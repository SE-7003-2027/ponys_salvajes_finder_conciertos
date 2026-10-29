const { fetchJson } = require('../lib/fetch-json');
const { normalizeName, parseYear, dedupeAndSort } = require('../lib/music-utils');

const API_URL = 'https://musicbrainz.org/ws/2';
const DEFAULT_USER_AGENT =
  'ConcertFinder/1.0 (https://github.com/SE-7003-2027/ponys_salvajes_finder_conciertos)';
const DEFAULT_MIN_INTERVAL_MS = 1100; // MusicBrainz allows about 1 request per second
const MIN_SEARCH_SCORE = 90;
const INCLUDED_TYPES = new Set(['Album', 'EP', 'Single']);

let lastRequestAt = 0;
let queue = Promise.resolve();

function minIntervalMs() {
  const configured = Number(process.env.MUSICBRAINZ_MIN_INTERVAL_MS);
  return Number.isFinite(configured) && configured >= 0 ? configured : DEFAULT_MIN_INTERVAL_MS;
}

/** Runs requests one at a time and spaces them out to respect the rate limit. */
function throttledGet(path) {
  const run = async () => {
    const wait = lastRequestAt + minIntervalMs() - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequestAt = Date.now();

    return fetchJson('MusicBrainz', `${API_URL}${path}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': process.env.MUSICBRAINZ_USER_AGENT || DEFAULT_USER_AGENT,
      },
    });
  };

  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
}

/** Returns the MusicBrainz id of the artist whose name matches exactly, or null. */
async function searchArtistId(name) {
  const query = new URLSearchParams({
    query: `artist:"${String(name).replace(/"/g, '')}"`,
    limit: '5',
    fmt: 'json',
  });
  const data = await throttledGet(`/artist?${query}`);

  const target = normalizeName(name);
  const match = (data.artists ?? []).find(
    (artist) => artist.score >= MIN_SEARCH_SCORE && normalizeName(artist.name) === target
  );

  return match ? match.id : null;
}

/** Studio releases only: live albums, compilations and remixes are left out. */
function isStudioRelease(group) {
  return INCLUDED_TYPES.has(group['primary-type']) && (group['secondary-types'] ?? []).length === 0;
}

function mapReleaseGroup(group) {
  const primaryType = group['primary-type'];

  return {
    id: group.id,
    title: group.title,
    year: parseYear(group['first-release-date']),
    type: primaryType === 'Album' ? 'album' : primaryType === 'EP' ? 'ep' : 'single',
    imageUrl: `https://coverartarchive.org/release-group/${group.id}/front-250`,
    url: `https://musicbrainz.org/release-group/${group.id}`,
  };
}

async function getReleases(musicbrainzId) {
  const query = new URLSearchParams({
    artist: musicbrainzId,
    type: 'album|ep|single',
    limit: '100',
    fmt: 'json',
  });
  const data = await throttledGet(`/release-group?${query}`);

  return dedupeAndSort((data['release-groups'] ?? []).filter(isStudioRelease).map(mapReleaseGroup));
}

module.exports = { searchArtistId, getReleases, mapReleaseGroup, isStudioRelease };

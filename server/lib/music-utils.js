/**
 * Helpers shared by the music providers (Spotify and MusicBrainz).
 */

/** Lowercase, strip accents and collapse spaces so "Beyoncé" matches "beyonce". */
function normalizeName(name) {
  return String(name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Returns the year of "2019-05-31", "2019-05" or "2019", or null. */
function parseYear(date) {
  const match = /^(\d{4})/.exec(String(date ?? ''));
  return match ? Number(match[1]) : null;
}

/**
 * Removes repeated releases (same title and type, e.g. clean and explicit
 * editions) and sorts newest first. Releases without a year go last.
 */
function dedupeAndSort(releases) {
  const seen = new Set();
  const unique = releases.filter((release) => {
    const key = `${normalizeName(release.title)}|${release.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.sort(byNewestFirst);
}

function byNewestFirst(a, b) {
  return (b.year ?? -Infinity) - (a.year ?? -Infinity);
}

/**
 * Keeps at most `max` releases without losing the albums: prolific artists
 * have dozens of recent singles that would otherwise push their classic
 * albums out of the list. Albums go in first, singles and EPs fill the rest.
 */
function limitReleases(releases, max) {
  const albums = releases.filter((release) => release.type === 'album').slice(0, max);
  const others = releases.filter((release) => release.type !== 'album').slice(0, max - albums.length);

  return [...albums, ...others].sort(byNewestFirst);
}

const SPOTIFY_ARTIST_URL = /open\.spotify\.com\/(?:intl-[a-z-]+\/)?artist\/([A-Za-z0-9]{22})/;

/** Returns the artist id of an open.spotify.com artist URL, or null. */
function extractSpotifyArtistId(url) {
  const match = SPOTIFY_ARTIST_URL.exec(String(url ?? ''));
  return match ? match[1] : null;
}

module.exports = { normalizeName, parseYear, dedupeAndSort, limitReleases, extractSpotifyArtistId };

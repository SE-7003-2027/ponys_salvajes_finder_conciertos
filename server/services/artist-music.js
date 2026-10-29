const ticketmaster = require('./ticketmaster');
const spotify = require('./spotify');
const musicbrainz = require('./musicbrainz');
const { createTtlCache } = require('../lib/ttl-cache');
const { limitReleases } = require('../lib/music-utils');

const MAX_RELEASES = 36;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const CACHE_TTL_EMPTY_MS = 10 * 60 * 1000; // retry sooner when providers returned nothing

const cache = createTtlCache();

/**
 * Builds the Spotify part of the profile. With a known id we can link the
 * artist page and embed the player; without one we link a Spotify search,
 * so the "Open in Spotify" button always works.
 */
function buildSpotifyProfile(name, spotifyId) {
  if (!spotifyId) {
    return {
      id: null,
      profileUrl: `https://open.spotify.com/search/${encodeURIComponent(name)}/artists`,
      embedUrl: null,
    };
  }

  return {
    id: spotifyId,
    profileUrl: `https://open.spotify.com/artist/${spotifyId}`,
    embedUrl: `https://open.spotify.com/embed/artist/${spotifyId}`,
  };
}

/** Runs a provider call; a failing provider must not break the profile. */
async function attempt(label, task) {
  try {
    return await task();
  } catch (error) {
    console.warn(`[artist-music] ${label} failed: ${error.message}`);
    return null;
  }
}

/** Resolves the MusicBrainz id at most once per request, and only if needed. */
function musicbrainzIdResolver(attraction) {
  let pending = null;

  return () => {
    pending ??= attraction.musicbrainzId
      ? Promise.resolve(attraction.musicbrainzId)
      : attempt('MusicBrainz search', () => musicbrainz.searchArtistId(attraction.name));
    return pending;
  };
}

/** Ticketmaster link first, then a Spotify search (with credentials), then MusicBrainz links. */
async function resolveSpotifyId(attraction, getMusicbrainzId) {
  if (attraction.spotifyId) return attraction.spotifyId;

  if (spotify.isConfigured()) {
    const found = await attempt('Spotify search', () => spotify.searchArtistId(attraction.name));
    if (found) return found;
  }

  const musicbrainzId = await getMusicbrainzId();
  if (!musicbrainzId) return null;
  return attempt('MusicBrainz Spotify link', () => musicbrainz.getSpotifyArtistId(musicbrainzId));
}

/** Spotify first (when configured), MusicBrainz as the keyless fallback. */
async function loadDiscography(spotifyId, getMusicbrainzId) {
  if (spotifyId && spotify.isConfigured()) {
    const releases = await attempt('Spotify albums', () => spotify.getReleases(spotifyId));
    if (releases?.length) {
      return { source: 'spotify', releases: limitReleases(releases, MAX_RELEASES) };
    }
  }

  const musicbrainzId = await getMusicbrainzId();
  if (musicbrainzId) {
    const releases = await attempt('MusicBrainz releases', () => musicbrainz.getReleases(musicbrainzId));
    if (releases?.length) {
      return { source: 'musicbrainz', releases: limitReleases(releases, MAX_RELEASES) };
    }
  }

  return { source: null, releases: [] };
}

/**
 * Music data for the artist page of a Ticketmaster attraction:
 * Spotify link and player, plus the discography.
 * Throws HttpError(404) when the attraction does not exist.
 */
async function getArtistMusic(attractionId) {
  const cached = cache.get(attractionId);
  if (cached) return cached;

  const attraction = await ticketmaster.getAttraction(attractionId);
  const getMusicbrainzId = musicbrainzIdResolver(attraction);
  const spotifyId = await resolveSpotifyId(attraction, getMusicbrainzId);
  const discography = await loadDiscography(spotifyId, getMusicbrainzId);

  const music = {
    artistId: attraction.id,
    name: attraction.name,
    spotify: buildSpotifyProfile(attraction.name, spotifyId),
    discography,
  };

  cache.set(attractionId, music, discography.releases.length ? CACHE_TTL_MS : CACHE_TTL_EMPTY_MS);
  return music;
}

function clearCache() {
  cache.clear();
}

module.exports = { getArtistMusic, buildSpotifyProfile, clearCache };

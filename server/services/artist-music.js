const ticketmaster = require('./ticketmaster');
const spotify = require('./spotify');
const musicbrainz = require('./musicbrainz');
const { createTtlCache } = require('../lib/ttl-cache');

const MAX_RELEASES = 24;
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

async function resolveSpotifyId(attraction) {
  if (attraction.spotifyId) return attraction.spotifyId;
  if (!spotify.isConfigured()) return null;
  return attempt('Spotify search', () => spotify.searchArtistId(attraction.name));
}

/** Spotify first (when configured), MusicBrainz as the keyless fallback. */
async function loadDiscography(attraction, spotifyId) {
  if (spotifyId && spotify.isConfigured()) {
    const releases = await attempt('Spotify albums', () => spotify.getReleases(spotifyId));
    if (releases?.length) {
      return { source: 'spotify', releases: releases.slice(0, MAX_RELEASES) };
    }
  }

  const musicbrainzId =
    attraction.musicbrainzId ??
    (await attempt('MusicBrainz search', () => musicbrainz.searchArtistId(attraction.name)));

  if (musicbrainzId) {
    const releases = await attempt('MusicBrainz releases', () => musicbrainz.getReleases(musicbrainzId));
    if (releases?.length) {
      return { source: 'musicbrainz', releases: releases.slice(0, MAX_RELEASES) };
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
  const spotifyId = await resolveSpotifyId(attraction);
  const discography = await loadDiscography(attraction, spotifyId);

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

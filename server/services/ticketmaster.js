const { fetchJson, UpstreamError } = require('../lib/fetch-json');
const { HttpError } = require('../lib/http-error');
const { extractSpotifyArtistId } = require('../lib/music-utils');

const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const MUSICBRAINZ_ID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function extractMusicbrainzId(link) {
  const match = MUSICBRAINZ_ID.exec(`${link?.id ?? ''} ${link?.url ?? ''}`);
  return match ? match[0].toLowerCase() : null;
}

/**
 * Keeps only what the artist profile needs from a Ticketmaster attraction:
 * its name and, when Ticketmaster knows them, its Spotify and MusicBrainz ids.
 */
function mapAttraction(raw) {
  const links = raw.externalLinks ?? {};

  const spotifyId =
    (links.spotify ?? []).map((link) => extractSpotifyArtistId(link.url)).find(Boolean) ?? null;
  const musicbrainzId =
    (links.musicbrainz ?? []).map(extractMusicbrainzId).find(Boolean) ?? null;

  return { id: raw.id, name: raw.name, spotifyId, musicbrainzId };
}

async function getAttraction(attractionId) {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    throw new HttpError(503, 'Ticketmaster is not configured on the server');
  }

  const url = `${BASE_URL}/attractions/${encodeURIComponent(attractionId)}.json?apikey=${encodeURIComponent(apiKey)}`;

  try {
    return mapAttraction(await fetchJson('Ticketmaster', url));
  } catch (error) {
    if (error instanceof UpstreamError && error.status === 404) {
      throw new HttpError(404, 'Artist not found');
    }
    throw error;
  }
}

module.exports = { getAttraction, mapAttraction, extractSpotifyArtistId, extractMusicbrainzId };

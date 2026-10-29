const { fetchJson } = require('../lib/fetch-json');
const { normalizeName, parseYear, dedupeAndSort } = require('../lib/music-utils');

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_URL = 'https://api.spotify.com/v1';
const SEARCH_LIMIT = 5; // Spotify caps search at 10 results since February 2026
const ALBUMS_LIMIT = 20;
const TOKEN_EXPIRY_MARGIN_MS = 60 * 1000;
const PREFERRED_IMAGE_WIDTH = 300;

let cachedToken = null;

/** Spotify is optional: without credentials we fall back to MusicBrainz. */
function isConfigured() {
  return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}

/** Client Credentials flow: an app token, no Spotify user login needed. */
async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const data = await fetchJson('Spotify', TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS,
  };

  return cachedToken.value;
}

async function spotifyGet(path) {
  const token = await getAccessToken();
  return fetchJson('Spotify', `${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Returns the Spotify id of the artist whose name matches exactly, or null. */
async function searchArtistId(name) {
  const query = new URLSearchParams({ q: name, type: 'artist', limit: String(SEARCH_LIMIT) });
  const data = await spotifyGet(`/search?${query}`);

  const target = normalizeName(name);
  const match = (data.artists?.items ?? []).find((artist) => normalizeName(artist.name) === target);

  return match ? match.id : null;
}

function pickImage(images = []) {
  const bySize = [...images].sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
  return (bySize.find((image) => (image.width ?? 0) >= PREFERRED_IMAGE_WIDTH) ?? bySize.at(-1))?.url ?? null;
}

function mapAlbum(album) {
  return {
    id: album.id,
    title: album.name,
    year: parseYear(album.release_date),
    type: album.album_type === 'album' || album.album_type === 'single' ? album.album_type : 'other',
    imageUrl: pickImage(album.images),
    url: album.external_urls?.spotify ?? `https://open.spotify.com/album/${album.id}`,
  };
}

async function getReleases(artistId) {
  const query = new URLSearchParams({ include_groups: 'album,single', limit: String(ALBUMS_LIMIT) });
  const data = await spotifyGet(`/artists/${encodeURIComponent(artistId)}/albums?${query}`);

  return dedupeAndSort((data.items ?? []).map(mapAlbum));
}

function resetTokenCache() {
  cachedToken = null;
}

module.exports = { isConfigured, searchArtistId, getReleases, mapAlbum, resetTokenCache };

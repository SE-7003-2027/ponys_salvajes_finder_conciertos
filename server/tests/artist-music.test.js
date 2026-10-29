const { describe, it, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');

const { getArtistMusic, clearCache } = require('../services/artist-music');
const spotify = require('../services/spotify');
const { HttpError } = require('../lib/http-error');
const { mockFetch } = require('./helpers/mock-fetch');
const fixtures = require('./fixtures');

beforeEach(() => {
  clearCache();
  spotify.resetTokenCache();
  process.env.TICKETMASTER_API_KEY = 'tm-key';
  process.env.MUSICBRAINZ_MIN_INTERVAL_MS = '0';
  delete process.env.SPOTIFY_CLIENT_ID;
  delete process.env.SPOTIFY_CLIENT_SECRET;
  mock.method(console, 'warn', () => {});
});

afterEach(() => {
  mock.restoreAll();
});

describe('getArtistMusic', () => {
  it('without Spotify credentials: embeds the player and uses MusicBrainz for releases', async () => {
    const calls = mockFetch({
      'app.ticketmaster.com': { body: fixtures.attractionWithLinks },
      '/release-group?': { body: fixtures.releaseGroups },
    });

    const music = await getArtistMusic('K8vZ9175rX7');

    assert.deepEqual(music.spotify, {
      id: fixtures.SPOTIFY_ID,
      profileUrl: `https://open.spotify.com/artist/${fixtures.SPOTIFY_ID}`,
      embedUrl: `https://open.spotify.com/embed/artist/${fixtures.SPOTIFY_ID}`,
    });
    assert.equal(music.discography.source, 'musicbrainz');
    assert.equal(music.discography.releases.length, 3);
    assert.ok(!calls.some((url) => url.includes('spotify.com')), 'no Spotify API calls without credentials');
  });

  it('with Spotify credentials: takes the discography from Spotify', async () => {
    process.env.SPOTIFY_CLIENT_ID = 'id';
    process.env.SPOTIFY_CLIENT_SECRET = 'secret';
    mockFetch({
      'app.ticketmaster.com': { body: fixtures.attractionWithLinks },
      'accounts.spotify.com': { body: { access_token: 'token', expires_in: 3600 } },
      '/albums?': { body: fixtures.spotifyAlbums },
    });

    const music = await getArtistMusic('K8vZ9175rX7');

    assert.equal(music.discography.source, 'spotify');
    assert.equal(music.discography.releases[0].title, 'Houdini');
  });

  it('falls back to MusicBrainz when Spotify fails', async () => {
    process.env.SPOTIFY_CLIENT_ID = 'id';
    process.env.SPOTIFY_CLIENT_SECRET = 'secret';
    mockFetch({
      'app.ticketmaster.com': { body: fixtures.attractionWithLinks },
      'accounts.spotify.com': { status: 500 },
      '/release-group?': { body: fixtures.releaseGroups },
    });

    const music = await getArtistMusic('K8vZ9175rX7');

    assert.equal(music.discography.source, 'musicbrainz');
  });

  it('without known ids: links a Spotify search and finds the artist on MusicBrainz by name', async () => {
    mockFetch({
      'app.ticketmaster.com': { body: fixtures.attractionWithoutLinks },
      '/artist?': { body: { artists: [{ id: 'mb-beyonce', name: 'Beyoncé', score: 100 }] } },
      '/release-group?': { body: fixtures.releaseGroups },
    });

    const music = await getArtistMusic('K8vZ917Gku7');

    assert.equal(music.spotify.id, null);
    assert.equal(music.spotify.embedUrl, null);
    assert.equal(music.spotify.profileUrl, 'https://open.spotify.com/search/Beyonc%C3%A9/artists');
    assert.equal(music.discography.source, 'musicbrainz');
  });

  it('returns an empty discography when every provider fails', async () => {
    mockFetch({
      'app.ticketmaster.com': { body: fixtures.attractionWithLinks },
      '/release-group?': { status: 503 },
    });

    const music = await getArtistMusic('K8vZ9175rX7');

    assert.deepEqual(music.discography, { source: null, releases: [] });
    assert.ok(music.spotify.embedUrl, 'the Spotify player still works');
  });

  it('throws a 404 HttpError when Ticketmaster does not know the artist', async () => {
    mockFetch({ 'app.ticketmaster.com': { status: 404 } });

    await assert.rejects(getArtistMusic('unknown'), (error) => error instanceof HttpError && error.status === 404);
  });

  it('caches results per artist', async () => {
    const calls = mockFetch({
      'app.ticketmaster.com': { body: fixtures.attractionWithLinks },
      '/release-group?': { body: fixtures.releaseGroups },
    });

    await getArtistMusic('K8vZ9175rX7');
    await getArtistMusic('K8vZ9175rX7');

    assert.equal(calls.filter((url) => url.includes('ticketmaster')).length, 1);
  });
});

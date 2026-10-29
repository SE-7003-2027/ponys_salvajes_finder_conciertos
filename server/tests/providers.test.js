const { describe, it, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');

const ticketmaster = require('../services/ticketmaster');
const spotify = require('../services/spotify');
const musicbrainz = require('../services/musicbrainz');
const { normalizeName, parseYear } = require('../lib/music-utils');
const { mockFetch } = require('./helpers/mock-fetch');
const fixtures = require('./fixtures');

afterEach(() => {
  mock.restoreAll();
  spotify.resetTokenCache();
});

describe('music utils', () => {
  it('normalizes accents, case and spaces', () => {
    assert.equal(normalizeName('  Beyoncé   Knowles '), 'beyonce knowles');
  });

  it('parses the year of full and partial dates', () => {
    assert.equal(parseYear('2020-03-27'), 2020);
    assert.equal(parseYear('2023-11'), 2023);
    assert.equal(parseYear(undefined), null);
  });
});

describe('ticketmaster', () => {
  it('extracts Spotify and MusicBrainz ids from externalLinks', () => {
    assert.deepEqual(ticketmaster.mapAttraction(fixtures.attractionWithLinks), {
      id: 'K8vZ9175rX7',
      name: 'Dua Lipa',
      spotifyId: fixtures.SPOTIFY_ID,
      musicbrainzId: fixtures.MUSICBRAINZ_ID,
    });
  });

  it('returns null ids when Ticketmaster has no links', () => {
    const attraction = ticketmaster.mapAttraction(fixtures.attractionWithoutLinks);
    assert.equal(attraction.spotifyId, null);
    assert.equal(attraction.musicbrainzId, null);
  });

  it('reads localized Spotify URLs and ignores other links', () => {
    assert.equal(
      ticketmaster.extractSpotifyArtistId(`https://open.spotify.com/intl-es/artist/${fixtures.SPOTIFY_ID}`),
      fixtures.SPOTIFY_ID
    );
    assert.equal(ticketmaster.extractSpotifyArtistId('https://open.spotify.com/album/123'), null);
  });
});

describe('spotify', () => {
  it('maps albums, picks a ~300px cover, removes duplicates and sorts newest first', async () => {
    process.env.SPOTIFY_CLIENT_ID = 'id';
    process.env.SPOTIFY_CLIENT_SECRET = 'secret';
    mockFetch({
      'accounts.spotify.com': { body: { access_token: 'token', expires_in: 3600 } },
      '/albums?': { body: fixtures.spotifyAlbums },
    });

    const releases = await spotify.getReleases(fixtures.SPOTIFY_ID);

    assert.deepEqual(releases.map((release) => release.title), ['Houdini', 'Future Nostalgia']);
    assert.equal(releases[1].imageUrl, 'https://i.scdn.co/300.jpg');
    assert.equal(releases[0].type, 'single');
  });

  it('reuses the access token until it expires', async () => {
    process.env.SPOTIFY_CLIENT_ID = 'id';
    process.env.SPOTIFY_CLIENT_SECRET = 'secret';
    const calls = mockFetch({
      'accounts.spotify.com': { body: { access_token: 'token', expires_in: 3600 } },
      '/albums?': { body: { items: [] } },
    });

    await spotify.getReleases(fixtures.SPOTIFY_ID);
    await spotify.getReleases(fixtures.SPOTIFY_ID);

    assert.equal(calls.filter((url) => url.includes('accounts.spotify.com')).length, 1);
  });

  it('only accepts an exact name match when searching', async () => {
    process.env.SPOTIFY_CLIENT_ID = 'id';
    process.env.SPOTIFY_CLIENT_SECRET = 'secret';
    mockFetch({
      'accounts.spotify.com': { body: { access_token: 'token', expires_in: 3600 } },
      '/search?': {
        body: { artists: { items: [{ id: 'tribute', name: 'Beyoncé Tribute Band' }, { id: 'real', name: 'Beyonce' }] } },
      },
    });

    assert.equal(await spotify.searchArtistId('Beyoncé'), 'real');
  });
});

describe('musicbrainz', () => {
  it('keeps studio albums and singles, drops live and remix releases', async () => {
    process.env.MUSICBRAINZ_MIN_INTERVAL_MS = '0';
    mockFetch({ '/release-group?': { body: fixtures.releaseGroups } });

    const releases = await musicbrainz.getReleases(fixtures.MUSICBRAINZ_ID);

    assert.deepEqual(
      releases.map((release) => [release.title, release.year, release.type]),
      [
        ['Radical Optimism', 2024, 'album'],
        ['Future Nostalgia', 2020, 'album'],
        ['Be the One', 2015, 'single'],
      ]
    );
    assert.match(releases[0].imageUrl, /coverartarchive\.org\/release-group\/rg-2\/front-250$/);
  });

  it('sends a User-Agent, as MusicBrainz requires', async () => {
    process.env.MUSICBRAINZ_MIN_INTERVAL_MS = '0';
    let userAgent;
    mockFetch({
      '/artist?': (_url, init) => {
        userAgent = init.headers['User-Agent'];
        return { body: { artists: [{ id: 'mb-1', name: 'Beyoncé', score: 100 }] } };
      },
    });

    assert.equal(await musicbrainz.searchArtistId('Beyoncé'), 'mb-1');
    assert.match(userAgent, /ConcertFinder/);
  });
});

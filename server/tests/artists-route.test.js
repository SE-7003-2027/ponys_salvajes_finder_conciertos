const { describe, it, before, after, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../server');
const { clearCache } = require('../services/artist-music');
const { mockFetch } = require('./helpers/mock-fetch');
const fixtures = require('./fixtures');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

beforeEach(() => {
  clearCache();
  process.env.TICKETMASTER_API_KEY = 'tm-key';
  process.env.MUSICBRAINZ_MIN_INTERVAL_MS = '0';
  delete process.env.SPOTIFY_CLIENT_ID;
  delete process.env.SPOTIFY_CLIENT_SECRET;
  mock.method(console, 'warn', () => {});
  mock.method(console, 'error', () => {});
});

afterEach(() => mock.restoreAll());

describe('GET /api/artists/:id/music', () => {
  it('answers 200 with the artist music', async () => {
    mockFetch({
      'app.ticketmaster.com': { body: fixtures.attractionWithLinks },
      '/release-group?': { body: fixtures.releaseGroups },
    });

    const response = await fetch(`${baseUrl}/api/artists/K8vZ9175rX7/music`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.name, 'Dua Lipa');
    assert.equal(body.discography.releases.length, 3);
  });

  it('answers 400 for an invalid id', async () => {
    const response = await fetch(`${baseUrl}/api/artists/${encodeURIComponent('bad id!')}/music`);
    assert.equal(response.status, 400);
  });

  it('answers 404 when the artist does not exist', async () => {
    mockFetch({ 'app.ticketmaster.com': { status: 404 } });

    const response = await fetch(`${baseUrl}/api/artists/missing123/music`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: 'Artist not found' });
  });

  it('answers 502 when Ticketmaster is down', async () => {
    mockFetch({ 'app.ticketmaster.com': { status: 500 } });

    const response = await fetch(`${baseUrl}/api/artists/K8vZ9175rX7/music`);
    assert.equal(response.status, 502);
  });

  it('answers 503 when the Ticketmaster key is missing', async () => {
    delete process.env.TICKETMASTER_API_KEY;

    const response = await fetch(`${baseUrl}/api/artists/K8vZ9175rX7/music`);
    assert.equal(response.status, 503);
  });
});

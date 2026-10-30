const { mock } = require('node:test');

const realFetch = globalThis.fetch;

/**
 * Replaces global fetch for third-party hosts. `routes` maps a URL substring
 * to `{ status, body }` or to a function that returns one.
 * Requests to localhost go to the real fetch so route tests can call the app.
 * Returns the list of URLs that were requested.
 */
function mockFetch(routes) {
  const calls = [];

  mock.method(globalThis, 'fetch', async (url, init) => {
    const href = String(url);
    if (href.startsWith('http://127.0.0.1') || href.startsWith('http://localhost')) {
      return realFetch(url, init);
    }

    calls.push(href);
    const key = Object.keys(routes).find((fragment) => href.includes(fragment));
    if (!key) {
      throw new TypeError(`Unexpected request in test: ${href}`);
    }

    const route = typeof routes[key] === 'function' ? routes[key](href, init) : routes[key];
    return new Response(JSON.stringify(route.body ?? {}), {
      status: route.status ?? 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  return calls;
}

module.exports = { mockFetch };

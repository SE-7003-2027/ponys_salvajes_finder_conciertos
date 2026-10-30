const DEFAULT_TIMEOUT_MS = 8000;

/**
 * Error thrown when a third-party API answers with a non-2xx status,
 * times out, or cannot be reached.
 */
class UpstreamError extends Error {
  constructor(service, status, message) {
    super(`${service}: ${message}`);
    this.name = 'UpstreamError';
    this.service = service;
    this.status = status;
  }
}

/**
 * GET or POST a third-party endpoint and parse its JSON body.
 * `service` only labels errors (e.g. "Spotify").
 */
async function fetchJson(service, url, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;

  let response;
  try {
    response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    throw new UpstreamError(service, null, `request failed (${error.name})`);
  }

  if (!response.ok) {
    throw new UpstreamError(service, response.status, `responded with ${response.status}`);
  }

  return response.json();
}

module.exports = { fetchJson, UpstreamError };

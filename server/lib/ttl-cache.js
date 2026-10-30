/**
 * Small in-memory cache with per-entry expiration.
 * When full, the oldest entry is evicted first.
 */
function createTtlCache({ maxEntries = 200 } = {}) {
  const entries = new Map();

  function get(key) {
    const entry = entries.get(key);
    if (!entry) return undefined;

    if (entry.expiresAt <= Date.now()) {
      entries.delete(key);
      return undefined;
    }

    return entry.value;
  }

  function set(key, value, ttlMs) {
    entries.delete(key);
    entries.set(key, { value, expiresAt: Date.now() + ttlMs });

    if (entries.size > maxEntries) {
      const oldestKey = entries.keys().next().value;
      entries.delete(oldestKey);
    }
  }

  function clear() {
    entries.clear();
  }

  return { get, set, clear };
}

module.exports = { createTtlCache };

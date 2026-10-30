interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

export function readCache<T>(key: string, ttlMs: number): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as CacheEntry<T>;

    if (Date.now() - entry.timestamp > ttlMs) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
}

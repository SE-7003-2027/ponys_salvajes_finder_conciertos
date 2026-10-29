/**
 * Helpers shared by the music providers (Spotify and MusicBrainz).
 */

/** Lowercase, strip accents and collapse spaces so "Beyoncé" matches "beyonce". */
function normalizeName(name) {
  return String(name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Returns the year of "2019-05-31", "2019-05" or "2019", or null. */
function parseYear(date) {
  const match = /^(\d{4})/.exec(String(date ?? ''));
  return match ? Number(match[1]) : null;
}

/**
 * Removes repeated releases (same title and type, e.g. clean and explicit
 * editions) and sorts newest first. Releases without a year go last.
 */
function dedupeAndSort(releases) {
  const seen = new Set();
  const unique = releases.filter((release) => {
    const key = `${normalizeName(release.title)}|${release.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.sort((a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity));
}

module.exports = { normalizeName, parseYear, dedupeAndSort };

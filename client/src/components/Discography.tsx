import { useState } from 'react';
import { ReleaseCard } from './ReleaseCard';
import type { DiscographySource, Release } from '../types/artist';

type ReleaseFilter = 'all' | 'albums' | 'singles';

const FILTERS: Array<{ value: ReleaseFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'albums', label: 'Albums' },
  { value: 'singles', label: 'Singles and EPs' },
];

const INITIAL_VISIBLE = 12;

const SOURCE_CREDITS: Record<DiscographySource, { name: string; url: string }> = {
  spotify: { name: 'Spotify', url: 'https://open.spotify.com' },
  musicbrainz: { name: 'MusicBrainz', url: 'https://musicbrainz.org' },
};

function matchesFilter(release: Release, filter: ReleaseFilter): boolean {
  if (filter === 'albums') return release.type === 'album';
  if (filter === 'singles') return release.type === 'single' || release.type === 'ep';
  return true;
}

interface DiscographyProps {
  releases: Release[];
  source: DiscographySource;
}

export function Discography({ releases, source }: DiscographyProps) {
  const [filter, setFilter] = useState<ReleaseFilter>('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = releases.filter((release) => matchesFilter(release, filter));
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE);
  const availableFilters = FILTERS.filter(
    (option) => option.value === 'all' || releases.some((release) => matchesFilter(release, option.value))
  );
  const credit = SOURCE_CREDITS[source];

  return (
    <div>
      {availableFilters.length > 2 && (
        <div role="group" aria-label="Filter releases" className="mb-5 flex flex-wrap gap-2">
          {availableFilters.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={filter === option.value}
              onClick={() => {
                setFilter(option.value);
                setShowAll(false);
              }}
              className="cursor-pointer rounded-full border border-line px-4 py-1.5 text-sm text-gray-300 transition-colors hover:border-gray-500 aria-pressed:border-white aria-pressed:bg-white aria-pressed:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visible.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        {filtered.length > INITIAL_VISIBLE ? (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="cursor-pointer text-sm font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {showAll ? 'Show fewer' : `Show all ${filtered.length}`}
          </button>
        ) : (
          <span />
        )}
        <p className="text-xs text-gray-500">
          Release data from{' '}
          <a href={credit.url} target="_blank" rel="noreferrer" className="underline hover:text-gray-300">
            {credit.name}
          </a>
        </p>
      </div>
    </div>
  );
}

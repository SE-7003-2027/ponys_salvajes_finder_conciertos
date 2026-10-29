import { useState } from 'react';
import type { Release, ReleaseType } from '../types/artist';

const TYPE_LABELS: Record<ReleaseType, string> = {
  album: 'Album',
  single: 'Single',
  ep: 'EP',
  other: 'Release',
};

interface ReleaseCardProps {
  release: Release;
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  const [hasCover, setHasCover] = useState(Boolean(release.imageUrl));
  const details = release.year ? `${TYPE_LABELS[release.type]}, ${release.year}` : TYPE_LABELS[release.type];

  return (
    <li>
      <a
        href={release.url}
        target="_blank"
        rel="noreferrer"
        className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="aspect-square overflow-hidden rounded-md bg-surface-raised shadow-lg">
          {hasCover && release.imageUrl ? (
            <img
              src={release.imageUrl}
              alt=""
              loading="lazy"
              onError={() => setHasCover(false)}
              className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-end bg-linear-to-br from-brand/40 to-surface-raised p-3 text-3xl font-bold text-white/70"
            >
              {release.title.charAt(0)}
            </div>
          )}
        </div>
        <p className="mt-2 truncate text-sm font-semibold text-white group-hover:text-accent" title={release.title}>
          {release.title}
        </p>
        <p className="text-xs text-gray-400">{details}</p>
      </a>
    </li>
  );
}

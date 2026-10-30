import { Discography } from './Discography';
import { SpotifyPlayer } from './SpotifyPlayer';
import type { ArtistMusic } from '../types/artist';

export type ArtistMusicState =
  | { status: 'loading' }
  | { status: 'ready'; music: ArtistMusic }
  | { status: 'unavailable' };

const SKELETON_ITEMS = 6;

function DiscographySkeleton() {
  return (
    <ul aria-hidden="true" className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: SKELETON_ITEMS }, (_, index) => (
        <li key={index}>
          <div className="aspect-square rounded-md bg-surface-raised motion-safe:animate-pulse" />
          <div className="mt-2 h-3 w-3/4 rounded bg-surface-raised motion-safe:animate-pulse" />
        </li>
      ))}
    </ul>
  );
}

interface ArtistMusicSectionProps {
  state: ArtistMusicState;
}

export function ArtistMusicSection({ state }: ArtistMusicSectionProps) {
  const music = state.status === 'ready' ? state.music : null;
  const { source, releases } = music?.discography ?? { source: null, releases: [] };

  return (
    <>
      {music?.spotify.embedUrl && (
        <section aria-labelledby="listen-heading" className="mt-12">
          <h2 id="listen-heading" className="mb-4 text-2xl font-semibold">
            Listen
          </h2>
          <SpotifyPlayer embedUrl={music.spotify.embedUrl} artistName={music.name} />
        </section>
      )}

      <section aria-labelledby="discography-heading" aria-busy={state.status === 'loading'} className="mt-12">
        <h2 id="discography-heading" className="mb-4 text-2xl font-semibold">
          Discography
        </h2>

        {state.status === 'loading' && <DiscographySkeleton />}

        {state.status === 'unavailable' && (
          <p className="py-8 text-center text-gray-500">
            Couldn't load this artist's music. Reload the page to try again.
          </p>
        )}

        {state.status === 'ready' &&
          (source && releases.length > 0 ? (
            <Discography releases={releases} source={source} />
          ) : (
            <p className="py-8 text-center text-gray-500">
              No releases found for this artist. Try opening their Spotify page above.
            </p>
          ))}
      </section>
    </>
  );
}

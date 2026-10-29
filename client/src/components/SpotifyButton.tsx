import { FaSpotify } from 'react-icons/fa';
import type { SpotifyProfile } from '../types/artist';

interface SpotifyButtonProps {
  spotify: SpotifyProfile;
}

export function SpotifyButton({ spotify }: SpotifyButtonProps) {
  const label = spotify.id ? 'Open in Spotify' : 'Search on Spotify';

  return (
    <a
      href={spotify.profileUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-spotify px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-spotify-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <FaSpotify aria-hidden="true" className="h-5 w-5" />
      {label}
    </a>
  );
}

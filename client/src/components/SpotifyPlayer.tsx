interface SpotifyPlayerProps {
  embedUrl: string;
  artistName: string;
}

const PLAYER_HEIGHT = 352;

/**
 * Spotify's embedded player. It plays the artist's popular tracks without
 * calling the Web API (its top-tracks endpoint was removed in February 2026):
 * 30-second previews for visitors, full tracks for logged-in Spotify users.
 */
export function SpotifyPlayer({ embedUrl, artistName }: SpotifyPlayerProps) {
  return (
    <iframe
      title={`${artistName} on Spotify`}
      src={`${embedUrl}?utm_source=generator&theme=0`}
      width="100%"
      height={PLAYER_HEIGHT}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="block w-full rounded-xl border-0 bg-surface"
    />
  );
}

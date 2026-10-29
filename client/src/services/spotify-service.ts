import { getJson } from './http';
import type { SpotifyArtist } from '../types/spotifyArtist';

export async function getTopArtists(): Promise<SpotifyArtist[]> {
  const data = await getJson<{ artists: SpotifyArtist[] }>('/api/spotify/top-artists');
  return data.artists;
}

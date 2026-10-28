import { INITIAL_MOCK_ARTISTS } from '../mocks/spotifyArtists.mock';
import type { SpotifyArtist } from '../types/spotifyArtist';

export async function getTopArtists(): Promise<SpotifyArtist[]> {
  return INITIAL_MOCK_ARTISTS
}

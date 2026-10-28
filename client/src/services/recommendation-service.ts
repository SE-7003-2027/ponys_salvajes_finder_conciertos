import { fetchMusicEvents, mapEvents } from './ticketmaster';
import { getTopArtists } from './spotify-service';
import type { Concert } from '../types/concert';
import type { SpotifyArtist } from '../types/spotifyArtist';

const MAX_ARTISTS = 5;
const MAX_PER_ARTIST = 3;
const MAX_TOTAL = 12;

export async function getPersonalizedRecommendations(): Promise<{
  artists: SpotifyArtist[];
  concerts: Concert[];
}> {
  const artists = (await getTopArtists()).slice(0, MAX_ARTISTS);

  const results = await Promise.allSettled(
    artists.map((artist) => fetchMusicEvents(artist.name))
  );

  const byId = new Map<string, Concert>();

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;

    for (const concert of mapEvents(result.value).slice(0, MAX_PER_ARTIST)) {
      if (!byId.has(concert.id)) byId.set(concert.id, concert);
    }
  }

  return { artists, concerts: [...byId.values()].slice(0, MAX_TOTAL) };
}

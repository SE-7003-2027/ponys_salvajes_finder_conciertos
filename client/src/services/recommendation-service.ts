import { fetchMusicEvents, mapEvents } from './ticketmaster';
import { getTopArtists } from './spotify-service';
import type { Concert } from '../types/concert';
import type { SpotifyArtist } from '../types/spotifyArtist';
import { readCache, writeCache } from './cache';

const MAX_ARTISTS = 5;
const MAX_PER_ARTIST = 3;
const MAX_TOTAL = 15;
const CACHE_KEY = 'personalized_recommendations_cache';
const CACHE_TIME = 1000 * 60 * 60;

interface CachedRecommendations {
  artistsKey: string;
  concerts: Concert[];
}

export async function getPersonalizedRecommendations(): Promise<{
  artists: SpotifyArtist[];
  concerts: Concert[];
}> {
  const artists = (await getTopArtists()).slice(0, MAX_ARTISTS);

  if (artists.length === 0) {
    return { artists: [], concerts: [] };
  }

  const artistsKey = artists.map((artist) => artist.id).join(',');

  const cached = readCache<CachedRecommendations>(CACHE_KEY, CACHE_TIME);
  if (cached?.artistsKey === artistsKey) {
    return { artists, concerts: cached.concerts };
  }

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

  const concerts = [...byId.values()].slice(0, MAX_TOTAL);

  if (concerts.length > 0) {
    writeCache(CACHE_KEY, { artistsKey, concerts });
  }

  return { artists, concerts };
}

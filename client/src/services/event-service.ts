import { INITIAL_MOCK_CONCERTS } from '../mocks/concerts.mock';
import { fetchMusicEvents, mapEvents } from './ticketmaster';
import type { Concert } from '../types/concert';

const CACHE_KEY = 'recommended_concerts_cache';
const CACHE_TIME = 1000 * 60 * 60;

export async function getRecommendedEvents(): Promise<Concert[]> {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { timestamp, data } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_TIME;
      if (!isExpired && data.length > 0) {
        return data;
      }
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  try {
    const concerts = mapEvents(await fetchMusicEvents());

    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data: concerts })
    );

    return concerts;
  } catch (error) {
    console.warn('Falló la carga de recomendados en vivo, usando mocks:', error);
    return INITIAL_MOCK_CONCERTS;
  }
}

export async function searchEvents(query: string): Promise<Concert[]> {
  if (!query.trim()) return [];

  try {
    return mapEvents(await fetchMusicEvents(query));
  } catch (error) {
    console.error('Error al consultar eventos:', error);
    return [];
  }
}

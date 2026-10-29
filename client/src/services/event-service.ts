import { INITIAL_MOCK_CONCERTS } from '../mocks/concerts.mock';
import { fetchMusicEvents, fetchMusicEventsByAttraction,
  fetchMusicSuggestions, eventMatchesByArtistOrTitle, mapEvents } from './ticketmaster';
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
  const q = query.trim();
  if (!q) return [];

  try {
    const suggestions = await fetchMusicSuggestions(q);

    const attractionEvents = await Promise.all(
      suggestions.attractions
        .slice(0, 2)
        .map((attraction) => fetchMusicEventsByAttraction(attraction.id))
    );

    const events = [
      ...suggestions.events,
      ...attractionEvents.flat(),
    ];

    const filtered = events.filter((e) => eventMatchesByArtistOrTitle(e, q));

    const uniqueEvents = [
      ...new Map(filtered.map((event) => [event.id, event])).values(),
    ];

    return mapEvents(uniqueEvents).slice(0, 12);
  } catch (error) {
    console.error(
      'The suggestion endpoint has failed',
      error
    );

    try {
      return mapEvents(await fetchMusicEvents(q));
    } catch (fallbackError) {
      console.error('Event searching has failed', fallbackError);
      return [];
    }
  }
}

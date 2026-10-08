import { INITIAL_MOCK_CONCERTS } from '../mocks/concerts.mock'
import type { Concert } from '../types/concert'
import type { TicketmasterEvent } from '../types/ticketmasterEvent'

const TM_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY
const CACHE_KEY = 'recommended_concerts_cache';
const CACHE_TIME = 1000 * 60 * 60;

export function cleanResults(rawEvents: TicketmasterEvent[]): Concert[] {
  return rawEvents.map((event): Concert => {
    const venueObj = event._embedded?.venues?.[0];

    const address = venueObj?.address?.line1 || 'Address available at venue';

    const imageUrl =
      event.images?.find((img) => img.ratio === '16_9')?.url ||
      event.images?.[0]?.url ||
      '';

    const priceObj = event.priceRanges?.[0];
    const priceRange = priceObj
      ? `$${priceObj.min} - $${priceObj.max} ${priceObj.currency || 'USD'}`
      : 'Check site for prices';

    return {
      id: event.id,
      title: event.name,
      artistId: event._embedded?.attractions?.[0]?.id || '',
      artist: event._embedded?.attractions?.[0]?.name || event.name,
      venue: venueObj?.name || 'Venue not specified',
      city: venueObj?.city?.name || event.place?.city?.name || 'City not specified',
      date: event.dates?.start?.localDate || 'To be announced',
      ticketUrl: event.url || 'https://www.ticketmaster.com/',
      address,
      imageUrl,
      priceRange,
    };
  });
}

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
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=12&apikey=${TM_API_KEY}`
    );

    if (!response.ok) throw new Error('Error en Ticketmaster')

    const data = await response.json();
    const rawEvents = data._embedded?.events || [];

    const concerts = cleanResults(rawEvents);

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
  if (!query.trim()) return []

  try {
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(
        query
      )}&classificationName=music&size=12&apikey=${TM_API_KEY}`
    )

    if (!response.ok) throw new Error('Error en Ticketmaster')

    const data = await response.json()
    const rawEvents = data._embedded?.events || []
    console.log("Raw event from Ticketmaster:", rawEvents[0]);
    return cleanResults(rawEvents);
  } catch (error) {
    console.error('Error al consultar eventos:', error)
    return []
  }
}

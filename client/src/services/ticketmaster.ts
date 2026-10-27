import type { Concert } from '../types/concert';
import type { TicketmasterEvent } from '../types/ticketmasterEvent';

const TM_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const TM_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY ?? '';
const PAGE_SIZE = 12;

interface EventsResponse {
  _embedded?: { events?: TicketmasterEvent[] };
}

export interface TicketmasterAttraction {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
  classifications?: Array<{ genre?: { name?: string } }>;
  info?: string;
  description?: string;
}

async function tmGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const query = new URLSearchParams({ ...params, apikey: TM_API_KEY });
  const response = await fetch(`${TM_BASE_URL}${path}?${query.toString()}`);

  if (!response.ok) {
    throw new Error(`Ticketmaster responded with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchMusicEvents(keyword?: string): Promise<TicketmasterEvent[]> {
  const params: Record<string, string> = {
    classificationName: 'music',
    size: String(PAGE_SIZE),
  };

  if (keyword) {
    params.keyword = keyword;
  }

  const data = await tmGet<EventsResponse>('/events.json', params);

  return data._embedded?.events ?? [];
}

export function fetchAttraction(artistId: string): Promise<TicketmasterAttraction> {
  return tmGet<TicketmasterAttraction>(`/attractions/${artistId}.json`);
}

export function mapEvents(rawEvents: TicketmasterEvent[]): Concert[] {
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

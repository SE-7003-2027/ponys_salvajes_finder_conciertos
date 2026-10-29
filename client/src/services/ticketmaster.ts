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
  classifications?: Array<{
    primary?: boolean;
    segment?: { name?: string };
    genre?: { name?: string };
    subGenre?: { name?: string };
  }>;
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

interface ClassifiedEntity {
  name?: string;
  classifications?: Array<{
    primary?: boolean;
    segment?: { name?: string };
    genre?: { name?: string };
    subGenre?: { name?: string };
  }>;
}

export function isMusicEntity(entity: ClassifiedEntity): boolean {
  const cls =
    entity.classifications?.find((c) => c.primary) ??
    entity.classifications?.[0];
  if (!cls) return false;

  const segment = cls.segment?.name?.toLowerCase() ?? '';
  const genre = cls.genre?.name?.toLowerCase() ?? '';
  const subGenre = cls.subGenre?.name?.toLowerCase() ?? '';

  if (genre === 'venue' || subGenre === 'venue') return false;
  if (segment === 'miscellaneous') return false;
  if (genre === 'other') return false;
  if (!genre && !segment) return false;

  return segment === 'music';
}

export function eventMatchesByArtistOrTitle(
  event: TicketmasterEvent,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if ((event.name ?? '').toLowerCase().includes(q)) return true;

  const venues = event._embedded?.venues ?? [];
  const venueNames = new Set(
    venues.map((v) => (v.name ?? '').toLowerCase()).filter(Boolean),
  );

  for (const a of event._embedded?.attractions ?? []) {
    const name = (a.name ?? '').toLowerCase();
    if (!name) continue;
    if (venueNames.has(name)) continue;
    if (!isMusicEntity(a)) continue;
    if (name.includes(q)) return true;
  }

  return false;
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
  const events = data._embedded?.events ?? [];

  return keyword
    ? events.filter((e) => eventMatchesByArtistOrTitle(e, keyword))
    : events;
}

interface SuggestionsResponse {
  _embedded?: {
    events?: TicketmasterEvent[];
    attractions?: TicketmasterAttraction[];
  };
}

export interface TicketmasterSuggestions {
  events: TicketmasterEvent[];
  attractions: TicketmasterAttraction[];
}

export async function fetchMusicSuggestions(keyword: string): Promise<TicketmasterSuggestions> {
  const data = await tmGet<SuggestionsResponse>('/suggest', {
    keyword,
    size: '5',
    includeSpellcheck: 'yes',
    classificationName: 'music',
  });

  return {
    events: (data._embedded?.events ?? []).filter((e) =>
      eventMatchesByArtistOrTitle(e, keyword),
    ),
    attractions: (data._embedded?.attractions ?? []).filter((a) =>
      isMusicEntity(a),
    ),
  };
}

export async function fetchMusicEventsByAttraction(attractionId: string): Promise<TicketmasterEvent[]> {
  const data = await tmGet<EventsResponse>('/events.json', {
    attractionId,
    classificationName: 'music',
    size: String(PAGE_SIZE),
  });

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
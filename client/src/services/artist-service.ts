import type { Artist } from '../types/artist';
import type { Concert } from '../types/concert';

const TM_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const TM_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

/**
 * Obtiene la información de un artista desde Ticketmaster.
 */
export async function getArtistById(artistId: string): Promise<Artist | null> {
  try {
    const response = await fetch(
      `${TM_BASE_URL}/attractions/${artistId}.json?apikey=${TM_API_KEY}`
    );

    if (!response.ok) throw new Error('Error fetching artist');

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      image: data.images?.[0]?.url || '',
      genre: data.classifications?.[0]?.genre?.name || 'Unknown',
      bio: data.info || data.description || '',
    };
  } catch (error) {
    console.error('Error fetching artist:', error);
    return null;
  }
}

/**
 * Obtiene los eventos (conciertos) de un artista desde Ticketmaster.
 */
export async function getArtistEvents(artistName: string): Promise<Concert[]> {
  try {
    const response = await fetch(
      `${TM_BASE_URL}/events.json?keyword=${encodeURIComponent(
        artistName
      )}&classificationName=music&size=12&apikey=${TM_API_KEY}`
    );

    if (!response.ok) throw new Error('Error fetching events');

    const data = await response.json();
    const rawEvents = data._embedded?.events || [];

    return rawEvents.map((event: any): Concert => ({
      id: event.id,
      title: event.name,
      artistId: event._embedded?.attractions?.[0]?.id || '',
      artist: event._embedded?.attractions?.[0]?.name || event.name,
      venue: event._embedded?.venues?.[0]?.name || 'Venue not specified',
      city: event._embedded?.venues?.[0]?.city?.name || 'City not specified',
      date: event.dates?.start?.localDate || 'To be announced',
      ticketUrl: event.url || 'https://www.ticketmaster.com/',
    }));
  } catch (error) {
    console.error('Error fetching artist events:', error);
    return [];
  }
}

/**
 * Obtiene la biografía de un artista desde Wikipedia.
 */
export async function getArtistBio(artistName: string): Promise<string> {
  try {
    const formattedName = encodeURIComponent(artistName.replace(/ /g, '_'));
    const response = await fetch(
      `https://es.wikipedia.org/api/rest_v1/page/summary/${formattedName}`
    );

    if (!response.ok) return '';

    const data = await response.json();
    return data.extract || '';
  } catch (error) {
    console.error('Error fetching bio:', error);
    return '';
  }
}
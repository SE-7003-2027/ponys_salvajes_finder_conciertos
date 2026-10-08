import type { Artist } from '../types/artist';
import type { Concert } from '../types/concert';
import { cleanResults } from './event-service';

const TM_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const TM_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

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

    return cleanResults(rawEvents);
  } catch (error) {
    console.error('Error fetching artist events:', error);
    return [];
  }
}

export async function getArtistBio(artistName: string): Promise<string> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(artistName + ' band music')}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const pageTitle = searchData.query?.search[0]?.title || artistName;

    const formattedName = encodeURIComponent(pageTitle.replace(/ /g, '_'));

    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${formattedName}`;
    const summaryRes = await fetch(summaryUrl);

    if (!summaryRes.ok) return '';

    const data = await summaryRes.json();
    return data.extract || '';
  } catch (error) {
    console.error('Error fetching bio:', error);
    return '';
  }
}

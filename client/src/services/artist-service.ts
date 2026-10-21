import type { Artist } from '../types/artist';
import type { Concert } from '../types/concert';
import { fetchAttraction, fetchMusicEvents, mapEvents } from './ticketmaster';

export async function getArtistById(artistId: string): Promise<Artist | null> {
  try {
    const data = await fetchAttraction(artistId);

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
    return mapEvents(await fetchMusicEvents(artistName));
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

export interface Concert {
  id: string;
  title?: string;
  artistId: string;
  artist: string;
  venue: string;
  address?: string;
  city?: string;
  date: string;
  ticketUrl: string;
  imageUrl?: string;
  priceRange?: string;
}
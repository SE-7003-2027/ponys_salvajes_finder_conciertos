export interface Concert {
  id: string;
  title: string;
  artistId: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  ticketUrl: string;
  address?: string;
  imageUrl?: string;
  priceRange?: string;
}

interface TicketmasterImage {
  ratio?: string;
  url: string;
  width?: number;
  height?: number;
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  url?: string;
  images?: TicketmasterImage[];
  priceRanges?: Array<{ min: number; max: number; currency?: string }>;
  dates?: {
    start?: {
      localDate?: string;
    };
  };
  _embedded?: {
    attractions?: Array<{ id: string; name: string }>;
    venues?: Array<{
      name: string;
      city?: { name?: string };
      address?: { line1?: string };
    }>;
  };
  place?: {
    city?: { name?: string };
  };
}

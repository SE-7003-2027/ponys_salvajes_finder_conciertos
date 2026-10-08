export interface TicketmasterEvent {
  id: string;
  name: string;
  url?: string;
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
    }>;
  };
  place?: {
    city?: { name?: string };
  };
}

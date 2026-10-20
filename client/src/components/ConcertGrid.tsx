import { ConcertCard } from './ConcertCard';
import type { Concert } from '../types/concert';

interface ConcertGridProps {
  concerts: Concert[];
}

export function ConcertGrid({ concerts }: ConcertGridProps) {
  return (
    <section className="mt-8">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {concerts.map((concert) => (
          <ConcertCard key={concert.id} concert={concert} />
        ))}
      </ul>
    </section>
  );
}

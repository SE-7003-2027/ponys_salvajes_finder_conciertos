import { ConcertCard } from './ConcertCard';
import type { Concert } from '../types/concert';

interface ConcertGridProps {
  concerts: Concert[];
}

export function ConcertGrid({ concerts }: ConcertGridProps) {
  return (
    <section style={{ marginTop: '2rem' }}>
      {concerts.length === 0 ? (
        <p className="text-center py-16 text-gray-500 text-sm" >No concerts found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" >
          {concerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </ul>
      )}
    </section>
  );
}

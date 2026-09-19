import { ConcertCard } from './ConcertCard';
import type { Concert } from '../types/concert';

interface ConcertGridProps {
  concerts: Concert[];
}

export function ConcertGrid({ concerts }: ConcertGridProps) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>Concert Grid 🐴</h2>
      {concerts.length === 0 ? (
        <p>No concerts found.</p>
      ) : (
        <ul style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {concerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </ul>
      )}
    </section>
  );
}

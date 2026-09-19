import type { Concert } from '../types/concert';

interface ConcertCardProps {
  concert: Concert;
}

export function ConcertCard({ concert }: ConcertCardProps) {
  return (
    <li style={{ border: '1px solid gray', padding: '1rem', listStyle: 'none' }}>
      <h3>{concert.artist}</h3>
      <p>{concert.venue} ({concert.city})</p>
      <p>Date: {concert.date}</p>
    </li>
  );
}

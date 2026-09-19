import { useState } from 'react';
import { getRecommendedEvents } from './services/event-service';
import type { Concert } from './types/concert';

export function App() {
  const [concerts] = useState<Concert[]>(getRecommendedEvents);

  return (
    <main>
      <header>
        <h1>Concert Finder 🐴</h1>
        <p>Upcoming recommended events (Sprint 1 - Mock)</p>
      </header>

      <section style={{ marginTop: '2rem' }}>
        <ul>
          {concerts.map((concert) => (
            <li key={concert.id} style={{ marginBottom: '1rem' }}>
              <strong>{concert.artist}</strong> --{concert.venue} ({concert.city})
              <div>Date: {concert.date}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;

import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { ConcertGrid } from '../components/ConcertGrid';
import { getRecommendedEvents } from '../services/event-service';
import type { Concert } from '../types/concert';

export function Home() {
  const [concerts] = useState<Concert[]>(getRecommendedEvents);
  const [query, setQuery] = useState('');

  const filteredConcerts = concerts.filter((c) =>
    c.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white font-sans p-6">
      <div className="max-w-6xl mx-auto w-full" >
        <header className="border-b border-[#262626] pb-6 mb-8" >
          <h1>Concert Finder 🐴</h1>
          <Navbar query={query} onSearch={setQuery} />
        </header>
        <ConcertGrid concerts={filteredConcerts} />
      </div>
    </main>
  );
}

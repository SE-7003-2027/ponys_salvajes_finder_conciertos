import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ConcertGrid } from '../components/ConcertGrid';
import { getRecommendedEvents, searchEvents } from '../services/event-service';
import type { Concert } from '../types/concert';

export function Home() {
  const [concerts, setConcerts] = useState<Concert[]>(getRecommendedEvents());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setLoading(true);
        const apiConcerts = await searchEvents(query);
        setConcerts(apiConcerts);
        setLoading(false);
      } else if (query.trim() === '') {
        setConcerts(getRecommendedEvents());
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen bg-black text-white font-sans p-6">
      <div className="max-w-6xl mx-auto w-full">
        <header className="border-b border-[#262626] pb-6 mb-8">
          <h1>Concert Finder 🐴</h1>
          <Navbar query={query} onSearch={setQuery} />
        </header>

        {loading ? (
          <div className="text-center py-10 font-mono text-gray-400">
            Looking for real concerts on Ticketmaster...
          </div>
        ) : concerts.length === 0 ? (
          <div className="text-center py-10 font-mono text-gray-500">
            No concerts were found for "{query}".
          </div>
        ) : (
          <ConcertGrid concerts={concerts} />
        )}
      </div>
    </main>
  );
}

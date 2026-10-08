import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ConcertGrid } from '../components/ConcertGrid';
import { getRecommendedEvents, searchEvents } from '../services/event-service';
import type { Concert } from '../types/concert';

export function Home() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(async () => {
      setLoading(true);

      if (query.trim().length > 2) {
        const apiConcerts = await searchEvents(query);
        if (isMounted) {
          setConcerts(apiConcerts);
          setLoading(false);
        }
      } else {
        const recommended = await getRecommendedEvents();
        if (isMounted) {
          setConcerts(recommended);
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
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
            Looking for real concerts...
          </div>
        ) : concerts.length === 0 ? (
          <div className="text-center py-10 font-mono text-gray-500">
            {query.trim()
              ? `No concerts were found for "${query}".`
              : 'No recommended concerts available at the moment.'}
          </div>
        ) : (
          <ConcertGrid concerts={concerts} />
        )}
      </div>
    </main>
  );
}

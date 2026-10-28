import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ConcertGrid } from '../components/ConcertGrid';
import { getRecommendedEvents, searchEvents } from '../services/event-service';
import type { Concert } from '../types/concert';

const SEARCH_DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;

export function Home() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(async () => {
      setLoading(true);

      const shouldSearch = query.trim().length >= MIN_QUERY_LENGTH;

      const results = shouldSearch
        ? await searchEvents(query)
        : await getRecommendedEvents();

      if (isMounted) {
        setConcerts(results);
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Handler for linking a Spotify account from an active session
  const handleSpotifyLink = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = 'http://127.0.0.1:5173/spotify/callback';
    const scope = 'user-read-private user-read-email user-top-read';
    
    // We add state=link to differentiate this action from a standard login
    const state = 'link';
    
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
    
    window.location.href = authUrl;
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans p-6">
      <div className="max-w-6xl mx-auto w-full">
        <header className="border-b border-line pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl font-bold mb-4">Concert Finder 🐴</h1>
            <Navbar query={query} onSearch={setQuery} />
          </div>
          
          {/* Spotify Linking Button */}
          <button
            onClick={handleSpotifyLink}
            className="px-4 py-2 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-sm transition-colors shadow-md flex items-center gap-2"
          >
            Link Spotify Account
          </button>
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
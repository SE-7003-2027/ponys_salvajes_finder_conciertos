import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { ConcertGrid } from '../components/ConcertGrid';
import { PersonalizedRecommendations } from '../components/PersonalizedRecommendations';
import { getRecommendedEvents, searchEvents } from '../services/event-service';
import { mapEvents } from '../services/ticketmaster';
import { useDebounce } from '../hooks/useDebounce';
import type { SearchSuggestion } from '../components/SearchBar';
import type { Concert } from '../types/concert';

const SEARCH_DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 3;

export function Home() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  
  const handleSuggestionsChange = useCallback(
    (next: SearchSuggestion[], isLoading: boolean) => {
      setSuggestions(next);
      setSuggestionsLoading(isLoading);
    },[],
  );

  // State to track if the current user has already linked their Spotify account
  const [isSpotifyLinked, setIsSpotifyLinked] = useState(false);

  // Effect to verify the Spotify linking status when the component mounts
  useEffect(() => {
    const checkSpotifyStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3000/api/account/status', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setIsSpotifyLinked(data.isSpotifyLinked);
        }
      } catch (error) {
        console.error('Error checking Spotify status:', error);
      }
    };

    checkSpotifyStatus();
  }, []);

  // Effect to handle searching vs fetching recommended events based on user input
  useEffect(() => {
    if (suggestions.length > 0 || suggestionsLoading) return;
    let isMounted = true;
    setLoading(true);

    const shouldSearch = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

    (shouldSearch
      ? searchEvents(debouncedQuery)
      : getRecommendedEvents()
    ).then((results) => {
      if (isMounted) {
        setConcerts(results);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, suggestions.length, suggestionsLoading]);

  const suggestionConcerts: Concert[] = suggestions
    .filter((s): s is { kind: 'event'; item: any } => s.kind === 'event')
    .map((s) => mapEvents([s.item])[0]);
  const showSuggestionGrid = suggestions.length > 0 || suggestionsLoading;
  const gridConcerts = showSuggestionGrid ? suggestionConcerts : concerts;

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
        <header className="border-b border-line pb-6 mb-8">
          <h1>Concert Finder 🐴</h1>
          <Navbar
            query={query}
            onSearch={setQuery}
            onSuggestionsChange={handleSuggestionsChange}
          />
        </header>
        {loading || suggestionsLoading ? (
        <header className="border-b border-line pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-2xl font-bold mb-4">Concert Finder 🐴</h1>
            <Navbar query={query} onSearch={setQuery} />
          </div>

          {/* Conditional rendering based on Spotify connection status */}
          {isSpotifyLinked ? (
            <div className="px-4 py-2 rounded-lg bg-[#1DB954]/20 border border-[#1DB954] text-[#1DB954] font-bold text-sm flex items-center gap-2">
              <span>✓</span> Spotify Connected
            </div>
          ) : (
            <button
              onClick={handleSpotifyLink}
              className="px-4 py-2 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-sm transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              Link Spotify Account
            </button>
          )}
        </header>

        <PersonalizedRecommendations
          enabled={isSpotifyLinked}
          isSearching={query.trim().length >= MIN_QUERY_LENGTH}
        />

        {loading ? (
          <div className="text-center py-10 font-mono text-gray-400">
            Looking for real concerts...
          </div>
        ) : gridConcerts.length === 0 ? (
          <div className="text-center py-10 font-mono text-gray-500">
            {query.trim()
              ? `No concerts were found for "${query}".`
              : 'No recommended concerts available at the moment.'}
          </div>
        ) : (
          <ConcertGrid concerts={gridConcerts} />
        )}
      </div>
    </main>
  );
}
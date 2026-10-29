import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { ConcertGrid } from '../components/ConcertGrid';
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
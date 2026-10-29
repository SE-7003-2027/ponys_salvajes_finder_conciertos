import { SearchBar, type SearchSuggestion } from './SearchBar';

interface NavbarProps {
  query: string;
  onSearch: (value: string) => void;
  onSuggestionsChange?: (suggestions: SearchSuggestion[], loading: boolean) => void;
}

export function Navbar({ query, onSearch, onSuggestionsChange }: NavbarProps) {
  return (
    <nav>
      <SearchBar
        query={query}
        onSearch={onSearch}
        onSuggestionsChange={onSuggestionsChange}
      />
    </nav>
  );
}
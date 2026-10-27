import { SearchBar } from './SearchBar';

interface NavbarProps {
  query: string;
  onSearch: (value: string) => void;
}

export function Navbar({ query, onSearch }: NavbarProps) {
  return (
    <nav>
      <SearchBar query={query} onSearch={onSearch} />
    </nav>
  );
}

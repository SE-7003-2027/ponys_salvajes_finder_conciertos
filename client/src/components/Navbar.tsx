import { SearchBar } from './SearchBar';

interface NavbarProps {
  query: string;
  onSearch: (value: string) => void;
}

export function Navbar({ query, onSearch }: NavbarProps) {
  return (
    <nav>
      <h2>Navbar 🐴</h2>
      <SearchBar query={query} onSearch={onSearch} />
    </nav>
  );
}

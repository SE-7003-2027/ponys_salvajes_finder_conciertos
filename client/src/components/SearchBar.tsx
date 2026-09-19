interface SearchBarProps {
  query: string;
  onSearch: (value: string) => void;
}

export function SearchBar({ query, onSearch }: SearchBarProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search artist..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}

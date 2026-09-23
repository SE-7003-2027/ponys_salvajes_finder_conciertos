import { IoCloseOutline } from "react-icons/io5";

interface SearchBarProps {
  query: string;
  onSearch: (value: string) => void;
}

export function SearchBar({ query, onSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search artist..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        className={`
          text-white font-mono
          placeholder:text-gray-600 placeholder:font-sans
          bg-[#121212]/50 hover:bg-gray-500/10 
          min-w-full min-h-8 rounded-lg p-3 focus:outline-1 focus:outline-[#262626]
          caret-[#0457cb] cursor-text
        `}
      />
      {query && (
        <button
          type="button"
          onClick={() => onSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0457cb] hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
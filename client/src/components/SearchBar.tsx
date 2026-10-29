import { useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDebounce } from '../hooks/useDebounce';
import {
  fetchMusicSuggestions,
  type TicketmasterAttraction,
} from '../services/ticketmaster';
import type { TicketmasterEvent } from '../types/ticketmasterEvent';

export type SearchSuggestion =
  | { kind: 'attraction'; item: TicketmasterAttraction }
  | { kind: 'event'; item: TicketmasterEvent };

interface SearchBarProps {
  query: string;
  onSearch: (value: string) => void;
  onSuggestionsChange?: (suggestions: SearchSuggestion[], loading: boolean) => void;
}

const MIN_CHARS = 2;
const DEBOUNCE_MS = 180;

function isAlnum(ch: string): boolean {
  return /[\p{L}\p{N}]/u.test(ch);
}

function countSpecialChars(s: string): number {
  let n = 0;
  for (const ch of s) {
    if (ch === ' ' || ch === '-' || ch === "'") continue;
    if (!isAlnum(ch)) n++;
  }
  return n;
}

function getCompletion(query: string, suggestion: string): string | null {
  const q = query.trim();
  if (!q) return null;
  const s = suggestion.trim();
  if (!s.toLowerCase().startsWith(q.toLowerCase())) return null;
  return s.slice(q.length); // respeta mayúsculas originales
}

interface ScoredSuggestion {
  suggestion: SearchSuggestion;
  name: string;
  completion: string;
  score: number;
  originalIndex: number;
}

function pickBestCompletion(
  query: string,
  suggestions: SearchSuggestion[],
): ScoredSuggestion | null {
  const q = query.trim();
  if (!q) return null;

  const candidates: ScoredSuggestion[] = [];

  suggestions.forEach((s, index) => {
    const name = s.item.name ?? '';
    const completion = getCompletion(q, name);
    if (completion === null) return;

    const firstChar = completion.trimStart()[0] ?? '';
    const nextIsAlnum = firstChar === '' || isAlnum(firstChar);
    const alnumBonus = nextIsAlnum ? 100 : 0;

    const specialPenalty = countSpecialChars(name) * 10;
    const lengthPenalty = name.length * 0.01;

    candidates.push({
      suggestion: s,
      name,
      completion,
      score: alnumBonus - specialPenalty - lengthPenalty,
      originalIndex: index,
    });
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.originalIndex - b.originalIndex;
  });

  return candidates[0];
}

export function SearchBar({ query, onSearch, onSuggestionsChange }: SearchBarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Fetch de sugerencias
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < MIN_CHARS) {
      abortRef.current?.abort();
      setIsLoading(false);
      setSuggestions([]);
      onSuggestionsChange?.([], false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    onSuggestionsChange?.([], true);

    fetchMusicSuggestions(trimmed)
      .then(({ events, attractions }) => {
        if (controller.signal.aborted) return;

        const merged: SearchSuggestion[] = [
          ...attractions.slice(0, 3).map((item) => ({ kind: 'attraction' as const, item })),
          ...events.slice(0, 5).map((item) => ({ kind: 'event' as const, item })),
        ];

        setSuggestions(merged);
        onSuggestionsChange?.(merged, false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setSuggestions([]);
        onSuggestionsChange?.([], false);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, onSuggestionsChange]);

  // Mejor candidato para autocompletar
  const best = pickBestCompletion(query, suggestions);
  const completion =
    dismissedFor === query || !best ? '' : best.completion;

  // Alineación del texto fantasma: medimos el ancho real del texto tecleado
  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [query]);

  function acceptCompletion() {
    if (!completion || !best) return;
    const full = best.name;
    onSearch(full);
    requestAnimationFrame(() => {
      const len = full.length;
      inputRef.current?.setSelectionRange(len, len);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!completion) return;

    const atEnd = inputRef.current?.selectionStart === query.length;

    if (e.key === 'Tab' || (e.key === 'ArrowRight' && atEnd)) {
      e.preventDefault();
      acceptCompletion();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setDismissedFor(query);
    }
  }

  return (
    <div className="relative w-full">
      {/* Medidor oculto: mismo font/padding que el input real */}
      <span
        ref={measureRef}
        aria-hidden
        className="
          invisible absolute left-3 top-1/2 -translate-y-1/2
          text-white font-mono whitespace-pre pointer-events-none
        "
      >
        {query}
      </span>

      {/* Texto fantasma: se superpone exactamente donde va el resto */}
      {completion && !isLoading && (
        <div
          aria-hidden
          className="
            pointer-events-none absolute top-1/2 -translate-y-1/2
            text-gray-500 font-mono whitespace-pre
          "
          style={{ left: `calc(0.75rem + ${textWidth}px)` }}
        >
          {completion}
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        placeholder="Search by artist or show..."
        value={query}
        onChange={(e) => {
          onSearch(e.target.value);
          setDismissedFor(null);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className={`
          relative z-10
          w-full text-white font-mono
          placeholder:text-gray-600 placeholder:font-sans
          bg-surface/50 hover:bg-gray-500/10
          min-h-8 rounded-lg p-3 focus:outline-1 focus:outline-line
          caret-brand cursor-text
          ${query ? 'pr-10' : ''}
        `}
      />

      {isLoading && !query && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-mono animate-pulse z-10">
          ...
        </span>
      )}

      {query && (
        <button
          type="button"
          onClick={() => {
            onSearch('');
            setDismissedFor(null);
            onSuggestionsChange?.([], false);
          }}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brand hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1 z-10"
        >
          <IoCloseOutline className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
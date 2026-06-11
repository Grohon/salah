'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { searchCity } from '@/lib/api/geocode';
import type { LocationData } from '@/lib/types';

interface CitySearchProps {
  onSelect: (location: LocationData) => void;
}

export function CitySearch({ onSelect }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchCity(q);
      setResults(data);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (location: LocationData) => {
    onSelect(location);
    setQuery(`${location.city}, ${location.country}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleChange}
          placeholder="Search for your city..."
          className="pl-10"
          aria-label="Search city"
          role="combobox"
          aria-expanded={isOpen}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin dark:text-emerald-400 text-emerald-700" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-surface p-2 shadow-2xl">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                'hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none'
              )}
            >
              <MapPin className="h-4 w-4 shrink-0 dark:text-emerald-400 text-emerald-700" />
              <div>
                <p className="font-medium">{result.city}</p>
                <p className="text-xs text-muted-foreground">
                  {result.state ? `${result.state}, ` : ''}{result.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && !loading && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-surface p-4 text-center text-sm text-muted-foreground">
          No cities found. Try a different search term.
        </div>
      )}
    </div>
  );
}

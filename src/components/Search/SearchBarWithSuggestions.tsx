import React, { useEffect, useRef, useState } from 'react';
import { Leaf, MapPin, Navigation, Search, X } from 'lucide-react';
import type { Pandal } from '../../types/pandal';
import { useI18n } from '../../context/I18nContext';
import { formatDistance } from '../../utils/geoUtils';

interface SearchBarWithSuggestionsProps {
  query: string;
  onQueryChange: (q: string) => void;
  pandals: Pandal[];
  onSelectSuggestion: (pandal: Pandal) => void;
  distancesMap?: Map<string, number>;
}

export const SearchBarWithSuggestions: React.FC<SearchBarWithSuggestionsProps> = ({
  query,
  onQueryChange,
  pandals,
  onSelectSuggestion,
  distancesMap,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggestions filter
  const suggestions = React.useMemo(() => {
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase().trim();
    return pandals
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.nearestStation.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
        );
      })
      .slice(0, 6); // Top 6 suggestions
  }, [query, pandals]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (pandal: Pandal) => {
    onSelectSuggestion(pandal);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-stone-400 dark:text-stone-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.searchPlaceholder}
          className="w-full pl-10 pr-9 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 border border-stone-200 dark:border-stone-700 shadow-md transition-all"
        />
        {query && (
          <button
            onClick={() => {
              onQueryChange('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            title={t.clearSearch}
            className="absolute right-3 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Live Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          id="search-suggestions-dropdown"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-amber-300/40 dark:border-stone-700 overflow-hidden z-[1050] divide-y divide-stone-100 dark:divide-stone-700/60 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3.5 py-1.5 bg-amber-50/80 dark:bg-stone-900/60 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center justify-between">
            <span>{t.searchSuggestionsTitle}</span>
            <span className="text-[10px] text-stone-500 font-normal">
              {suggestions.length} matches
            </span>
          </div>

          <ul className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-700/40">
            {suggestions.map((pandal, idx) => {
              const distanceKm = distancesMap?.get(pandal.id);
              const isHighlighted = idx === highlightedIndex;

              return (
                <li
                  key={pandal.id}
                  onClick={() => handleSelect(pandal)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`px-3 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isHighlighted
                      ? 'bg-amber-100/70 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100'
                      : 'hover:bg-amber-50/60 dark:hover:bg-stone-700/50'
                  }`}
                >
                  {/* Left: Thumbnail & Name/Area */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={pandal.photoUrl}
                      alt={pandal.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                        {pandal.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                        <span className="flex items-center gap-0.5 font-medium text-amber-700 dark:text-amber-400">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {pandal.area}
                        </span>
                        <span>•</span>
                        <span className="truncate">{pandal.nearestStation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges & Distance */}
                  <div className="flex items-center gap-2 shrink-0">
                    {distanceKm !== undefined && (
                      <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800 flex items-center gap-1">
                        <Navigation className="w-2.5 h-2.5 rotate-45" />
                        {formatDistance(distanceKm)}
                      </span>
                    )}

                    {pandal.ecoFriendly && (
                      <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                        <Leaf className="w-2.5 h-2.5" />
                        Eco
                      </span>
                    )}

                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        pandal.crowdLevel === 'High'
                          ? 'bg-red-500 ring-2 ring-red-300'
                          : pandal.crowdLevel === 'Medium'
                          ? 'bg-amber-500 ring-2 ring-amber-300'
                          : 'bg-emerald-500 ring-2 ring-emerald-300'
                      }`}
                      title={`${pandal.crowdLevel} Rush`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

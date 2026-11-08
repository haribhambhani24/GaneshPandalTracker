import React, { useEffect, useRef, useState } from 'react';
import { History, Leaf, MapPin, Navigation, Search, X } from 'lucide-react';
import type { Pandal } from '../../types/pandal';
import { useI18n } from '../../context/I18nContext';
import { formatDistance } from '../../utils/geoUtils';
import {
  matchesSearchQuery,
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '../../utils/searchUtils';

interface SearchBarWithSuggestionsProps {
  query: string;
  onQueryChange: (q: string) => void;
  pandals: Pandal[];
  onSelectSuggestion: (pandal: Pandal) => void;
  distancesMap?: Map<string, number>;
}

const POPULAR_AREAS = ['Lalbaug', 'Girgaon', 'Khetwadi', 'Andheri', 'Fort', 'Chembur'];

export const SearchBarWithSuggestions: React.FC<SearchBarWithSuggestionsProps> = ({
  query,
  onQueryChange,
  pandals,
  onSelectSuggestion,
  distancesMap,
}) => {
  const { t, locale, formatNumber, formatCrowdLevel } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearchesList, setRecentSearchesList] = useState<string[]>(() => getRecentSearches());
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches when opened
  const refreshRecentSearches = () => {
    setRecentSearchesList(getRecentSearches());
  };

  // Multi-language & fuzzy matching suggestions
  const suggestions = React.useMemo(() => {
    if (!query || query.trim() === '') return [];
    return pandals
      .filter((p) => matchesSearchQuery(p, query))
      .slice(0, 6);
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

  const handleSelectPandal = (pandal: Pandal) => {
    addRecentSearch(pandal.name);
    refreshRecentSearches();
    onSelectSuggestion(pandal);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSelectRecent = (term: string) => {
    onQueryChange(term);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeRecentSearch(term);
    refreshRecentSearches();
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches();
    refreshRecentSearches();
  };

  const handleSelectPopularArea = (area: string) => {
    onQueryChange(area);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectPandal(suggestions[highlightedIndex]);
        } else if (suggestions.length > 0) {
          handleSelectPandal(suggestions[0]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    } else if (e.key === 'Enter' && query.trim()) {
      addRecentSearch(query.trim());
      refreshRecentSearches();
      setIsOpen(false);
    }
  };

  const showRecent = !query.trim() && isOpen && recentSearchesList.length > 0;
  const showSuggestions = query.trim().length > 0 && isOpen && suggestions.length > 0;
  const showNoResults = query.trim().length > 0 && isOpen && suggestions.length === 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-stone-400 dark:text-stone-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          aria-label={t.searchPlaceholder}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            refreshRecentSearches();
            setIsOpen(true);
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
            aria-label={t.clearSearch}
            className="absolute right-3 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Container */}
      {isOpen && (showRecent || showSuggestions || showNoResults) && (
        <div
          id="search-suggestions-dropdown"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-amber-300/40 dark:border-stone-700 overflow-hidden z-[1050] divide-y divide-stone-100 dark:divide-stone-700/60 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* 1. Recent Searches (when query is empty) */}
          {showRecent && (
            <div>
              <div className="px-3.5 py-1.5 bg-stone-50 dark:bg-stone-900/60 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <History className="w-3 h-3" />
                  {t.recentSearches}
                </span>
                <button
                  type="button"
                  onClick={handleClearAllRecent}
                  className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  {t.clearRecentSearches}
                </button>
              </div>
              <ul className="max-h-60 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-700/40">
                {recentSearchesList.map((term) => (
                  <li
                    key={term}
                    onClick={() => handleSelectRecent(term)}
                    className="px-3.5 py-2 flex items-center justify-between gap-2 hover:bg-amber-50/60 dark:hover:bg-stone-700/50 cursor-pointer text-xs text-stone-700 dark:text-stone-200"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{term}</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveRecent(e, term)}
                      title="Remove"
                      className="p-1 hover:text-red-500 text-stone-400 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 2. Live Suggestions */}
          {showSuggestions && (
            <div>
              <div className="px-3.5 py-1.5 bg-amber-50/80 dark:bg-stone-900/60 text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center justify-between">
                <span>{t.searchSuggestionsTitle}</span>
                <span className="text-[10px] text-stone-500 font-normal">
                  {formatNumber(suggestions.length)} {t.matches}
                </span>
              </div>

              <ul className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-700/40">
                {suggestions.map((pandal, idx) => {
                  const distanceKm = distancesMap?.get(pandal.id);
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <li
                      key={pandal.id}
                      onClick={() => handleSelectPandal(pandal)}
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
                          src={pandal.coverThumbUrl || pandal.photoUrl}
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
                            {formatDistance(distanceKm, locale)}
                          </span>
                        )}

                        {pandal.ecoFriendly && (
                          <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                            <Leaf className="w-2.5 h-2.5" />
                            {t.ecoFriendly}
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
                          title={formatCrowdLevel(pandal.crowdLevel)}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* 3. Helpful No Results State */}
          {showNoResults && (
            <div className="p-4 text-center space-y-3">
              <p className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                {t.noSearchResults} &ldquo;<span className="font-bold text-amber-700 dark:text-amber-400">{query}</span>&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100 dark:border-stone-700">
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2 font-medium">
                  {t.tryPopularArea}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {POPULAR_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleSelectPopularArea(area)}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 hover:bg-amber-100 dark:bg-stone-700 dark:hover:bg-amber-950/60 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600 transition-colors cursor-pointer"
                    >
                      📍 {area}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

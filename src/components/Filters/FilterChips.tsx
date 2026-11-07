import React from 'react';
import { Clock, Compass, Leaf, Locate, MapPin, Star, Users, X } from 'lucide-react';
import type { CrowdLevel } from '../../types/pandal';
import type { Circuit } from '../../types/circuit';
import { useI18n } from '../../context/I18nContext';

interface FilterChipsProps {
  selectedArea: string;
  onAreaChange: (area: string) => void;
  areas: string[];
  ecoFriendlyFilter: boolean;
  onEcoFriendlyFilterChange: (enabled: boolean) => void;
  twentyFourHoursFilter: boolean;
  onTwentyFourHoursFilterChange: (enabled: boolean) => void;
  crowdFilter: 'All' | CrowdLevel;
  onCrowdFilterChange: (level: 'All' | CrowdLevel) => void;
  sortByDistance: boolean;
  onToggleSortByDistance: () => void;
  locatingDistance: boolean;
  searchQuery: string;
  onClearSearchQuery: () => void;
  onClearAllFilters: () => void;
  hasActiveFilters: boolean;
  onOpenCircuits?: () => void;
  activeCircuit?: Circuit | null;
  onClearCircuit?: () => void;
  myDarshanFilterOnly?: boolean;
  onToggleMyDarshanFilter?: () => void;
  myDarshanCount?: number;
  filteredCount?: number;
  totalCount?: number;
}

// Shared control style specifications:
// - Height: exactly 40px on mobile (h-10) and 36px on desktop (sm:h-9)
// - Horizontal padding: 14px on mobile (px-3.5) and 12px on desktop (sm:px-3)
// - Font: 14px (text-sm) font-semibold
// - Border: 1px solid (border) rounded-full
// - Icons: Lucide 16px (w-4 h-4 shrink-0)
// - Spacing: gap-1.5 between icon and text
const baseControlClass =
  'shrink-0 inline-flex items-center gap-1.5 h-10 sm:h-9 px-3.5 sm:px-3 rounded-full text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-stone-900 disabled:opacity-40 disabled:cursor-not-allowed select-none';

const baseSelectClass =
  'shrink-0 appearance-none h-10 sm:h-9 pl-8 pr-7 sm:pl-7.5 sm:pr-6 rounded-full text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-stone-900 disabled:opacity-40 disabled:cursor-not-allowed select-none';

const inactiveClass =
  'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 hover:border-stone-300 dark:hover:border-stone-600 shadow-xs';

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedArea,
  onAreaChange,
  areas,
  ecoFriendlyFilter,
  onEcoFriendlyFilterChange,
  twentyFourHoursFilter,
  onTwentyFourHoursFilterChange,
  crowdFilter,
  onCrowdFilterChange,
  sortByDistance,
  onToggleSortByDistance,
  locatingDistance,
  searchQuery,
  onClearSearchQuery,
  onClearAllFilters,
  hasActiveFilters,
  onOpenCircuits,
  activeCircuit,
  onClearCircuit,
  myDarshanFilterOnly,
  onToggleMyDarshanFilter,
  myDarshanCount = 0,
  filteredCount,
}) => {
  const { t, formatNumber } = useI18n();

  return (
    <div className="w-full bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-200/80 dark:border-stone-800 px-3 py-2 z-[970] shadow-xs">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Main Filters Scrollable Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {/* Walking Trails Button */}
          {onOpenCircuits && (
            <button
              type="button"
              onClick={onOpenCircuits}
              className={`${baseControlClass} ${
                activeCircuit
                  ? 'bg-orange-600 text-white border-orange-600 shadow-xs hover:bg-orange-700'
                  : 'bg-white dark:bg-stone-800 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-800 hover:bg-orange-50/70 dark:hover:bg-orange-950/40 shadow-xs'
              }`}
            >
              <Compass className={`w-4 h-4 shrink-0 ${activeCircuit ? 'text-white' : 'text-orange-600 dark:text-orange-400'}`} />
              <span>{activeCircuit ? `${t.trail}: ${activeCircuit.name.split(' ')[0]}` : t.circuits}</span>
            </button>
          )}

          {/* Near Me Button with Clear States */}
          <button
            type="button"
            onClick={onToggleSortByDistance}
            id="near-me-btn"
            title={sortByDistance ? t.nearMeActive : t.nearMe}
            className={`${baseControlClass} ${
              sortByDistance
                ? 'bg-orange-600 text-white border-orange-600 shadow-xs hover:bg-orange-700'
                : 'bg-white dark:bg-stone-800 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-800 hover:bg-orange-50/70 dark:hover:bg-orange-950/40 shadow-xs'
            }`}
          >
            <Locate className={`w-4 h-4 shrink-0 ${locatingDistance ? 'animate-spin' : ''} ${sortByDistance ? 'text-white' : 'text-orange-600 dark:text-orange-400'}`} />
            <span>{locatingDistance ? t.nearMeLocating : sortByDistance ? t.nearMeActive : t.nearMe}</span>
          </button>

          {/* My Darshan Bookmark Pill */}
          {onToggleMyDarshanFilter && (
            <button
              type="button"
              onClick={onToggleMyDarshanFilter}
              className={`${baseControlClass} ${
                myDarshanFilterOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs hover:bg-amber-600'
                  : inactiveClass
              }`}
            >
              <Star className={`w-4 h-4 shrink-0 ${myDarshanFilterOnly ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'}`} />
              <span>{t.myDarshan} ({formatNumber(myDarshanCount)})</span>
            </button>
          )}

          {/* Area Dropdown */}
          <div className="shrink-0 relative">
            <label htmlFor="area-select" className="sr-only">
              {t.allAreas}
            </label>
            <select
              id="area-select"
              aria-label={t.allAreas}
              value={selectedArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className={`${baseSelectClass} ${
                selectedArea !== 'All'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs hover:bg-amber-700'
                  : inactiveClass
              }`}
            >
              {areas.map((area) => (
                <option key={area} value={area} className="text-stone-900 bg-white dark:bg-stone-800 dark:text-white">
                  {area === 'All' ? t.allAreas : area}
                </option>
              ))}
            </select>
            <MapPin
              className={`w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                selectedArea !== 'All' ? 'text-white' : 'text-stone-500 dark:text-stone-400'
              }`}
            />
          </div>

          {/* Eco-Friendly Filter */}
          <button
            type="button"
            onClick={() => onEcoFriendlyFilterChange(!ecoFriendlyFilter)}
            className={`${baseControlClass} ${
              ecoFriendlyFilter
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs hover:bg-emerald-700'
                : inactiveClass
            }`}
          >
            <Leaf className={`w-4 h-4 shrink-0 ${ecoFriendlyFilter ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span>{t.ecoFriendly}</span>
          </button>

          {/* 24-Hour Darshan Filter */}
          <button
            type="button"
            onClick={() => onTwentyFourHoursFilterChange(!twentyFourHoursFilter)}
            className={`${baseControlClass} ${
              twentyFourHoursFilter
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs hover:bg-indigo-700'
                : inactiveClass
            }`}
          >
            <Clock className={`w-4 h-4 shrink-0 ${twentyFourHoursFilter ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
            <span>{t.twentyFourHours}</span>
          </button>

          {/* Crowd Filter Pills */}
          <button
            type="button"
            onClick={() => onCrowdFilterChange(crowdFilter === 'Low' ? 'All' : 'Low')}
            className={`${baseControlClass} ${
              crowdFilter === 'Low'
                ? 'bg-teal-700 text-white border-teal-700 shadow-xs hover:bg-teal-800'
                : inactiveClass
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${crowdFilter === 'Low' ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />
            <span>{t.crowdLow}</span>
          </button>

          <button
            type="button"
            onClick={() => onCrowdFilterChange(crowdFilter === 'High' ? 'All' : 'High')}
            className={`${baseControlClass} ${
              crowdFilter === 'High'
                ? 'bg-red-600 text-white border-red-600 shadow-xs hover:bg-red-700'
                : inactiveClass
            }`}
          >
            <Users className={`w-4 h-4 shrink-0 ${crowdFilter === 'High' ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />
            <span>{t.crowdHigh}</span>
          </button>
        </div>

        {/* Removable Active Filter Chips & Result Count Row */}
        <div
          id="active-filter-chips"
          className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-amber-200/60 dark:border-stone-800 text-xs"
        >
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {/* Result count pill */}
            {filteredCount !== undefined && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs shrink-0">
                {formatNumber(filteredCount)} {t.resultsCount}
              </span>
            )}

            {/* Active Circuit Chip */}
            {activeCircuit && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-600 text-white font-semibold shadow-xs shrink-0 text-xs">
                <Compass className="w-3.5 h-3.5 text-amber-200" />
                <span>{t.trail}: {activeCircuit.name}</span>
                {onClearCircuit && (
                  <button
                    type="button"
                    onClick={onClearCircuit}
                    className="hover:text-amber-200 p-0.5 rounded-full ml-0.5"
                    title={t.exitCircuit}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            )}

            {/* My Darshan chip */}
            {myDarshanFilterOnly && onToggleMyDarshanFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white font-semibold shrink-0 text-xs">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>{t.myDarshan}</span>
                <button
                  type="button"
                  onClick={onToggleMyDarshanFilter}
                  className="hover:text-amber-200 p-0.5 rounded-full ml-0.5"
                  title={t.clearAllFilters}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Search query chip */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium border border-amber-300 dark:border-stone-700 shrink-0 text-xs">
                <span>"{searchQuery}"</span>
                <button
                  type="button"
                  onClick={onClearSearchQuery}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Area chip */}
            {selectedArea !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium border border-amber-300 dark:border-stone-700 shrink-0 text-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>{selectedArea}</span>
                <button
                  type="button"
                  onClick={() => onAreaChange('All')}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Clear area filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Eco chip */}
            {ecoFriendlyFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-medium border border-emerald-300 dark:border-emerald-800 shrink-0 text-xs">
                <Leaf className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>{t.ecoFriendly}</span>
                <button
                  type="button"
                  onClick={() => onEcoFriendlyFilterChange(false)}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Remove eco filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* 24-Hours chip */}
            {twentyFourHoursFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 font-medium border border-indigo-300 dark:border-indigo-800 shrink-0 text-xs">
                <Clock className="w-3.5 h-3.5 text-indigo-700 dark:text-indigo-400" />
                <span>{t.twentyFourHours}</span>
                <button
                  type="button"
                  onClick={() => onTwentyFourHoursFilterChange(false)}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Remove 24-hour darshan filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Crowd chip */}
            {crowdFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium border border-stone-300 dark:border-stone-700 shrink-0 text-xs">
                <Users className={`w-3.5 h-3.5 ${crowdFilter === 'High' ? 'text-red-500' : 'text-teal-500'}`} />
                <span>{crowdFilter === 'High' ? t.crowdHigh : t.crowdLow}</span>
                <button
                  type="button"
                  onClick={() => onCrowdFilterChange('All')}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Remove crowd filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>

          {/* Single-tap Clear All button */}
          {(hasActiveFilters || activeCircuit || myDarshanFilterOnly) && (
            <button
              type="button"
              onClick={onClearAllFilters}
              id="clear-all-filters-btn"
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline px-2 py-1 rounded shrink-0 cursor-pointer"
            >
              {t.clearAllFilters}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

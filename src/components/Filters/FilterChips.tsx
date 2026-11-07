import React from 'react';
import { Clock, Compass, Leaf, Locate, MapPin, Navigation, Star, Users, X } from 'lucide-react';
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
}

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
}) => {
  const { t, formatNumber } = useI18n();

  return (
    <div className="w-full bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-200/80 dark:border-stone-800 px-3 py-2 z-[970] shadow-xs">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Main Filters Scrollable Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {/* Walking Trails Button */}
          {onOpenCircuits && (
            <button
              onClick={onOpenCircuits}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                activeCircuit
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white ring-2 ring-orange-400/60'
                  : 'bg-white dark:bg-stone-800 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100/60 dark:hover:bg-amber-950/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeCircuit ? `${t.trail}: ${activeCircuit.name.split(' ')[0]}` : t.circuits}</span>
            </button>
          )}

          {/* Near Me Button */}
          <button
            onClick={onToggleSortByDistance}
            id="near-me-btn"
            title={sortByDistance ? t.nearMeActive : t.nearMe}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              sortByDistance
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-2 ring-orange-400/50'
                : 'bg-white dark:bg-stone-800 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/40'
            }`}
          >
            <Locate className={`w-3.5 h-3.5 ${locatingDistance ? 'animate-spin' : ''}`} />
            <span>{locatingDistance ? t.nearMeLocating : sortByDistance ? t.nearMeActive : t.nearMe}</span>
          </button>

          {/* My Darshan Bookmark Pill */}
          {onToggleMyDarshanFilter && (
            <button
              onClick={onToggleMyDarshanFilter}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                myDarshanFilterOnly
                  ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${myDarshanFilterOnly ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'}`} />
              <span>{t.myDarshan} ({formatNumber(myDarshanCount)})</span>
            </button>
          )}

          {/* Area Dropdown */}
          <div className="shrink-0 relative">
            <select
              value={selectedArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className={`appearance-none pl-7 pr-7 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                selectedArea !== 'All'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-amber-200/60 dark:border-stone-700 hover:bg-amber-100/50 dark:hover:bg-stone-700'
              }`}
            >
              {areas.map((area) => (
                <option key={area} value={area} className="text-stone-900 bg-white dark:bg-stone-800 dark:text-white">
                  {area === 'All' ? `📍 ${t.allAreas}` : `📍 ${area}`}
                </option>
              ))}
            </select>
            <MapPin
              className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                selectedArea !== 'All' ? 'text-white' : 'text-stone-500 dark:text-stone-400'
              }`}
            />
          </div>

          {/* Eco-Friendly Filter */}
          <button
            onClick={() => onEcoFriendlyFilterChange(!ecoFriendlyFilter)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              ecoFriendlyFilter
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>{t.ecoFriendly}</span>
          </button>

          {/* 24-Hour Darshan Filter */}
          <button
            onClick={() => onTwentyFourHoursFilterChange(!twentyFourHoursFilter)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              twentyFourHoursFilter
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/30'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.twentyFourHours}</span>
          </button>

          {/* Crowd Filter Pills */}
          <button
            onClick={() => onCrowdFilterChange(crowdFilter === 'Low' ? 'All' : 'Low')}
            className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              crowdFilter === 'Low'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-teal-800 dark:text-teal-400 border border-teal-200 dark:border-teal-900 hover:bg-teal-50 dark:hover:bg-teal-950/30'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.crowdLow}</span>
          </button>

          <button
            onClick={() => onCrowdFilterChange(crowdFilter === 'High' ? 'All' : 'High')}
            className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              crowdFilter === 'High'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white dark:bg-stone-800 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{t.crowdHigh}</span>
          </button>
        </div>

        {/* Removable Active Filter Chips Row */}
        {(hasActiveFilters || activeCircuit || myDarshanFilterOnly) && (
          <div
            id="active-filter-chips"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-amber-200/60 dark:border-stone-800 text-xs"
          >
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 shrink-0">
              {t.activeFilters}
            </span>

            {/* Active Circuit Chip */}
            {activeCircuit && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-600 text-white font-semibold shadow-xs shrink-0">
                <Compass className="w-3 h-3 text-amber-200" />
                <span>{t.trail}: {activeCircuit.name}</span>
                {onClearCircuit && (
                  <button
                    onClick={onClearCircuit}
                    className="hover:text-amber-200 p-0.5 rounded-full ml-0.5"
                    title={t.exitCircuit}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            )}

            {/* My Darshan chip */}
            {myDarshanFilterOnly && onToggleMyDarshanFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-semibold shrink-0">
                <Star className="w-3 h-3 fill-white" />
                <span>{t.myDarshan}</span>
                <button
                  onClick={onToggleMyDarshanFilter}
                  className="hover:text-amber-200 p-0.5 rounded-full ml-0.5"
                  title={t.clearAllFilters}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Near Me Chip */}
            {sortByDistance && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200 font-semibold border border-orange-300 dark:border-orange-800 shrink-0">
                <Navigation className="w-3 h-3 text-orange-600" />
                <span>{t.nearMe}</span>
                <button
                  onClick={onToggleSortByDistance}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Remove Near Me filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Search query chip */}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium border border-amber-300 dark:border-stone-700 shrink-0">
                <span>"{searchQuery}"</span>
                <button
                  onClick={onClearSearchQuery}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Clear search query"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Area chip */}
            {selectedArea !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium border border-amber-300 dark:border-stone-700 shrink-0">
                <span>📍 {selectedArea}</span>
                <button
                  onClick={() => onAreaChange('All')}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Clear area filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Eco chip */}
            {ecoFriendlyFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-medium border border-emerald-300 dark:border-emerald-800 shrink-0">
                <span>🌱 {t.ecoFriendly}</span>
                <button
                  onClick={() => onEcoFriendlyFilterChange(false)}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Remove eco filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* 24-Hours chip */}
            {twentyFourHoursFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 font-medium border border-indigo-300 dark:border-indigo-800 shrink-0">
                <span>⏰ {t.twentyFourHours}</span>
                <button
                  onClick={() => onTwentyFourHoursFilterChange(false)}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Remove 24-hour darshan filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Crowd chip */}
            {crowdFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium border border-stone-300 dark:border-stone-700 shrink-0">
                <span>{crowdFilter === 'High' ? `🔴 ${t.crowdHigh}` : `🟢 ${t.crowdLow}`}</span>
                <button
                  onClick={() => onCrowdFilterChange('All')}
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5"
                  title="Remove crowd filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Clear All button */}
            <button
              onClick={onClearAllFilters}
              id="clear-all-filters-btn"
              className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline px-2 py-0.5 rounded shrink-0 cursor-pointer"
            >
              {t.clearAllFilters}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Clock,
  Compass,
  Leaf,
  Locate,
  MapPin,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from 'lucide-react';
import type { CrowdLevel } from '../../types/pandal';
import type { Circuit } from '../../types/circuit';
import { useI18n } from '../../context/I18nContext';
import { MobileFiltersModal } from '../Modal/MobileFiltersModal';

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

// Consistent styles across all controls:
// - Selected: solid orange (#EA580C / bg-orange-600), white text & icon, 1px matching border (WCAG AA > 4.5:1)
// - Unselected: high contrast stone-700 / stone-200 with 1px border (WCAG AAA > 9:1)
const selectedClass =
  'bg-orange-600 text-white border-orange-600 shadow-xs hover:bg-orange-700';

const unselectedClass =
  'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750 hover:border-stone-400 dark:hover:border-stone-600 shadow-xs';

// Desktop/Tablet (>= 768px):
// - Height: 36px (h-9)
// - Padding: 10px on tablet, 12px on desktop (px-2.5 lg:px-3)
// - Font size: 13px on tablet, 14px on desktop (text-[13px] lg:text-sm font-semibold)
// - Icons: 16px (w-4 h-4 shrink-0)
// - Gap icon-to-label: 6px (gap-1.5)
// - Flex: flex-1 min-w-0 justify-center
const baseControlClass =
  'flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 h-9 px-2.5 lg:px-3 rounded-full text-[13px] lg:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-stone-900 disabled:opacity-40 disabled:cursor-not-allowed select-none';

// Mobile (< 768px):
// - Height: 40px (h-10)
// - Horizontal padding: px-2.5 sm:px-3
// - Font: text-xs sm:text-sm font-semibold
const mobileControlClass =
  'flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 h-10 px-2.5 sm:px-3 rounded-full text-xs sm:text-sm font-semibold border transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-stone-900 select-none';

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modal active filters count (excluding Near Me and Area which remain visible on mobile)
  const activeModalFiltersCount =
    (activeCircuit ? 1 : 0) +
    (myDarshanFilterOnly ? 1 : 0) +
    (ecoFriendlyFilter ? 1 : 0) +
    (twentyFourHoursFilter ? 1 : 0) +
    (crowdFilter !== 'All' ? 1 : 0);

  return (
    <div className="w-full bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-200/80 dark:border-stone-800 px-2 sm:px-3 py-2 z-[970] shadow-xs">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* MOBILE CONTROLS ROW (< 768px): Near Me, All Areas, Filters with badge */}
        <div id="filter-bar-mobile" className="flex md:hidden items-center gap-2 w-full overflow-hidden">
          {/* Near Me Button */}
          <button
            type="button"
            onClick={onToggleSortByDistance}
            id="near-me-btn-mobile"
            title={sortByDistance ? t.nearMeActive : t.nearMe}
            aria-label={sortByDistance ? t.nearMeActive : t.nearMe}
            className={`${mobileControlClass} ${sortByDistance ? selectedClass : unselectedClass}`}
          >
            <Locate
              className={`w-4 h-4 shrink-0 ${locatingDistance ? 'animate-spin' : ''} ${
                sortByDistance ? 'text-white' : 'text-stone-600 dark:text-stone-300'
              }`}
            />
            <span className="truncate">
              {locatingDistance ? t.nearMeLocating : sortByDistance ? t.nearMeActive : t.nearMeShort}
            </span>
          </button>

          {/* Area Dropdown Button */}
          <div
            className={`relative ${mobileControlClass} ${
              selectedArea !== 'All' ? selectedClass : unselectedClass
            }`}
            title={t.allAreas}
          >
            <MapPin
              className={`w-4 h-4 shrink-0 ${
                selectedArea !== 'All' ? 'text-white' : 'text-stone-600 dark:text-stone-300'
              }`}
            />
            <span className="truncate">
              {selectedArea !== 'All' ? selectedArea : t.allAreasShort}
            </span>
            <select
              id="area-select-mobile"
              aria-label={t.allAreas}
              value={selectedArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {areas.map((area) => (
                <option key={area} value={area} className="text-stone-900 bg-white dark:bg-stone-800 dark:text-white">
                  {area === 'All' ? t.allAreas : area}
                </option>
              ))}
            </select>
          </div>

          {/* Filters Button */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            id="mobile-filters-trigger-btn"
            title={t.filtersModalTitle || t.filtersButton}
            aria-label={`${t.filtersButton}${activeModalFiltersCount > 0 ? ` (${activeModalFiltersCount})` : ''}`}
            className={`${mobileControlClass} ${
              activeModalFiltersCount > 0 ? selectedClass : unselectedClass
            }`}
          >
            <SlidersHorizontal
              className={`w-4 h-4 shrink-0 ${
                activeModalFiltersCount > 0 ? 'text-white' : 'text-stone-600 dark:text-stone-300'
              }`}
            />
            <span className="truncate">{t.filtersButton}</span>
            {activeModalFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold bg-white text-orange-600 shrink-0">
                {formatNumber(activeModalFiltersCount)}
              </span>
            )}
          </button>
        </div>

        {/* DESKTOP & TABLET ROW (>= 768px): All 8 Controls in a single line with flex-nowrap and NO scrollbar */}
        <div id="filter-bar-desktop" className="hidden md:flex items-center gap-2 w-full flex-nowrap overflow-hidden">
          {/* 1. Walking Tours */}
          {onOpenCircuits && (
            <button
              type="button"
              onClick={onOpenCircuits}
              title={activeCircuit ? `${t.trail}: ${activeCircuit.name}` : t.circuitsModalTitle || t.circuits}
              aria-label={activeCircuit ? `${t.trail}: ${activeCircuit.name}` : t.circuitsModalTitle || t.circuits}
              className={`${baseControlClass} ${activeCircuit ? selectedClass : unselectedClass}`}
            >
              <Compass
                className={`w-4 h-4 shrink-0 ${activeCircuit ? 'text-white' : 'text-stone-600 dark:text-stone-300'}`}
              />
              <span className={`truncate ${activeCircuit ? 'inline' : 'hidden lg:inline'}`}>
                {activeCircuit ? `${t.trail}: ${activeCircuit.name.split(' ')[0]}` : t.circuitsShort}
              </span>
            </button>
          )}

          {/* 2. Near Me */}
          <button
            type="button"
            onClick={onToggleSortByDistance}
            id="near-me-btn"
            title={sortByDistance ? t.nearMeActive : t.nearMe}
            aria-label={sortByDistance ? t.nearMeActive : t.nearMe}
            className={`${baseControlClass} ${sortByDistance ? selectedClass : unselectedClass}`}
          >
            <Locate
              className={`w-4 h-4 shrink-0 ${locatingDistance ? 'animate-spin' : ''} ${
                sortByDistance ? 'text-white' : 'text-stone-600 dark:text-stone-300'
              }`}
            />
            <span className={`truncate ${sortByDistance ? 'inline' : 'hidden lg:inline'}`}>
              {locatingDistance ? t.nearMeLocating : sortByDistance ? t.nearMeActive : t.nearMeShort}
            </span>
          </button>

          {/* 3. My Darshan */}
          {onToggleMyDarshanFilter && (
            <button
              type="button"
              onClick={onToggleMyDarshanFilter}
              title={`${t.myDarshan} (${formatNumber(myDarshanCount)})`}
              aria-label={`${t.myDarshan} (${formatNumber(myDarshanCount)})`}
              className={`${baseControlClass} ${myDarshanFilterOnly ? selectedClass : unselectedClass}`}
            >
              <Star
                className={`w-4 h-4 shrink-0 ${
                  myDarshanFilterOnly ? 'fill-white text-white' : 'fill-amber-400 text-amber-500'
                }`}
              />
              <span className={`truncate ${myDarshanFilterOnly ? 'inline' : 'hidden lg:inline'}`}>
                {t.myDarshanShort} ({formatNumber(myDarshanCount)})
              </span>
            </button>
          )}

          {/* 4. All Areas Dropdown */}
          <div
            className={`relative ${baseControlClass} focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-1 dark:focus-within:ring-offset-stone-900 ${
              selectedArea !== 'All' ? selectedClass : unselectedClass
            }`}
            title={t.allAreas}
          >
            <MapPin
              className={`w-4 h-4 shrink-0 ${
                selectedArea !== 'All' ? 'text-white' : 'text-stone-600 dark:text-stone-300'
              }`}
            />
            <span className={`truncate ${selectedArea !== 'All' ? 'inline' : 'hidden lg:inline'}`}>
              {selectedArea !== 'All' ? selectedArea : t.allAreasShort}
            </span>
            <select
              id="area-select"
              aria-label={t.allAreas}
              value={selectedArea}
              onChange={(e) => onAreaChange(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {areas.map((area) => (
                <option key={area} value={area} className="text-stone-900 bg-white dark:bg-stone-800 dark:text-white">
                  {area === 'All' ? t.allAreas : area}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Eco-Friendly */}
          <button
            type="button"
            onClick={() => onEcoFriendlyFilterChange(!ecoFriendlyFilter)}
            title={t.ecoFriendly}
            aria-label={t.ecoFriendly}
            className={`${baseControlClass} ${ecoFriendlyFilter ? selectedClass : unselectedClass}`}
          >
            <Leaf
              className={`w-4 h-4 shrink-0 ${
                ecoFriendlyFilter ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            />
            <span className={`truncate ${ecoFriendlyFilter ? 'inline' : 'hidden lg:inline'}`}>
              {t.ecoFriendlyShort}
            </span>
          </button>

          {/* 6. 24-Hour Darshan */}
          <button
            type="button"
            onClick={() => onTwentyFourHoursFilterChange(!twentyFourHoursFilter)}
            title={t.twentyFourHours}
            aria-label={t.twentyFourHours}
            className={`${baseControlClass} ${twentyFourHoursFilter ? selectedClass : unselectedClass}`}
          >
            <Clock
              className={`w-4 h-4 shrink-0 ${
                twentyFourHoursFilter ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
              }`}
            />
            <span className={`truncate ${twentyFourHoursFilter ? 'inline' : 'hidden lg:inline'}`}>
              {t.twentyFourHoursShort}
            </span>
          </button>

          {/* 7. Low Wait Time (WCAG AA Compliant High Contrast) */}
          <button
            type="button"
            onClick={() => onCrowdFilterChange(crowdFilter === 'Low' ? 'All' : 'Low')}
            title={t.crowdLow}
            aria-label={t.crowdLow}
            className={`${baseControlClass} ${crowdFilter === 'Low' ? selectedClass : unselectedClass}`}
          >
            <Users
              className={`w-4 h-4 shrink-0 ${
                crowdFilter === 'Low' ? 'text-white' : 'text-teal-600 dark:text-teal-400'
              }`}
            />
            <span className={`truncate ${crowdFilter === 'Low' ? 'inline' : 'hidden lg:inline'}`}>
              {t.crowdLowShort}
            </span>
          </button>

          {/* 8. High Rush / Long Queue */}
          <button
            type="button"
            onClick={() => onCrowdFilterChange(crowdFilter === 'High' ? 'All' : 'High')}
            title={t.crowdHigh}
            aria-label={t.crowdHigh}
            className={`${baseControlClass} ${crowdFilter === 'High' ? selectedClass : unselectedClass}`}
          >
            <Users
              className={`w-4 h-4 shrink-0 ${
                crowdFilter === 'High' ? 'text-white' : 'text-red-600 dark:text-red-400'
              }`}
            />
            <span className={`truncate ${crowdFilter === 'High' ? 'inline' : 'hidden lg:inline'}`}>
              {t.crowdHighShort}
            </span>
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
                    className="hover:text-amber-200 p-0.5 rounded-full ml-0.5 cursor-pointer"
                    title={t.exitCircuit}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </span>
            )}

            {/* My Darshan chip */}
            {myDarshanFilterOnly && onToggleMyDarshanFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-600 text-white font-semibold shrink-0 text-xs shadow-xs">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>{t.myDarshan}</span>
                <button
                  type="button"
                  onClick={onToggleMyDarshanFilter}
                  className="hover:text-amber-200 p-0.5 rounded-full ml-0.5 cursor-pointer"
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
                  className="hover:text-red-600 p-0.5 rounded-full ml-0.5 cursor-pointer"
                  title="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Area chip */}
            {selectedArea !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-600 text-white font-semibold shadow-xs shrink-0 text-xs">
                <MapPin className="w-3.5 h-3.5 text-white" />
                <span>{selectedArea}</span>
                <button
                  type="button"
                  onClick={() => onAreaChange('All')}
                  className="hover:text-amber-200 p-0.5 rounded-full ml-0.5 cursor-pointer"
                  title="Clear area filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Eco chip */}
            {ecoFriendlyFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-600 text-white font-semibold shadow-xs shrink-0 text-xs">
                <Leaf className="w-3.5 h-3.5 text-white" />
                <span>{t.ecoFriendlyShort}</span>
                <button
                  type="button"
                  onClick={() => onEcoFriendlyFilterChange(false)}
                  className="hover:text-amber-200 p-0.5 rounded-full ml-0.5 cursor-pointer"
                  title="Remove eco filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* 24-Hours chip */}
            {twentyFourHoursFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-600 text-white font-semibold shadow-xs shrink-0 text-xs">
                <Clock className="w-3.5 h-3.5 text-white" />
                <span>{t.twentyFourHoursShort}</span>
                <button
                  type="button"
                  onClick={() => onTwentyFourHoursFilterChange(false)}
                  className="hover:text-amber-200 p-0.5 rounded-full ml-0.5 cursor-pointer"
                  title="Remove 24-hour darshan filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {/* Crowd chip */}
            {crowdFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-600 text-white font-semibold shadow-xs shrink-0 text-xs">
                <Users className="w-3.5 h-3.5 text-white" />
                <span>{crowdFilter === 'High' ? t.crowdHighShort : t.crowdLowShort}</span>
                <button
                  type="button"
                  onClick={() => onCrowdFilterChange('All')}
                  className="hover:text-amber-200 p-0.5 rounded-full ml-0.5 cursor-pointer"
                  title="Remove crowd filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>

          {/* Single-tap Clear All button */}
          {(hasActiveFilters || activeCircuit || myDarshanFilterOnly || selectedArea !== 'All') && (
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

      {/* Mobile Filters Bottom Sheet */}
      <MobileFiltersModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        selectedArea={selectedArea}
        onAreaChange={onAreaChange}
        areas={areas}
        ecoFriendlyFilter={ecoFriendlyFilter}
        onEcoFriendlyFilterChange={onEcoFriendlyFilterChange}
        twentyFourHoursFilter={twentyFourHoursFilter}
        onTwentyFourHoursFilterChange={onTwentyFourHoursFilterChange}
        crowdFilter={crowdFilter}
        onCrowdFilterChange={onCrowdFilterChange}
        myDarshanFilterOnly={myDarshanFilterOnly}
        onToggleMyDarshanFilter={onToggleMyDarshanFilter}
        myDarshanCount={myDarshanCount}
        activeCircuit={activeCircuit}
        onOpenCircuits={onOpenCircuits}
        onClearCircuit={onClearCircuit}
        filteredCount={filteredCount}
        onClearAllFilters={onClearAllFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

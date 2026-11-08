// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect } from 'react';
import {
  Clock,
  Compass,
  Leaf,
  MapPin,
  Star,
  Users,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
import type { CrowdLevel } from '../../types/pandal';
import type { Circuit } from '../../types/circuit';
import { useI18n } from '../../context/I18nContext';

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  areas: string[];
  ecoFriendlyFilter: boolean;
  onEcoFriendlyFilterChange: (enabled: boolean) => void;
  twentyFourHoursFilter: boolean;
  onTwentyFourHoursFilterChange: (enabled: boolean) => void;
  crowdFilter: 'All' | CrowdLevel;
  onCrowdFilterChange: (level: 'All' | CrowdLevel) => void;
  myDarshanFilterOnly?: boolean;
  onToggleMyDarshanFilter?: () => void;
  myDarshanCount?: number;
  activeCircuit?: Circuit | null;
  onOpenCircuits?: () => void;
  onClearCircuit?: () => void;
  filteredCount?: number;
  onClearAllFilters: () => void;
  hasActiveFilters: boolean;
}

export const MobileFiltersModal: React.FC<MobileFiltersModalProps> = ({
  isOpen,
  onClose,
  selectedArea,
  onAreaChange,
  areas,
  ecoFriendlyFilter,
  onEcoFriendlyFilterChange,
  twentyFourHoursFilter,
  onTwentyFourHoursFilterChange,
  crowdFilter,
  onCrowdFilterChange,
  myDarshanFilterOnly = false,
  onToggleMyDarshanFilter,
  myDarshanCount = 0,
  activeCircuit,
  onOpenCircuits,
  onClearCircuit,
  filteredCount = 0,
  onClearAllFilters,
  hasActiveFilters,
}) => {
  const { t, formatNumber } = useI18n();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filters-title"
      className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-xs flex flex-col justify-end md:hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Bottom Sheet Drawer */}
      <div
        className="bg-white dark:bg-stone-900 rounded-t-3xl border-t border-stone-200 dark:border-stone-800 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle Indicator */}
        <div className="pt-3 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 id="mobile-filters-title" className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t.filtersModalTitle || t.filtersButton}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
              {formatNumber(filteredCount)} {t.resultsCount}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sheet Body */}
        <div className="p-5 space-y-5 overflow-y-auto no-scrollbar">
          {/* Walking Tours Action */}
          {onOpenCircuits && (
            <div>
              <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
                {t.circuits}
              </label>
              {activeCircuit ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-900 dark:text-orange-200">
                        {t.trail}: {activeCircuit.name}
                      </p>
                      <p className="text-xs text-orange-700 dark:text-orange-400">
                        {activeCircuit.pandalIds.length} pandals • {activeCircuit.estimatedWalkingMins} min
                      </p>
                    </div>
                  </div>
                  {onClearCircuit && (
                    <button
                      type="button"
                      onClick={onClearCircuit}
                      className="px-3 py-1.5 min-h-[44px] text-xs font-bold rounded-lg text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50 cursor-pointer"
                    >
                      {t.exitCircuit}
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCircuits();
                  }}
                  className="w-full flex items-center justify-between p-3.5 min-h-[48px] rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Compass className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-stone-900 dark:text-stone-100">{t.circuits}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{t.circuitsSubtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    {t.startCircuit} →
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Quick Toggles */}
          <div>
            <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
              {t.activeFilters}
            </label>
            <div className="space-y-2.5">
              {/* My Darshan Toggle */}
              {onToggleMyDarshanFilter && (
                <button
                  type="button"
                  onClick={onToggleMyDarshanFilter}
                  className={`w-full flex items-center justify-between p-3.5 min-h-[48px] rounded-2xl border transition-colors cursor-pointer ${
                    myDarshanFilterOnly
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-100'
                      : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-750'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star
                      className={`w-5 h-5 shrink-0 ${
                        myDarshanFilterOnly
                          ? 'fill-amber-500 text-amber-500'
                          : 'fill-amber-400/30 text-amber-500'
                      }`}
                    />
                    <div className="text-left">
                      <p className="text-sm font-bold">
                        {t.myDarshan} ({formatNumber(myDarshanCount)})
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {myDarshanFilterOnly ? t.myDarshanFilter : t.saveToDarshan}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                      myDarshanFilterOnly
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : 'border-stone-300 dark:border-stone-600'
                    }`}
                  >
                    {myDarshanFilterOnly && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              )}

              {/* Eco-Friendly Toggle */}
              <button
                type="button"
                onClick={() => onEcoFriendlyFilterChange(!ecoFriendlyFilter)}
                className={`w-full flex items-center justify-between p-3.5 min-h-[48px] rounded-2xl border transition-colors cursor-pointer ${
                  ecoFriendlyFilter
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-750'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Leaf
                    className={`w-5 h-5 shrink-0 ${
                      ecoFriendlyFilter ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-500'
                    }`}
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold">{t.ecoFriendly}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{t.ecoFriendlyBadge}</p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                    ecoFriendlyFilter
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'border-stone-300 dark:border-stone-600'
                  }`}
                >
                  {ecoFriendlyFilter && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </button>

              {/* 24-Hours Toggle */}
              <button
                type="button"
                onClick={() => onTwentyFourHoursFilterChange(!twentyFourHoursFilter)}
                className={`w-full flex items-center justify-between p-3.5 min-h-[48px] rounded-2xl border transition-colors cursor-pointer ${
                  twentyFourHoursFilter
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-700 text-indigo-900 dark:text-indigo-100'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-750'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock
                    className={`w-5 h-5 shrink-0 ${
                      twentyFourHoursFilter ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-500'
                    }`}
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold">{t.twentyFourHours}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{t.twentyFourHoursBadge}</p>
                  </div>
                </div>
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${
                    twentyFourHoursFilter
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'border-stone-300 dark:border-stone-600'
                  }`}
                >
                  {twentyFourHoursFilter && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>

          {/* Crowd Filter Segmented Options */}
          <div>
            <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
              {t.crowdLevel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onCrowdFilterChange('All')}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center transition-all cursor-pointer ${
                  crowdFilter === 'All'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750'
                }`}
              >
                {t.allPandals}
              </button>
              <button
                type="button"
                onClick={() => onCrowdFilterChange('Low')}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  crowdFilter === 'Low'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750'
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${crowdFilter === 'Low' ? 'text-white' : 'text-teal-600 dark:text-teal-400'}`} />
                <span>{t.crowdLowShort}</span>
              </button>
              <button
                type="button"
                onClick={() => onCrowdFilterChange('High')}
                className={`min-h-[44px] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  crowdFilter === 'High'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750'
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${crowdFilter === 'High' ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />
                <span>{t.crowdHighShort}</span>
              </button>
            </div>
          </div>

          {/* Area Selector in Bottom Sheet */}
          <div>
            <label htmlFor="mobile-sheet-area-select" className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-2">
              {t.allAreas}
            </label>
            <div className="relative">
              <select
                id="mobile-sheet-area-select"
                aria-label={t.allAreas}
                value={selectedArea}
                onChange={(e) => onAreaChange(e.target.value)}
                className={`w-full min-h-[48px] pl-10 pr-8 py-2.5 rounded-2xl text-sm font-semibold border appearance-none cursor-pointer transition-all ${
                  selectedArea !== 'All'
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-800'
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                }`}
              >
                {areas.map((area) => (
                  <option key={area} value={area} className="text-stone-900 bg-white dark:bg-stone-800 dark:text-white">
                    {area === 'All' ? t.allAreas : area}
                  </option>
                ))}
              </select>
              <MapPin
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  selectedArea !== 'All' ? 'text-orange-600' : 'text-stone-400'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Sticky Sheet Footer with Safe Area */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClearAllFilters}
            disabled={!hasActiveFilters && !activeCircuit && !myDarshanFilterOnly}
            className="min-h-[44px] px-4 rounded-xl border border-stone-300 dark:border-stone-700 font-semibold text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.clearAllFilters}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] px-5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center cursor-pointer"
          >
            {t.applyFilters} ({formatNumber(filteredCount)})
          </button>
        </div>
      </div>
    </div>
  );
};

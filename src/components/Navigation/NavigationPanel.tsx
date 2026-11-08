// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bike,
  Car,
  CheckCircle2,
  Compass,
  Footprints,
  LocateFixed,
  MapPin,
  RotateCcw,
  Train,
  WifiOff,
  X,
} from 'lucide-react';
import type { Pandal } from '../../types/pandal';
import type { RouteResult, RouteStep, TravelMode } from '../../services/routing';
import { formatManeuverInstruction, formatRouteDistance, formatRouteDuration } from '../../utils/navigationUtils';
import { useI18n } from '../../context/I18nContext';

interface NavigationPanelProps {
  destinationPandal: Pandal;
  route: RouteResult | null;
  loading: boolean;
  error: string | null;
  mode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
  onClose: () => void;
  onRetry: () => void;
  isLiveTracking: boolean;
  onToggleLiveTracking: () => void;
  onRecenter: () => void;
  activeStepIndex: number | null;
  onSelectStep: (step: RouteStep, index: number) => void;
  originName: string;
  onChangeOrigin: () => void;
  isOffRoute: boolean;
}

export const NavigationPanel: React.FC<NavigationPanelProps> = ({
  destinationPandal,
  route,
  loading,
  error,
  mode,
  onModeChange,
  onClose,
  onRetry,
  isLiveTracking,
  onToggleLiveTracking,
  onRecenter,
  activeStepIndex,
  onSelectStep,
  originName,
  onChangeOrigin,
  isOffRoute,
}) => {
  const { t, language } = useI18n();

  return (
    <div
      role="region"
      aria-label={t.directionsTitle}
      className="w-full h-full bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col z-[1000] text-stone-900 dark:text-stone-100 select-none overflow-hidden"
    >
      {/* Top Bar */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 bg-stone-50 dark:bg-stone-850">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="p-2 -ml-1 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title={t.endNavigation}
            aria-label={t.endNavigation}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-black truncate text-stone-900 dark:text-white">
              {destinationPandal.name}
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-600 dark:text-orange-400" />
              <span>{destinationPandal.area}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title={t.endNavigation}
          aria-label={t.endNavigation}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Start Point & Mode Switcher */}
      <div className="p-3 bg-stone-50/70 dark:bg-stone-850/60 border-b border-stone-200 dark:border-stone-800 space-y-2.5 shrink-0">
        {/* Origin Selector */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-stone-500 dark:text-stone-400 shrink-0">{t.chooseStartPoint}:</span>
            <span className="font-bold text-stone-800 dark:text-stone-200 truncate">
              {originName}
            </span>
          </div>
          <button
            type="button"
            onClick={onChangeOrigin}
            className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline shrink-0 cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* Travel Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-stone-200/70 dark:bg-stone-800 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => onModeChange('walk')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all cursor-pointer ${
              mode === 'walk'
                ? 'bg-white dark:bg-stone-700 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Footprints className="w-4 h-4" />
            <span>{t.travelModeWalk}</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('drive')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all cursor-pointer ${
              mode === 'drive'
                ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{t.travelModeDrive}</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('bike')}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all cursor-pointer ${
              mode === 'bike'
                ? 'bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>{t.travelModeBike}</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loading State */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-9 h-9 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-stone-500 dark:text-stone-400">
              Calculating fastest route...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{t.routeUnavailable}</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.retryRoute}</span>
            </button>
          </div>
        )}

        {/* Route Summary Card */}
        {!loading && route && (
          <>
            <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-stone-800/80 border border-orange-200 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                  {formatRouteDuration(route.durationSeconds, language)}
                </span>
                <p className="text-xs font-bold text-stone-600 dark:text-stone-400 mt-0.5">
                  {formatRouteDistance(route.distanceMeters, language)} • via Mumbai roads
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <button
                  type="button"
                  onClick={onToggleLiveTracking}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                    isLiveTracking
                      ? 'bg-blue-600 text-white hover:bg-blue-700 ring-2 ring-blue-400/50 animate-pulse'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>{isLiveTracking ? 'Live Tracking' : t.startNavigation}</span>
                </button>

                {isLiveTracking && (
                  <button
                    type="button"
                    onClick={onRecenter}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <LocateFixed className="w-3 h-3" />
                    <span>{t.recenterMap}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Off-Route Alert */}
            {isOffRoute && (
              <div className="p-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center gap-2 animate-bounce">
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>{t.offRouteRecalculating}</span>
              </div>
            )}

            {/* Offline indicator if fallback */}
            {route.isOfflineFallback && (
              <div className="p-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-amber-600" />
                <span>{t.liveReroutingUnavailableOffline}</span>
              </div>
            )}

            {/* "By Train" Transit Tip */}
            {destinationPandal.nearestStation && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <Train className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{t.byTrainTip}: </span>
                  <span>
                    Short walk from {destinationPandal.nearestStation}
                    {destinationPandal.stationDistance ? ` (${destinationPandal.stationDistance})` : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Festival Road Closure Notice */}
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 flex items-start gap-2 text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{t.festivalRoadWarning}</span>
            </div>

            {/* Turn-by-Turn Steps List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>{t.turnByTurn}</span>
                <span className="text-[11px] text-stone-400">
                  {route.steps.length} {route.steps.length === 1 ? 'step' : 'steps'}
                </span>
              </div>

              <div
                role="list"
                className="space-y-1.5"
                aria-live="polite"
              >
                {route.steps.map((step, idx) => {
                  const isSelected = activeStepIndex === idx;
                  const instruction = formatManeuverInstruction(
                    step,
                    language,
                    destinationPandal.name
                  );

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectStep(step, idx)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-100 dark:bg-stone-750 border border-orange-400 dark:border-orange-500 font-bold'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-stone-900 dark:text-stone-100 leading-snug">
                          {instruction}
                        </p>
                        {step.distanceMeters > 0 && (
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            {formatRouteDistance(step.distanceMeters, language)}
                          </p>
                        )}
                      </div>

                      {step.maneuverType === 'arrive' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between gap-2 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer"
        >
          {t.endNavigation}
        </button>
      </div>
    </div>
  );
};


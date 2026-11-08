import React, { useState } from 'react';
import {
  AlertTriangle,
  Bike,
  Car,
  ChevronDown,
  ChevronUp,
  Compass,
  Footprints,
  LocateFixed,
  RotateCcw,
  Train,
  WifiOff,
  X,
} from 'lucide-react';
import type { Pandal } from '../../types/pandal';
import type { RouteResult, RouteStep, TravelMode } from '../../services/routing';
import { formatManeuverInstruction, formatRouteDistance, formatRouteDuration } from '../../utils/navigationUtils';
import { useI18n } from '../../context/I18nContext';

interface NavigationBottomSheetProps {
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

export const NavigationBottomSheet: React.FC<NavigationBottomSheetProps> = ({
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      role="dialog"
      aria-label={t.directionsTitle}
      className={`fixed bottom-0 left-0 right-0 z-[1050] bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 rounded-t-3xl shadow-2xl transition-all duration-300 flex flex-col pb-safe ${
        isExpanded ? 'max-h-[85vh] h-[85vh]' : 'max-h-[220px]'
      }`}
    >
      {/* Drag handle / Toggle button */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full pt-2.5 pb-1 flex flex-col items-center justify-center cursor-pointer select-none"
      >
        <div className="w-10 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 mb-1" />
        <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400">
          <span>{isExpanded ? 'Collapse' : 'Turn-by-turn steps'}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Persistent Summary Bar (Visible in both collapsed & expanded) */}
      <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black truncate text-stone-900 dark:text-white">
              {destinationPandal.name}
            </h2>
            <span className="text-[11px] font-medium text-stone-400 truncate">
              {destinationPandal.area}
            </span>
          </div>

          {!loading && route ? (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                {formatRouteDuration(route.durationSeconds, language)}
              </span>
              <span className="text-xs font-bold text-stone-500">
                ({formatRouteDistance(route.distanceMeters, language)})
              </span>
            </div>
          ) : (
            <span className="text-xs text-stone-400">
              {loading ? 'Calculating route...' : 'Route unavailable'}
            </span>
          )}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!loading && route && (
            <button
              type="button"
              onClick={onToggleLiveTracking}
              className={`p-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1 min-h-[44px] ${
                isLiveTracking
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="text-[11px] font-bold">
                {isLiveTracking ? 'Live' : t.startNavigation}
              </span>
            </button>
          )}

          {isLiveTracking && (
            <button
              type="button"
              onClick={onRecenter}
              className="p-2.5 rounded-xl bg-blue-100 text-blue-700 dark:bg-stone-800 dark:text-blue-400 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title={t.recenterMap}
              aria-label={t.recenterMap}
            >
              <LocateFixed className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title={t.endNavigation}
            aria-label={t.endNavigation}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Selector Strip */}
      <div className="px-4 py-2 flex items-center justify-between gap-2 shrink-0 bg-stone-50/60 dark:bg-stone-850/50 text-xs">
        <div className="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800 p-0.5 rounded-xl font-bold">
          <button
            type="button"
            onClick={() => onModeChange('walk')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer ${
              mode === 'walk'
                ? 'bg-white dark:bg-stone-700 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>{t.travelModeWalk}</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('drive')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer ${
              mode === 'drive'
                ? 'bg-white dark:bg-stone-700 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{t.travelModeDrive}</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('bike')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer ${
              mode === 'bike'
                ? 'bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>{t.travelModeBike}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onChangeOrigin}
          className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline truncate max-w-[120px]"
        >
          From: {originName}
        </button>
      </div>

      {/* Expanded Scrollable Section */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* Off-Route Alert */}
          {isOffRoute && (
            <div className="p-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center gap-2 animate-bounce">
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>{t.offRouteRecalculating}</span>
            </div>
          )}

          {/* Offline indicator if fallback */}
          {route?.isOfflineFallback && (
            <div className="p-2.5 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600" />
              <span>{t.liveReroutingUnavailableOffline}</span>
            </div>
          )}

          {/* Error & Retry */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={onRetry}
                className="font-bold underline text-rose-700 cursor-pointer"
              >
                {t.retryRoute}
              </button>
            </div>
          )}

          {/* By Train Transit Tip */}
          {destinationPandal.nearestStation && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
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
          <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 flex items-start gap-2 text-[11px] text-stone-600 dark:text-stone-400">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{t.festivalRoadWarning}</span>
          </div>

          {/* Turn-by-Turn Steps */}
          {route && (
            <div className="space-y-1.5 pt-1">
              <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {t.turnByTurn} ({route.steps.length})
              </p>
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
                    className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-100 dark:bg-stone-750 border border-orange-400 dark:border-orange-500 font-bold'
                        : 'hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-stone-900 dark:text-stone-100 leading-tight">
                        {instruction}
                      </p>
                      {step.distanceMeters > 0 && (
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {formatRouteDistance(step.distanceMeters, language)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  AlertTriangle,
  Car,
  ChevronDown,
  Clock,
  Compass,
  Footprints,
  Info,
  Navigation,
  RotateCcw,
  Train,
  X,
} from 'lucide-react';
import type { RouteResult, RouteStep, TravelMode } from '../../services/routing';
import type { Pandal } from '../../types/pandal';
import { useI18n } from '../../context/I18nContext';
import { formatDistance } from '../../utils/geoUtils';

interface DirectionsPanelProps {
  destinationPandal: Pandal;
  startLabel: string;
  route: RouteResult | null;
  loading: boolean;
  error: string | null;
  mode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
  onClose: () => void;
  onRetry: () => void;
  onSelectStep?: (step: RouteStep) => void;
  isLiveGuidance: boolean;
  onToggleLiveGuidance: () => void;
  onRecenter?: () => void;
  isOffRoute?: boolean;
}

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  destinationPandal,
  startLabel,
  route,
  loading,
  error,
  mode,
  onModeChange,
  onClose,
  onRetry,
  onSelectStep,
  isLiveGuidance,
  onToggleLiveGuidance,
  onRecenter,
  isOffRoute,
}) => {
  const { t, locale } = useI18n();
  const [stepsExpanded, setStepsExpanded] = useState(false);

  // Format estimated time
  const formatDuration = (seconds: number): string => {
    const mins = Math.round(seconds / 60);
    if (mins < 60) {
      return `${mins} min`;
    }
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs} hr ${remMins > 0 ? `${remMins} min` : ''}`;
  };

  return (
    <aside
      aria-label={t.navDirections}
      className="w-full md:w-96 max-h-[85vh] md:max-h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-t-3xl md:rounded-3xl overflow-hidden pointer-events-auto transition-all text-stone-900 dark:text-stone-100"
    >
      {/* Top Header */}
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50 dark:bg-stone-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-black truncate">{destinationPandal.name}</h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
              {destinationPandal.area}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 transition-colors cursor-pointer"
          aria-label={t.close}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1 p-2 bg-stone-100 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={() => onModeChange('foot')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all min-h-[44px] cursor-pointer ${
            mode === 'foot'
              ? 'bg-white dark:bg-stone-800 text-orange-600 dark:text-orange-400 shadow-sm border border-stone-200/60 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span>{t.navModeWalk}</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('driving')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all min-h-[44px] cursor-pointer ${
            mode === 'driving'
              ? 'bg-white dark:bg-stone-800 text-orange-600 dark:text-orange-400 shadow-sm border border-stone-200/60 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>{t.navModeDrive}</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('bike')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all min-h-[44px] cursor-pointer ${
            mode === 'bike'
              ? 'bg-white dark:bg-stone-800 text-orange-600 dark:text-orange-400 shadow-sm border border-stone-200/60 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t.navModeBike}</span>
        </button>
      </div>

      {/* Start Point & Destination summary */}
      <div className="px-4 py-2.5 bg-stone-50/50 dark:bg-stone-900/50 border-b border-stone-100 dark:border-stone-800 text-xs space-y-1">
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          <span className="truncate">
            <strong className="text-stone-700 dark:text-stone-300">{t.navStartPoint}:</strong>{' '}
            {startLabel}
          </span>
        </div>
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0" />
          <span className="truncate">
            <strong className="text-stone-700 dark:text-stone-300">{t.navDestination}:</strong>{' '}
            {destinationPandal.name}
          </span>
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-center">
            <div className="w-8 h-8 rounded-full border-3 border-orange-500 border-t-transparent animate-spin" />
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              {t.navCalculatingRoute}
            </p>
          </div>
        ) : error ? (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-center space-y-2">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
            <h4 className="font-bold text-xs text-red-800 dark:text-red-300">
              {t.navRouteUnavailable}
            </h4>
            <p className="text-[11px] text-red-700/80 dark:text-red-300/80">{error}</p>
            <button
              onClick={onRetry}
              className="mt-1 px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer"
            >
              {t.navRetry}
            </button>
          </div>
        ) : route ? (
          <>
            {/* Metric Summary */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-stone-800 dark:to-stone-800 border border-amber-200/60 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-stone-900 dark:text-white leading-tight">
                  {formatDuration(route.duration)}
                </span>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  {formatDistance(route.distance / 1000, locale)}
                </p>
              </div>

              {/* Start Live Guidance Button */}
              <button
                type="button"
                onClick={onToggleLiveGuidance}
                className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                  isLiveGuidance
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{isLiveGuidance ? t.navEndNavigation : t.navStartNavigation}</span>
              </button>
            </div>

            {/* Off-Route Alert */}
            {isOffRoute && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold flex items-center gap-2 animate-pulse shadow-sm"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>{t.navOffRouteRecalculating}</span>
              </div>
            )}

            {/* Nearest Station (By Train Tip) */}
            {destinationPandal.nearestStation && (
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex items-start gap-2.5 text-xs">
                <Train className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {t.navByTrainTip}:
                  </span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">
                    {destinationPandal.nearestStation}
                  </span>
                </div>
              </div>
            )}

            {/* Festival Road Closure Notice */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-[11px] text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{t.navFestivalRoadAdvisory}</p>
            </div>

            {/* Turn-by-Turn Collapsible List */}
            {route.steps.length > 0 && (
              <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setStepsExpanded(!stepsExpanded)}
                  className="w-full flex items-center justify-between p-3 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer min-h-[44px]"
                  aria-expanded={stepsExpanded}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-orange-600" />
                    <span>{t.navTurnByTurn} ({route.steps.length})</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform ${
                      stepsExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {stepsExpanded && (
                  <ol className="p-2 space-y-1.5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 max-h-60 overflow-y-auto">
                    {route.steps.map((step, idx) => (
                      <li
                        key={idx}
                        onClick={() => onSelectStep && onSelectStep(step)}
                        className="p-2 rounded-xl text-xs hover:bg-white dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700 cursor-pointer flex items-start gap-2.5 transition-colors"
                      >
                        <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-stone-800 dark:text-stone-200">
                            {step.name ? `${step.name}` : step.instruction || 'Follow route'}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {formatDistance(step.distance / 1000, locale)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Recenter Action when Live Guidance is Active */}
      {isLiveGuidance && onRecenter && (
        <div className="p-3 bg-stone-100 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live Guidance Active
          </span>
          <button
            type="button"
            onClick={onRecenter}
            className="px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {t.navRecenter}
          </button>
        </div>
      )}

      {/* Footer Attribution */}
      <div className="px-4 py-2 border-t border-stone-200 dark:border-stone-800 text-[10px] text-center text-stone-400 dark:text-stone-500 bg-stone-50 dark:bg-stone-900">
        {t.navAttribution}
      </div>
    </aside>
  );
};

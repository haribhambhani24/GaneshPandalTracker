import React from 'react';
import { Compass, Locate, Minus, Plus } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateMe: () => void;
  onResetCenter: () => void;
  locating?: boolean;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  isSheetOpen?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onLocateMe,
  onResetCenter,
  locating = false,
  canZoomIn = true,
  canZoomOut = true,
  isSheetOpen = false,
}) => {
  const { t } = useI18n();

  return (
    <div
      className={`absolute z-[1005] flex flex-col gap-2 pointer-events-auto transition-all duration-300 ease-out ${
        isSheetOpen
          ? 'right-3.5 top-32 md:top-auto md:bottom-10 md:right-[412px] lg:right-[444px]'
          : 'right-3.5 bottom-24 sm:bottom-10 sm:right-6'
      }`}
    >
      {/* Locate Me button */}
      <button
        type="button"
        onClick={onLocateMe}
        title={t.nearMe}
        aria-label={t.nearMe}
        className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-xl border border-amber-200/60 dark:border-stone-700 flex items-center justify-center hover:bg-amber-50 dark:hover:bg-stone-700 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <Locate className={`w-5 h-5 text-orange-600 dark:text-orange-400 ${locating ? 'animate-spin' : ''}`} />
      </button>

      {/* Reset to Mumbai Center */}
      <button
        type="button"
        onClick={onResetCenter}
        title={t.resetView}
        aria-label={t.resetView}
        className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-xl border border-amber-200/60 dark:border-stone-700 flex items-center justify-center hover:bg-amber-50 dark:hover:bg-stone-700 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        <Compass className="w-5 h-5 text-red-600 dark:text-red-400" />
      </button>

      {/* Zoom In & Out Pill */}
      <div className="flex flex-col rounded-full bg-white dark:bg-stone-800 shadow-xl border border-amber-200/60 dark:border-stone-700 overflow-hidden divide-y divide-stone-100 dark:divide-stone-700">
        <button
          type="button"
          onClick={onZoomIn}
          disabled={!canZoomIn}
          title={t.zoomIn}
          aria-label={t.zoomIn}
          aria-disabled={!canZoomIn}
          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-700 active:bg-amber-100 dark:active:bg-stone-600 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:scale-100 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          disabled={!canZoomOut}
          title={t.zoomOut}
          aria-label={t.zoomOut}
          aria-disabled={!canZoomOut}
          className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-700 active:bg-amber-100 dark:active:bg-stone-600 active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:scale-100 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


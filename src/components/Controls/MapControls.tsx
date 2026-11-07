import React from 'react';
import { Compass, Locate, Minus, Plus } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateMe: () => void;
  onResetCenter: () => void;
  locating?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onLocateMe,
  onResetCenter,
  locating = false,
}) => {
  const { t } = useI18n();

  return (
    <div className="absolute right-3.5 bottom-24 sm:bottom-10 z-[950] flex flex-col gap-2 pointer-events-auto">
      {/* Locate Me button */}
      <button
        onClick={onLocateMe}
        title={t.nearMe}
        aria-label={t.nearMe}
        className="w-11 h-11 rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-xl border border-amber-200/60 dark:border-stone-700 flex items-center justify-center hover:bg-amber-50 dark:hover:bg-stone-700 active:scale-95 transition-all cursor-pointer"
      >
        <Locate className={`w-5 h-5 text-orange-600 dark:text-orange-400 ${locating ? 'animate-spin' : ''}`} />
      </button>

      {/* Reset to Mumbai Center */}
      <button
        onClick={onResetCenter}
        title={t.resetView}
        aria-label={t.resetView}
        className="w-11 h-11 rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-xl border border-amber-200/60 dark:border-stone-700 flex items-center justify-center hover:bg-amber-50 dark:hover:bg-stone-700 active:scale-95 transition-all cursor-pointer"
      >
        <Compass className="w-5 h-5 text-red-600 dark:text-red-400" />
      </button>

      {/* Zoom In & Out */}
      <div className="flex flex-col rounded-full bg-white dark:bg-stone-800 shadow-xl border border-amber-200/60 dark:border-stone-700 overflow-hidden divide-y divide-stone-100 dark:divide-stone-700">
        <button
          onClick={onZoomIn}
          title={t.zoomIn}
          aria-label={t.zoomIn}
          className="w-11 h-10 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-700 active:bg-amber-100 dark:active:bg-stone-600 transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onZoomOut}
          title={t.zoomOut}
          aria-label={t.zoomOut}
          className="w-11 h-10 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-50 dark:hover:bg-stone-700 active:bg-amber-100 dark:active:bg-stone-600 transition-colors cursor-pointer"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


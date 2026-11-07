import React from 'react';
import { Compass, Locate, Minus, Plus } from 'lucide-react';

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
  return (
    <div className="absolute right-3.5 bottom-24 sm:bottom-10 z-[950] flex flex-col gap-2 pointer-events-auto">
      {/* Locate Me button */}
      <button
        onClick={onLocateMe}
        title="Find My Location"
        className="w-11 h-11 rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-xl border border-amber-200/60 dark:border-stone-700 flex items-center justify-center hover:bg-amber-50 active:scale-95 transition-all"
      >
        <Locate className={`w-5 h-5 text-orange-600 ${locating ? 'animate-spin' : ''}`} />
      </button>

      {/* Reset to Mumbai Center */}
      <button
        onClick={onResetCenter}
        title="Reset Map to Mumbai"
        className="w-11 h-11 rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 shadow-xl border border-amber-200/60 dark:border-stone-700 flex items-center justify-center hover:bg-amber-50 active:scale-95 transition-all"
      >
        <Compass className="w-5 h-5 text-red-600" />
      </button>

      {/* Zoom In & Out */}
      <div className="flex flex-col rounded-full bg-white dark:bg-stone-800 shadow-xl border border-amber-200/60 dark:border-stone-700 overflow-hidden divide-y divide-stone-100 dark:divide-stone-700">
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="w-11 h-10 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-50 active:bg-amber-100 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="w-11 h-10 flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-50 active:bg-amber-100 transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


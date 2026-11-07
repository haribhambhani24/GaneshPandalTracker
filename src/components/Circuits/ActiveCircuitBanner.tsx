import React from 'react';
import { Compass, X } from 'lucide-react';
import type { Circuit } from '../../types/circuit';

interface ActiveCircuitBannerProps {
  circuit: Circuit;
  onClear: () => void;
  onOpenDetails: () => void;
}

export const ActiveCircuitBanner: React.FC<ActiveCircuitBannerProps> = ({
  circuit,
  onClear,
  onOpenDetails,
}) => {
  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[450] w-[92%] max-w-lg animate-in slide-in-from-top-4 duration-300">
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-3 border border-orange-400/80 dark:border-orange-800 shadow-xl flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
            style={{ backgroundColor: circuit.themeColor || '#EA580C' }}
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Active Walking Trail
              </span>
              <span className="text-[10px] text-stone-500">• {circuit.totalDistanceKm} km</span>
            </div>
            <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
              {circuit.name}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenDetails}
            className="px-2.5 py-1.5 rounded-lg bg-orange-100 dark:bg-stone-800 text-orange-700 dark:text-orange-300 font-bold text-[11px] hover:bg-orange-200 transition-colors cursor-pointer"
          >
            Stops
          </button>
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
            title="Exit walking route"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

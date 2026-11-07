import React from 'react';
import {
  Compass,
  Footprints,
  Info,
  MapPin,
  Train,
  X,
  Zap,
} from 'lucide-react';
import type { Circuit } from '../../types/circuit';
import type { Pandal } from '../../types/pandal';
import { useI18n } from '../../context/I18nContext';

interface CircuitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuits: Circuit[];
  pandals: Pandal[];
  activeCircuit: Circuit | null;
  onSelectCircuit: (circuit: Circuit) => void;
  onClearCircuit: () => void;
}

export const CircuitsModal: React.FC<CircuitsModalProps> = ({
  isOpen,
  onClose,
  circuits,
  pandals,
  activeCircuit,
  onSelectCircuit,
  onClearCircuit,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl border border-amber-300/60 dark:border-amber-900/40 shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-xl shadow-inner">
              <Compass className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                {t.circuitsModalTitle || 'Curated Pandal Walking Tours'}
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-100 font-medium">
                {t.circuitsSubtitle || 'Optimized walking routes between neighboring Mumbai pandals'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/20 hover:bg-black/35 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Circuit Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {circuits.map((circuit) => {
            const isActive = activeCircuit?.id === circuit.id;
            const circuitPandals = circuit.pandalIds
              .map((id) => pandals.find((p) => p.id === id))
              .filter(Boolean) as Pandal[];

            return (
              <div
                key={circuit.id}
                className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                  isActive
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-400/40 shadow-lg'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-800/40 hover:shadow-md'
                }`}
              >
                {/* Circuit Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 dark:border-stone-700/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: circuit.themeColor }} />
                      <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                        {circuit.name}
                      </h3>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-600 text-white animate-pulse">
                          Active Route
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                      {circuit.tagline}
                    </p>
                  </div>

                  {/* Distance & Time Pills */}
                  <div className="flex items-center gap-2 text-xs font-bold shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1 shadow-xs">
                      <Footprints className="w-3.5 h-3.5 text-orange-600" />
                      {circuit.totalDistanceKm} km
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1 shadow-xs">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      ~{circuit.estimatedWalkingMins} mins
                    </span>
                  </div>
                </div>

                {/* Stops Timeline */}
                <div className="py-3 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Route Sequence ({circuitPandals.length} Stops):
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {circuitPandals.map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold shadow-xs"
                      >
                        <span className="w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-stone-800 dark:text-stone-200 truncate max-w-[140px] sm:max-w-[180px]">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transit & Travel Advice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-400 py-1">
                  <div className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span><strong>Entry:</strong> {circuit.entryStation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span><strong>Exit:</strong> {circuit.exitStation}</span>
                  </div>
                </div>

                {circuit.travelTip && (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{circuit.travelTip}</span>
                  </div>
                )}

                {/* Action CTA */}
                <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-end gap-2">
                  {isActive ? (
                    <button
                      onClick={onClearCircuit}
                      className="px-4 py-2 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 hover:bg-red-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Exit This Route
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectCircuit(circuit)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Start Walking Route</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

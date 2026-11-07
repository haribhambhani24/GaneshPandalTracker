import React from 'react';
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  MapPin,
  Navigation,
  RotateCcw,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import type { Pandal } from '../../types/pandal';
import type { UserLocation } from '../../hooks/useUserLocation';
import { useMyDarshan } from '../../hooks/useMyDarshan';
import { useI18n } from '../../context/I18nContext';

interface MyDarshanModalProps {
  isOpen: boolean;
  onClose: () => void;
  pandals: Pandal[];
  userLocation: UserLocation | null;
  onSelectPandal: (pandal: Pandal) => void;
}

export const MyDarshanModal: React.FC<MyDarshanModalProps> = ({
  isOpen,
  onClose,
  pandals,
  userLocation,
  onSelectPandal,
}) => {
  const { t, formatNumber } = useI18n();
  const {
    savedList,
    removeSaved,
    undoLastRemoval,
    lastRemoved,
    reorderSaved,
    generateGoogleMapsRouteUrl,
  } = useMyDarshan();

  if (!isOpen) return null;

  // Retrieve full pandal objects for saved IDs in order
  const savedPandals = savedList
    .map((id) => pandals.find((p) => p.id === id))
    .filter((p): p is Pandal => Boolean(p));

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const next = [...savedList];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    reorderSaved(next);
  };

  const handleMoveDown = (index: number) => {
    if (index === savedList.length - 1) return;
    const next = [...savedList];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    reorderSaved(next);
  };

  const routeUrl = generateGoogleMapsRouteUrl(savedPandals, userLocation);

  return (
    <div
      id="my-darshan-modal"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-300/40 dark:border-stone-700 flex flex-col max-h-[88vh] text-stone-800 dark:text-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-white">
                {t.myDarshanRoute}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {formatNumber(savedPandals.length)} {t.resultsCount}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t.close || 'Close'}
            title={t.close || 'Close'}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Undo Toast if an item was recently removed */}
        {lastRemoved && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-stone-800 text-white text-xs flex items-center justify-between shadow-lg">
            <span>{t.pandalRemoved}</span>
            <button
              onClick={undoLastRemoval}
              className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 ml-3 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.undo}</span>
            </button>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {savedPandals.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-2xl mx-auto">
                🌟
              </div>
              <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                {t.noSavedDarshanTitle}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                {t.noSavedDarshanMsg}
              </p>
            </div>
          ) : (
            <>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 px-1">
                {t.reorderTip}
              </p>
              <ul className="space-y-2">
                {savedPandals.map((pandal, index) => (
                  <li
                    key={pandal.id}
                    className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between gap-3"
                  >
                    {/* Index & Name */}
                    <div
                      onClick={() => {
                        onSelectPandal(pandal);
                        onClose();
                      }}
                      className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                    >
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <img
                        src={pandal.photoUrl}
                        alt={pandal.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                          {pandal.name}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{pandal.area}</span>
                        </p>
                      </div>
                    </div>

                    {/* Controls: Reorder & Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === savedPandals.length - 1}
                        title="Move Down"
                        className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeSaved(pandal.id)}
                        title="Remove from saved"
                        className="p-1 text-stone-400 hover:text-red-500 rounded-full cursor-pointer ml-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer: Multi-Stop Google Maps Route Link & Privacy Note */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800 space-y-2 shrink-0">
          {savedPandals.length > 0 && (
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-md transition-all text-xs sm:text-sm cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>{t.openGoogleMapsRoute}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          )}
          <p className="text-[10px] text-center text-stone-400 dark:text-stone-500">
            {t.localDeviceNote}
          </p>
        </div>
      </div>
    </div>
  );
};


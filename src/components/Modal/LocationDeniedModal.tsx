import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MapPin, NavigationOff, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface LocationDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArea: (area: string) => void;
}

const POPULAR_HUBS = [
  'Lalbaug',
  'Girgaon',
  'Khetwadi',
  'Andheri',
  'Fort',
  'Chembur',
];

export const LocationDeniedModal: React.FC<LocationDeniedModalProps> = ({
  isOpen,
  onClose,
  onSelectArea,
}) => {
  const { t } = useI18n();
  const [showHowTo, setShowHowTo] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      id="location-denied-modal"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-300/40 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={t.close || 'Close'}
          title={t.close || 'Close'}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 shadow-inner">
          <NavigationOff className="w-6 h-6" />
        </div>

        {/* Title & Message */}
        <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5">
          {t.locationDeniedTitle}
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
          {t.locationDeniedMsg}
        </p>

        {/* Popular Areas Quick-Picks */}
        <div className="mb-4 text-left bg-stone-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-stone-200 dark:border-stone-700">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {t.popularAreas}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_HUBS.map((hub) => (
              <button
                key={hub}
                type="button"
                onClick={() => {
                  onSelectArea(hub);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-stone-700 hover:bg-amber-100 dark:hover:bg-amber-950 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600 shadow-2xs transition-colors cursor-pointer"
              >
                📍 {hub}
              </button>
            ))}
          </div>
        </div>

        {/* How to re-enable location accordion */}
        <div className="mb-4 text-left">
          <button
            type="button"
            onClick={() => setShowHowTo((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 py-1"
          >
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-amber-500" />
              How to enable location
            </span>
            {showHowTo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {showHowTo && (
            <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1.5 p-2.5 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200 dark:border-stone-700 leading-normal">
              {t.howToEnableLocation}
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 transition-colors cursor-pointer"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};

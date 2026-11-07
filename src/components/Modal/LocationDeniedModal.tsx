import React from 'react';
import { MapPin, NavigationOff, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface LocationDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArea: () => void;
}

export const LocationDeniedModal: React.FC<LocationDeniedModalProps> = ({
  isOpen,
  onClose,
  onSelectArea,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      id="location-denied-modal"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-amber-300/40 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 shadow-inner">
          <NavigationOff className="w-7 h-7" />
        </div>

        {/* Title & Message */}
        <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
          {t.locationDeniedTitle}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
          {t.locationDeniedMsg}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onSelectArea();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4" />
            <span>{t.locationDeniedAction}</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};


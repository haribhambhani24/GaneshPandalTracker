import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Flame, Phone, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface AboutBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMyDarshan?: () => void;
  onOpenCircuits?: () => void;
}

export const AboutBottomSheet: React.FC<AboutBottomSheetProps> = ({
  isOpen,
  onClose,
  onOpenMyDarshan,
  onOpenCircuits,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.aboutAndHelp}
        className="relative w-full sm:max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl max-h-[85vh] max-h-[85dvh] flex flex-col z-10 animate-in slide-in-from-bottom duration-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold">
              <Flame className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-stone-900 dark:text-white">
                {t.appName}
              </h2>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                {t.aboutAndHelp}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 cursor-pointer"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-5 text-xs text-stone-600 dark:text-stone-400">
          {/* Emergency Safety Alert */}
          <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <Phone className="w-3.5 h-3.5" />
              <span>{t.footerSafetyTitle}: 112</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {t.footerSafetyText}
            </p>
          </div>

          {/* Festival Dates */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-stone-800/80 border border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-xs">{t.festivalDates}</span>
          </div>

          {/* Quick Links Groups */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white">
              {t.footerHelpTitle}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/about"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 font-medium text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 min-h-[44px] flex items-center"
              >
                {t.footerHowItWorks}
              </Link>
              <Link
                to="/faq"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 font-medium text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 min-h-[44px] flex items-center"
              >
                {t.footerFaq}
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 font-medium text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 min-h-[44px] flex items-center"
              >
                {t.footerContactUs}
              </Link>
              <Link
                to="/submit"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-950/60 font-semibold text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 min-h-[44px] flex items-center"
              >
                {t.submitPandal}
              </Link>
              {onOpenMyDarshan && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenMyDarshan();
                  }}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 font-medium text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 min-h-[44px] flex items-center text-left cursor-pointer"
                >
                  {t.myDarshanShort}
                </button>
              )}
              {onOpenCircuits && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCircuits();
                  }}
                  className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 font-medium text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 min-h-[44px] flex items-center text-left cursor-pointer"
                >
                  {t.circuitsShort}
                </button>
              )}
            </div>
          </div>

          {/* Legal Links */}
          <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white">
              {t.footerLegalTitle}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
              <Link
                to="/privacy"
                onClick={onClose}
                className="hover:underline text-stone-700 dark:text-stone-300 py-1"
              >
                {t.footerPrivacyPolicy}
              </Link>
              <Link
                to="/terms"
                onClick={onClose}
                className="hover:underline text-stone-700 dark:text-stone-300 py-1"
              >
                {t.footerTermsOfUse}
              </Link>
              <Link
                to="/disclaimer"
                onClick={onClose}
                className="hover:underline text-stone-700 dark:text-stone-300 py-1"
              >
                {t.footerDisclaimer}
              </Link>
            </div>
          </div>

          {/* Disclaimer & Credits */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1 text-[11px] text-stone-500">
            <p>{t.footerDisclaimerText}</p>
            <p>{t.footerPhotoCreditsNotice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutBottomSheet;

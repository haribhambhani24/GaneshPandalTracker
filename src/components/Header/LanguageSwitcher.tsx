import React from 'react';
import type { Language } from '../../i18n';
import { useI18n } from '../../context/I18nContext';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useI18n();

  return (
    <div
      className={`flex items-center bg-black/30 backdrop-blur-xs rounded-xl p-0.5 border border-white/25 text-xs font-semibold shrink-0 min-h-[36px] ${className}`}
      role="group"
      aria-label="Language selection"
    >
      {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          aria-label={lang === 'en' ? 'EN - English' : lang === 'hi' ? 'HI - हिंदी' : 'MR - मराठी'}
          className={`px-2 py-1 rounded-lg uppercase transition-all cursor-pointer text-[11px] sm:text-xs font-bold focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none ${
            language === lang
              ? 'bg-white text-orange-950 shadow-sm'
              : 'text-white hover:bg-white/20 active:scale-95'
          }`}
          title={lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};


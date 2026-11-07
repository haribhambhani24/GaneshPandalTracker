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
      className={`flex items-center bg-black/25 dark:bg-black/40 rounded-lg p-0.5 border border-white/20 text-xs font-semibold shrink-0 ${className}`}
      role="group"
      aria-label="Language selection"
    >
      {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLanguage(lang)}
          aria-pressed={language === lang}
          className={`px-1.5 sm:px-2 py-1 rounded-md uppercase transition-colors cursor-pointer text-[11px] sm:text-xs font-bold ${
            language === lang
              ? 'bg-amber-400 text-red-950 shadow-xs'
              : 'text-amber-100 hover:text-white'
          }`}
          title={lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

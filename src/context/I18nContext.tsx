import React, { createContext, useContext, useState } from 'react';
import type { Language, Translations } from '../i18n';
import { translations } from '../i18n';

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('pandal_map_lang') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pandal_map_lang', lang);
  };

  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

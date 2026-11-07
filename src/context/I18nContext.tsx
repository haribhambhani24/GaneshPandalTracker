import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Language, Translations } from '../i18n';
import { translations } from '../i18n';
import type { CrowdLevel, PandalStatus } from '../types/pandal';

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  locale: string;
  formatNumber: (n: number) => string;
  formatCrowdLevel: (level: CrowdLevel) => string;
  formatStatus: (status?: PandalStatus) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const LANG_STORAGE_KEY = 'ganesh_pandal_tracker_lang';
const LEGACY_STORAGE_KEY = 'pandal_map_lang';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = (localStorage.getItem(LANG_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY)) as Language;
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        return saved;
      }
    } catch {
      // In case localStorage is blocked
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore quota or privacy errors
    }
  };

  // Sync <html lang="..."> attribute with the active language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = translations[language];
  const locale = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

  const formatNumber = (n: number): string => {
    try {
      return n.toLocaleString(locale);
    } catch {
      return String(n);
    }
  };

  const formatCrowdLevel = (level: CrowdLevel): string => {
    switch (level) {
      case 'High':
        return t.crowdHigh;
      case 'Medium':
        return t.crowdMedium;
      case 'Low':
      default:
        return t.crowdLow;
    }
  };

  const formatStatus = (status?: PandalStatus): string => {
    switch (status) {
      case 'approved':
        return t.statusApproved;
      case 'rejected':
        return t.statusRejected;
      case 'pending':
      default:
        return t.statusPending;
    }
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        locale,
        formatNumber,
        formatCrowdLevel,
        formatStatus,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

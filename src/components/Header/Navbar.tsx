import React from 'react';
import { List, Map, Moon, Sun } from 'lucide-react';
import type { Language } from '../../i18n';
import { useI18n } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';
import { SearchBarWithSuggestions } from '../Search/SearchBarWithSuggestions';
import type { Pandal } from '../../types/pandal';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pandals: Pandal[];
  onSelectPandalSuggestion: (pandal: Pandal) => void;
  isListView: boolean;
  onToggleView: () => void;
  totalPandals: number;
  filteredCount: number;
  distancesMap?: Map<string, number>;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  pandals,
  onSelectPandalSuggestion,
  isListView,
  onToggleView,
  totalPandals,
  filteredCount,
  distancesMap,
}) => {
  const { language, setLanguage, t } = useI18n();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-[1000] w-full bg-gradient-to-r from-orange-600 via-amber-600 to-red-700 text-white shadow-lg shadow-orange-950/20">
      {/* Top Brand & Controls Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-lg sm:text-xl shadow-inner border border-amber-200 shrink-0">
            🕉️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-none text-white drop-shadow">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-300 text-red-900 uppercase">
                Mumbai • {totalPandals}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-100 font-medium opacity-90 truncate max-w-[170px] sm:max-w-none">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Actions: Lang Switcher, Theme Toggle, Map/List Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher */}
          <div className="flex bg-black/25 rounded-lg p-0.5 border border-white/20 text-xs font-semibold">
            {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-1.5 sm:px-2 py-1 rounded-md uppercase transition-colors cursor-pointer ${
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

          {/* Light/Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            title={isDark ? t.lightMode : t.darkMode}
            className="p-1.5 sm:p-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-amber-100 hover:text-white border border-white/20 transition-all cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Map vs List View Toggle */}
          <button
            onClick={onToggleView}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-xs font-semibold border border-white/25 transition-all cursor-pointer"
            title={isListView ? t.mapView : t.listView}
          >
            {isListView ? (
              <>
                <Map className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">{t.mapView}</span>
              </>
            ) : (
              <>
                <List className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">{t.listView}</span>
              </>
            )}
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-red-950 text-[10px]">
              {filteredCount}
            </span>
          </button>
        </div>
      </div>

      {/* Search Input Bar with Live Suggestions Dropdown */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-2.5">
        <SearchBarWithSuggestions
          query={searchQuery}
          onQueryChange={onSearchChange}
          pandals={pandals}
          onSelectSuggestion={onSelectPandalSuggestion}
          distancesMap={distancesMap}
        />
      </div>
    </header>
  );
};

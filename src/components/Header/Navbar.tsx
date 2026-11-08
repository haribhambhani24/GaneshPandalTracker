// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, List, Map, MoreVertical, Plus, Shield, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { SearchBarWithSuggestions } from '../Search/SearchBarWithSuggestions';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
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
  onOpenAboutSheet?: () => void;
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
  onOpenAboutSheet,
}) => {
  const { t, formatNumber } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-[1000] w-full bg-[image:var(--header-bg)] text-[color:var(--header-text)] shadow-lg shadow-orange-950/20 pt-safe"
      style={{ backgroundColor: '#c2410c', backgroundImage: 'var(--header-bg)', color: 'var(--header-text)' }}
    >
      {/* Top Brand & Controls Row: Strictly designed to fit on 1 row down to 320px width */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-1 sm:gap-2">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 shrink">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold text-base sm:text-xl shadow-inner border border-amber-200 shrink-0">
            🕉️
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-xs sm:text-base md:text-lg tracking-tight leading-tight text-white drop-shadow truncate">
                <span className="hidden min-[360px]:inline">{t.appName}</span>
                <span className="min-[360px]:hidden">{t.appNameShort}</span>
              </h1>
              <span className="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/25 text-white border border-white/20 uppercase shrink-0">
                {t.mumbai} • {formatNumber(totalPandals)}
              </span>
            </div>
            <p className="hidden sm:block text-[11px] sm:text-xs text-white/95 font-medium truncate max-w-[200px] md:max-w-none drop-shadow-xs">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Actions: Lang Switcher, Theme Toggle, View Toggle, plus Links */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Reusable Global Language Switcher */}
          <LanguageSwitcher />

          {/* Standardized Theme Toggle */}
          <ThemeToggle variant="header" />

          {/* Map vs List View Toggle */}
          <button
            onClick={onToggleView}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold border border-white/25 transition-all cursor-pointer min-h-[36px] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none shadow-xs"
            title={`${isListView ? t.mapView : t.listView} (${formatNumber(filteredCount)})`}
            aria-label={`${isListView ? t.mapView : t.listView} ${formatNumber(filteredCount)}`}
          >
            {isListView ? (
              <>
                <Map className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="hidden sm:inline text-white">{t.mapView}</span>
              </>
            ) : (
              <>
                <List className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="hidden sm:inline text-white">{t.listView}</span>
              </>
            )}
            <span className="px-1.5 py-0.2 rounded-full bg-white text-orange-950 text-[10px] font-extrabold shadow-xs">
              {formatNumber(filteredCount)}
            </span>
          </button>

          {/* Desktop-only Direct Links */}
          <Link
            to="/submit"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 active:scale-95 text-orange-700 font-extrabold text-xs shadow-md border border-white/80 transition-all min-h-[36px] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none"
            title={t.submitPandal}
          >
            <Plus className="w-3.5 h-3.5 text-orange-700 stroke-[2.5]" />
            <span>{t.submitPandal}</span>
          </Link>

          <Link
            to="/admin"
            className="hidden md:flex p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white border border-white/25 transition-all min-h-[36px] min-w-[36px] items-center justify-center focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none shadow-xs"
            title={t.adminPortalTitle}
            aria-label={t.adminPortalTitle}
          >
            <Shield className="w-4 h-4 text-white" />
          </Link>

          {/* Mobile Secondary Menu Button (Collapses Submit & Admin on < md screens) */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white border border-white/25 transition-all min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none shadow-xs"
              aria-label="More navigation options"
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <MoreVertical className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Mobile Dropdown Menu Popover */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl py-2 z-[1100] animate-in fade-in zoom-in-95 duration-150">
                <Link
                  to="/submit"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-orange-100 dark:bg-stone-800 text-orange-700 dark:text-orange-400 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span>{t.submitPandal}</span>
                </Link>

                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <span>{t.adminPortalTitle}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (onOpenAboutSheet) {
                      onOpenAboutSheet();
                    }
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <span>{t.aboutAndHelp}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Input Bar with Live Suggestions Dropdown */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-2 sm:pb-2.5">
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

// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect, useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

// Next Ganesh Chaturthi target date: September 4, 2027 00:00:00 IST
const FESTIVAL_TARGET_DATE = new Date('2027-09-04T00:00:00+05:30').getTime();

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
}

function calculateTimeRemaining(): TimeRemaining {
  const now = Date.now();
  const diff = FESTIVAL_TARGET_DATE - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isStarted: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isStarted: false };
}

export const FestivalCountdownBanner: React.FC = () => {
  const { t, formatNumber } = useI18n();
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return (
      (localStorage.getItem('ganesh_pandal_tracker_banner_collapsed') ||
        localStorage.getItem('pandal_map_banner_collapsed')) === 'true'
    );
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('ganesh_pandal_tracker_banner_collapsed', String(next));
      return next;
    });
  };

  if (isCollapsed) {
    return (
      <button
        onClick={toggleCollapse}
        id="festival-banner-minimized"
        aria-label={t.showCountdown}
        aria-expanded={false}
        className="w-full bg-amber-50 dark:bg-stone-900 text-stone-900 dark:text-amber-200 px-3 py-1.5 text-xs font-semibold flex items-center justify-between border-b border-amber-200 dark:border-amber-900/40 hover:bg-amber-100/70 dark:hover:bg-stone-850 transition-all cursor-pointer shadow-xs"
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-amber-600 dark:text-amber-400">🕉️</span>
          <span className="truncate text-stone-900 dark:text-amber-200">{t.festivalBannerTitle} ({t.festivalDates})</span>
          <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold ml-1">
            • {formatNumber(timeLeft.days)} {t.countdownDays} {t.startsIn}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-amber-300 font-medium shrink-0 ml-2">
          <span>{t.showCountdown}</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </button>
    );
  }

  return (
    <div
      id="festival-banner-expanded"
      className="relative w-full bg-amber-50/90 dark:bg-stone-900 text-stone-900 dark:text-stone-100 px-3 sm:px-4 py-2 border-b border-amber-200 dark:border-amber-900/40 shadow-xs z-[980]"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Banner Title & Dates */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-400/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 shadow-xs">
            🕉️
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-stone-900 dark:text-amber-300">
                {t.festivalBannerTitle}
              </span>
              <span className="text-[10px] bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-amber-200 border border-red-300/40 px-1.5 py-0.2 rounded font-semibold">
                {t.mumbaiUtsav}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 flex items-center justify-center sm:justify-start gap-1 font-medium">
              <Calendar className="w-3 h-3 text-amber-600 dark:text-amber-400 inline" />
              {t.festivalDates}
            </p>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden md:inline-block text-[11px] font-semibold text-stone-600 dark:text-amber-200 uppercase tracking-wider">
            {t.startsIn}:
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-center">
            {/* Days */}
            <div className="bg-white dark:bg-black/40 border border-amber-200 dark:border-amber-500/30 rounded-lg px-2 py-1 min-w-[42px] sm:min-w-[48px] shadow-xs">
              <div className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-amber-300 leading-none">
                {formatNumber(timeLeft.days)}
              </div>
              <div className="text-[9px] uppercase font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                {t.countdownDays}
              </div>
            </div>
            <span className="text-amber-800 dark:text-amber-400 font-bold text-xs">:</span>

            {/* Hours */}
            <div className="bg-white dark:bg-black/40 border border-amber-200 dark:border-amber-500/30 rounded-lg px-2 py-1 min-w-[38px] sm:min-w-[44px] shadow-xs">
              <div className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-amber-300 leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                {t.countdownHours}
              </div>
            </div>
            <span className="text-amber-800 dark:text-amber-400 font-bold text-xs">:</span>

            {/* Minutes */}
            <div className="bg-white dark:bg-black/40 border border-amber-200 dark:border-amber-500/30 rounded-lg px-2 py-1 min-w-[38px] sm:min-w-[44px] shadow-xs">
              <div className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-amber-300 leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                {t.countdownMins}
              </div>
            </div>
            <span className="text-amber-800 dark:text-amber-400 font-bold text-xs">:</span>

            {/* Seconds */}
            <div className="bg-white dark:bg-black/40 border border-amber-200 dark:border-amber-500/30 rounded-lg px-2 py-1 min-w-[38px] sm:min-w-[44px] shadow-xs">
              <div className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-amber-300 leading-none animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                {t.countdownSecs}
              </div>
            </div>
          </div>

          {/* Minimize toggle */}
          <button
            onClick={toggleCollapse}
            title={t.minimizeBanner}
            aria-label={t.minimizeBanner}
            aria-expanded={true}
            className="p-1 rounded-md text-stone-500 hover:text-stone-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-stone-800 active:scale-95 transition-colors ml-1 cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

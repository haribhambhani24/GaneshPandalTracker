// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t.footerHowItWorks} | ${t.appName}`;
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <div className="min-h-[100vh] min-h-[100dvh] bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-xs pt-safe">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-orange-600 dark:hover:text-amber-400 transition-colors cursor-pointer min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToMap}</span>
          </button>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle variant="nav" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.tagline}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            {t.footerHowItWorks}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t.lastUpdated}: November 2026
          </p>
        </div>

        {/* Intro Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-stone-900 dark:text-white">
            {t.appName}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {t.footerBrandDesc}
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            During Mumbai&apos;s 10-day Ganesh Chaturthi festival, millions of devotees visit pandals across the city.
            Ganesh Pandal Tracker was created to provide reliable, real-time information on pandal locations, darshan timings,
            aarti schedules, crowd conditions, walking tours, and railway access.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-stone-800 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">Interactive Pandal Map</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Explore pandals across Mumbai with instant filtering by area, 24-hour darshan, eco-friendly idols, and crowd levels.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">Community Driven</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Information is contributed by devotees and mandal volunteers, and reviewed before publishing to ensure accuracy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">Privacy First</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Your location is only used locally inside your browser to calculate distances. We never track or store your coordinates.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-stone-900 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white">
              Know a pandal not listed yet?
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Submit your local pandal with photos and timings to help fellow devotees.
            </p>
          </div>
          <Link
            to="/submit"
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all shrink-0 min-h-[44px] flex items-center"
          >
            {t.submitPandal}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;

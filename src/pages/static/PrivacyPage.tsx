// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Database, HardDrive, Lock, MapPin, ShieldCheck } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';

export const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t.footerPrivacyPolicy} | ${t.appName}`;
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.footerPrivacyPolicy}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            {t.privacyTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t.lastUpdated}: November 2026
          </p>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-stone-800 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
              1. Location Data (Zero Server Storage)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              When you use &ldquo;Near Me&rdquo;, your GPS coordinates are used <strong>strictly in your browser</strong> to calculate distance to pandals and sort them nearest to farthest. Your location is <strong>never sent to, stored on, or tracked by our servers</strong> or any third party.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
              2. Saved Pandals & Local Storage
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Pandals you save in &ldquo;My Darshan&rdquo;, your preferred language (EN, HI, MR), and your theme choice (Light, Dark) are stored <strong>locally in your device&apos;s browser (localStorage)</strong>. They remain private to your device.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-stone-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
              3. Pandal Submissions & Photo Storage
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              When you submit a new pandal or report information, the provided details (pandal name, address, timings, photos, and optional volunteer contact) are stored securely in <strong>Supabase</strong> for verification by our moderation team.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">
              4. Map Tiles & OpenStreetMap
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Our interactive map utilizes CartoDB and OpenStreetMap (OSM) tile providers to render street and landmark layers. Standard tile requests are made directly between your browser and tile servers in accordance with OpenStreetMap policies.
            </p>
          </div>
        </div>

        {/* Rights and Contact */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <h2 className="font-bold text-base text-stone-900 dark:text-white">
            Your Rights & Contact
          </h2>
          <p>
            You can clear your locally saved data at any time through your browser settings or directly inside the app.
            If you represent a registered mandal and wish to update or remove pandal details or photographs, please contact us.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;


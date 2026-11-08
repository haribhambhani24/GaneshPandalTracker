// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t.footerTermsOfUse} | ${t.appName}`;
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Scale className="w-3.5 h-3.5" />
            <span>{t.footerTermsOfUse}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            {t.termsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t.lastUpdated}: November 2026
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-stone-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Ganesh Pandal Tracker, you agree to comply with and be bound by these Terms of Use.
              This platform is an open community-guided resource built for Mumbai devotees and visitors.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-stone-900 dark:text-white">
              2. User-Submitted Content & Photographs
            </h2>
            <p>
              When submitting pandal information or photographs, you confirm that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-300">
              <li>The information submitted is accurate and truthful to the best of your knowledge.</li>
              <li>You possess the right or permission to share the uploaded photograph(s).</li>
              <li>Submissions must not contain offensive, misleading, or commercial advertising material.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-stone-900 dark:text-white">
              3. Community Moderation & Removal
            </h2>
            <p>
              Our volunteer administrators reserve the right to review, edit, reject, or remove any pandal submission,
              photo, or report that violates these terms or provides incorrect details, without prior notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-stone-900 dark:text-white">
              4. Prohibited Uses
            </h2>
            <p>
              You agree not to disrupt or overload platform services, conduct unauthorized automated scraping,
              or misuse the emergency or reporting features.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';

export const DisclaimerPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t.footerDisclaimer} | ${t.appName}`;
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.footerDisclaimer}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            {t.disclaimerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t.lastUpdated}: November 2026
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 font-medium">
            {t.footerDisclaimerText}
          </div>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-stone-900 dark:text-white">
              1. Community-Submitted Information
            </h2>
            <p>
              Information on Ganesh Pandal Tracker, including pandal names, addresses, darshan hours, aarti timings,
              and crowd estimates, is contributed by volunteers, mandal representatives, and devotees. While we review submissions
              carefully, mandal organizers may change schedules, queue routes, or visiting hours without advance notice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-stone-900 dark:text-white">
              2. Police & Traffic Directives
            </h2>
            <p>
              During festival days and visarjan processions, Mumbai Traffic Police and the Brihanmumbai Municipal Corporation (BMC)
              implement dynamic road closures, one-way diversions, and barricades. Always adhere to on-ground police instructions,
              signage, and official government announcements over digital map suggestions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-stone-900 dark:text-white">
              3. Independent Devotee Initiative
            </h2>
            <p>
              Ganesh Pandal Tracker is an independent, non-commercial public service initiative created to aid devotees during the festival.
              It is not officially affiliated with or endorsed by any specific Sarvajanik Ganeshotsav Mandal, the BMC, or Mumbai Police.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-stone-900 dark:text-white">
              4. Photographs & Trademarks
            </h2>
            <p>
              All photographs remain the property and copyright of their respective photographers, creators, and mandal trusts.
              Names and titles of pandals are referenced solely for informational identification purposes.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DisclaimerPage;

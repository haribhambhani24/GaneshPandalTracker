import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';

export const DisclaimerPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans">
      {/* Header */}
      <nav className="border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between sticky top-0 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold text-sm text-stone-800 dark:text-stone-200"
        >
          <ArrowLeft className="w-4 h-4 text-orange-600" />
          <span>{t.staticPageBackHome}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle variant="nav" />
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-6">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500 font-bold mb-2">
            <AlertCircle className="w-6 h-6" />
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              {t.disclaimerTitle}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mb-2">
            {t.disclaimerSubtitle}
          </p>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-900 text-stone-500 border border-stone-200 dark:border-stone-800">
            {t.disclaimerLastUpdated}
          </span>
        </header>

        <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-stone-800 dark:text-stone-200 leading-relaxed text-sm sm:text-base space-y-4">
          <p>{t.disclaimerBody}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DisclaimerPage;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { LanguageSwitcher } from '../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../components/Header/ThemeToggle';

const POPULAR_HUBS = ['Lalbaug', 'Girgaon', 'Khetwadi', 'Andheri'];

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-[100vh] min-h-[100dvh] bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-stone-200 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold text-sm text-stone-800 dark:text-stone-200"
        >
          <span className="text-orange-600 font-black">GANESH</span> PANDAL TRACKER
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle variant="nav" />
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Main 404 Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-4xl shadow-inner">
          🕉️
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
            404
          </span>
          <h1 className="text-2xl font-black text-stone-900 dark:text-white pt-2">
            {t.notFoundTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            {t.notFoundDesc}
          </p>
        </div>

        <div className="pt-2 w-full space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-6 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToMap}</span>
          </button>

          {/* Quick Hub Links */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mb-2.5">
              {t.tryPopularArea}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_HUBS.map((hub) => (
                <button
                  key={hub}
                  onClick={() => navigate(`/?area=${encodeURIComponent(hub)}`)}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-orange-400 transition-colors cursor-pointer"
                >
                  📍 {hub}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;

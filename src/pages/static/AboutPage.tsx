import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Database, Map } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';
import { siteConfig } from '../../config/site';

export const AboutPage: React.FC = () => {
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
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white mb-2">
            {t.aboutTitle}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
            {t.aboutSubtitle}
          </p>
        </header>

        <div className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg">
              <BookOpen className="w-5 h-5" />
              <h2>{t.aboutSectionHowTitle}</h2>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
              {t.aboutSectionHowBody}
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg">
              <Database className="w-5 h-5" />
              <h2>{t.aboutSectionDataTitle}</h2>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
              {t.aboutSectionDataBody}
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-lg">
              <Map className="w-5 h-5" />
              <h2>{t.aboutSectionOsmTitle}</h2>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm sm:text-base">
              {t.aboutSectionOsmBody}
            </p>
            <div className="pt-2">
              <a
                href={siteConfig.credits.osmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-600 dark:text-orange-400 underline font-semibold"
              >
                {siteConfig.credits.osmUrl}
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;


import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Flag } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';
import { siteConfig } from '../../config/site';

export const ContactPage: React.FC = () => {
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
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold mb-2">
            <Mail className="w-6 h-6" />
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              {t.contactTitle}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
            {t.contactSubtitle}
          </p>
        </header>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs uppercase font-bold tracking-wider text-stone-500 mb-1">
                {t.contactEmailLabel}
              </h2>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              Send Email
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="flex items-center gap-2 text-stone-800 dark:text-stone-200 font-bold text-base mb-2">
              <Flag className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h2>{t.contactReportLabel}</h2>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              If you found wrong timings, location, or crowd status on a pandal, use the built-in report button on that pandal's page to flag it directly to our moderation queue.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 dark:text-orange-400 hover:underline"
            >
              <span>{t.contactReportLink}</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;


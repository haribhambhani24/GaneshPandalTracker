import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  Calendar,
  ChevronDown,
  ExternalLink,
  Flame,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { siteConfig } from '../../config/site';
import { LanguageSwitcher } from '../Header/LanguageSwitcher';
import { ThemeToggle } from '../Header/ThemeToggle';

const CURRENT_YEAR = new Date().getFullYear();

interface FooterProps {
  className?: string;
  onOpenMyDarshan?: () => void;
  onOpenCircuits?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  onOpenMyDarshan,
  onOpenCircuits,
}) => {
  const { t } = useI18n();

  // Mobile accordion state for link columns
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    explore: false,
    help: false,
    legal: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className={`w-full bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-xs transition-colors ${className}`}
    >
      {/* 1. Emergency Safety Strip */}
      <div className="w-full bg-stone-200/80 dark:bg-stone-800/80 border-b border-stone-300/60 dark:border-stone-700/60 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white font-bold text-[11px] shrink-0">
              <Phone className="w-3 h-3" />
              <span>{siteConfig.emergency.number}</span>
            </span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 text-[11px] sm:text-xs">
              {t.footerSafetyTitle}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 font-medium max-w-2xl">
            {t.footerSafetyText}
          </p>
        </div>
      </div>

      {/* 2. Main Footer Navigation & Brand Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Mission Block (Takes 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                <Flame className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <span className="font-black text-base text-stone-900 dark:text-white tracking-tight">
                  {t.appName}
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  {t.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-sm">
              {t.footerBrandDesc}
            </p>

            {/* Dynamic Festival Dates Notice */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-800/90 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-medium text-[11px] sm:text-xs">
                {t.festivalDates}
              </span>
            </div>

            {/* Social & Contact Channels (from siteConfig) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {siteConfig.contact.email && (
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors font-medium min-h-[36px]"
                  title={siteConfig.contact.email}
                >
                  <Mail className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  <span>{siteConfig.contact.email}</span>
                </a>
              )}

              {siteConfig.social.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label="GitHub Repository"
                  title="GitHub"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('explore')}
              className="w-full flex items-center justify-between md:cursor-default text-left font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white py-1 md:py-0"
              aria-expanded={openSections.explore}
            >
              <span>{t.footerExploreTitle}</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSections.explore ? 'rotate-180' : ''
                }`}
              />
            </button>
            <nav
              aria-label="Explore pandals"
              className={`space-y-2 mt-3 ${
                openSections.explore ? 'block' : 'hidden md:block'
              }`}
            >
              <Link
                to="/"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.home || 'Home / Map'}
              </Link>
              <Link
                to="/?near=true"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.nearMe}
              </Link>
              {onOpenMyDarshan ? (
                <button
                  type="button"
                  onClick={onOpenMyDarshan}
                  className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center cursor-pointer text-left w-full"
                >
                  {t.myDarshanShort}
                </button>
              ) : (
                <Link
                  to="/?darshan=true"
                  className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
                >
                  {t.myDarshanShort}
                </Link>
              )}
              <Link
                to="/submit"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center font-medium text-orange-700 dark:text-amber-400"
              >
                {t.submitPandal}
              </Link>
              {onOpenCircuits ? (
                <button
                  type="button"
                  onClick={onOpenCircuits}
                  className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center cursor-pointer text-left w-full"
                >
                  {t.circuitsShort}
                </button>
              ) : (
                <Link
                  to="/?tours=true"
                  className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
                >
                  {t.circuitsShort}
                </Link>
              )}
            </nav>
          </div>

          {/* Column 2: Help & Trust */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('help')}
              className="w-full flex items-center justify-between md:cursor-default text-left font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white py-1 md:py-0"
              aria-expanded={openSections.help}
            >
              <span>{t.footerHelpTitle}</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSections.help ? 'rotate-180' : ''
                }`}
              />
            </button>
            <nav
              aria-label="Help and Trust links"
              className={`space-y-2 mt-3 ${
                openSections.help ? 'block' : 'hidden md:block'
              }`}
            >
              <Link
                to="/about"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.footerHowItWorks}
              </Link>
              <Link
                to="/faq"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.footerFaq}
              </Link>
              <Link
                to="/contact?type=report"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.reportProblem}
              </Link>
              <Link
                to="/contact"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.footerContactUs}
              </Link>
            </nav>
          </div>

          {/* Column 3: Legal & Info */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('legal')}
              className="w-full flex items-center justify-between md:cursor-default text-left font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-white py-1 md:py-0"
              aria-expanded={openSections.legal}
            >
              <span>{t.footerLegalTitle}</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden transition-transform ${
                  openSections.legal ? 'rotate-180' : ''
                }`}
              />
            </button>
            <nav
              aria-label="Legal and Policy links"
              className={`space-y-2 mt-3 ${
                openSections.legal ? 'block' : 'hidden md:block'
              }`}
            >
              <Link
                to="/privacy"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.footerPrivacyPolicy}
              </Link>
              <Link
                to="/terms"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.footerTermsOfUse}
              </Link>
              <Link
                to="/disclaimer"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center"
              >
                {t.footerDisclaimer}
              </Link>
              <a
                href={siteConfig.credits.osmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-1 hover:text-orange-600 dark:hover:text-amber-400 transition-colors min-h-[36px] flex items-center text-stone-500"
              >
                {t.footerMapAttribution}
              </a>
            </nav>
          </div>
        </div>

        {/* 3. Community Disclaimer & Photo Attribution */}
        <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800 space-y-2">
          <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            <span className="font-semibold text-stone-700 dark:text-stone-300">
              {t.footerDisclaimer}:
            </span>{' '}
            {t.footerDisclaimerText}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500 dark:text-stone-400">
            <span>{t.footerPhotoCreditsNotice}</span>
            <span>•</span>
            <a
              href={siteConfig.credits.osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-stone-600 dark:text-stone-300"
            >
              {t.footerMapAttribution}
            </a>
            <span>•</span>
            <span>
              Built with{' '}
              <a
                href={siteConfig.credits.leafletUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-stone-600 dark:text-stone-300"
              >
                Leaflet
              </a>{' '}
              &{' '}
              <a
                href={siteConfig.credits.supabaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-stone-600 dark:text-stone-300"
              >
                Supabase
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Utility Bar (Language, Theme, Copyright, Back to Top, Admin) */}
      <div className="bg-stone-200/50 dark:bg-stone-950/60 border-t border-stone-200 dark:border-stone-800 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Preferences (Lang switcher + Theme toggle) */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle variant="nav" />
          </div>

          {/* Center: Copyright */}
          <div className="text-center text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium">
            © {CURRENT_YEAR} {t.footerCopyright}. All rights reserved.
          </div>

          {/* Right: Back to Top & Subtle Admin Link */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors font-medium cursor-pointer min-h-[36px]"
              aria-label={t.footerBackToTop}
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{t.footerBackToTop}</span>
            </button>

            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors p-1"
              title={t.adminPortalTitle}
              aria-label={t.adminPortalTitle}
            >
              <Shield className="w-3.5 h-3.5 text-stone-400" />
              <span>{t.footerAdminLink}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

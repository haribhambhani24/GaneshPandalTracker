import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  ChevronDown,
  Flame,
  Mail,
  Map,
  Shield,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../Header/LanguageSwitcher';
import { ThemeToggle } from '../Header/ThemeToggle';
import { siteConfig } from '../../config/site';

// ─── Link group data ───────────────────────────────────────────────────────────

interface FooterLink {
  labelKey: keyof ReturnType<typeof useI18n>['t'];
  to: string;
  external?: boolean;
}

function useFooterLinks() {
  const { t } = useI18n();

  const exploreLinks: FooterLink[] = [
    { labelKey: 'footerHome', to: '/' },
    { labelKey: 'footerNearMe', to: '/' },
    { labelKey: 'footerSavedPandals', to: '/' },
    { labelKey: 'footerSubmitPandal', to: '/submit' },
    { labelKey: 'footerWalkingTours', to: '/' },
  ];

  const helpLinks: FooterLink[] = [
    { labelKey: 'footerHowItWorks', to: '/about' },
    { labelKey: 'footerFaq', to: '/faq' },
    { labelKey: 'footerReportProblem', to: '/' },
    { labelKey: 'footerContactUs', to: '/contact' },
  ];

  const legalLinks: FooterLink[] = [
    { labelKey: 'footerPrivacyPolicy', to: '/privacy' },
    { labelKey: 'footerTermsOfUse', to: '/terms' },
    { labelKey: 'footerDisclaimer', to: '/disclaimer' },
  ];

  return { t, exploreLinks, helpLinks, legalLinks };
}

// ─── Accordion section (mobile only) ──────────────────────────────────────────

interface AccordionSectionProps {
  title: string;
  links: FooterLink[];
  labels: Record<string, string>;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, links, labels }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-stone-200 dark:border-stone-800 md:border-none">
      {/* Mobile header — toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-3.5 text-left text-sm font-semibold text-stone-800 dark:text-stone-100 md:hidden min-h-[44px]"
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Desktop heading (always visible) */}
      <p className="hidden md:block text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">
        {title}
      </p>

      {/* Links */}
      <ul
        className={`space-y-1 overflow-hidden transition-all duration-200 ${open ? 'max-h-96 pb-3' : 'max-h-0 md:max-h-96 md:pb-0'}`}
      >
        {links.map((link) => (
          <li key={link.labelKey}>
            <Link
              to={link.to}
              className="text-sm text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-1 block min-h-[36px] flex items-center"
            >
              {labels[link.labelKey]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Main Footer ───────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const { t } = useFooterLinks();
  const { exploreLinks, helpLinks, legalLinks } = useFooterLinks();
  const year = CURRENT_YEAR;

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build label maps for AccordionSection
  const labels = t as unknown as Record<string, string>;

  const exploreTitles = exploreLinks.map((l) => ({ ...l, label: t[l.labelKey] as string }));
  const helpTitles = helpLinks.map((l) => ({ ...l, label: t[l.labelKey] as string }));
  const legalTitles = legalLinks.map((l) => ({ ...l, label: t[l.labelKey] as string }));

  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400"
    >
      {/* ── Disclaimer strip ── */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-4 py-2 text-center text-xs text-amber-800 dark:text-amber-300">
        {t.footerDisclaimerLine}
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-8">

          {/* Brand block */}
          <div className="pb-6 md:pb-0 border-b border-stone-200 dark:border-stone-800 md:border-none">
            {/* Logo + name */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 group mb-3"
              aria-label="Ganesh Pandal Tracker home"
            >
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <Flame className="w-5 h-5 text-white" />
              </span>
              <div>
                <p className="text-sm font-black text-stone-800 dark:text-stone-100 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {siteConfig.name}
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-500 leading-tight">
                  {t.footerTagline}
                </p>
              </div>
            </Link>

            <p className="text-xs text-stone-500 dark:text-stone-500 leading-relaxed mb-5 max-w-[220px]">
              {t.footerDescription}
            </p>

            {/* Theme + language controls */}
            <div className="flex items-center gap-2">
              <ThemeToggle variant="nav" />
              <LanguageSwitcher />
            </div>
          </div>

          {/* Explore links */}
          <div>
            {/* Mobile accordion */}
            <div className="md:hidden">
              <AccordionSection
                title={t.footerExploreTitle}
                links={exploreLinks}
                labels={labels}
              />
            </div>
            {/* Desktop column */}
            <div className="hidden md:block">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">
                {t.footerExploreTitle}
              </p>
              <ul className="space-y-1">
                {exploreTitles.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-0.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Help links */}
          <div>
            <div className="md:hidden">
              <AccordionSection
                title={t.footerHelpTitle}
                links={helpLinks}
                labels={labels}
              />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">
                {t.footerHelpTitle}
              </p>
              <ul className="space-y-1">
                {helpTitles.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-0.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal links */}
          <div>
            <div className="md:hidden">
              <AccordionSection
                title={t.footerLegalTitle}
                links={legalLinks}
                labels={labels}
              />
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-3">
                {t.footerLegalTitle}
              </p>
              <ul className="space-y-1">
                {legalTitles.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      to={link.to}
                      className="text-sm hover:text-orange-600 dark:hover:text-orange-400 transition-colors py-0.5 block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact email */}
            {siteConfig.contact.email && (
              <div className="mt-4 hidden md:flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-xs hover:text-orange-600 dark:hover:text-orange-400 transition-colors break-all"
                  rel="noopener noreferrer"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile contact */}
        {siteConfig.contact.email && (
          <div className="mt-2 flex items-center gap-2 pb-4 border-b border-stone-200 dark:border-stone-800 md:hidden">
            <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-sm hover:text-orange-600 dark:hover:text-orange-400 transition-colors break-all"
              rel="noopener noreferrer"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        )}

        {/* ── OSM credit + map link ── */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href={siteConfig.credits.osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <Map className="w-3.5 h-3.5" />
            {t.footerCreditsOsm}
          </a>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-stone-400 dark:text-stone-600">
            {t.footerCopyright.replace('{year}', String(year))}
          </p>

          <div className="flex items-center gap-3">
            {/* Subtle admin link */}
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-xs text-stone-300 dark:text-stone-700 hover:text-stone-500 dark:hover:text-stone-500 transition-colors"
              aria-label={t.footerAdmin}
            >
              <Shield className="w-3 h-3" />
              <span>{t.footerAdmin}</span>
            </Link>

            {/* Back to top */}
            <button
              type="button"
              onClick={handleBackToTop}
              aria-label={t.footerBackToTop}
              className="inline-flex items-center gap-1 text-xs text-stone-400 dark:text-stone-600 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer min-h-[36px]"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{t.footerBackToTop}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safe-area bottom padding for mobile notch/gesture bar */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </footer>
  );
};

export default Footer;


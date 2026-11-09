import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-bold text-sm sm:text-base text-stone-900 dark:text-white cursor-pointer min-h-[44px]"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 text-sm text-stone-600 dark:text-stone-300 border-t border-stone-100 dark:border-stone-800 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const { t } = useI18n();

  const faqs = [
    { q: t.faqQ1, a: t.faqA1 },
    { q: t.faqQ2, a: t.faqA2 },
    { q: t.faqQ3, a: t.faqA3 },
    { q: t.faqQ4, a: t.faqA4 },
    { q: t.faqQ5, a: t.faqA5 },
    { q: t.faqQ6, a: t.faqA6 },
  ];

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
            <HelpCircle className="w-6 h-6" />
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
              {t.faqTitle}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400">
            {t.faqSubtitle}
          </p>
        </header>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;


// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    document.title = `${t.faqTitle} | ${t.appName}`;
    window.scrollTo(0, 0);
  }, [t]);

  const faqs: FaqItem[] = [
    {
      q: language === 'hi'
        ? 'क्या गणेश पंडाल ट्रैकर का उपयोग पूरी तरह मुफ़्त है?'
        : language === 'mr'
        ? 'गणेश मंडळ ट्रॅकर वापरणे पूर्णपणे मोफत आहे का?'
        : 'Is Ganesh Pandal Tracker completely free to use?',
      a: language === 'hi'
        ? 'हाँ, गणेश पंडाल ट्रैकर सभी भक्तों के लिए 100% मुफ़्त है। कोई विज्ञापन, सशुल्क टियर या सदस्यता शुल्क नहीं है।'
        : language === 'mr'
        ? 'होय, गणेश मंडळ ट्रॅकर सर्व भाविकांसाठी 100% मोफत आहे. कोणत्याही जाहिराती किंवा शुल्क नाही.'
        : 'Yes, Ganesh Pandal Tracker is 100% free for all devotees. There are no fees, subscriptions, or intrusive ads.',
    },
    {
      q: language === 'hi'
        ? 'मैं नया पंडाल कैसे जोड़ या सबमिट कर सकता हूँ?'
        : language === 'mr'
        ? 'मी नवीन मंडळ कसे जोडू किंवा सादर करू शकतो?'
        : 'How do I add or submit a pandal?',
      a: language === 'hi'
        ? "शीर्ष नेविगेशन या पादलेख में 'पंडाल जोड़ें' पर क्लिक करें। नाम, क्षेत्र, दर्शन का समय, आरती का समय, फोटो और सटीक मैप लोकेशन पिन दर्ज करें। हमारी समीक्षा टीम सत्यापन के बाद इसे लाइव कर देगी।"
        : language === 'mr'
        ? "मुख्य पृष्ठावर किंवा फूटरमध्ये 'मंडळ जोडा' वर क्लिक करा. नाव, परिसर, दर्शनाची वेळ, आरतीची वेळ, फोटो आणि नकाशावरील अचूक स्थान भरा. पडताळणीनंतर ते लगेच लाइव्ह केले जाईल."
        : "Click 'Submit Pandal' in the top header or footer. Provide the pandal name, area, darshan timings, aarti schedules, photos, and drop a pin on the map. Our volunteer review team verifies submissions before making them live.",
    },
    {
      q: language === 'hi'
        ? 'भीड़ का स्तर (कम, मध्यम, अधिक) कैसे निर्धारित किया जाता है?'
        : language === 'mr'
        ? 'गर्दीची स्थिती (कमी, मध्यम, जास्त) कशी ठरवली जाते?'
        : 'How is the crowd level decided?',
      a: language === 'hi'
        ? 'भीड़ का स्तर ऐतिहासिक उत्सव प्रवृत्तियों, पीक आरती समय, स्थानीय मंडल स्वयंसेवकों की रिपोर्ट और वास्तविक समय में भक्तों के इनपुट के आधार पर तय किया जाता है।'
        : language === 'mr'
        ? 'गर्दीची पातळी मागील वर्षांतील गर्दीचा अंदाज, आरतीच्या वेळा, स्थानिक मंडळ स्वयंसेवकांचे अहवाल आणि भाविकांच्या सूचनांवरून ठरवली जाते.'
        : 'Crowd indicators (Low, Medium, High Rush) are based on historical festival attendance patterns, peak aarti schedules, volunteer updates from mandals, and community reports.',
    },
    {
      q: language === 'hi'
        ? 'यदि कोई जानकारी या समय गलत हो तो मैं उसे कैसे रिपोर्ट करूँ?'
        : language === 'mr'
        ? 'काही माहिती किंवा वेळ चुकीची असल्यास तक्रार कशी करावी?'
        : 'How do I report incorrect info or timing changes?',
      a: language === 'hi'
        ? "किसी भी पंडाल के विस्तृत पृष्ठ पर 'समस्या की रिपोर्ट करें' बटन पर क्लिक करें या फूटर से संपर्क पृष्ठ पर जाएं। हमारी टीम तुरंत संशोधन करेगी।"
        : language === 'mr'
        ? "कोणत्याही मंडळाच्या तपशील पृष्ठावरील 'समस्येची तक्रार करा' बटणावर क्लिक करा किंवा संपर्क पृष्ठावरून त्वरित माहिती द्या."
        : "Open the pandal's detail card or page and click 'Report a Problem', or visit our Contact page. Our team promptly reviews and updates the details.",
    },
    {
      q: language === 'hi'
        ? 'क्या मुझे ऐप का उपयोग करने के लिए साइन अप या लॉगिन करने की आवश्यकता है?'
        : language === 'mr'
        ? 'अॅप वापरण्यासाठी मला साइन अप किंवा लॉगिन करावे लागेल का?'
        : 'Do I need to create an account or sign up?',
      a: language === 'hi'
        ? 'बिल्कुल नहीं! किसी खाते की आवश्यकता नहीं है। आप तुरंत पंडाल खोज सकते हैं, दर्शन योजना बना सकते हैं और पसंदीदा पंडाल अपने डिवाइस पर सहेज सकते हैं।'
        : language === 'mr'
        ? 'मुळीच नाही! कोणत्याही खात्याची गरज नाही. तुम्ही थेट मंडळे शोधू शकता आणि आवडीची मंडळे तुमच्या डिव्हाइसवर जतन करू शकता.'
        : 'No account or registration is required. You can immediately search pandals, view routes, and save favorites directly on your device.',
    },
    {
      q: language === 'hi'
        ? 'क्या यह ऐप ऑफ़लाइन या कमजोर नेटवर्क पर काम करता है?'
        : language === 'mr'
        ? 'हे अॅप ऑफलाइन किंवा कमी इंटरनेट असलेल्या भागात चालते का?'
        : 'Does this app work offline or with poor connectivity?',
      a: language === 'hi'
        ? 'हाँ! यह एक प्रोग्रेसिव वेब ऐप (PWA) है। एक बार लोड होने के बाद, आवश्यक पंडाल डेटा और कैश्ड मैप टाइल्स ऑफ़लाइन भी उपलब्ध रहते हैं।'
        : language === 'mr'
        ? 'होय! हे प्रोग्रेसिव्ह वेब अॅप (PWA) असून एकदा लोड झाल्यानंतर महत्त्वाचा डेटा ऑफलाइनही उपलब्ध राहतो.'
        : 'Yes! Ganesh Pandal Tracker is a Progressive Web App (PWA) with smart offline caching. Once loaded, essential pandal details and cached map tiles remain viewable even with intermittent connectivity.',
    },
  ];

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
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.footerFaq}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            {t.faqTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {t.faqSubtitle}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-sm sm:text-base text-stone-900 dark:text-white cursor-pointer hover:bg-stone-50/60 dark:hover:bg-stone-850 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-stone-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-600 dark:text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/80 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FaqPage;

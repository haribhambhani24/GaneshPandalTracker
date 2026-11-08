// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, ShieldAlert, Mail } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { siteConfig } from '../../config/site';
import { LanguageSwitcher } from '../../components/Header/LanguageSwitcher';
import { ThemeToggle } from '../../components/Header/ThemeToggle';
import { Footer } from '../../components/Footer/Footer';

interface TermSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();

  useEffect(() => {
    document.title = `${t.footerTermsOfUse} | ${t.appName}`;
    window.scrollTo(0, 0);
  }, [t]);

  // Multilingual Terms Content (English, Hindi, Marathi)
  const content: { [lang: string]: { subtitle: string; sections: TermSection[] } } = {
    en: {
      subtitle: 'Please read these terms carefully before using Ganesh Pandal Tracker.',
      sections: [
        {
          title: '1. Personal, Non-Commercial Use Only',
          paragraphs: [
            'Ganesh Pandal Tracker is provided solely for personal, devotional, and non-commercial informational use by Mumbai devotees and festival visitors.',
            'You may use this service to view pandal locations, darshan timings, aarti schedules, and get walking and driving directions. Any commercial exploitation, redistribution, sale, or sublicensing of our data, text, or interface is strictly forbidden.',
          ],
        },
        {
          title: '2. Anti-Scraping & Dataset Protection',
          paragraphs: [
            'Our pandal database and curated schedules are original proprietary compilations. To protect the service from misuse, the following actions are strictly prohibited:',
          ],
          bullets: [
            'Automated scraping, crawling, spidering, or harvesting of pandal records, coordinates, timings, or photos.',
            'Bulk downloading or extracting of the dataset for training artificial intelligence or machine learning models.',
            'Framing, mirroring, or displaying this site or its maps within another website or application without prior written permission.',
            'Re-publishing, bundling, or syndicating our compiled pandal listings on any other platform.',
          ],
        },
        {
          title: '3. Code, Design & Brand Protection',
          paragraphs: [
            'All software code, application architecture, map configurations, visual styles, icons, and interface designs are proprietary and protected under copyright law.',
            'You may not decompile, reverse engineer, disassemble, modify, copy, or create derivative works from any part of this application.',
            'The name "Ganesh Pandal Tracker" and associated logos are proprietary. You may not use them to imply affiliation, sponsorship, or endorsement.',
          ],
        },
        {
          title: '4. User Submissions & License to Display',
          paragraphs: [
            'When you submit a new pandal, update, or photograph through our Submit form:',
          ],
          bullets: [
            'You confirm that you own the photograph and content or have obtained explicit permission from the rights-holder to share it.',
            'You retain full copyright ownership of what you submit.',
            'By submitting, you grant Ganesh Pandal Tracker a perpetual, non-exclusive, worldwide, royalty-free license to host, display, format, and share the submission publicly for festival visitors.',
            'Submissions must not contain offensive, inaccurate, defamatory, or promotional commercial content. Volunteer administrators reserve the right to review, edit, reject, or remove any submission at their discretion.',
          ],
        },
        {
          title: '5. Contact for Takedowns & Permissions',
          paragraphs: [
            `If you believe any photograph, information, or material on this website infringes your rights, or if you wish to request written permission for non-standard use, please contact us immediately at: ${siteConfig.contact.email}.`,
            'We review all legitimate takedown notices and requests promptly and take appropriate corrective action.',
          ],
        },
      ],
    },
    hi: {
      subtitle: 'गणेश पंडाल ट्रैकर का उपयोग करने से पहले कृपया इन शर्तों को ध्यान से पढ़ें।',
      sections: [
        {
          title: '1. केवल व्यक्तिगत एवं गैर-व्यावसायिक उपयोग',
          paragraphs: [
            'गणेश पंडाल ट्रैकर केवल मुंबई के श्रद्धालुओं और उत्सव दर्शनार्थियों के व्यक्तिगत व गैर-व्यावसायिक उपयोग के लिए बनाया गया है।',
            'आप पंडालों के दर्शन समय, आरती समय, भीड़ की स्थिति और दिशा-निर्देश देखने के लिए इस सेवा का उपयोग कर सकते हैं। डेटा, पाठ या डिज़ाइन का किसी भी प्रकार का व्यावसायिक उपयोग या पुनर्विक्रय सख्त वर्जित है।',
          ],
        },
        {
          title: '2. डेटा सुरक्षा और स्क्रैपिंग निषेध',
          paragraphs: [
            'हमारा पंडाल डेटाबेस और तैयार की गई समय-सारणी मूल स्वामित्व वाली सामग्री है। इसके दुरुपयोग को रोकने के लिए निम्नलिखित गतिविधियां पूरी तरह प्रतिबंधित हैं:',
          ],
          bullets: [
            'स्क्रैपिंग, बॉट्स, स्पाइडर्स या स्वचालित टूल्स द्वारा पंडाल सूची, फोटो या समय का डेटा एकत्र करना।',
            'AI (कृत्रिम बुद्धिमत्ता) या मशीन लर्निंग मॉडल के प्रशिक्षण हेतु डेटासेट का थोक डाउनलोड।',
            'बिना पूर्व लिखित अनुमति के इस वेबसाइट या इसके नक्शों को किसी अन्य ऐप या साइट में फ्रेम (Framing) या मिरर करना।',
            'हमारी संकलित सूचियों को किसी अन्य माध्यम पर पुनः प्रकाशित करना।',
          ],
        },
        {
          title: '3. कोड, डिज़ाइन और ब्रांड सुरक्षा',
          paragraphs: [
            'वेबसाइट का संपूर्ण सॉफ़्टवेयर कोड, उपयोगकर्ता इंटरफ़ेस, डिज़ाइन और मैप लेआउट कॉपीराइट कानूनों द्वारा संरक्षित हैं।',
            'कोड को रिवर्स-इंजीनियर करना, कॉपी करना, बदलना या इससे नया उत्पाद बनाना प्रतिबंधित है।',
            'गणेश पंडाल ट्रैकर नाम और लोगो का अनधिकृत उपयोग किसी भी प्रकार के जुड़ाव या समर्थन को दर्शाने के लिए नहीं किया जा सकता।',
          ],
        },
        {
          title: '4. उपयोगकर्ता सबमिशन और प्रदर्शन अधिकार',
          paragraphs: [
            'जब आप हमारे सबमिट फॉर्म द्वारा कोई पंडाल या तस्वीर सबमिट करते हैं:',
          ],
          bullets: [
            'आप पुष्टि करते हैं कि तस्वीर और जानकारी के अधिकार आपके पास हैं या आपके पास इसे साझा करने की अनुमति है।',
            'आपके द्वारा भेजी गई सामग्री का मूल स्वामित्व आपका ही रहेगा।',
            'सबमिट करने पर आप गणेश पंडाल ट्रैकर को इस सामग्री को वेबसाइट पर प्रदर्शित करने का गैर-अनन्य (Non-exclusive), रॉयल्टी-मुक्त लाइसेंस प्रदान करते हैं।',
            'सबमिशन में भ्रामक, अनुचित या व्यावसायिक विज्ञापन सामग्री नहीं होनी चाहिए। प्रशासक किसी भी सबमिशन को अस्वीकार या संपादित करने का अधिकार रखते हैं।',
          ],
        },
        {
          title: '5. टेकडाउन और अनुमति संपर्क',
          paragraphs: [
            `यदि आपको लगता है कि किसी तस्वीर या सामग्री से आपके अधिकारों का उल्लंघन हुआ है, या आप विशेष अनुमति चाहते हैं, तो कृपया हमें ईमेल करें: ${siteConfig.contact.email}`,
            'हम सभी वैध अनुरोधों की त्वरित समीक्षा कर उचित कार्रवाई करते हैं।',
          ],
        },
      ],
    },
    mr: {
      subtitle: 'गणेश पंडाल ट्रॅकर वापरण्यापूर्वी कृपया या अटी काळजीपूर्वक वाचा.',
      sections: [
        {
          title: '१. केवळ वैयक्तिक आणि बिगर-व्यावसायिक वापर',
          paragraphs: [
            'गणेश पंडाल ट्रॅकर हे मुंबईतील भाविक आणि गणेशभक्तांसाठी केवळ वैयक्तिक आणि भक्तीभावाच्या माहितीसाठी उपलब्ध केले आहे.',
            'पंडालचे दर्शन, आरतीच्या वेळा आणि नकाशावरील मार्ग शोधण्यासाठी तुम्ही ही सेवा वापरू शकता. कोणत्याही व्यावसायिक हेतूने डेटा किंवा डिझाइनचा वापर किंवा पुनर्विक्री करण्यास सक्त मनाई आहे.',
          ],
        },
        {
          title: '२. डेटा सुरक्षितता आणि स्क्रॅपिंग बंदी',
          paragraphs: [
            'आमचा पंडाल डेटाबेस आणि मार्गदर्शक माहिती ही मूळ संकलित माहिती आहे. गैरवापर रोखण्यासाठी खालील गोष्टींवर पूर्णपणे बंदी आहे:',
          ],
          bullets: [
            'बॉट, स्क्रॅपर किंवा स्वयंचलित साधनांद्वारे पंडालची माहिती, फोटो किंवा पत्ते गोळा करणे (Scraping).',
            'AI किंवा इतर डेटा मॉडेल्ससाठी माहितीचे मोठ्या प्रमाणावर स्वयंचलित डाऊनलोड करणे.',
            'लेखी परवानगीशिवाय ही वेबसाईट किंवा तिचे नकाशे इतर कोणत्याही वेबसाईटवर फ्रेम किंवा मिरर करणे.',
            'आमची संकलित पंडाल यादी इतरत्र कोणत्याही स्वरूपात पुन्हा प्रकाशित करणे.',
          ],
        },
        {
          title: '३. कोड, डिझाईन आणि ब्रँड संरक्षण',
          paragraphs: [
            'वेबसाईटचा सर्व कोड, डिझाइन, इंटरफेस आणि नकाशे कॉपीराइट कायद्यांतर्गत संरक्षित आहेत.',
            'कोड रिव्हर्स-इंजिनिअर करणे, कॉपी करणे, बदलणे किंवा त्यावरून नवीन काम तयार करण्यास सक्त मनाई आहे.',
            '"Ganesh Pandal Tracker" हे नाव आणि लोगो यांचा अनधिकृत वापर करणे प्रतिबंधित आहे.',
          ],
        },
        {
          title: '४. युझर सबमिशन आणि प्रदर्शन परवाना',
          paragraphs: [
            'जेव्हा आपण नवीन पंडाल किंवा फोटो सबमिट करता:',
          ],
          bullets: [
            'आपण खात्री देता की सादर केलेली माहिती आणि फोटो वापरण्याचा आपल्याला पूर्ण अधिकार आहे.',
            'आपण सादर केलेल्या मूळ साहित्याची मालकी आपल्याकडेच राहते.',
            'सबमिट करून, आपण गणेश पंडाल ट्रॅकरला हे साहित्य संकेतस्थळावर भाविकांच्या दर्शनासाठी प्रदर्शित करण्याचा विनाशुल्क, गैर-अनन्य परवाना देता.',
            'कोणतीही खोटी, आक्षेपार्ह किंवा जाहिरातबाजी असलेली माहिती स्वीकारली जाणार नाही. प्रशासकांना सबमिशन नाकारण्याचा किंवा संपादित करण्याचा अधिकार आहे.',
          ],
        },
        {
          title: '५. संपर्क व आक्षेप निवारण',
          paragraphs: [
            `जर कोणत्याही फोटो किंवा माहितीमुळे आपल्या हक्कांचा भंग होत असल्याचे आढळल्यास, किंवा पुनर्वापराची परवानगी हवी असल्यास, कृपया आमच्याशी संपर्क साधा: ${siteConfig.contact.email}`,
            'आम्ही सर्व योग्य तक्रारींची तातडीने दखल घेऊन योग्य ती कारवाई करतो.',
          ],
        },
      ],
    },
  };

  const currentContent = content[language] || content.en;

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
            {currentContent.subtitle}
          </p>
          <p className="text-[11px] text-stone-400 dark:text-stone-500">
            {t.lastUpdated}: November 2026
          </p>
        </div>

        {/* Anti-Scraping & Legal Callout */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Proprietary Community Resource: </span>
            <span>
              All pandal information, photographs, routes, and designs are for personal visitor guidance only. Automated harvesting, crawling, or reproduction is strictly prohibited.
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {currentContent.sections.map((sec, idx) => (
            <section key={idx} className="space-y-2.5">
              <h2 className="font-bold text-base text-stone-900 dark:text-white">
                {sec.title}
              </h2>
              {sec.paragraphs.map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
              {sec.bullets && sec.bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600 dark:text-stone-300">
                  {sec.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Contact Box */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium">
              <Mail className="w-4 h-4 text-orange-600 shrink-0" />
              <span>Questions or Takedown Requests:</span>
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-orange-600 dark:text-amber-400 font-bold hover:underline"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;

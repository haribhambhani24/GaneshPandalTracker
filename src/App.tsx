import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './context/I18nContext';
import { ThemeProvider } from './context/ThemeContext';

// Lazy-load routes for maximum mobile performance and instant FCP app shell
const MapPage = lazy(() => import('./pages/MapPage'));
const PandalDetailPage = lazy(() => import('./pages/PandalDetailPage'));
const SubmitPandalPage = lazy(() => import('./pages/SubmitPandalPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AboutPage = lazy(() => import('./pages/static/AboutPage'));
const FaqPage = lazy(() => import('./pages/static/FaqPage'));
const PrivacyPage = lazy(() => import('./pages/static/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/static/TermsPage'));
const DisclaimerPage = lazy(() => import('./pages/static/DisclaimerPage'));
const ContactPage = lazy(() => import('./pages/static/ContactPage'));

const PageLoadingFallback: React.FC = () => (
  <main
    role="main"
    aria-label="Loading Ganesh Pandal Tracker"
    className="w-full min-h-[100vh] min-h-[100dvh] flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200"
  >
    <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-3" />
    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
      Loading Ganesh Pandal Tracker...
    </span>
  </main>
);

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<MapPage />} />
              <Route path="/navigate/:id" element={<MapPage />} />
              <Route path="/pandal/:id" element={<PandalDetailPage />} />
              <Route path="/submit" element={<SubmitPandalPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<AboutPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;

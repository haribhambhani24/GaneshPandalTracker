import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { I18nProvider } from './context/I18nContext';
import { ThemeProvider } from './context/ThemeContext';

// Lazy-load routes for maximum performance on slow mobile networks
const MapPage = lazy(() => import('./pages/MapPage'));
const PandalDetailPage = lazy(() => import('./pages/PandalDetailPage'));
const SubmitPandalPage = lazy(() => import('./pages/SubmitPandalPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const PageLoadingFallback: React.FC = () => (
  <div className="w-screen h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200">
    <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-3" />
    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
      Loading Pandal Map...
    </span>
  </div>
);

export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<MapPage />} />
              <Route path="/pandal/:id" element={<PandalDetailPage />} />
              <Route path="/submit" element={<SubmitPandalPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;

// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import './index.css';
import App from './App.tsx';
import { migrateStorageKeys } from './utils/storageMigration';

// Ensure global L is available before any leaflet plugin imports
if (typeof window !== 'undefined') {
  (window as unknown as { L: typeof L }).L = L;
}

// Run one-time localStorage key migration
migrateStorageKeys();

// Register Service Worker for PWA offline capabilities
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('Ganesh Pandal Tracker PWA Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('Ganesh Pandal Tracker Service Worker registration error:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

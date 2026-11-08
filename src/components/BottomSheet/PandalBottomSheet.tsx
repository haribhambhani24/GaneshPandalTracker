// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect } from 'react';
import type { Pandal } from '../../types/pandal';
import { PandalDetailCard } from '../PandalCard/PandalDetailCard';

interface PandalBottomSheetProps {
  pandal: Pandal | null;
  onClose: () => void;
  userDistanceKm?: number | null;
  onNavigateToPandal?: (pandal: Pandal) => void;
}

export const PandalBottomSheet: React.FC<PandalBottomSheetProps> = ({
  pandal,
  onClose,
  userDistanceKm,
  onNavigateToPandal,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pandal) return null;

  return (
    <>
      {/* Backdrop (visible on mobile, hidden on desktop so desktop map remains fully interactive) */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[1001] transition-opacity duration-300 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Bottom Sheet (Slide-up from bottom on < md) */}
      <div
        id="mobile-pandal-bottom-sheet"
        className="fixed inset-x-0 bottom-0 z-[1002] max-h-[85vh] max-h-[85dvh] pb-safe overscroll-contain flex flex-col md:hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Pull Handle / Drag bar */}
        <div className="mx-auto w-12 h-1.5 bg-white/70 rounded-full mb-2 shadow-sm pointer-events-none" />

        <div className="flex-1 overflow-hidden rounded-t-3xl shadow-2xl bg-white dark:bg-stone-900 border-t border-amber-300/30">
          <PandalDetailCard
            pandal={pandal}
            onClose={onClose}
            userDistanceKm={userDistanceKm}
            onNavigateToPandal={onNavigateToPandal}
          />
        </div>
      </div>

      {/* Desktop Floating Side Drawer / Card (Slide-in from right on >= md) */}
      <div
        id="desktop-pandal-card"
        className="hidden md:flex fixed top-20 right-6 bottom-6 z-[1002] w-96 lg:w-[420px] flex-col animate-in slide-in-from-right duration-300 pointer-events-auto"
      >
        <div className="h-full rounded-2xl shadow-2xl overflow-hidden border border-amber-300/40 bg-white dark:bg-stone-900 ring-1 ring-black/10">
          <PandalDetailCard
            pandal={pandal}
            onClose={onClose}
            userDistanceKm={userDistanceKm}
            onNavigateToPandal={onNavigateToPandal}
          />
        </div>
      </div>
    </>
  );
};

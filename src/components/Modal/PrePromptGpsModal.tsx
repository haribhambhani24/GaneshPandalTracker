// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React from 'react';
import { Locate, ShieldCheck, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface PrePromptGpsModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PrePromptGpsModal: React.FC<PrePromptGpsModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      id="pre-prompt-gps-modal"
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-amber-300/40 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-center">
        <button
          onClick={onCancel}
          aria-label={t.close || 'Close'}
          title={t.close || 'Close'}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mx-auto w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 shadow-inner">
          <Locate className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-base font-bold text-stone-900 dark:text-white mb-2">
          {t.prePromptGpsTitle}
        </h3>
        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-5">
          {t.prePromptGpsDesc}
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-500 text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Locate className="w-4 h-4" />
            <span>{t.continueGps}</span>
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {t.cancel}
          </button>
        </div>

        <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Private • No tracking or storage</span>
        </p>
      </div>
    </div>
  );
};


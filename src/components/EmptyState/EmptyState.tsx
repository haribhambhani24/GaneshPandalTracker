import React from 'react';
import { FilterX, Plus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../context/I18nContext';

interface EmptyStateProps {
  onClearFilters: () => void;
  searchQuery?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters, searchQuery }) => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl border border-amber-200/60 dark:border-amber-900/40 shadow-xl max-w-md mx-auto my-8">
      {/* Icon / Emblem */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border-2 border-amber-400/50 flex items-center justify-center mb-4 shadow-inner">
        <span className="text-3xl sm:text-4xl">🕉️</span>
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
        {t.noPandalsFound}
      </h3>

      <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-xs leading-relaxed">
        {searchQuery ? (
          <>
            No pandals match <span className="font-semibold text-orange-600 dark:text-orange-400">"{searchQuery}"</span> or your current filter settings.
          </>
        ) : (
          'No pandals match your active filter combination. Try loosening your criteria or resetting filters.'
        )}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5 w-full">
        <button
          onClick={onClearFilters}
          className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all cursor-pointer active:scale-98"
        >
          <FilterX className="w-4 h-4" />
          <span>{t.clearAllFilters}</span>
        </button>

        <Link
          to="/submit"
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-200 font-semibold text-xs sm:text-sm border border-amber-300/70 dark:border-amber-800/60 transition-all"
        >
          <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>Submit Pandal</span>
        </Link>
      </div>

      <div className="flex items-center gap-1.5 mt-4 text-[11px] text-amber-700/80 dark:text-amber-400/80">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Know a pandal we missed? Help devotees by adding it!</span>
      </div>
    </div>
  );
};


import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'header' | 'nav';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useI18n();

  const baseStyles =
    variant === 'header'
      ? 'p-1.5 sm:p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-amber-100 hover:text-white border border-white/20 transition-all cursor-pointer flex items-center justify-center shadow-xs'
      : 'p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 border border-stone-200 dark:border-stone-700 transition-all cursor-pointer flex items-center justify-center shadow-xs';

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      title={isDark ? t.lightMode : t.darkMode}
      aria-label={isDark ? t.lightMode : t.darkMode}
      className={`${baseStyles} ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300" />
      ) : (
        <Moon className="w-4 h-4 text-stone-700 dark:text-stone-200" />
      )}
    </button>
  );
};

export default ThemeToggle;


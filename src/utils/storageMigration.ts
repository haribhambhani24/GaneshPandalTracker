// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

/**
 * LocalStorage Migration Utility
 * Migrates legacy 'pandal_map_*' keys to 'ganesh_pandal_tracker_*'
 * so user choices (theme, language, saved pandals, etc.) are seamlessly preserved.
 */

const KEY_MAPPINGS: Record<string, string> = {
  pandal_map_theme: 'ganesh_pandal_tracker_theme',
  pandal_map_lang: 'ganesh_pandal_tracker_lang',
  pandal_map_saved: 'ganesh_pandal_tracker_saved',
  pandal_map_visited: 'ganesh_pandal_tracker_visited',
  pandal_map_banner_collapsed: 'ganesh_pandal_tracker_banner_collapsed',
  pandal_map_offline_pandals: 'ganesh_pandal_tracker_offline_pandals',
};

export function migrateStorageKeys(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;

    Object.entries(KEY_MAPPINGS).forEach(([oldKey, newKey]) => {
      const existingNew = localStorage.getItem(newKey);
      const oldVal = localStorage.getItem(oldKey);

      // If old value exists and new key isn't set, migrate
      if (oldVal !== null && existingNew === null) {
        localStorage.setItem(newKey, oldVal);
      }
    });
  } catch (err) {
    console.warn('Storage migration failed or storage disabled:', err);
  }
}


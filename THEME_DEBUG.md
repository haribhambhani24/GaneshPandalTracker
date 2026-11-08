# Root Cause Analysis: Light Theme Failure in Ganesh Pandal Tracker

**Date**: 2026-11-08  
**Status**: Investigated & Root Causes Identified

---

## Executive Summary

The light theme appeared "broken" with black/dark surfaces remaining visible even when Light Mode was selected. The primary failure is a fundamental architectural mismatch introduced in Tailwind CSS v4: **by default, Tailwind v4 compiles all `dark:` utility variants into an `@media (prefers-color-scheme: dark)` media query rather than scoping them to a `.dark` CSS class**.

Consequently, whenever a user (or test environment) has an OS or browser preferring dark mode, **all `dark:` classes (`dark:bg-stone-900`, `dark:text-stone-100`, etc.) were evaluated as active by the browser engine**, completely bypassing and ignoring the `<html>` element's class (`<html class="light">`) or attribute (`data-theme="light"`).

In addition, several UI components (`Navbar`, `FestivalCountdownBanner`, `AdminPage` header, toast snackbars) used hardcoded dark gradient backgrounds with pure white text in light mode, violating the requirement that in Light Theme surfaces must be white or light grey with dark text.

---

## Detailed Findings by Audit Checklist

### 1. How the Theme Toggle Works
- **DOM Mutation**: `ThemeContext.tsx` toggles `.dark` on `document.documentElement` (`root.classList.add('dark')` / `root.classList.remove('dark')`), sets `data-theme="light"|"dark"`, and updates `root.style.colorScheme = "light"|"dark"`.
- **Pre-paint Script**: `index.html` runs an inline IIFE before render that reads `localStorage` and sets the class/attribute on `<html>` before first paint.
- **Why It Failed**: While the DOM changed correctly, **Tailwind CSS v4's compiled CSS did not have selector rules targeting `.dark`**; it had `@media (prefers-color-scheme: dark) { ... }`.

### 2. The Tailwind Configuration (Critical Root Cause)
- **Tailwind v4 CSS-First Paradigm**: In Tailwind v4, `tailwind.config.js` with `darkMode: 'class'` is no longer used.
- **Missing Directive**: Tailwind v4 defaults to `media` mode. To enable class-based dark mode, `src/index.css` **must declare**:
  ```css
  @import "tailwindcss";
  @custom-variant dark (&:where(.dark, .dark *));
  ```
- **Evidence**: Inspection of `dist/assets/index-Bqn_3EOp.css` showed:
  ```css
  @media (prefers-color-scheme:dark) {
    :where(.dark\:divide-stone-700>:not(:last-child)){ ... }
    .dark\:bg-stone-900 { ... }
    ...
  }
  ```
  Every user whose system was set to dark mode had every `dark:` rule forced on them in light mode.

### 3. CSS Variables & Hardcoded Dark Components
- While CSS variables were defined in `:root` and `html.dark` in `src/index.css`:
  - **`Navbar.tsx`**: Used `bg-gradient-to-r from-orange-600 via-amber-600 to-red-700 text-white` in light mode. Light mode requires a clean light surface (`bg-white` or light grey) with dark text (`#111827`).
  - **`FestivalCountdownBanner.tsx`**: Used `bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white` in light mode instead of a light surface with dark text and no dark gradient.
  - **`AdminPage.tsx`**: Used dark orange-red gradient headers with white text in light mode.
  - **`PhotoManagerModal.tsx`**: Undo toast used `bg-stone-900 text-white`.
  - **Map Overlays**: Overlays on top of non-photo UI lacked proper light-mode counterparts.

### 4. CSS Order, Specificity & Leaflet
- **Map Tiles**: Leaflet tiles in `LeafletMap.tsx` and `LocationPickerMap.tsx` lacked the dark-mode CSS filter in `html.dark .leaflet-tile-pane`, and in light mode required clean, uninhibited standard light tiles.
- **Popups & Controls**: Zoom controls had styling, but needed explicit variable token binding for both light and dark modes.

### 5. Persistence & Storage Keys
- `localStorage` stored `ganesh_pandal_tracker_theme` and migrated `pandal_map_theme`.
- The storage logic worked correctly, but when default was unset, OS preference defaulted to dark. Once switched to light, the Tailwind media bug masked the stored setting.

### 6. PWA Caching
- `public/sw.js` cached static assets under `ganesh-pandal-tracker-shell-v3`.
- Bumping to `v4` and ensuring immediate client claiming ensures users get updated CSS instantly without stale cache issues.

---

## Action Plan to Fix Properly

1. **Fix Tailwind v4 Variant**: Add `@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));` immediately after `@import "tailwindcss";` in `src/index.css`.
2. **Standardize CSS Variable Tokens**: Define all standard semantic tokens on `:root` and `html.dark` (background, surface, surface-raised, border, text, text-muted, primary, primary-contrast, error, success, warning, overlay).
3. **Convert Header & Festival Banner in Light Mode**:
   - Header: Light surface (`bg-white dark:bg-stone-900`), dark primary text (`#111827` / `text-stone-900 dark:text-stone-100`), subtle border.
   - Banner: Light warm surface (`bg-amber-50 dark:bg-stone-900`), dark text (`text-stone-900 dark:text-amber-200`), no dark gradient in light theme.
4. **Audit and Update All Surfaces**:
   - Filter chips & buttons: Pure white background in light theme with dark stone-800 text.
   - Search bar & suggestions: Pure white background in light theme with dark text and light divider borders.
   - Pandal cards & detail card: White surfaces, light borders.
   - Bottom sheet: White background with dark text in light theme.
   - Admin portal: White tables/cards, light header, dark text.
   - Photo Manager: White modal body, light dropzone, dark text.
5. **Leaflet Tiles**:
   - Light theme: Standard OSM tiles (`filter: none`).
   - Dark theme: Dark tile filter on `.leaflet-tile-pane`.
6. **Automated Verification Script**:
   - Create `/verification/verify-theme.cjs` with Puppeteer.
   - Scan every visible element on every route at 390px and 1280px in light theme: check luminance $\ge 0.2$ and contrast ratio $\ge 4.5:1$.
   - Save before and after screenshots into `/verification/theme/`.


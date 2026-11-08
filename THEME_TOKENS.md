# Ganesh Pandal Tracker — Theme Design Tokens

This document outlines the standardized, unified design token architecture for Light and Dark themes across the entire "Ganesh Pandal Tracker" application.

---

## 1. Core Semantic Tokens

| Token Name | Light Theme Value | Dark Theme Value | Tailwind Utility Equivalent | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `background` | `#FFFFFF` / `#F8FAFC` | `#0C0A09` / `#121417` | `bg-white dark:bg-stone-950` | Main canvas / page backdrop |
| `surface` | `#FFFFFF` | `#1C1917` | `bg-white dark:bg-stone-900` | Cards, panels, bottom sheets, modals, inputs, dropdowns, tables |
| `surface-raised` | `#F9FAFB` | `#292524` | `bg-stone-50 dark:bg-stone-800` | Secondary wells, hover states, table rows, headers |
| `border` | `#E5E7EB` (subtle grey) | `#292524` / `#383431` | `border-stone-200 dark:border-stone-800` | 1px clean dividers and control outlines |
| `border-strong` | `#D1D5DB` | `#44403C` | `border-stone-300 dark:border-stone-700` | Interactive control borders, focus rings |
| `text` | `#111827` (near-black) | `#F5F5F4` (soft white) | `text-stone-900 dark:text-stone-100` | Headings, primary labels, table data |
| `text-muted` | `#4B5563` (mid-grey) | `#A8A29E` (stone-400) | `text-stone-600 dark:text-stone-400` | Secondary descriptions, timestamps, metadata |
| `primary` | `#EA580C` (saffron orange) | `#F97316` (vibrant orange) | `text-orange-600 dark:text-orange-400` | Brand accents, key actions, icons |
| `primary-surface`| `#FFF7ED` (orange-50) | `#431407` (orange-950/70) | `bg-orange-50 dark:bg-orange-950/70` | Active filter pill background, highlight tint |
| `primary-contrast`| `#9A3412` (dark saffron) | `#FFEDD5` (orange-100) | `text-orange-900 dark:text-orange-200` | Active filter pill text and border in Light theme |
| `overlay-scrim` | `rgba(0,0,0,0.45)` | `rgba(0,0,0,0.75)` | `bg-black/45 dark:bg-black/75` | Modal backdrop scrims, drawer dimming |
| `photo-scrim` | `rgba(0,0,0,0.70)` | `rgba(0,0,0,0.85)` | `from-black/80 via-black/30 to-transparent` | Text contrast protection on top of pandal photos |

---

## 2. Status & State Tokens (WCAG AA Compliant $\ge$ 4.5:1)

| Status | Meaning | Light Theme (Surface + Border + Text) | Dark Theme (Surface + Border + Text) |
| :--- | :--- | :--- | :--- |
| **Success** | Open now, Low Rush, Eco-friendly, Verified | `bg-emerald-50 border-emerald-200 text-emerald-800` | `dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300` |
| **Warning** | Medium Rush, Closing Soon, Saved Darshan | `bg-amber-50 border-amber-200 text-amber-800` | `dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300` |
| **Danger** | High Rush, Closed, Rejected, Delete | `bg-red-50 border-red-200 text-red-800` | `dark:bg-red-950/60 dark:border-red-800 dark:text-red-300` |
| **Info / Trail**| Walking Tour, Station Info, Area Badge | `bg-sky-50 border-sky-200 text-sky-800` | `dark:bg-sky-950/60 dark:border-sky-800 dark:text-sky-300` |

---

## 3. Component-Specific Theme Rules

### A. Header & Navbar
- **Light Theme**: Clean crisp white surface (`bg-white/95 backdrop-blur-md text-stone-900 border-b border-stone-200 shadow-xs`). No dark red/orange gradient. Brand emblem uses soft amber/saffron accent. Search input has `bg-stone-50 border-stone-200 text-stone-900` with subtle focus ring.
- **Dark Theme**: Rich dark stone surface (`dark:bg-stone-900/95 dark:text-stone-100 dark:border-stone-800 shadow-md`).

### B. Festival Countdown Banner
- **Light Theme**: Soft warm brand tint (`bg-orange-50/90 text-stone-800 border-b border-orange-200/80 shadow-xs`). Countdown numbers and labels use high-contrast dark saffron text (`text-orange-950` and `text-stone-700`).
- **Dark Theme**: Deep stone surface (`dark:bg-stone-900 dark:text-stone-200 dark:border-stone-800`).

### C. Filter & Action Bar
- **Unselected Controls**:
  - Light: `bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300`
  - Dark: `dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700 dark:hover:bg-stone-750`
- **Selected / Active Controls**:
  - Light: Light-tinted brand background (`bg-orange-50`), crisp brand border (`border-orange-600`), high-contrast dark brand text (`text-orange-900 font-bold`).
  - Dark: Solid brand orange (`dark:bg-orange-600 dark:text-white dark:border-orange-600 font-bold`).
  - Identical uniform behavior across all 8 desktop buttons and mobile pills.

### D. Map Tiles & Controls (Leaflet)
- **Light Theme**: CartoDB Positron / OpenStreetMap standard daylight tiles (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png` or OSM) with light zoom controls (`bg-white border-stone-200 text-stone-800`).
- **Dark Theme**: CartoDB Dark Matter tiles (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`) with dark zoom controls (`dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100`).
- Applied identically to both main map (`LeafletMap.tsx`) and submit page picker (`LocationPickerMap.tsx`).

### E. Cards, Modals, Bottom Sheets & Tables
- **Light Theme**:
  - Sheet/Modal surface: Pure white `#FFFFFF` with 1px border `#E5E7EB`.
  - Admin tables: White table background, subtle light stone header (`bg-stone-50`), alternating rows (`hover:bg-stone-50/80`), dark text `#111827`.
  - Photo titles: Protected by clean gradient overlay (`from-black/80 via-black/30 to-transparent`) so white pandal titles remain crisp and readable over photo imagery in both themes.
- **Dark Theme**:
  - Deep stone `#1C1917` surface with `#292524` borders and `#F5F5F4` text.


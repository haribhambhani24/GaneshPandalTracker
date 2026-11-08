# Pre-Deployment Cleanup Plan (Part 1 of 6)

**Target**: Prepare "Ganesh Pandal Tracker" for production deployment on Vercel.  
**Branch**: `deploy-prep` (backed up at tag `pre-deploy-cleanup` and branch `backup/pre-deploy-cleanup`).  
**Safety Guarantees**:
- ZERO breaking changes to UI, design, themes, i18n, search bar, header, filter bar, or in-app navigation.
- All code and files tagged `GALLERY-DISABLED` (carousel, lightbox, admin gallery grid, caption modals) and `GALLERY_DISABLED.md` are strictly preserved so the gallery can be re-enabled later.
- All cover photos on cards, search results, "My Darshan", map popups, and the detail page hero header remain active.
- SQL files and audit documentation are moved to `private-docs/` rather than deleted.
- `.env`, `package-lock.json`, and all build/type configs remain intact.
- No files are deleted or moved until explicit user approval in Part 2.

---

## 1. KEEP (In Use)

These files are actively imported, referenced by the app shell, HTML entry, PWA service worker, or required for building and running the production application on Vercel.

| Path | Size | Tracked in Git | Reason / Usage |
| :--- | :--- | :--- | :--- |
| `index.html` | 3,541 B | Tracked | Main web entry point; includes PWA manifest, font preconnects, inline theme script |
| `package.json` | 888 B | Tracked | Project configuration, scripts, dependencies |
| `package-lock.json` | 88,342 B | Tracked | Deterministic dependency lockfile |
| `vite.config.ts` | 669 B | Tracked | Vite bundler config with React and Tailwind v4 plugins |
| `tsconfig.json` | 119 B | Tracked | Root TypeScript project reference config |
| `tsconfig.app.json` | 655 B | Tracked | Application TypeScript compiler options |
| `tsconfig.node.json` | 558 B | Tracked | Node / Vite tooling TypeScript options |
| `.oxlintrc.json` | 245 B | Tracked | Oxlint linter rules config |
| `vercel.json` | 97 B | Tracked | Vercel deployment configuration (SPA route rewrites) |
| `.gitignore` | 431 B | Tracked | Git exclusion rules (needs update to track `!public/*.png`) |
| `.env.example` | 45 B | Tracked | Safe template for public environment variables |
| `.env` | 129 B | Ignored | Local development credentials (never committed) |
| `README.md` | 7,829 B | Tracked | Public repository guide and technical documentation |
| `public/favicon.svg` | 309 B | Tracked | Browser tab icon |
| `public/icons.svg` | 5,031 B | Tracked | SVG sprite icon library |
| `public/manifest.webmanifest` | 969 B | Tracked | Web App Manifest for PWA installation |
| `public/robots.txt` | 78 B | Tracked | Search crawler indexing instructions |
| `public/sitemap.xml` | 1,197 B | Tracked | XML sitemap for SEO |
| `public/sw.js` | 3,588 B | Tracked | Progressive Web App Service Worker with offline caching |
| `public/apple-touch-icon.png` | 4,105 B | Ignored (*.png) | Apple iOS home screen PWA icon (referenced in `index.html` & `sw.js`) |
| `public/icon-192.png` | 4,366 B | Ignored (*.png) | Android standard 192x192 PWA icon (referenced in `manifest.webmanifest` & `sw.js`) |
| `public/icon-512.png` | 12,732 B | Ignored (*.png) | Android standard 512x512 PWA icon (referenced in `manifest.webmanifest` & `sw.js`) |
| `public/icon-maskable-192.png` | 2,521 B | Ignored (*.png) | Android adaptive maskable icon 192x192 |
| `public/icon-maskable-512.png` | 7,632 B | Ignored (*.png) | Android adaptive maskable icon 512x512 |
| `src/main.tsx` | 961 B | Tracked | React DOM mount entry, SW registration, key migration |
| `src/App.tsx` | 2,246 B | Tracked | Route definitions & code-split lazy routes |
| `src/index.css` | 4,874 B | Tracked | Core styling, Tailwind v4 theme variables, Leaflet overrides |
| `src/config/site.ts` | 1,939 B | Tracked | Site-wide metadata, social links, attribution config |
| `src/context/I18nContext.tsx` | 3,369 B | Tracked | Multilingual context provider (en, hi, mr) |
| `src/context/ThemeContext.tsx` | 3,371 B | Tracked | Single source of truth dark/light theme provider |
| `src/i18n/index.ts` | 48,154 B | Tracked | Complete translations dictionary for English, Hindi, Marathi |
| `src/lib/supabase.ts` | 1,079 B | Tracked | Safe client-side Supabase client initialization |
| `src/components/Admin/PhotoManagerModal.tsx` | 37,975 B | Tracked | Admin cover photo manager (contains GALLERY-DISABLED gallery blocks) |
| `src/components/Banner/FestivalCountdownBanner.tsx` | 7,522 B | Tracked | Live festival countdown banner component |
| `src/components/BottomSheet/PandalBottomSheet.tsx` | 2,584 B | Tracked | Mobile slide-up preview bottom sheet container |
| `src/components/Circuits/ActiveCircuitBanner.tsx` | 3,097 B | Tracked | Active walking trail banner indicator |
| `src/components/Circuits/CircuitsModal.tsx` | 8,969 B | Tracked | Curated walking circuits tour selector modal |
| `src/components/Controls/MapControls.tsx` | 4,028 B | Tracked | Recenter, near-me GPS, and zoom map control buttons |
| `src/components/EmptyState/EmptyState.tsx` | 1,847 B | Tracked | Search & filter empty results placeholder |
| `src/components/Filters/FilterChips.tsx` | 22,236 B | Tracked | Desktop single-line filter bar & mobile filter chips |
| `src/components/Footer/AboutBottomSheet.tsx` | 7,163 B | Tracked | Mobile slide-up about sheet (contains GALLERY-DISABLED notice) |
| `src/components/Footer/Footer.tsx` | 15,310 B | Tracked | Universal footer component (contains GALLERY-DISABLED notice) |
| `src/components/Header/LanguageSwitcher.tsx` | 3,365 B | Tracked | Language selector dropdown |
| `src/components/Header/Navbar.tsx` | 5,502 B | Tracked | Header bar with brand gradient and search bar integration |
| `src/components/Header/ThemeToggle.tsx` | 2,059 B | Tracked | Theme switcher toggle |
| `src/components/ListView/PandalListView.tsx` | 6,366 B | Tracked | Scrollable card list view component |
| `src/components/Map/LeafletMap.tsx` | 22,506 B | Tracked | Interactive Leaflet map, two-layer route polylines, markers |
| `src/components/Map/LocationPickerMap.tsx` | 5,225 B | Tracked | Mini draggable pin map for Submit form |
| `src/components/Map/ganeshaMarker.ts` | 5,178 B | Tracked | Custom SVG Ganesha marker creator |
| `src/components/Modal/LocationDeniedModal.tsx` | 3,468 B | Tracked | Helpful fallback modal when GPS permission denied |
| `src/components/Modal/MobileFiltersModal.tsx` | 10,757 B | Tracked | Full-screen mobile filter drawer |
| `src/components/Modal/PrePromptGpsModal.tsx` | 3,089 B | Tracked | Permission explanation dialog before browser GPS prompt |
| `src/components/Modal/ReportProblemModal.tsx` | 12,056 B | Tracked | Crowdsourced issue reporting modal |
| `src/components/MyDarshan/MyDarshanModal.tsx` | 15,082 B | Tracked | Saved / visited bookmarks and multi-stop route generator |
| `src/components/Navigation/NavigationBottomSheet.tsx` | 11,883 B | Tracked | Mobile in-app navigation bottom sheet with turn maneuvers |
| `src/components/Navigation/NavigationPanel.tsx` | 13,875 B | Tracked | Desktop in-app navigation left drawer |
| `src/components/Navigation/StartPointModal.tsx` | 6,864 B | Tracked | Origin selector (GPS, map pick, station, pandal) |
| `src/components/PandalCard/PandalDetailCard.tsx` | 19,418 B | Tracked | Interactive pandal preview card |
| `src/components/Search/SearchBarWithSuggestions.tsx` | 9,933 B | Tracked | Instant search bar with dropdown suggestions |
| `src/hooks/useMyDarshan.ts` | 4,008 B | Tracked | Saved list & visited state management hook |
| `src/hooks/usePandals.ts` | 4,213 B | Tracked | Live pandals fetching and distance calculation hook |
| `src/hooks/useUserLocation.ts` | 4,874 B | Tracked | Browser geolocation tracking hook |
| `src/pages/AdminPage.tsx` | 41,535 B | Tracked | Admin moderation dashboard (approve, reject, edit, cover photo) |
| `src/pages/MapPage.tsx` | 40,713 B | Tracked | Main home map page orchestrating navigation, list, and filters |
| `src/pages/NotFoundPage.tsx` | 3,007 B | Tracked | 404 page |
| `src/pages/PandalDetailPage.tsx` | 36,441 B | Tracked | Dedicated pandal detail page (contains GALLERY-DISABLED blocks) |
| `src/pages/SubmitPandalPage.tsx` | 31,525 B | Tracked | Public pandal contribution form |
| `src/pages/static/AboutPage.tsx` | 5,984 B | Tracked | Static About page |
| `src/pages/static/ContactPage.tsx` | 7,654 B | Tracked | Static Contact page |
| `src/pages/static/DisclaimerPage.tsx` | 4,960 B | Tracked | Static Disclaimer page |
| `src/pages/static/FaqPage.tsx` | 10,767 B | Tracked | Static FAQ accordion page |
| `src/pages/static/PrivacyPage.tsx` | 6,692 B | Tracked | Static Privacy Policy page |
| `src/pages/static/TermsPage.tsx` | 4,514 B | Tracked | Static Terms of Service page |
| `src/services/circuitService.ts` | 1,029 B | Tracked | Walking trails service |
| `src/services/pandalService.ts` | 13,913 B | Tracked | Supabase & local seed pandals query service |
| `src/services/photoService.ts` | 18,349 B | Tracked | Photo service (contains GALLERY-DISABLED method annotations) |
| `src/services/routing.ts` | 13,293 B | Tracked | OSRM routing engine with caching and offline fallback |
| `src/types/circuit.ts` | 495 B | Tracked | Circuit and itinerary TypeScript interfaces |
| `src/types/pandal.ts` | 3,822 B | Tracked | Pandal, filter, and review TypeScript interfaces |
| `src/data/circuits.json` | 5,479 B | Tracked | 3 curated Mumbai walking trail circuits |
| `src/data/pandals.json` | 16,610 B | Tracked | 15 verified Mumbai seed pandals |
| `src/utils/geoUtils.ts` | 4,929 B | Tracked | Distance calculation & in-app navigation URL generator |
| `src/utils/imageProcessor.ts` | 4,775 B | Tracked | Canvas-based image compression & thumbnail generator |
| `src/utils/navigationUtils.ts` | 5,595 B | Tracked | Localized turn-by-turn maneuver formatters |
| `src/utils/searchUtils.ts` | 4,495 B | Tracked | Multi-criteria fuzzy search utility |
| `src/utils/storageMigration.ts` | 1,777 B | Tracked | LocalStorage schema backward compatibility migration |
| `src/utils/timingsUtils.ts` | 4,007 B | Tracked | Real-time Aarti & open/closed status calculator |

---

## 2. MOVE to `private-docs/`

These files contain SQL database migrations, database security audits, and internal development audit reports. They are NOT required for the Vite client-side bundle and must NOT be publicly exposed in the repository root, but they must be preserved for admin reference.

| Current Path | Size | Tracked in Git | Destination in `private-docs/` | Reason |
| :--- | :--- | :--- | :--- | :--- |
| `GALLERY_DISABLED.md` | 5,973 B | Tracked | `private-docs/GALLERY_DISABLED.md` | Critical re-enable guide for restoring gallery feature |
| `GALLERY_DISABLE.sql` | 3,446 B | Tracked | `private-docs/sql/GALLERY_DISABLE.sql` | RLS restriction script for disabling gallery |
| `GALLERY_ENABLE.sql` | 2,929 B | Tracked | `private-docs/sql/GALLERY_ENABLE.sql` | RLS restoration script for re-enabling gallery |
| `supabase_reports_setup.sql` | 2,769 B | Tracked | `private-docs/sql/supabase_reports_setup.sql` | Supabase reports table setup script |
| `supabase_security_audit.sql` | 4,055 B | Tracked | `private-docs/sql/supabase_security_audit.sql` | Supabase RLS security audit script |
| `supabase_setup.sql` | 22,082 B | Tracked | `private-docs/sql/supabase_setup.sql` | Core database schema and seed SQL |
| `supabase/migrations/20261108_pandal_photos.sql` | 10,757 B | Tracked | `private-docs/sql/20261108_pandal_photos.sql` | Photo & gallery DB migration script |
| `BUG_REPORT.md` | 16,618 B | Tracked | `private-docs/BUG_REPORT.md` | Historical QA bug report |
| `DESIGN_AUDIT.md` | 10,690 B | Tracked | `private-docs/DESIGN_AUDIT.md` | Historical design audit |
| `THEME_DEBUG.md` | 6,023 B | Tracked | `private-docs/THEME_DEBUG.md` | Dark/light theme troubleshooting log |
| `THEME_TOKENS.md` | 6,629 B | Tracked | `private-docs/THEME_TOKENS.md` | Theme token specifications |
| `UX_AUDIT.md` | 10,728 B | Tracked | `private-docs/UX_AUDIT.md` | Historical UX audit report |
| `VERIFY_COORDINATES.md` | 2,812 B | Tracked | `private-docs/VERIFY_COORDINATES.md` | Historical geo-coordinate verification audit |

### Planned Git Commands for MOVE:
```bash
mkdir -p private-docs/sql
git mv GALLERY_DISABLED.md private-docs/GALLERY_DISABLED.md
git mv GALLERY_DISABLE.sql private-docs/sql/GALLERY_DISABLE.sql
git mv GALLERY_ENABLE.sql private-docs/sql/GALLERY_ENABLE.sql
git mv supabase_reports_setup.sql private-docs/sql/supabase_reports_setup.sql
git mv supabase_security_audit.sql private-docs/sql/supabase_security_audit.sql
git mv supabase_setup.sql private-docs/sql/supabase_setup.sql
git mv supabase/migrations/20261108_pandal_photos.sql private-docs/sql/20261108_pandal_photos.sql
rmdir supabase/migrations supabase
git mv BUG_REPORT.md private-docs/BUG_REPORT.md
git mv DESIGN_AUDIT.md private-docs/DESIGN_AUDIT.md
git mv THEME_DEBUG.md private-docs/THEME_DEBUG.md
git mv THEME_TOKENS.md private-docs/THEME_TOKENS.md
git mv UX_AUDIT.md private-docs/UX_AUDIT.md
git mv VERIFY_COORDINATES.md private-docs/VERIFY_COORDINATES.md
```

---

## 3. DELETE (Unused or Junk)

These files are completely unused in the code graph, boilerplate remnants from initial Vite scaffolding, or temporary local testing/screenshot artifacts.

| Path | Size | Tracked in Git | Reason for Deletion |
| :--- | :--- | :--- | :--- |
| `src/App.css` | 3,124 B | Tracked | Unused Vite boilerplate CSS (`.counter`, `.hero`, `.vite`); not imported anywhere |
| `src/assets/react.svg` | 4,127 B | Tracked | Unused default React starter logo |
| `src/assets/vite.svg` | 1,497 B | Tracked | Unused default Vite starter logo |
| `src/assets/hero.png` | 1,739 B | Ignored (*.png) | Unused placeholder image; not imported anywhere |
| `src/hooks/useMediaQuery.ts` | 668 B | Tracked | Unused hook; all responsive design handled via Tailwind CSS classes |
| `src/types/visarjan.ts` | 425 B | Tracked | Unused interface (`VisarjanSite`); not imported anywhere |
| `src/data/visarjanSites.json` | 6,864 B | Tracked | Unused standalone dataset; not imported anywhere in the app |
| `verification/analyze_lh.cjs` | 1,772 B | Tracked | Outdated local test script |
| `verification/capture_before_redesign.cjs` | 2,752 B | Tracked | Outdated local test script |
| `verification/debug_preview.cjs` | 1,228 B | Tracked | Outdated local debug script |
| `verification/generate_icons.cjs` | 4,778 B | Tracked | One-off icon generator script (icons already saved in `public/`) |
| `verification/run_lighthouse.cjs` | 2,425 B | Tracked | Outdated local lighthouse script |
| `verification/verify_filter_bar.cjs` | 6,297 B | Tracked | Outdated local verification script |
| `verification/verify_part3_comprehensive.cjs` | 9,997 B | Tracked | Outdated local verification script |
| `verification/verify_preview.cjs` | 3,365 B | Tracked | Outdated local verification script |
| `verification/verify_ux_improvements.cjs` | 8,247 B | Tracked | Outdated local verification script |
| `verification/verify_zoom_controls.cjs` | 6,104 B | Tracked | Outdated local verification script |
| `verification/lighthouse/before.json` | 510,504 B | Tracked | Outdated local performance dump |
| `verification/lighthouse/after_intermediate.json` | 509,985 B | Tracked | Outdated local performance dump |
| `verification/lighthouse/after.json` | 510,813 B | Tracked | Outdated local performance dump |
| `verification/` (untracked test dirs) | ~25 MB | Untracked/Ignored | Old verification screenshots & temporary scripts (`footer/`, `legacy/`, `mobile/`, `redesign/`, `theme/`, `ui/`, `ux_verification/`, `zoom_verification/`, `verify-footer.cjs`, `verify-theme.cjs`) |
| `scratch/` | ~75 KB | Untracked/Ignored | Temporary scratch scripts directory |

### Planned Git & Cleanup Commands for DELETE:
```bash
# 1. Untrack and remove tracked unused files
git rm src/App.css
git rm src/assets/react.svg
git rm src/assets/vite.svg
git rm src/hooks/useMediaQuery.ts
git rm src/types/visarjan.ts
git rm src/data/visarjanSites.json
git rm -r verification/

# 2. Remove untracked leftover directories
rm -rf scratch/
rm -f src/assets/hero.png
```

---

## 4. Gitignore Adjustment for Public PWA Icons

Currently, `.gitignore` has:
```gitignore
# Test artifacts and screenshots
*.png
```
This inadvertently ignores `public/apple-touch-icon.png`, `public/icon-192.png`, `public/icon-512.png`, `public/icon-maskable-192.png`, and `public/icon-maskable-512.png`. Without these in the git repository, Vercel cannot deploy the PWA icons, causing Service Worker installation failure.

In Part 2, `.gitignore` will be adjusted to whitelist public icons:
```gitignore
# Test artifacts and screenshots
*.png
!public/*.png
```
And the public PWA icons will be added to Git:
```bash
git add public/*.png
```


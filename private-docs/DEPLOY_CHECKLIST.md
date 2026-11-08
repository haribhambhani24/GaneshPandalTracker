# Production Deployment Readiness Checklist (Vercel)

This checklist records the comprehensive audit conducted for **Ganesh Pandal Tracker** on branch `deploy-prep` prior to production release on Vercel.

---

## 1. Functionality Audits

| # | Check Item | Status | Notes |
|---|------------|--------|-------|
| 1.1 | Home Map, OpenStreetMap tiles & Leaflet clustering | **PASS** | OSM tiles load via HTTPS; cluster groups markers at high zoom levels |
| 1.2 | Search & Filter Chips layout (Desktop 1280px) | **PASS** | Search bar and filter chips fit cleanly on one line with horizontal scroll fallback |
| 1.3 | "Near Me" GPS location picker (Allowed & Denied) | **PASS** | Location prompt modal displays before native prompt; graceful fallback modal on denial |
| 1.4 | Pandal Cards & Detail Page (Cover Photo only) | **PASS** | Single cover photo hero image displayed; gallery, carousels, and viewers remain disabled |
| 1.5 | In-App Navigation (Single Pandal) | **PASS** | Interactive route calculation (Walk, Drive, Bike) using OSRM; no external map redirects |
| 1.6 | "My Darshan" Saved Pandals | **PASS** | LocalStorage persistence with reordering, clear, and circuit navigation |
| 1.7 | Submit Pandal Stepper Form | **PASS** | Multi-step form with map coordinate picker, validation, single photo preview, and pending state |
| 1.8 | Admin Portal & Moderation | **PASS** | Supabase authentication; tabs for pending/approved/rejected; cover photo upload modal |
| 1.9 | Festival Countdown Banner | **PASS** | Live countdown to Ganesh Chaturthi; dismiss and collapse toggles functional |
| 1.10 | External Map URL Audit | **PASS** | **0** instances of `maps.google`, `google.com/maps`, `goo.gl/maps`, `maps.apple.com`, `waze.com` in codebase |

---

## 2. Consistency & Visual Design Audits

| # | Check Item | Status | Notes |
|---|------------|--------|-------|
| 2.1 | Language Persistence | **PASS** | English, Hindi, and Marathi selections persist across page reloads via `localStorage` |
| 2.2 | Theme Persistence | **PASS** | Light and Dark mode preferences persist; theme initialized in `<head>` before render |
| 2.3 | Light Theme Surface Audit | **PASS** | Verified 0 unintended dark surfaces or unreadable text in light theme |
| 2.4 | Header & Brand Color Consistency | **PASS** | `#D9531E` / `bg-orange-600` consistent in header, meta `theme-color`, and PWA manifest |
| 2.5 | Main Brand Icon & Favicon | **PASS** | Flame/Ganesha icon consistent across header, `/favicon.svg`, and PWA icon suite |
| 2.6 | Footer & Legal Static Pages | **PASS** | Footer links to `/about`, `/faq`, `/terms`, `/privacy`, `/disclaimer`, `/contact` |
| 2.7 | Application Name Consistency | **PASS** | Consistent brand "Ganesh Pandal Tracker" across all user-facing headers, titles, and cards |

---

## 3. Security & Anti-Scraping Audits

| # | Check Item | Status | Notes |
|---|------------|--------|-------|
| 3.1 | Supabase Row Level Security (RLS) | **PASS** | Anonymous public can only read `status = 'approved'`; inserts set `status = 'pending'`; no public update/delete |
| 3.2 | Supabase Query Column Whitelisting | **PASS** | `getPandals()` explicitly queries only UI columns; internal table fields are not sent over the wire |
| 3.3 | Storage Bucket Policies | **PASS** | `pandal-photos` bucket enforces < 2 MB size limit and strict image MIME validation |
| 3.4 | Secret & Private Key Leak Audit | **PASS** | Full audit confirms **0** private tokens, passwords, or `service_role` keys in repository |
| 3.5 | Production Source Maps Disabled | **PASS** | `sourcemap: false` configured; **0** `.map` files generated in `dist/` |
| 3.6 | External Link Security | **PASS** | 100% of external links with `target="_blank"` include `rel="noopener noreferrer"` |
| 3.7 | Input Sanitization (XSS Defense) | **PASS** | `sanitizeInput` strips dangerous HTML characters from all user inputs and DB records |
| 3.8 | Vercel Security Headers | **PASS** | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy: geolocation=(self)` |
| 3.9 | Content-Security-Policy (CSP) | **PASS** | Whitelists Supabase REST/WS, OpenStreetMap tiles, OSRM routing, Google Fonts, and image blobs |
| 3.10 | AI Crawler Anti-Scraping Directives | **PASS** | `public/robots.txt` disallows 12 known AI bot user-agents; `<meta name="robots" content="noai, noimageai">` |

---

## 4. Quality & Performance Audits

| # | Check Item | Status | Notes |
|---|------------|--------|-------|
| 4.1 | Oxlint Linter | **PASS** | 0 errors |
| 4.2 | TypeScript Typecheck (`tsc -b`) | **PASS** | 0 type errors |
| 4.3 | Production Build (`vite build`) | **PASS** | Clean build completed without errors or warnings |
| 4.4 | Unused Imports & Dead Code | **PASS** | Clean import graph; unused boilerplate scripts and types removed |
| 4.5 | Custom 404 Route Handler | **PASS** | Catch-all route renders localized `NotFoundPage` with back-to-map navigation |
| 4.6 | XML Sitemap (`public/sitemap.xml`) | **PASS** | Valid sitemap covering home and all static informational pages |
| 4.7 | PWA Service Worker & Manifest | **PASS** | `public/sw.js` and `manifest.webmanifest` valid; dynamic APIs pass through; static shell cached |
| 4.8 | Mobile Responsiveness (320px & 390px) | **PASS** | Verified 0 horizontal overflow at 320px; responsive controls, touch targets >= 44px |
| 4.9 | Desktop Viewport (1280px) | **PASS** | High-resolution layout with side navigation panels and spacious map controls |


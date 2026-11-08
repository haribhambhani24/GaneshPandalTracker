# Anti-Scraping & Data Defense Architecture

This document details the multi-layered anti-scraping and data harvesting defense strategy designed for **Ganesh Pandal Tracker** (`https://mumbaiganeshpandals.com`).

---

## 1. Implemented Protections (Active in Repository)

### A. Crawler & AI Scraper Disallowance (`public/robots.txt`)
Explicitly instructs search engines and AI dataset crawlers not to harvest pandal information:
- Disallows `/admin` for all crawlers.
- Disallows known AI scrapers: `GPTBot`, `ChatGPT-User`, `CCBot`, `Google-Extended`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Bytespider`, `Amazonbot`, `Applebot-Extended`, `cohere-ai`, `Omgilibot`.
- Includes best-effort disclaimer comments.

### B. Machine Learning Opt-Out Signals (`index.html`)
- Includes `<meta name="robots" content="noai, noimageai" />` to signal machine-learning web scrapers not to index or train on text and photography.

### C. Client Query Column Whitelisting (`src/services/pandalService.ts`)
- The public `getPandals()` query selects only user-facing UI columns (`id, name, area, lat, lng, address, description, photo_url, history, darshan_timings, aarti_timings, eco_friendly, is_24_hours, crowd_level, nearest_station, visarjan_date, status, created_at`).
- Internal database columns, submitter contact info, and moderation notes are strictly excluded from public wire transfers.

### D. Build Hardening (`vite.config.ts` & `vercel.json`)
- Source maps are disabled (`sourcemap: false`) preventing automated de-minification and source-tree reconstruction.
- Code is minified via `esbuild`.
- Security headers enforce strict content isolation (`nosniff`, `DENY`, `strict-origin-when-cross-origin`, strict `Content-Security-Policy`).

### E. Legal & Contributor Grounding (`TermsPage.tsx`)
- Explicitly reserves all proprietary rights over the database, layout, coordinates, and timings.
- Explicitly bans automated scraping, dataset extraction, framing, and commercial reuse in English, Hindi, and Marathi.

---

## 2. Advanced Options Available on Vercel & Supabase (If Needed Later)

If the site experiences automated scraping or abuse during festival spikes, the following non-intrusive server-side measures can be toggled without changing the frontend application:

### A. Vercel Security & Bot Protection (Vercel Dashboard)
1. **Attack Challenge Mode**:
   - In Vercel Project Settings -> Security, toggle on **Attack Challenge Mode** to require automated suspicious visitors to solve a transparent browser proof-of-work challenge before loading the site.
2. **Vercel WAF (Web Application Firewall)**:
   - Configure custom firewall rules to block user agents matching common scraping libraries (`python-requests`, `curl`, `Scrapy`, `Go-http-client`, `Puppeteer`).
3. **Edge Middleware Rate Limiting**:
   - Deploy a lightweight Vercel Edge Middleware using Upstash Redis to enforce an IP limit (e.g., max 60 requests per minute per IP).

### B. Supabase Database & API Layer
1. **PostgREST Max Rows Limit**:
   - In Supabase Dashboard -> Project Settings -> API, adjust `max-rows` from default to `50` or `100` so that any client attempting an unpaginated bulk dump cannot retrieve more than one page of records at a time.
2. **Supabase Network Restrictions**:
   - If needed, restrict the Supabase database connection pooler to Vercel's IP ranges or edge endpoints.
3. **RLS Hardening**:
   - The existing RLS policy `Public can view approved pandals` prevents unapproved pandals or draft submissions from ever being read by anonymous users.


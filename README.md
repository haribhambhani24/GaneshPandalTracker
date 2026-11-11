# 🕉️ Ganesh Pandal Tracker | Mumbai Ganesh Chaturthi Guide

A mobile-first, high-performance web and PWA application designed specifically for devotees, travellers, and tourists navigating Mumbai during **Ganesh Chaturthi**. Built with React 19, TypeScript, Tailwind CSS v4, Leaflet (OpenStreetMap), OSRM In-App Navigation, and Supabase.

---

## 🌟 Key Features

### 🧭 100% In-App Directions & Live Navigation
- **Zero External Map App Redirects**: All navigation happens directly inside the application. No redirects to Google Maps, Apple Maps, or external apps.
- **Multiple Travel Modes**: Supports **Walking** (default for short distances), **Driving** (car/taxi), and **Cycling** via OpenStreetMap/OSRM routing.
- **Turn-by-Turn Directions Panel**: Floating, responsive directions panel with summarized travel time, total distance, plain-language turn maneuvers translated in all supported languages, and step-by-step route inspection.
- **Live GPS Guidance**: Real-time position tracking via `navigator.geolocation.watchPosition`, accuracy ring, dynamic re-centering, next-turn highlighting, and automated off-route recalculation (> 50m threshold).
- **Public Transit / "By Train" Tip**: Provides the nearest suburban railway or metro station with walking guidance directly to the pandal gates.
- **Festival Safety Advisories**: Live cautionary notes regarding crowded alleys, barricaded routes, and police traffic diversions during peak festival hours.
- **Multi-Stop "Plan My Darshan Route"**: Plan Darshan visits for up to 8 saved pandals in "My Darshan" with sequenced waypoints, optimized route ordering, and per-leg summaries.
- **Curated Walking Tours**: Explore pre-planned trails (Lalbaug Trail, Girgaon Heritage Trail, Vedic Annadanam Tour) rendered directly on the map as interactive numbered routes.
- **Offline Route Caching**: Recovers and displays the last calculated route even when intermittent festival network connectivity drops.

### 🗺️ Interactive Full-Screen Map
- **Custom SVG Ganesha Markers**: Visually distinct status markers with halo rings, stop indicators, and active selection states.
- **Smooth Marker Clustering**: High-performance grouping for dense clusters using `leaflet.markercluster`.
- **CSS-Powered Dark Mode Map**: Standard OpenStreetMap tiles dynamically inverted via pure CSS (zero external API keys or watermarks required).
- **Responsive Controls**: Floating thumb-friendly zoom in/out, Mumbai center reset compass, and GPS radar location button.

### 🔍 Discovery & Filtering
- **Live Search & Autocomplete**: Instant search by pandal name, suburban area, or nearest railway/metro station with auto-zoom.
- **Multi-Criteria Filter Chips**: Filter by Area, Eco-Friendly (Shadu Mati) idols, 24-Hour Darshan, and Crowd Rush levels (Low Wait / High Rush) with removable filter chips.
- **"Near Me" GPS Radar**: Haversine distance calculations sorting pandals by distance in kilometers with distance badges and polite permission pre-prompts.
- **Dual View Modes**: Seamless toggle between full-screen Interactive Map view and structured List view.

### 🌐 Internationalization (i18n)
- **Full Trilingual Support**: English (`en`), Hindi (`hi`), and Marathi (`mr`).
- **Instant Language Switching**: Dynamic UI, countdown, filters, and routing step localization with `localStorage` persistence.

### 📸 Pandal Detail Pages (`/pandal/:id`)
- **Rich Historical Context**: Dedicated pages featuring stories, darshan timings, aarti schedules, dress codes, and transit advice.
- **Cover Photo & Gallery**: High-resolution pandal photos with accessible alt texts.
- **One-Tap In-App Directions**: Primary CTA opens navigation directly on the home map without leaving the site.

### 🤝 Community Contribution & Moderation
- **Public Submissions (`/submit`)**: Devotees can submit new pandals with image uploads (< 2 MB) and an interactive pin-drop map.
- **Admin Moderation Portal (`/admin`)**: Protected by Supabase Auth (email/password) to review pending submissions, update details, manage photos, and approve or reject submissions.

### ⚡ Progressive Web App (PWA)
- **Installable**: Full PWA support with native standalone launch on Android and iOS.
- **Service Worker Caching**: Offline app shell, asset caching, and graceful offline fallback indicators.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Map & Geodata**: Leaflet, `leaflet.markercluster`, OpenStreetMap tile service
- **Routing Engine**: OSRM (Open Source Routing Machine) hosted by FOSSGIS (`routing.openstreetmap.de`), with in-memory route caching and request debouncing
- **Backend & Database**: [Supabase](https://supabase.com) (PostgreSQL 15, Auth, Storage, Row Level Security)
- **Icons**: Lucide React
- **PWA**: Service Worker (`sw.js`) + Web App Manifest (`manifest.webmanifest`)
- **Linter**: Oxlint

---

## 📋 Environment Variables Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Optional: Custom Self-Hosted OSRM or OpenRouteService Endpoint
# Defaults to public FOSSGIS routing service if omitted:
# VITE_ROUTING_BASE_URL=https://routing.openstreetmap.de
```

> **Security Note**: Never commit `.env` or expose your `service_role` secret key in frontend code. The application strictly uses client-safe public keys. All database mutations and storage uploads are protected by PostgreSQL Row Level Security (RLS) policies.

---

## 🗄️ Supabase Database & Security Setup

### Step 1: Run the Database Setup Script
1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab from the left sidebar.
3. Click **New query**.
4. Copy the contents of [`supabase_setup.sql`](./supabase_setup.sql), paste into the editor, and click **Run**.

### What this script configures:
1. **`pandals` Table**:
   - Stores pandal metadata, coordinates, schedules, transit stations, and publication status (`pending`, `approved`, `rejected`).
2. **Row Level Security (RLS)**:
   - **Public Read**: Anyone can query pandals with `status = 'approved'`.
   - **Public Insert**: Devotees can submit pandals with `status = 'pending'`.
   - **Admin Management**: Only authenticated admin accounts can view pending/rejected items, update records, or delete.
3. **Storage Bucket & Security**:
   - Pre-configures the `pandal-photos` public storage bucket.
   - Enforces 2 MB file size caps and image MIME validation (`jpg`, `png`, `webp`, `gif`, `avif`).
4. **Seed Dataset**:
   - Seeds Mumbai's top 15 historic pandals with verified coordinates and timings.

---

## 👥 How to Add & Moderate Data

### 1. Community Contribution (`/submit`)
- Tap **+ Submit Pandal** in the navigation header.
- Fill in the pandal details, darshan timings, nearest station, upload a photo under 2 MB, and drop the exact entrance pin on the mini-map.
- Submissions are marked as `pending` and held for review.

### 2. Admin Moderation Portal (`/admin`)
- Log in with your admin credentials.
- Filter through **Pending**, **Approved**, and **Rejected** submissions.
- Edit pandal coordinates, descriptions, transit stations, or cover photos before approving.
- Approved items appear instantly on the live map and search indexes.

---

## 🚀 Local Development

1. **Clone the repository and install dependencies**:
   ```bash
   git clone https://github.com/haribhambhani24/GaneshPandalTracker.git
   cd GaneshPandalTracker
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Run linter**:
   ```bash
   npm run lint
   ```

4. **Build production bundle**:
   ```bash
   npm run build
   ```

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```
   Open `http://localhost:4173` to test the production bundle and Service Worker behavior.

---

## 📱 Mobile Testing & PWA Installation

### Testing on a Physical Mobile Device
1. **Expose Vite to your Local Network**:
   ```bash
   npm run dev -- --host
   ```
2. Connect your mobile phone to the same local Wi-Fi network.
3. Navigate to the network IP displayed in your terminal (e.g., `http://192.168.1.15:5173`).

### Installing as a PWA
- **iOS (Safari)**: Tap the **Share** button -> scroll down and select **Add to Home Screen** -> tap **Add**.
- **Android (Chrome)**: Tap the three-dot menu -> tap **Add to Home screen** or **Install App**.
- Opens in full-screen standalone mode with support for native safe area insets (notch and home indicator).

---

## ☁️ Deployment

### Vercel Deployment
1. Import the repository in [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add your environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
6. The included `vercel.json` provides single-page application (SPA) rewrite rules to ensure client-side routing works smoothly:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 📜 Attributions & Licenses

- **Map Data**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **Routing Engine**: Routing powered by [OSRM](https://project-osrm.org/) hosted by [FOSSGIS](https://routing.openstreetmap.de/)
- **Marker Icons**: [Lucide Icons](https://lucide.dev/) (ISC License)
- **Backend Infrastructure**: [Supabase](https://supabase.com/)

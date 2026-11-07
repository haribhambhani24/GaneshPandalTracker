# 🕉️ Ganesh Pandal Tracker | Mumbai Ganesh Chaturthi Guide

A mobile-first, high-performance web and PWA application designed specifically for travellers, devotees, and tourists navigating Mumbai during **Ganesh Chaturthi**. Built with React 19, TypeScript, Tailwind CSS, Leaflet (OpenStreetMap), and Supabase.

---

## 🌟 Key Features

- **Interactive Full-Screen Map**: Custom Ganesha SVG markers with status rings, dynamic marker clustering, and zero paid API keys.
- **Dark Mode Free Basemap**: Uses standard OpenStreetMap tiles with pure CSS inverted rendering (no CartoDB API keys or watermarks).
- **Live Search & Autocomplete**: Instant search by pandal name, area, or nearest railway station with live suggestion cards and auto-zoom.
- **Multi-Criteria Filter Chips**: Filter by Area, Eco-Friendly (Shadu Mati) idols, 24-Hour Darshan, and Crowd Rush levels with active removable chips.
- **"Near Me" GPS Radar**: Haversine distance calculation sorting pandals by distance in kilometers with distance badges and friendly permission-denied modal.
- **Curated Walking Trails (Circuits)**: Pre-planned walking itineraries (Lalbaug Trail, Girgaon Heritage Trail, Vedic Annadanam Tour) with numbered stop pins and dashed route polylines.
- **Dedicated Pandal Detail Page (`/pandal/:id`)**: High-res photo gallery, historical stories, darshan & aarti timings, nearest suburban railway/metro station, and direct Google Maps directions.
- **Multi-Language Support (i18n)**: English (`en`), Hindi (`hi`), and Marathi (`mr`) with instant toggle and `localStorage` persistence.
- **Community Submission (`/submit`)**: Submit new pandals with image upload (< 2 MB) and an interactive Leaflet map to drop/drag the exact entrance pin.
- **Admin Moderation Portal (`/admin`)**: Protected by Supabase Auth (email/password) to review pending submissions, edit coordinates/details, approve to live map, or reject spam.
- **Progressive Web App (PWA)**: Installable on iOS and Android with Service Worker caching app shell, map tiles, and offline data.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Map & Geodata**: Leaflet, `leaflet.markercluster`, OpenStreetMap (free tile layer)
- **Backend & Database**: [Supabase](https://supabase.com) (PostgreSQL 15, Auth, Storage, Row Level Security)
- **Icons**: Lucide React
- **PWA**: Service Worker (`sw.js`) + Web App Manifest (`manifest.webmanifest`)

---

## 📋 Environment Variables Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Security Note**: Never commit `.env` or expose your `service_role` secret key. The application only needs the client-safe public `anon` key. All write and admin permissions are enforced via PostgreSQL Row Level Security (RLS) policies.

---

## 🗄️ Supabase Database & Security Setup

### Step 1: Run the SQL Setup Script
1. Open your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab from the left sidebar.
3. Click **New query**.
4. Open the file [`supabase_setup.sql`](./supabase_setup.sql) from this repository, copy all contents, paste into the SQL Editor, and click **Run**.

### What this script creates:
1. **`pandals` Table**:
   - Schema fields matching pandal data + `status: 'pending' | 'approved' | 'rejected'` + `created_at`.
2. **Row Level Security (RLS)**:
   - **Public Read**: Anyone can read pandals where `status = 'approved'`.
   - **Public Insert**: Anyone can submit pandals, but only with `status = 'pending'`.
   - **Admin Read/Write**: Only authenticated admin users can view pending/rejected items, update details, or delete.
3. **Storage Bucket & Policies**:
   - Ensures `pandal-photos` public storage bucket exists.
   - Allows public reads.
   - Enforces file size limit of **2 MB** and image MIME types (`jpg`, `png`, `webp`, `gif`, `avif`).
4. **Seed Data**:
   - Inserts the 15 verified Mumbai pandals with `status = 'approved'`.

---

## 👥 How to Add & Moderate Data

### 1. Community Contribution (`/submit`)
- Any devotee can visit `/submit` from the navbar "+ Submit" button.
- Users fill in the pandal details, upload an image under 2 MB, and drop a pin on the interactive mini-map.
- Submissions are saved to Supabase with `status = 'pending'` and will not appear on the live map until reviewed.

### 2. Admin Moderation (`/admin`)
- Visit `/admin` and log in with your Supabase Auth admin email and password.
- The Admin Portal displays three tabs:
  - **Pending Submissions**: Review new pandals submitted by the public.
  - **Approved Pandals**: Currently live on the map.
  - **Rejected**: Entries that were flagged or duplicate.
- Actions available per pandal:
  - **Approve**: Immediately publishes the pandal to the public map.
  - **Edit**: Adjust coordinates, fix typos, correct station or timings before approving.
  - **Reject**: Move to rejected tab.
  - **Delete**: Permanently delete spam.

---

## 🚀 Local Development

1. Clone repository and install dependencies:
   ```bash
   git clone https://github.com/haribhambhani24/GaneshPandalTracker.git
   cd GaneshPandalTracker
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. Build production bundle:
   ```bash
   npm run build
   ```

4. Preview production build locally:
   ```bash
   npm run preview
   ```
   Open `http://localhost:4173` to test the production bundle with Service Worker caching.

---

## 📱 How to Test on a Real Mobile Phone

To test on your real phone over your local Wi-Fi:

1. **Expose Vite on Local Network**:
   ```bash
   npm run dev -- --host
   ```
   or for production build:
   ```bash
   npm run preview -- --host
   ```
2. **Access from Your Phone**:
   - Ensure your phone is connected to the same Wi-Fi network as your computer.
   - Look at the terminal output under `Network:` (e.g., `http://192.168.1.15:5173`).
   - Open Safari (iOS) or Chrome (Android) on your phone and type that URL.

3. **Install as a PWA on Your Phone**:
   - **iOS (Safari)**: Tap the **Share** button (box with upward arrow) -> scroll down and tap **Add to Home Screen** -> tap **Add**.
   - **Android (Chrome)**: Tap the three-dot menu in the top-right -> tap **Add to Home screen** or **Install App**.
   - Launch the app from your home screen to experience full-screen standalone mode with native safe-area inset handling!

4. **Testing in Browser Device Emulation**:
   - Press `F12` in Chrome/Edge, click the **Toggle Device Toolbar** icon (`Ctrl+Shift+M` / `Cmd+Shift+M`).
   - Select popular viewports: iPhone SE (`375px`), iPhone 12/14/15 (`390px`), Pixel 7 (`412px`), and test both portrait and landscape.

---

## ☁️ Vercel Deployment Guide

Deploying Ganesh Pandal Tracker to Vercel is seamless:

1. **Push to GitHub**:
   Ensure all changes are pushed to your `main` branch.
2. **Import Project in Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **Add New... > Project**.
   - Select your `GaneshPandalTracker` GitHub repository.
3. **Framework Preset**:
   - Vercel will automatically detect **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Configure Environment Variables**:
   Under the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
5. **SPA Routing Configuration**:
   The included `vercel.json` ensures client-side routes (`/pandal/:id`, `/submit`, `/admin`) resolve to `index.html`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Click **Deploy**!

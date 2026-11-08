# Ganesh Pandal Tracker - Internal Developer & Architecture Notes

**Confidential & Proprietary** — For internal engineering and administrative maintenance only.

---

## 1. Environment Variables Configuration

Create a `.env` file in the root directory (never commit this file):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
# Optional OSRM routing server URL:
# VITE_ROUTING_BASE_URL=https://routing.openstreetmap.de
```

### Security Notes
- Only the public `anon` key should ever be provided to the frontend.
- Never use the `service_role` key in frontend code or client bundles.
- All database write and admin capabilities are gated by PostgreSQL Row Level Security (RLS) policies.

---

## 2. Database Schema & Migration Execution

All database setup and migration scripts are safely preserved in `private-docs/sql/`:

1. `private-docs/sql/supabase_setup.sql`: Core tables (`pandals`, `pandal_reports`), RLS policies, and storage bucket configuration.
2. `private-docs/sql/20261108_pandal_photos.sql`: Multi-photo and cover photo management table (`pandal_photos`), indexes, and RLS policies.
3. `private-docs/sql/supabase_reports_setup.sql`: Report moderation procedures.
4. `private-docs/sql/supabase_security_audit.sql`: Security policy audit queries.
5. `private-docs/sql/GALLERY_DISABLE.sql` & `GALLERY_ENABLE.sql`: Scripts to restrict or re-enable public gallery table mutations.

---

## 3. Local Development & Build Workflows

```bash
# Install dependencies
npm install

# Start Vite dev server on localhost:5173
npm run dev

# Run Oxlint linter
npm run lint

# TypeScript typecheck & production build
npm run build

# Preview production build locally on localhost:4173
npm run preview
```

---

## 4. Vercel Deployment Instructions

1. **Framework**: Vite
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables on Vercel Dashboard**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Configuration**:
   - `vercel.json` provides SPA fallback rewrites and security/caching headers.


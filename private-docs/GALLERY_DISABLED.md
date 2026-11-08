# Gallery Feature Disablement & Re-Enable Guide

This document records the temporary disablement of the **Photo Gallery** feature across **Ganesh Pandal Tracker** and provides instructions for re-enabling it in the future.

---

## 1. Executive Summary

- **Status**: Gallery features temporarily disabled in the UI.
- **Data Integrity**: **ZERO code was deleted**. All gallery components, state logic, handlers, types, and services remain 100% intact and type-checked in the codebase.
- **Cover Photos**: All cover/main photos remain **100% active and visible** across the entire website.
- **Tags Used**: All disabled JSX blocks and related methods are tagged with `GALLERY-DISABLED`.

---

## 2. What Remains 100% Active (Untouched)

The following core photo workflows are **active and fully operational**:

1. **Pandal Cards & Lists**:
   - Pandal cards on the home page list (`PandalListView`).
   - "My Darshan" saved & visited lists (`MyDarshanModal`).
   - Search results & live filter results.
   - Pandal Map popup cards & preview sheets (`PandalDetailCard`).
2. **Pandal Detail Page Hero Cover**:
   - The large hero image header at the top of `/pandal/:id` displays the pandal's cover photo (`pandal.photoUrl`).
   - Includes fallback placeholder (`🕉️ No photo uploaded yet`) when no photo is attached.
   - Verification badges, area badge, crowd status, and like/save buttons all remain displayed over the cover photo.
3. **Public Pandal Submission**:
   - The single-photo upload, compression, client-side preview, and submission in the **Submit a Pandal** form (`/submit`) continue to work seamlessly.
4. **Admin Cover Photo Management**:
   - Inside the Admin Dashboard (`/admin`), admins can view, upload, or replace the main cover photo for any approved, pending, or rejected pandal using the Cover Photo section in `PhotoManagerModal`.
   - **Direct `pandals.photo_url` Update**: The upload flow is completely decoupled from the disabled `pandal_photos` table. It compresses the image to max 1600px at ~80% WebP, uploads directly to `covers/<pandal_id>/<uuid>.webp` in the `pandal-photos` bucket, and saves the resulting URL straight to `public.pandals.photo_url`.
   - The replaced cover photo immediately invalidates cache and reflects throughout the site (cards, map popups, detail pages).
   - If the previous cover photo was stored in the `pandal-photos` bucket, it is automatically removed from storage upon successful replacement. External URLs (such as Unsplash) are never touched.
   - If the database update fails, the newly uploaded storage file is automatically cleaned up (zero orphans).

---

## 3. What Was Disabled (Commented Out with `GALLERY-DISABLED`)

The multi-photo gallery interactions were disabled using zero-regression JSX boolean guards (`{false as boolean && (...) }`) and code annotations:

| Location | Component / File | Disabled Element | Tag / Guard Used |
| :--- | :--- | :--- | :--- |
| **Pandal Detail Page** | `src/pages/PandalDetailPage.tsx` | Carousel Previous/Next Arrow Buttons | `{/* GALLERY-DISABLED: Carousel Prev/Next Buttons */} {false as boolean && ...}` |
| **Pandal Detail Page** | `src/pages/PandalDetailPage.tsx` | Top-right photo counter & Fullscreen viewer button | `{/* GALLERY-DISABLED: Counter & Fullscreen trigger */} {false as boolean && ...}` |
| **Pandal Detail Page** | `src/pages/PandalDetailPage.tsx` | Bottom carousel navigation indicator dots | `{/* GALLERY-DISABLED: Navigation Dots */} {false as boolean && ...}` |
| **Pandal Detail Page** | `src/pages/PandalDetailPage.tsx` | Full-Screen Lightbox Viewer modal with captions & credits | `{/* GALLERY-DISABLED: Full-Screen Lightbox Viewer */} {false as boolean && ...}` |
| **Admin Photo Modal** | `src/components/Admin/PhotoManagerModal.tsx` | Multi-photo upload dropzone & camera picker | `{/* GALLERY-DISABLED: MULTI-PHOTO UPLOAD DROPZONE */} {false as boolean && ...}` |
| **Admin Photo Modal** | `src/components/Admin/PhotoManagerModal.tsx` | Gallery Photos thumbnail grid & reorder controls | `{/* GALLERY-DISABLED: Photo Gallery Grid */} {false as boolean && ...}` |
| **Admin Photo Modal** | `src/components/Admin/PhotoManagerModal.tsx` | Delete confirmation modal | `{/* GALLERY-DISABLED: DELETE CONFIRMATION MODAL */} {false as boolean && ...}` |
| **Admin Photo Modal** | `src/components/Admin/PhotoManagerModal.tsx` | Edit photo details modal (multilingual captions/credits) | `{/* GALLERY-DISABLED: EDIT PHOTO DETAILS DRAWER / MODAL */} {false as boolean && ...}` |
| **Admin Photo Modal** | `src/components/Admin/PhotoManagerModal.tsx` | Undo deletion toast snackbar | `{/* GALLERY-DISABLED: Undo Toast Snackbar */} {false as boolean && ...}` |
| **Footer** | `src/components/Footer/Footer.tsx` | Photographer credits disclaimer text | `{/* GALLERY-DISABLED: Photo credits notice */} {false as boolean && ...}` |
| **About Bottom Sheet** | `src/components/Footer/AboutBottomSheet.tsx` | Photographer credits disclaimer text | `{/* GALLERY-DISABLED: Photo credits notice */} {false as boolean && ...}` |
| **Photo Service** | `src/services/photoService.ts` | `setCoverPhoto`, `reorderPhotos`, `updatePhotoDetails`, `deletePhoto` | `// GALLERY-DISABLED: re-enable when gallery returns` |

---

## 4. How to Re-Enable the Gallery

When you are ready to re-enable the gallery feature:

### Step 1: Frontend Code Re-Activation
Search for all instances of `GALLERY-DISABLED` in the codebase:
```bash
git grep "GALLERY-DISABLED"
```

1. **In `src/pages/PandalDetailPage.tsx`**:
   - Remove `{false as boolean && (` and closing `)}` around:
     - Carousel buttons (`pandalPhotos.length > 1`)
     - Counter & Fullscreen trigger
     - Navigation dots
     - Full-Screen Lightbox Viewer modal
2. **In `src/components/Admin/PhotoManagerModal.tsx`**:
   - Remove `{false as boolean && (` and closing `)}` around:
     - Multi-photo upload dropzone
     - Photo gallery grid
     - Delete confirmation modal
     - Edit photo details drawer / modal
     - Undo toast snackbar
3. **In `src/components/Footer/Footer.tsx` & `src/components/Footer/AboutBottomSheet.tsx`**:
   - Remove `{false as boolean && (` and closing `)}` around `{t.footerPhotoCreditsNotice}`.

### Step 2: Supabase Database (If applicable)
If you ran `GALLERY_DISABLE.sql` in Supabase to restrict table policies:
- Run `GALLERY_ENABLE.sql` in the Supabase SQL editor to restore RLS permissions for inserting and managing gallery records in `public.pandal_photos` and `storage.objects`.

---

## 5. Verification Commands
To verify the build and TypeScript health at any time:
```bash
npx tsc -b
npx oxlint
npm run build
```


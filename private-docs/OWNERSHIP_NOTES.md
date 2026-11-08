# Project Ownership & Provenance Evidence

This document establishes the proprietary provenance, authorship, and evidentiary trail for **Ganesh Pandal Tracker**.

---

## 1. Project Metadata & Author Identification

- **Project Name**: Ganesh Pandal Tracker
- **Author & Copyright Holder**: Hari Bhambhani
- **Production Domain**: `https://mumbaiganeshpandals.com`
- **Contact Email**: `contact@example.com` (configured in `src/config/site.ts`)
- **First Commit Hash**: `dd5608c` (Committed on 7 November 2026)
- **First Commit Author**: Hari Bhambhani
- **Safety Pre-Deploy Tag**: `pre-deploy-cleanup`
- **Working Branch**: `deploy-prep`
- **License**: Proprietary / UNLICENSED ("All Rights Reserved. Copyright (c) 2026 Hari Bhambhani")

---

## 2. Evidentiary Trail of Prior Ownership

If another party copies or republishes this website, application design, or database without authorization, the following interlocking records provide proof of first creation and prior ownership:

1. **Cryptographic Git Commit History**:
   - The initial commit `dd5608c` contains the original unreleased code, initial seed data files (`pandals.json`), and custom UI component architectures with original timestamps from 7 Nov 2026.
   - The commit history contains iterative development steps, refactors, and feature additions that an unauthorized copier cannot reproduce chronologically.
2. **Permanent Git Backup Tag (`pre-deploy-cleanup`)**:
   - Anchors the state of the codebase prior to public deployment preparation, preserving historical audits, design specs, and development scripts.
3. **Domain Registration Records**:
   - Domain purchase and registration receipts for `mumbaiganeshpandals.com` from your domain registrar, matching your legal identity and payment account.
4. **Google Search Console & DNS Verification**:
   - DNS TXT record or HTML file verification in Google Search Console establishes authenticated administrative control over the domain from day one.
5. **Hosting & Deployment Dashboard (Vercel & Supabase)**:
   - Account creation logs, project provisioning timestamps, and deployment histories linked to your primary developer account.
6. **Curated Seed Data & Photographic Records**:
   - The original 15 verified pandal records preserved in `private-docs/data/pandals.json` with original coordinate verification logs (`private-docs/VERIFY_COORDINATES.md`).

---

## 3. Best Practices for Evidence Preservation

To maintain maximum legal and evidentiary protection:

1. **Keep `private-docs/` Gitignored & Secure**:
   - `private-docs/` contains raw SQL setup, full original datasets, coordinate audit logs, and development notes. Keep this folder strictly local and out of any public repository.
2. **Create Periodic Timestamped Git Bundles**:
   - Run `git bundle create ganesh-pandal-tracker-backup-YYYY-MM-DD.bundle --all` periodically and store the bundle on a secure offline drive or encrypted backup service.
3. **Archive Domain & Hosting Invoices**:
   - Save PDF receipts of domain renewals, SSL certificates, and hosting subscriptions in your personal archive.
4. **Preserve Raw Submissions**:
   - Store timestamps and original image uploads in Supabase Storage with tamper-resistant audit timestamps (`created_at`).


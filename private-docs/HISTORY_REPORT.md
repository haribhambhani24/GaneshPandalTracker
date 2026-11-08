# Git History & Secrets Security Audit Report

**Date**: November 8, 2026  
**Auditor**: Automated Security Audit  
**Branch**: `deploy-prep`  
**Status**: **SECURE - No Credentials or Secrets Exposed**

---

## 1. Secrets & Credentials Scan Results

A rigorous scan was conducted across all commits and branches for sensitive credentials:

| Pattern / Secret Type | Scan Result | Details |
| :--- | :--- | :--- |
| **Supabase `service_role` Key** | **CLEAN (0 found)** | Never committed. Only mentioned in warning docstrings advising never to commit it. |
| **Database Passwords / URLs** | **CLEAN (0 found)** | No PostgreSQL connection strings (`postgresql://`) found in any commit. |
| **Private API Keys / Tokens** | **CLEAN (0 found)** | No private keys (`sk_`, `sbp_`, JWT secret tokens) found in repo history. |
| **Public Client Environment** | **Verified Public** | `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are safe, read-only public anon keys designed for client-side queries protected by RLS. |
| **`.env.example`** | **CLEAN** | Verified that `.env.example` contains only empty template placeholders. |
| **`.env`** | **Protected** | Ignored by Git, exists solely on local machine. |

---

## 2. Inventory of Valuable Data & Assets in Git History

The following valuable assets and database definitions were historically committed to Git. They are noted here with their commit hashes for auditability:

| Asset | Commit Hash | Date | Description |
| :--- | :--- | :--- | :--- |
| **Original 15 Pandal Seed Data** | `dd5608c` | Nov 7, 2026 | Full dataset of 15 verified Mumbai pandals with histories, coordinates, and timings. |
| **Curated Walking Circuits** | `dd5608c` | Nov 7, 2026 | 3 curated walking itineraries (Lalbaug, Girgaon, Vedic). |
| **Initial Supabase Schema & Seed SQL** | `aee9a69` | Nov 7, 2026 | `supabase_setup.sql` with full table DDL, RLS policies, and initial insert seed. |
| **Reports Schema & Security Audits** | `325d99a` | Nov 8, 2026 | `supabase_reports_setup.sql` and `supabase_security_audit.sql`. |
| **Photo & Gallery DB Migration** | `d35f3be` | Nov 8, 2026 | `supabase/migrations/20261108_pandal_photos.sql`. |
| **Gallery RLS SQL Scripts** | `d35f3be` | Nov 8, 2026 | `GALLERY_DISABLE.sql` and `GALLERY_ENABLE.sql`. |

---

## 3. Local Protection Status

- All real seed data has been moved to:
  - `private-docs/data/pandals.json`
  - `private-docs/data/circuits.json`
- All database setup and migration SQL has been moved to:
  - `private-docs/sql/*.sql`
- `private-docs/` is completely excluded by `.gitignore` and untracked in Git.
- Real production data is securely hosted and managed directly inside Supabase with Row Level Security (RLS) enforcement.


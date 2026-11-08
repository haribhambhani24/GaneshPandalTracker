# Dependency License Audit

**Project**: Ganesh Pandal Tracker  
**Date**: November 8, 2026  
**Status**: **PASSED** - Zero Copyleft (GPL / AGPL / SSPL) conflicts detected.

---

## 1. Executive Summary

A comprehensive automated license audit was performed on all 18 direct dependencies and 86 total packages in `node_modules`. 
All dependencies are distributed under permissive open-source licenses (MIT, BSD-2-Clause, ISC, Apache-2.0). 
There are **zero strong copyleft (GPL/AGPL) or viral restrictions**, confirming full legal compatibility with an "All Rights Reserved" proprietary application license.

---

## 2. Direct Dependencies License Breakdown

### Production Dependencies (`dependencies`)

| Package | Version | License | License Type | Proprietary Compatible? |
| :--- | :--- | :--- | :--- | :--- |
| `@supabase/supabase-js` | `^2.119.0` | MIT | Permissive | Yes |
| `@tailwindcss/vite` | `^4.3.5` | MIT | Permissive | Yes |
| `@types/leaflet` | `^1.9.22` | MIT | Permissive | Yes |
| `@types/leaflet.markercluster` | `^1.5.6` | MIT | Permissive | Yes |
| `leaflet` | `^1.9.4` | BSD-2-Clause | Permissive | Yes |
| `leaflet.markercluster` | `^1.5.3` | MIT | Permissive | Yes |
| `lucide-react` | `^1.70.0` | ISC | Permissive | Yes |
| `react` | `^19.3.1` | MIT | Permissive | Yes |
| `react-dom` | `^19.3.1` | MIT | Permissive | Yes |
| `react-router-dom` | `^7.18.5` | MIT | Permissive | Yes |
| `tailwindcss` | `^4.3.5` | MIT | Permissive | Yes |

### Development Dependencies (`devDependencies`)

| Package | Version | License | License Type | Proprietary Compatible? |
| :--- | :--- | :--- | :--- | :--- |
| `@types/node` | `^24.19.2` | MIT | Permissive | Yes |
| `@types/react` | `^19.3.0` | MIT | Permissive | Yes |
| `@types/react-dom` | `^19.3.0` | MIT | Permissive | Yes |
| `@vitejs/plugin-react` | `^6.1.2` | MIT | Permissive | Yes |
| `oxlint` | `^1.90.0` | MIT | Permissive | Yes |
| `typescript` | `~7.0.2` | Apache-2.0 | Permissive | Yes |
| `vite` | `^8.3.6` | MIT | Permissive | Yes |

---

## 3. Data & Map Attributions Compliance

- **Map Data**: OpenStreetMap data is licensed under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/).
  - **Compliance**: The mandatory attribution notice (`© OpenStreetMap contributors`) is prominently rendered on the interactive Leaflet map canvas and in the site footer (`Footer.tsx`).
- **Routing Engine**: OSRM (Open Source Routing Machine) routing via FOSSGIS Germany.
  - **Compliance**: Routing attribution notice is credited in map controls and in `THIRD_PARTY_NOTICES.md`.
- **Fonts**: Inter and Noto Sans Devanagari via Google Fonts (SIL Open Font License 1.1).
  - **Compliance**: Preconnected and loaded with standard web font attribution.

---

## 4. Conclusion

No dependencies need to be removed, replaced, or relicensed.


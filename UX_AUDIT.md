# UX Audit & Heuristic Evaluation: Ganesh Pandal Tracker

> **Core Objective**: Optimize the user experience for high-stress, on-the-go scenarios in Mumbai during Ganesh Chaturthi.
> **Guiding Principle**: *"Can a traveller or local find the pandal and start heading towards it in under 30 seconds with one hand on a crowded mobile network?"*
> **Audit Framework**: Nielsen's 10 Usability Heuristics & 8 Real-World User Journeys.
> **Date**: November 2026

---

## 1. Primary User Personas & Context

1. **The Out-of-Town Devotee / Tourist**:
   - Arriving from another city, state, or abroad.
   - Holding a mobile phone with one hand while navigating intense street crowds.
   - Weak or congested 4G/5G mobile cellular signal.
   - Unfamiliar with Mumbai geography, suburban rail networks, or Marathi/Hindi script.
   - **Primary Need**: *"Where am I, where is the nearest famous pandal, is darshan open right now, and how do I walk there?"*

2. **The Fast-Moving Mumbai Local**:
   - Knows areas like Lalbaug, Girgaon, or Bandra.
   - Wants to check real-time crowd status, specific aarti timings, or visit 3 to 4 pandals efficiently in an evening.
   - **Primary Need**: *"Is Lalbaugcha Raja High crowd right now? When is the evening aarti? Add it to my route."*

3. **The Mandal Volunteer / Organizer**:
   - Submitting their pandal's official darshan hours, eco-friendly certification, and photo from their phone.
   - Needs to report a quick correction (e.g., darshan extended to 24 hours, or entry gate changed).
   - **Primary Need**: *"Let me submit my mandal's details in 2 minutes without losing progress if my browser reloads."*

---

## 2. Walkthrough of the 8 Core User Journeys

| Journey | Steps / Taps | Friction Points & Heuristic Violations | Severity | Proposed UX Solution |
|---|---|---|---|---|
| **1. First Visit** | 4-6 taps to find a pandal | **Heuristic 1 (Visibility of system status) & Heuristic 6 (Recognition rather than recall)**:<br>• User lands on the map with zero orientation.<br>• Unclear what to tap first.<br>• Language switcher is hidden in top right header; devotees who only read Hindi/Marathi don't notice it immediately. | **High** | • **Lightweight Dismissible Hint**: Non-blocking tooltip banner on first load: *"Tap 'Near Me' to find pandals around you, or pick an area below."* (dismissed once and remembered).<br>• **First-Time Language Prompt**: Auto-detects browser locale; if Hindi/Marathi, shows a 1-tap language switch chip.<br>• Map immediately shows clustered top pandals without any blocking modal. |
| **2. Find Pandals Near Me & Get There** | 3-5 taps, high drop-off if permission denied | **Heuristic 5 (Error prevention) & Heuristic 9 (Help users recognize & recover from errors)**:<br>• Tapping "Near Me" abruptly fires native browser GPS prompt with no context.<br>• If user clicks "Block" or "Deny", the app shows an apology modal with no instant fallback.<br>• When GPS is on, list items don't show estimated walking/transit time. | **Critical** | • **Pre-Prompt Explanation**: Quick toast explaining why GPS is needed (*"Finding pandals closest to your walking location"*).<br>• **Instant Fallback on Deny**: Show 1-tap popular hubs (Lalbaug, Girgaon, Andheri, Fort, Chembur) and guidance on re-enabling location.<br>• **Walking/Transit Time**: Display `~8 min walk (650m)` or `~18 min drive (4.2 km)` directly on cards.<br>• **Button State**: Near Me button clearly displays `Searching...`, `Active (Within 5 km)`, or `Location Off`. |
| **3. Find Specific Pandal by Name or Area** | 3-4 taps, search fails on typos/Hindi | **Heuristic 7 (Flexibility & efficiency of use) & Heuristic 8 (Aesthetic & minimalist design)**:<br>• Search only matches exact English substrings. Typos like "Lalbagh" or Devanagari script "लालबाग" return 0 results.<br>• No recent search history.<br>• Navigating to a pandal and hitting "Back" resets all applied filters and map position. | **High** | • **Bilingual & Phonetic Search Index**: Support English, Hindi, and Marathi text + phonetic alias matching ("Lalbaugcha Raja" / "लालबागचा राजा" / "Lalbagh").<br>• **Recent Searches**: Save last 5 searches in `localStorage`.<br>• **Map State Preservation**: Preserve map center, zoom, and active filters in session so hitting "Back" from detail view returns to exact position.<br>• **Multi-Criteria Sorting**: Add dropdown to sort by Distance, Name (A-Z), or Crowd Level (Low first). |
| **4. Plan Multi-Pandal Day Route** | Impossible in current app | **Heuristic 3 (User control & freedom)**:<br>• Users can bookmark pandals with a star, but there is no dedicated "My Saved Pandals" drawer or route generation.<br>• Cannot export a multi-stop itinerary to Google Maps. | **High** | • **"My Darshan" / Saved Drawer**: Clean drawer showing all bookmarked pandals with reorder and delete options.<br>• **"Open Multi-Stop Route in Google Maps"**: Single tap generates Google Maps navigation with up to 9 waypoints sorted nearest-first.<br>• Stored 100% locally on device with zero login required. |
| **5. Crowd Level & Aarti Timings** | 3 taps, scanning long text | **Heuristic 1 (Visibility of system status) & Heuristic 2 (Match between system & real world)**:<br>• Users must read paragraphs to find whether darshan is open right now.<br>• Next aarti time is not highlighted in plain conversational terms.<br>• Users cannot tell if information is verified or outdated. | **High** | • **Real-Time "Open Now / Closed" Badge**: Evaluates current Mumbai IST time against pandal hours (e.g. `🟢 Open Now • Closes 11:00 PM` or `🌙 Closed • Opens 6:00 AM`).<br>• **Next Aarti Callout**: Highlight next upcoming aarti in conversational terms (`🔔 Next Aarti in 45 min (8:00 PM)`).<br>• **Verification & Transit Badge**: `"✓ Verified Mandal Data"` and `"Currey Road Station • 600m (~7 min walk)"`.<br>• **Previous / Next Pandal Navigation**: Swipe or tap `← Previous` / `Next →` without returning to map. |
| **6. Mandal Volunteer Submission & Corrections** | 5-8 min, risk of lost form on reload | **Heuristic 5 (Error prevention) & Heuristic 7 (Flexibility & efficiency)**:<br>• Single 12-field form on `/submit` is intimidating in a crowd.<br>• Phone browser reload or accidental tab closure erases all typed data.<br>• No mechanism for devotees or mandals to report corrections on existing pandals. | **High** | • **3-Step Form with Auto-Draft**: Step 1 (Basics), Step 2 (Location & Timings), Step 3 (Photo & Review). Auto-saves draft in `localStorage`.<br>• **"Use My Current GPS Pin"**: 1-tap button sets coordinates directly to volunteer's current GPS location.<br>• **"Report a Correction" Button**: On every detail page, opens quick modal (`Wrong location`, `Timings changed`, `Closed`, `Crowd inaccurate`) saving to `pandal_reports` table. |
| **7. Admin Review of Submissions & Reports** | 4 taps | **Heuristic 4 (Consistency & standards)**:<br>• Admin can only moderate pandals, but has no way to view user-submitted error reports or corrections. | **Medium** | • **User Reports Tab**: Dedicated tab in `/admin` displaying user-reported issues with 1-tap "Mark Resolved" and pandal edit shortcut. |
| **8. Offline & Weak Connection** | Confusing error states | **Heuristic 1 (Visibility of system status)**:<br>• If connection drops, app silently attempts network calls and eventually shows an error.<br>• No clear visual indicator that offline cached data is being displayed. | **Medium** | • **Non-Intrusive Offline Banner**: Top bar: `"Offline mode • Showing saved pandals"`.<br>• **Auto-Reconnect**: Seamlessly retries data fetch as soon as `window.ononline` fires.<br>• Action buttons that require network (Submit, Report) show graceful disabled state when offline. |

---

## 3. Nielsen Heuristics Scorecard & Priority Fix Matrix

| Heuristic | Status | Primary Action Item |
|---|---|---|
| **1. Visibility of system status** | Needs Improvement | Real-time "Open Now / Closed" calculation, "Next Aarti in X min" countdown, Geolocation status indicator. |
| **2. Match between system & real world** | Fair | Conversational timings ("Next Aarti at 8:00 PM"), walking time estimates, local landmark references. |
| **3. User control & freedom** | Good | Multi-stop custom route planner, "Clear all filters" single tap, easy previous/next navigation. |
| **4. Consistency & standards** | Excellent | Consistent button hierarchy, unified 8px/12px border radii, WCAG AA contrast. |
| **5. Error prevention** | Needs Improvement | Auto-save draft on submission form, pre-prompt before GPS request, confirmation before deleting saved items. |
| **6. Recognition rather than recall** | Needs Improvement | Recent search history, popular hub chips on location denial, bilingual name suggestions. |
| **7. Flexibility & efficiency of use** | Needs Improvement | 1-tap "Open Route in Google Maps", sorting dropdown (Distance, Name, Crowd), "Report problem" flow. |
| **8. Aesthetic & minimalist design** | Excellent | Clean flat design system, content-first layout, zero emojis in UI controls. |
| **9. Help users recognize, diagnose & recover from errors** | Needs Improvement | Contextual fallbacks when location denied or search yields no results; report problem button for data errors. |
| **10. Help and documentation** | Fair | Dismissible first-time hint, clear transit hints on pandal pages. |

---

## 4. Execution Sequence

1. **Database Extension (`supabase_reports_setup.sql`)**:
   - Create `pandal_reports` table with RLS for crowdsourced corrections.
2. **First-Time Experience & Onboarding**:
   - Dismissible first-visit guide toast & browser locale detection.
   - Pre-prompt GPS explanation and instant popular area fallback chips.
3. **Search & Filter Upgrade**:
   - Multi-language search dictionary (English + Devanagari) + phonetic matching.
   - Recent searches history in `localStorage`.
   - Sorting options (Nearest, Alphabetical, Crowd level).
   - Map position & zoom preservation on back navigation.
4. **Pandal Detail "30-Second Answer"**:
   - "Open Now / Closed" real-time engine based on Mumbai IST.
   - "Next Aarti in X min" calculation.
   - Nearest suburban station & walking distance badge.
   - "Report a Problem" modal & previous/next pandal links.
5. **My Darshan Custom Itinerary**:
   - Multi-pandal saved list with nearest-first ordering and Google Maps multi-waypoint link.
6. **Volunteer Submission Flow**:
   - 3-step progressive form with autosave draft & "Use current GPS location".
7. **Offline & System Feedback**:
   - Offline status banner, auto-reconnect, and action undo toasts.


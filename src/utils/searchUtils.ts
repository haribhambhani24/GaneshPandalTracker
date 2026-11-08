// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

/**
 * Search Utilities: Multilingual (English, Hindi, Marathi) & Fuzzy Matcher
 * Supports typo tolerance, Devanagari script, phonetic aliases, and recent search history.
 */
import type { Pandal } from '../types/pandal';

const RECENT_SEARCHES_KEY = 'ganesh_pandal_tracker_recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Common phonetic and script aliases for Mumbai pandals & areas
const PANDAL_ALIASES: Record<string, string[]> = {
  'lalbaugcha-raja': [
    'lalbaug', 'lalbagh', 'lal baug', 'raja', 'navasacha', 'लालबाग', 'लालबागचा राजा', 'नवसाचा गणपती',
  ],
  'gsb-seva-mandal-kings-circle': [
    'gsb', 'gold ganpati', 'golden ganpati', 'kings circle', 'sion', 'सायन', 'जीएसबी', 'सोनेरी गणपती', 'किंग्स सर्कल',
  ],
  'mumbaicha-raja-ganesh-galli': [
    'mumbaicha raja', 'ganesh galli', 'ganeshgalli', 'lane 1', 'मुंबईचा राजा', 'गणेश गल्ली', 'लालबाग',
  ],
  'khetwadi-12th-lane': [
    'khetwadi', 'khetwadi 12th', '12vi galli', 'baravi galli', 'खेतवाडी', '१२वी गल्ली', 'खेतवाडीचा राजा',
  ],
  'andhericha-raja': [
    'andheri', 'andhericha raja', 'azad nagar', 'veera desai', 'अंधेरी', 'अंधेरीचा राजा', 'आझाद नगर',
  ],
  'chinchpoklicha-chintamani': [
    'chinchpokli', 'chintamani', 'dattaram lad', 'चिंचपोकळी', 'चिंतामणी', 'चिंचपोकळीचा चिंतामणी',
  ],
  'keshavji-naik-chawl-girgaon': [
    'keshavji naik', 'girgaon', 'girgaum', 'chawl', 'lokmanya tilak', '1893', 'गिरगाव', 'केशवजी नाईक चाळ',
  ],
  'fort-vibhag-sarvajanik-ganeshotsav': [
    'fort', 'cst', 'csmt', 'south mumbai', 'फोर्ट', 'फोर्टचा राजा',
  ],
  'tejukaya-mandal-lalbaug': [
    'tejukaya', 'lalbaug', 'तेजुकराया', 'तेजुकया',
  ],
  'sahyadri-krida-mandal-chembur': [
    'chembur', 'sahyadri', 'tilak nagar', 'चेंबूर', 'सह्याद्री',
  ],
  'girgaoncha-raja': [
    'girgaon', 'girgaoncha raja', 'nikadwari', 'गिरगावचा राजा',
  ],
  'wadala-gsb-sarvajanik-ganesan': [
    'wadala', 'gsb wadala', 'ram mandir', 'वडाळा',
  ],
};

/**
 * Standardizes a string by lowercasing and stripping diacritics / punctuation
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{Script=Devanagari}\w\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Basic Levenshtein distance for fuzzy search on short terms (e.g. "lalbagh" -> "lalbaug")
 */
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  if (Math.abs(m - n) > 2) return 99; // Quick rejection

  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Checks whether a pandal matches the search query across English, Marathi, Hindi, and typos
 */
export function matchesSearchQuery(pandal: Pandal, rawQuery: string): boolean {
  if (!rawQuery || rawQuery.trim() === '') return true;

  const query = normalizeText(rawQuery);
  if (!query) return true;

  const pandalName = normalizeText(pandal.name);
  const pandalArea = normalizeText(pandal.area);
  const pandalStation = normalizeText(pandal.nearestStation);
  const pandalAddress = normalizeText(pandal.address);

  // 1. Direct substring match on primary fields
  if (
    pandalName.includes(query) ||
    pandalArea.includes(query) ||
    pandalStation.includes(query) ||
    pandalAddress.includes(query)
  ) {
    return true;
  }

  // 2. Direct match on Devanagari fields if present
  if (pandal.nameMr && normalizeText(pandal.nameMr).includes(query)) return true;
  if (pandal.nameHi && normalizeText(pandal.nameHi).includes(query)) return true;
  if (pandal.areaMr && normalizeText(pandal.areaMr).includes(query)) return true;
  if (pandal.areaHi && normalizeText(pandal.areaHi).includes(query)) return true;

  // 3. Known phonetic & multilingual aliases
  const aliases = PANDAL_ALIASES[pandal.id] || [];
  for (const alias of aliases) {
    const normAlias = normalizeText(alias);
    if (normAlias.includes(query) || query.includes(normAlias)) {
      return true;
    }
  }

  // 4. Fuzzy token matching for words >= 4 characters
  const queryWords = query.split(/\s+/).filter((w) => w.length >= 4);
  const targetWords = `${pandalName} ${pandalArea}`.split(/\s+/).filter((w) => w.length >= 4);

  for (const qWord of queryWords) {
    for (const tWord of targetWords) {
      if (levenshteinDistance(qWord, tWord) <= 1) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Retrieves stored recent searches from localStorage
 */
export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT_SEARCHES) : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new search query to recent searches
 */
export function addRecentSearch(query: string): void {
  const clean = query.trim();
  if (!clean || clean.length < 2) return;

  try {
    const existing = getRecentSearches().filter((s) => s.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...existing].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save recent search:', err);
  }
}

/**
 * Removes a single search query from recent history
 */
export function removeRecentSearch(query: string): void {
  try {
    const existing = getRecentSearches().filter((s) => s !== query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn('Failed to remove recent search:', err);
  }
}

/**
 * Clears all recent searches
 */
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {}
}

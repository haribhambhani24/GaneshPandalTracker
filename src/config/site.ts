/**
 * Site-wide configuration constants.
 * Replace placeholder values before deploying to production.
 */
export const siteConfig = {
  name: 'Ganesh Pandal Tracker',
  nameShort: 'Pandal Tracker',
  tagline: 'Mumbai Ganesh Chaturthi Pandal Guide',
  description: 'Find pandals, timings and routes — all in one place.',
  url: 'https://ganeshpandaltracker.com', // MANUAL: replace with real domain
  contact: {
    email: 'haribhambhani24@gmail.com',
  },
  social: {
    // Leave empty string to hide the link in the footer
    twitter: '', // MANUAL: replace with @handle or leave empty
    instagram: '', // MANUAL: replace with @handle or leave empty
  },
  credits: {
    osmUrl: 'https://www.openstreetmap.org/copyright',
    leafletUrl: 'https://leafletjs.com',
    supabaseUrl: 'https://supabase.com',
  },
  legal: {
    lastUpdated: '1 November 2026', // MANUAL: update when content changes
  },
} as const;


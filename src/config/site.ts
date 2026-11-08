// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

/**
 * Site Configuration & External Links
 *
 * NOTE FOR SITE OWNER:
 * Replace the placeholder values below with your real contact email and social accounts.
 * Any entry left as an empty string ("") will automatically be hidden in the footer and contact page.
 */

export interface SiteConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  contact: {
    email: string; // e.g. "contact@mumbaiganeshpandals.com"
    phonePlaceholder?: string;
  };
  social: {
    twitter?: string; // e.g. "https://twitter.com/example"
    instagram?: string; // e.g. "https://instagram.com/example"
    github?: string; // e.g. "https://github.com/example/ganesh-pandal-tracker"
    whatsappGroup?: string; // e.g. "https://chat.whatsapp.com/example"
  };
  emergency: {
    number: string;
    description: string;
  };
  credits: {
    osmUrl: string;
    leafletUrl: string;
    supabaseUrl: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'Ganesh Pandal Tracker',
  shortName: 'Pandal Tracker',
  tagline: 'Mumbai Ganesh Chaturthi Pandal Guide',
  description: 'Find pandals, timings and routes, all in one place.',
  url: 'https://mumbaiganeshpandals.com',
  contact: {
    // MANUAL ACTION: Replace with your actual contact / support email
    email: 'contact@example.com',
  },
  social: {
    // MANUAL ACTION: Replace with your actual social links, or leave empty "" to hide
    twitter: 'https://x.com/example',
    instagram: '',
    github: 'https://github.com/example/ganesh-pandal-tracker',
    whatsappGroup: '',
  },
  emergency: {
    number: '112',
    description: 'National Emergency Number (Police, Fire, Ambulance)',
  },
  credits: {
    osmUrl: 'https://www.openstreetmap.org/copyright',
    leafletUrl: 'https://leafletjs.com/',
    supabaseUrl: 'https://supabase.com/',
  },
};


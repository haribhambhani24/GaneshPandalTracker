/**
 * Timings & Real-Time Status Utilities
 * Calculates live "Open Now / Closed" status and conversational "Next Aarti" countdowns
 * strictly using Mumbai IST (Indian Standard Time, UTC+5:30).
 */
import type { Pandal } from '../types/pandal';

export interface DarshanStatus {
  isOpen: boolean;
  is24Hours: boolean;
  statusText: string;
  statusType: 'open' | 'closed' | '24hours';
  closingTime?: string;
  openingTime?: string;
}

export interface NextAartiInfo {
  timeStr: string;
  aartiName: string;
  minutesUntil: number;
  displayText: string;
}

/**
 * Returns current date/time in Indian Standard Time (IST)
 */
export function getMumbaiTime(): Date {
  const now = new Date();
  // Format into Asia/Kolkata date string and parse
  const istString = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  return new Date(istString);
}

/**
 * Parses time strings like "6:00 AM", "12:30 PM", "8:30 PM", "11:00 PM"
 * into minutes from midnight (0 to 1439).
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  const match = timeStr.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Determines whether darshan is currently open at this pandal
 */
export function getDarshanStatus(pandal: Pandal, referenceTime: Date = getMumbaiTime()): DarshanStatus {
  if (pandal.is24Hours) {
    return {
      isOpen: true,
      is24Hours: true,
      statusText: 'Open 24 Hours',
      statusType: '24hours',
    };
  }

  const timings = pandal.darshanTimings || '';
  // Check if string mentions 24 Hours
  if (/24\s*hours/i.test(timings)) {
    return {
      isOpen: true,
      is24Hours: true,
      statusText: 'Open 24 Hours',
      statusType: '24hours',
    };
  }

  // Look for patterns like "6:00 AM - 11:00 PM" or "5:00 AM to 12:00 AM"
  const rangeMatch = timings.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM))\s*(?:-|to)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/i);
  if (!rangeMatch) {
    // Default open during daytime if hours aren't strictly parseable
    return {
      isOpen: true,
      is24Hours: false,
      statusText: timings || 'Open Daily',
      statusType: 'open',
    };
  }

  const openMins = parseTimeToMinutes(rangeMatch[1]);
  let closeMins = parseTimeToMinutes(rangeMatch[2]);

  if (openMins === null || closeMins === null) {
    return {
      isOpen: true,
      is24Hours: false,
      statusText: timings,
      statusType: 'open',
    };
  }

  // If closing at 12:00 AM or 1:00 AM (past midnight)
  if (closeMins <= openMins) {
    closeMins += 24 * 60;
  }

  const currentMins = referenceTime.getHours() * 60 + referenceTime.getMinutes();
  const isOpen = currentMins >= openMins && currentMins < closeMins;

  if (isOpen) {
    return {
      isOpen: true,
      is24Hours: false,
      statusText: `Open now • Closes ${rangeMatch[2]}`,
      statusType: 'open',
      closingTime: rangeMatch[2],
    };
  } else {
    return {
      isOpen: false,
      is24Hours: false,
      statusText: `Closed now • Opens ${rangeMatch[1]}`,
      statusType: 'closed',
      openingTime: rangeMatch[1],
    };
  }
}

/**
 * Finds the next upcoming aarti today or tomorrow morning in conversational terms
 */
export function getNextAarti(pandal: Pandal, referenceTime: Date = getMumbaiTime()): NextAartiInfo | null {
  const aartiStr = pandal.aartiTimings;
  if (!aartiStr) return null;

  // Extract all time patterns like "7:00 AM", "12:30 PM", "8:30 PM"
  const regex = /(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/gi;
  const matches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(aartiStr)) !== null) {
    matches.push(m[1]);
  }

  if (matches.length === 0) return null;

  const currentMins = referenceTime.getHours() * 60 + referenceTime.getMinutes();
  const parsedAartis: { timeStr: string; mins: number }[] = [];

  for (const timeStr of matches) {
    const mins = parseTimeToMinutes(timeStr);
    if (mins !== null) {
      parsedAartis.push({ timeStr, mins });
    }
  }

  parsedAartis.sort((a, b) => a.mins - b.mins);

  // Look for the next one today
  const nextToday = parsedAartis.find((a) => a.mins > currentMins);

  if (nextToday) {
    const diff = nextToday.mins - currentMins;
    const displayText = diff <= 60 ? `in ${diff} min (${nextToday.timeStr})` : `today at ${nextToday.timeStr}`;

    return {
      timeStr: nextToday.timeStr,
      aartiName: 'Aarti',
      minutesUntil: diff,
      displayText,
    };
  }

  // If all today's aartis have passed, next is the earliest tomorrow
  const firstTomorrow = parsedAartis[0];
  if (firstTomorrow) {
    const diff = 24 * 60 - currentMins + firstTomorrow.mins;
    return {
      timeStr: firstTomorrow.timeStr,
      aartiName: 'Morning Aarti',
      minutesUntil: diff,
      displayText: `tomorrow at ${firstTomorrow.timeStr}`,
    };
  }

  return null;
}

/**
 * Calculates rough walking and transit times based on distance in kilometers
 */
export function getTravelEstimate(distanceKm?: number | null): {
  walkingMin: number;
  transitMin: number;
  walkingText: string;
  transitText: string;
} | null {
  if (distanceKm === undefined || distanceKm === null || isNaN(distanceKm)) {
    return null;
  }

  // Walking speed ~ 4.8 km/h = 12.5 min/km
  const walkingMin = Math.max(1, Math.round(distanceKm * 12.5));
  // Mumbai local traffic / auto-rickshaw ~ 18 km/h + 4 min wait
  const transitMin = Math.max(3, Math.round(distanceKm * 3.3 + 4));

  const walkingText = walkingMin < 60 ? `~${walkingMin} min walk` : `~${(walkingMin / 60).toFixed(1)} hr walk`;
  const transitText = transitMin < 60 ? `~${transitMin} min drive` : `~${(transitMin / 60).toFixed(1)} hr drive`;

  return {
    walkingMin,
    transitMin,
    walkingText,
    transitText,
  };
}


// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import type { RouteStep } from '../services/routing';

/**
 * Format duration in seconds into human-readable string (mins, hrs)
 */
export function formatRouteDuration(seconds: number, lang: string = 'en'): string {
  const mins = Math.max(1, Math.round(seconds / 60));
  if (mins < 60) {
    if (lang === 'hi') return `${mins} मिनट`;
    if (lang === 'mr') return `${mins} मिनिटे`;
    return `${mins} min${mins > 1 ? 's' : ''}`;
  }
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (lang === 'hi') {
    return remainingMins > 0 ? `${hrs} घंटा ${remainingMins} मिनट` : `${hrs} घंटा`;
  }
  if (lang === 'mr') {
    return remainingMins > 0 ? `${hrs} तास ${remainingMins} मिनिटे` : `${hrs} तास`;
  }
  return remainingMins > 0 ? `${hrs} hr ${remainingMins} mins` : `${hrs} hr`;
}

/**
 * Format distance in meters into human-readable string (m or km)
 */
export function formatRouteDistance(meters: number, lang: string = 'en'): string {
  if (meters < 1000) {
    const rounded = Math.round(meters / 10) * 10;
    if (lang === 'hi') return `${rounded} मी`;
    if (lang === 'mr') return `${rounded} मी`;
    return `${rounded} m`;
  }
  const km = (meters / 1000).toFixed(1);
  if (lang === 'hi') return `${km} किमी`;
  if (lang === 'mr') return `${km} किमी`;
  return `${km} km`;
}

/**
 * Generate human-friendly, translated turn-by-turn guidance instruction
 */
export function formatManeuverInstruction(
  step: RouteStep,
  lang: string = 'en',
  destinationName?: string
): string {
  const type = step.maneuverType || 'turn';
  const mod = step.modifier || '';
  const street = step.name || '';

  // 1. ARRIVE
  if (type === 'arrive') {
    const dest = destinationName || (lang === 'hi' ? 'गंतव्य' : lang === 'mr' ? 'मुक्कामी' : 'destination');
    if (lang === 'hi') return `${dest} पर पहुंचे`;
    if (lang === 'mr') return `${dest} येथे पोहोचले`;
    return `Arrive at ${dest}`;
  }

  // 2. DEPART
  if (type === 'depart') {
    if (street) {
      if (lang === 'hi') return `${street} पर आगे बढ़ें`;
      if (lang === 'mr') return `${street} वरून पुढे जा`;
      return `Head out on ${street}`;
    }
    if (lang === 'hi') return 'आगे बढ़ें';
    if (lang === 'mr') return 'पुढे जा';
    return 'Head towards destination';
  }

  // 3. ROUNDABOUT
  if (type.includes('roundabout') || type.includes('rotary')) {
    if (street) {
      if (lang === 'hi') return `गोलचक्कर से ${street} की ओर निकलें`;
      if (lang === 'mr') return `गोलचक्रावरून ${street} कडे जा`;
      return `At the roundabout, exit onto ${street}`;
    }
    if (lang === 'hi') return 'गोलचक्कर पर घूमें';
    if (lang === 'mr') return 'गोलचक्रातून वळा';
    return 'Take the roundabout';
  }

  // 4. FORK
  if (type === 'fork') {
    const side = mod.includes('left')
      ? lang === 'hi' ? 'बाईं' : lang === 'mr' ? 'डाव्या' : 'left'
      : lang === 'hi' ? 'दाहिनी' : lang === 'mr' ? 'उजव्या' : 'right';
    if (street) {
      if (lang === 'hi') return `कांटे पर ${side} ओर ${street} पर रहें`;
      if (lang === 'mr') return `फाट्यावर ${side} बाजूने ${street} वर राहा`;
      return `Keep ${side} at the fork onto ${street}`;
    }
    if (lang === 'hi') return `कांटे पर ${side} ओर रहें`;
    if (lang === 'mr') return `फाट्यावर ${side} बाजूने राहा`;
    return `Keep ${side} at the fork`;
  }

  // 5. TURN / NEW NAME / CONTINUE
  const modText = getTurnModifierText(mod, lang);
  if (street) {
    if (lang === 'hi') return `${street} की ओर ${modText} मुड़ें`;
    if (lang === 'mr') return `${street} कडे ${modText} वळा`;
    return `Turn ${modText} onto ${street}`;
  }

  if (modText) {
    if (lang === 'hi') return `${modText} मुड़ें`;
    if (lang === 'mr') return `${modText} वळा`;
    return `Turn ${modText}`;
  }

  if (lang === 'hi') return 'सीधे आगे बढ़ें';
  if (lang === 'mr') return 'सरळ पुढे जा';
  return 'Continue straight';
}

function getTurnModifierText(modifier: string, lang: string): string {
  switch (modifier) {
    case 'sharp right':
      return lang === 'hi' ? 'तीव्र दाहिने' : lang === 'mr' ? 'तीव्र उजवीकडे' : 'sharp right';
    case 'right':
      return lang === 'hi' ? 'दाहिने' : lang === 'mr' ? 'उजवीकडे' : 'right';
    case 'slight right':
      return lang === 'hi' ? 'हल्का दाहिने' : lang === 'mr' ? 'किंचित उजवीकडे' : 'slight right';
    case 'sharp left':
      return lang === 'hi' ? 'तीव्र बाएं' : lang === 'mr' ? 'तीव्र डावीकडे' : 'sharp left';
    case 'left':
      return lang === 'hi' ? 'बाएं' : lang === 'mr' ? 'डावीकडे' : 'left';
    case 'slight left':
      return lang === 'hi' ? 'हल्का बाएं' : lang === 'mr' ? 'किंचित डावीकडे' : 'slight left';
    case 'uturn':
      return lang === 'hi' ? 'यू-टर्न' : lang === 'mr' ? 'यू-टर्न' : 'U-turn';
    case 'straight':
    default:
      return lang === 'hi' ? 'सीधे' : lang === 'mr' ? 'सरळ' : 'straight';
  }
}


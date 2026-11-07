export const MUMBAI_CENTER: [number, number] = [19.0150, 72.8450];
export const DEFAULT_ZOOM = 12;

/**
 * Generates a direct Google Maps navigation URL for a given destination.
 */
export function getGoogleMapsDirectionsUrl(lat: number, lng: number, placeName?: string): string {
  const query = placeName ? encodeURIComponent(`${placeName}, ${lat},${lng}`) : `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
}

/**
 * Calculates distance in kilometers between two GPS coordinates using Haversine formula.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Formats distance for display.
 */
export function formatDistance(distanceKm: number, locale = 'en-IN'): string {
  if (distanceKm < 1) {
    const m = Math.round(distanceKm * 1000);
    return `${m.toLocaleString(locale)} m`;
  }
  const km = Number(distanceKm.toFixed(1));
  return `${km.toLocaleString(locale)} km`;
}


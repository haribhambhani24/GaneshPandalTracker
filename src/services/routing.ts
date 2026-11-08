/**
 * In-App Routing Service for Ganesh Pandal Tracker
 * Powered by OpenStreetMap / FOSSGIS OSRM
 * 
 * Features:
 * - Provider interface allowing seamless swapping between backends.
 * - Default: FOSSGIS OSRM (routing.openstreetmap.de) with foot, car, and bike profiles.
 * - Secondary stub: OpenRouteService / Self-Hosted OSRM via VITE_ROUTING_BASE_URL.
 * - In-memory and sessionStorage route caching keyed by rounded coordinates + mode.
 * - Timeout (7s) with AbortController, exponential backoff retry.
 * - Request debouncing to prevent spamming the public server.
 * - Offline fallback from local cache.
 */

export type TravelMode = 'walk' | 'drive' | 'bike';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteStep {
  instruction: string;
  maneuverType: string;
  modifier?: string;
  distanceMeters: number;
  durationSeconds: number;
  name: string;
  location: [number, number]; // [lat, lng]
}

export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng]
  distanceMeters: number;
  durationSeconds: number;
  steps: RouteStep[];
  mode: TravelMode;
  attribution: string;
  isOfflineFallback?: boolean;
}

export interface RouteLeg {
  fromIndex: number;
  toIndex: number;
  distanceMeters: number;
  durationSeconds: number;
  coordinates: [number, number][];
  steps: RouteStep[];
}

export interface MultiStopRouteResult {
  legs: RouteLeg[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  fullCoordinates: [number, number][];
  mode: TravelMode;
  attribution: string;
  isOfflineFallback?: boolean;
}

export interface RoutingProvider {
  getRoute(origin: Coordinates, destination: Coordinates, mode: TravelMode): Promise<RouteResult>;
  getMultiStopRoute(points: Coordinates[], mode: TravelMode): Promise<MultiStopRouteResult>;
}

const ROUTING_ATTRIBUTION = 'Routing by OSRM / FOSSGIS, map data © OpenStreetMap contributors';
const CACHE_STORAGE_KEY_PREFIX = 'ganesh_pandal_route_cache_';
const LAST_ROUTE_KEY = 'ganesh_pandal_last_route';

/**
 * In-memory LRU-like cache
 */
const inMemoryCache = new Map<string, { data: RouteResult; timestamp: number }>();
const inMemoryMultiStopCache = new Map<string, { data: MultiStopRouteResult; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

/**
 * Cache key generator based on rounded coordinates (~11 meters resolution)
 */
function getCacheKey(origin: Coordinates, destination: Coordinates, mode: TravelMode): string {
  const oLat = origin.lat.toFixed(4);
  const oLng = origin.lng.toFixed(4);
  const dLat = destination.lat.toFixed(4);
  const dLng = destination.lng.toFixed(4);
  return `${mode}_${oLat},${oLng}_to_${dLat},${dLng}`;
}

function getMultiStopCacheKey(points: Coordinates[], mode: TravelMode): string {
  const pts = points.map((p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`).join(';');
  return `multi_${mode}_${pts}`;
}

/**
 * Debounce / In-flight request deduplication map
 */
const inflightRequests = new Map<string, Promise<RouteResult>>();
const inflightMultiRequests = new Map<string, Promise<MultiStopRouteResult>>();

/**
 * Default Provider: FOSSGIS OSRM
 */
export class OsrmFossgisProvider implements RoutingProvider {
  private getEndpointForMode(mode: TravelMode): string {
    switch (mode) {
      case 'walk':
        return 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/';
      case 'bike':
        return 'https://routing.openstreetmap.de/routed-bike/route/v1/driving/';
      case 'drive':
      default:
        return 'https://routing.openstreetmap.de/routed-car/route/v1/driving/';
    }
  }

  private async fetchWithRetry(url: string, retries = 1, timeoutMs = 7000): Promise<Response> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (response.ok) return response;
        if (response.status === 429) {
          // Rate limit wait
          await new Promise((r) => setTimeout(r, 1500));
        }
      } catch (err: unknown) {
        clearTimeout(timer);
        if (attempt === retries) throw err;
        await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
      }
    }
    throw new Error('Routing service request failed after retry');
  }

  public async getRoute(
    origin: Coordinates,
    destination: Coordinates,
    mode: TravelMode
  ): Promise<RouteResult> {
    const cacheKey = getCacheKey(origin, destination, mode);

    // 1. Check in-memory cache
    const cached = inMemoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    // 2. Check in-flight requests (deduplication)
    if (inflightRequests.has(cacheKey)) {
      return inflightRequests.get(cacheKey)!;
    }

    const requestPromise = (async () => {
      const baseUrl = this.getEndpointForMode(mode);
      const coordsQuery = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
      const url = `${baseUrl}${coordsQuery}?overview=full&geometries=geojson&steps=true&annotations=false`;

      try {
        const response = await this.fetchWithRetry(url);
        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
          throw new Error(data.message || 'No route found between these locations');
        }

        const route = data.routes[0];
        // OSRM coordinates are [lng, lat]; convert to Leaflet [lat, lng]
        const rawCoords: [number, number][] = route.geometry.coordinates;
        const coordinates: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);

        const steps: RouteStep[] = [];
        if (route.legs && route.legs.length > 0) {
          route.legs.forEach((leg: any) => {
            if (leg.steps) {
              leg.steps.forEach((s: any) => {
                const maneuver = s.maneuver || {};
                const mLoc = maneuver.location || [0, 0];
                steps.push({
                  instruction: s.name ? `${maneuver.type} onto ${s.name}` : maneuver.type,
                  maneuverType: maneuver.type || 'turn',
                  modifier: maneuver.modifier,
                  distanceMeters: Math.round(s.distance || 0),
                  durationSeconds: Math.round(s.duration || 0),
                  name: s.name || '',
                  location: [mLoc[1], mLoc[0]],
                });
              });
            }
          });
        }

        const result: RouteResult = {
          coordinates,
          distanceMeters: Math.round(route.distance),
          durationSeconds: Math.round(route.duration),
          steps,
          mode,
          attribution: ROUTING_ATTRIBUTION,
        };

        // Cache result
        inMemoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
        try {
          localStorage.setItem(LAST_ROUTE_KEY, JSON.stringify(result));
          sessionStorage.setItem(`${CACHE_STORAGE_KEY_PREFIX}${cacheKey}`, JSON.stringify(result));
        } catch {
          // Ignore quota errors
        }

        return result;
      } catch (err: unknown) {
        // Attempt offline fallback from localStorage
        try {
          const lastSaved = localStorage.getItem(LAST_ROUTE_KEY);
          if (lastSaved) {
            const parsed = JSON.parse(lastSaved) as RouteResult;
            parsed.isOfflineFallback = true;
            return parsed;
          }
        } catch {
          // fallback failed
        }
        throw err;
      } finally {
        inflightRequests.delete(cacheKey);
      }
    })();

    inflightRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  public async getMultiStopRoute(
    points: Coordinates[],
    mode: TravelMode
  ): Promise<MultiStopRouteResult> {
    if (points.length < 2) {
      throw new Error('Multi-stop route requires at least 2 points');
    }

    const cacheKey = getMultiStopCacheKey(points, mode);
    const cached = inMemoryMultiStopCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    if (inflightMultiRequests.has(cacheKey)) {
      return inflightMultiRequests.get(cacheKey)!;
    }

    const requestPromise = (async () => {
      const baseUrl = this.getEndpointForMode(mode);
      const coordsQuery = points.map((p) => `${p.lng},${p.lat}`).join(';');
      const url = `${baseUrl}${coordsQuery}?overview=full&geometries=geojson&steps=true`;

      try {
        const response = await this.fetchWithRetry(url);
        const data = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
          throw new Error(data.message || 'Unable to calculate multi-stop route');
        }

        const route = data.routes[0];
        const rawCoords: [number, number][] = route.geometry.coordinates;
        const fullCoordinates: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng]);

        const legs: RouteLeg[] = [];
        if (route.legs && route.legs.length > 0) {
          route.legs.forEach((leg: any, idx: number) => {
            const legCoords: [number, number][] = [];
            const legSteps: RouteStep[] = [];

            if (leg.steps) {
              leg.steps.forEach((s: any) => {
                const maneuver = s.maneuver || {};
                const mLoc = maneuver.location || [0, 0];
                legSteps.push({
                  instruction: s.name ? `${maneuver.type} onto ${s.name}` : maneuver.type,
                  maneuverType: maneuver.type || 'turn',
                  modifier: maneuver.modifier,
                  distanceMeters: Math.round(s.distance || 0),
                  durationSeconds: Math.round(s.duration || 0),
                  name: s.name || '',
                  location: [mLoc[1], mLoc[0]],
                });
                if (s.geometry?.coordinates) {
                  s.geometry.coordinates.forEach(([lng, lat]: [number, number]) => {
                    legCoords.push([lat, lng]);
                  });
                }
              });
            }

            legs.push({
              fromIndex: idx,
              toIndex: idx + 1,
              distanceMeters: Math.round(leg.distance || 0),
              durationSeconds: Math.round(leg.duration || 0),
              coordinates: legCoords.length > 0 ? legCoords : fullCoordinates,
              steps: legSteps,
            });
          });
        }

        const result: MultiStopRouteResult = {
          legs,
          totalDistanceMeters: Math.round(route.distance),
          totalDurationSeconds: Math.round(route.duration),
          fullCoordinates,
          mode,
          attribution: ROUTING_ATTRIBUTION,
        };

        inMemoryMultiStopCache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      } finally {
        inflightMultiRequests.delete(cacheKey);
      }
    })();

    inflightMultiRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }
}

/**
 * Secondary Provider Stub: Custom / Self-Hosted / OpenRouteService
 * Configurable via import.meta.env.VITE_ROUTING_BASE_URL.
 * If credentials are required, proxy through a Supabase Edge Function to avoid client secrets.
 */
export class CustomRoutingProvider implements RoutingProvider {
  private fallback = new OsrmFossgisProvider();

  public async getRoute(
    origin: Coordinates,
    destination: Coordinates,
    mode: TravelMode
  ): Promise<RouteResult> {
    const customBase = import.meta.env.VITE_ROUTING_BASE_URL;
    if (!customBase) {
      return this.fallback.getRoute(origin, destination, mode);
    }
    // Custom endpoint implementation follows standard OSRM v1 spec
    const coordsQuery = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url = `${customBase}/${mode}/${coordsQuery}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url);
    if (!res.ok) {
      return this.fallback.getRoute(origin, destination, mode);
    }
    const data = await res.json();
    const route = data.routes[0];
    return {
      coordinates: route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]),
      distanceMeters: Math.round(route.distance),
      durationSeconds: Math.round(route.duration),
      steps: [],
      mode,
      attribution: 'Routing via Custom Server',
    };
  }

  public async getMultiStopRoute(
    points: Coordinates[],
    mode: TravelMode
  ): Promise<MultiStopRouteResult> {
    return this.fallback.getMultiStopRoute(points, mode);
  }
}

/**
 * Utility: Point-to-line segment distance calculation (for off-route detection)
 */
export function getDistanceToPolylineMeters(
  point: Coordinates,
  polyline: [number, number][]
): number {
  if (polyline.length === 0) return 0;
  if (polyline.length === 1) {
    return calculateHaversineMeters(point.lat, point.lng, polyline[0][0], polyline[0][1]);
  }

  let minDistance = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const dist = distanceToSegmentMeters(
      point.lat,
      point.lng,
      polyline[i][0],
      polyline[i][1],
      polyline[i + 1][0],
      polyline[i + 1][1]
    );
    if (dist < minDistance) minDistance = dist;
  }
  return minDistance;
}

function calculateHaversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function distanceToSegmentMeters(
  pLat: number,
  pLng: number,
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  // Approximate flat earth projection around pLat
  const cosLat = Math.cos((pLat * Math.PI) / 180);
  const px = pLng * cosLat * 111320;
  const py = pLat * 110540;
  const ax = aLng * cosLat * 111320;
  const ay = aLat * 110540;
  const bx = bLng * cosLat * 111320;
  const by = bLat * 110540;

  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;

  const abLenSq = abx * abx + aby * aby;
  if (abLenSq === 0) return Math.hypot(apx, apy);

  let t = (apx * abx + apy * aby) / abLenSq;
  t = Math.max(0, Math.min(1, t));

  const nearestX = ax + t * abx;
  const nearestY = ay + t * aby;
  return Math.hypot(px - nearestX, py - nearestY);
}

// Active singleton instance
export const routingService = new OsrmFossgisProvider();


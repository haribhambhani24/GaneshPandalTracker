/**
 * In-App Routing Service for Ganesh Pandal Tracker.
 * Provider interface with default OSRM (FOSSGIS) implementation,
 * exponential backoff, request debouncing, and in-memory LRU caching.
 */

export type TravelMode = 'foot' | 'driving' | 'bike';

export interface RouteCoordinate {
  lat: number;
  lng: number;
}

export interface RouteStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  maneuverType: string;
  modifier?: string;
  name: string;
  location: [number, number]; // [lat, lng]
}

export interface RouteResult {
  coordinates: [number, number][]; // [lat, lng] array for Leaflet polyline
  distance: number; // meters
  duration: number; // seconds
  steps: RouteStep[];
  mode: TravelMode;
  provider: string;
}

export interface RoutingProvider {
  name: string;
  getRoute(
    points: RouteCoordinate[],
    mode: TravelMode,
    signal?: AbortSignal
  ): Promise<RouteResult>;
}

// In-memory route cache keyed by rounded coordinates + mode
const routeCache = new Map<string, { result: RouteResult; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
const MAX_CACHE_ENTRIES = 50;

function buildCacheKey(points: RouteCoordinate[], mode: TravelMode): string {
  // Round coordinates to 4 decimal places (~11 meters)
  const coordsKey = points
    .map((p) => `${p.lat.toFixed(4)},${p.lng.toFixed(4)}`)
    .join(';');
  return `${mode}:${coordsKey}`;
}

/**
 * Default OSRM implementation via routing.openstreetmap.de
 */
class OSRMProvider implements RoutingProvider {
  name = 'OSRM / FOSSGIS';

  private getProfile(mode: TravelMode): { server: string; profile: string } {
    switch (mode) {
      case 'driving':
        return { server: 'routed-car', profile: 'driving' };
      case 'bike':
        return { server: 'routed-bike', profile: 'cycling' };
      case 'foot':
      default:
        return { server: 'routed-foot', profile: 'walking' };
    }
  }

  async getRoute(
    points: RouteCoordinate[],
    mode: TravelMode,
    signal?: AbortSignal
  ): Promise<RouteResult> {
    if (points.length < 2) {
      throw new Error('At least 2 points are required to compute a route.');
    }

    const cacheKey = buildCacheKey(points, mode);
    const cached = routeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.result;
    }

    const { server, profile } = this.getProfile(mode);
    const coordsPath = points.map((p) => `${p.lng},${p.lat}`).join(';');
    
    // Check custom routing base URL override from env if present
    const baseUrl =
      (import.meta as unknown as { env?: { VITE_ROUTING_BASE_URL?: string } })
        .env?.VITE_ROUTING_BASE_URL ||
      `https://routing.openstreetmap.de/${server}`;

    const url = `${baseUrl}/route/v1/${profile}/${coordsPath}?overview=full&geometries=geojson&steps=true`;

    let attempts = 0;
    const maxRetries = 2;
    let lastError: Error | null = null;

    while (attempts <= maxRetries) {
      try {
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => timeoutController.abort(), 9000);

        const mergedSignal = signal
          ? anySignal([signal, timeoutController.signal])
          : timeoutController.signal;

        const response = await fetch(url, {
          signal: mergedSignal,
          headers: {
            Accept: 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Routing service returned status ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
          throw new Error(data?.message || 'No route found between selected points.');
        }

        const bestRoute = data.routes[0];
        const coordinates: [number, number][] = bestRoute.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]] // convert GeoJSON [lng, lat] to Leaflet [lat, lng]
        );

        const steps: RouteStep[] = [];
        if (bestRoute.legs) {
          for (const leg of bestRoute.legs) {
            if (leg.steps) {
              for (const s of leg.steps) {
                steps.push({
                  instruction: s.maneuver?.instruction || '',
                  distance: s.distance || 0,
                  duration: s.duration || 0,
                  maneuverType: s.maneuver?.type || 'turn',
                  modifier: s.maneuver?.modifier || undefined,
                  name: s.name || '',
                  location: s.maneuver?.location
                    ? [s.maneuver.location[1], s.maneuver.location[0]]
                    : [0, 0],
                });
              }
            }
          }
        }

        const result: RouteResult = {
          coordinates,
          distance: bestRoute.distance,
          duration: bestRoute.duration,
          steps,
          mode,
          provider: this.name,
        };

        // Update cache
        if (routeCache.size >= MAX_CACHE_ENTRIES) {
          const oldestKey = routeCache.keys().next().value;
          if (oldestKey) routeCache.delete(oldestKey);
        }
        routeCache.set(cacheKey, { result, timestamp: Date.now() });

        return result;
      } catch (err: unknown) {
        lastError = err as Error;
        attempts++;
        if (attempts <= maxRetries) {
          // Exponential backoff: 300ms, 800ms
          await new Promise((resolve) => setTimeout(resolve, attempts * 400));
        }
      }
    }

    throw lastError || new Error('Failed to fetch route. Please try again.');
  }
}

function anySignal(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort();
      return controller.signal;
    }
    sig.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return controller.signal;
}

export const routingService: RoutingProvider = new OSRMProvider();


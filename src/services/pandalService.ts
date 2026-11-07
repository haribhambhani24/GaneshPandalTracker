import type { Pandal, PandalSubmission, PandalStatus, CrowdLevel } from '../types/pandal';
import rawPandalsData from '../data/pandals.json?raw';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const CACHE_STORAGE_KEY = 'ganesh_pandal_tracker_offline_pandals';
const REQUEST_TIMEOUT_MS = 8000;

// Type representing a Supabase DB row
interface PandalDbRow {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  address: string;
  description: string | null;
  photo_url: string;
  gallery: string[] | null;
  history: string | null;
  darshan_timings: string;
  aarti_timings: string;
  eco_friendly: boolean | null;
  is_24_hours: boolean | null;
  crowd_level: CrowdLevel;
  nearest_station: string;
  visarjan_date: string;
  status: PandalStatus;
  created_at?: string;
}

/**
 * Strips dangerous HTML angle brackets to prevent stored XSS attacks.
 */
export function sanitizeInput(input?: string | null): string {
  if (!input) return '';
  return input.replace(/[<>]/g, '').trim();
}

/**
 * Validates that an image URL begins with http:// or https://.
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Wraps a promise in a timeout to prevent infinite hangs on unstable networks.
 */
function withTimeout<T>(promise: PromiseLike<T>, timeoutMs = REQUEST_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Network request timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

/**
 * Maps a PostgreSQL database row (snake_case) to the frontend Pandal model (camelCase).
 */
export function mapDbRowToPandal(row: PandalDbRow): Pandal {
  return {
    id: row.id,
    name: sanitizeInput(row.name),
    area: sanitizeInput(row.area),
    lat: Number(row.lat),
    lng: Number(row.lng),
    address: sanitizeInput(row.address),
    description: sanitizeInput(row.description || ''),
    photoUrl: row.photo_url,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    history: sanitizeInput(row.history || ''),
    darshanTimings: sanitizeInput(row.darshan_timings),
    aartiTimings: sanitizeInput(row.aarti_timings),
    ecoFriendly: Boolean(row.eco_friendly),
    is24Hours: Boolean(row.is_24_hours),
    crowdLevel: row.crowd_level || 'Medium',
    nearestStation: sanitizeInput(row.nearest_station),
    visarjanDate: sanitizeInput(row.visarjan_date),
    status: row.status || 'approved',
    createdAt: row.created_at,
  };
}

/**
 * Service to manage pandal data access.
 * Backed by Supabase with automatic fallback to local JSON & localStorage cache.
 */
class PandalService {
  private cachedPandals: Pandal[] | null = null;
  public isFallbackActive = false;
  public lastError: string | null = null;

  /**
   * Helper that strips comments (e.g. `// TODO: verify`)
   * from JSON text without breaking URLs containing `://`.
   */
  private parseJsonFallback(): Pandal[] {
    try {
      const sanitized = rawPandalsData
        .replace(/\/\/\s*TODO:[^\r\n]*/g, '')
        .replace(/(^|[^:])\/\/[^\r\n]*/g, '$1');
      const parsed = JSON.parse(sanitized) as Pandal[];
      return parsed.map((p) => ({
        ...p,
        name: sanitizeInput(p.name),
        area: sanitizeInput(p.area),
        address: sanitizeInput(p.address),
        description: sanitizeInput(p.description),
        history: sanitizeInput(p.history),
        status: 'approved' as PandalStatus,
      }));
    } catch (e) {
      console.error('Failed to parse fallback pandals.json:', e);
      return [];
    }
  }

  /**
   * Fetch approved pandals for the public map & list.
   * Prioritizes Supabase -> localStorage offline cache -> bundled pandals.json
   */
  public async getPandals(): Promise<Pandal[]> {
    if (this.cachedPandals && this.cachedPandals.length > 0) {
      return this.cachedPandals;
    }

    if (isSupabaseConfigured) {
      try {
        const queryPromise = supabase
          .from('pandals')
          .select('*')
          .eq('status', 'approved')
          .order('name');

        const { data, error } = await withTimeout(queryPromise);

        if (!error && data && data.length > 0) {
          const mapped = (data as unknown as PandalDbRow[]).map(mapDbRowToPandal);
          this.cachedPandals = mapped;
          this.isFallbackActive = false;
          this.lastError = null;

          // Cache in localStorage for PWA offline experience
          try {
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(mapped));
          } catch {
            // Ignore quota issues
          }

          return mapped;
        } else if (error) {
          this.isFallbackActive = true;
          this.lastError = error.message;
          console.warn('Supabase query error, switching to fallback:', error.message);
        }
      } catch (err) {
        this.isFallbackActive = true;
        this.lastError = err instanceof Error ? err.message : 'Connection failed';
        console.warn('Network or Supabase connection failure, falling back to local cache/json:', err);
      }
    } else {
      this.isFallbackActive = true;
    }

    // Try reading last-loaded offline cache
    try {
      const cached = localStorage.getItem(CACHE_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Pandal[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cachedPandals = parsed;
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }

    // Final fallback to bundled JSON
    const fallbackData = this.parseJsonFallback();
    this.cachedPandals = fallbackData;
    return fallbackData;
  }

  /**
   * Force refresh pandals from Supabase (bypasses memory cache).
   */
  public async refreshPandals(): Promise<Pandal[]> {
    this.cachedPandals = null;
    return this.getPandals();
  }

  /**
   * Fetch a single pandal by id.
   */
  public async getPandalById(id: string): Promise<Pandal | undefined> {
    const list = await this.getPandals();
    return list.find((p) => p.id === id);
  }

  /**
   * Upload an image to the 'pandal-photos' public storage bucket.
   * Returns the public URL of the uploaded image.
   */
  public async uploadPandalPhoto(file: File): Promise<string> {
    if (!isSupabaseConfigured) {
      // Local object URL fallback if Supabase not configured
      return URL.createObjectURL(file);
    }

    // Validate size (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Image size must be less than 2 MB');
    }

    // Validate MIME type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!validMimes.includes(file.type.toLowerCase())) {
      throw new Error('Only image files (JPEG, PNG, WebP, GIF, AVIF) are permitted.');
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    const uploadPromise = supabase.storage
      .from('pandal-photos')
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    const { error: uploadError } = await withTimeout(uploadPromise, 15000);

    if (uploadError) {
      throw new Error(`Failed to upload photo: ${uploadError.message}`);
    }

    const { data } = supabase.storage
      .from('pandal-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Submit a new pandal. Always sets status to 'pending'.
   */
  public async submitPandal(submission: PandalSubmission): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      // In offline/mock mode, simulate successful pending submission
      return { success: true };
    }

    try {
      const sanitizedPhoto = submission.photoUrl.trim();
      if (!isValidImageUrl(sanitizedPhoto)) {
        return { success: false, error: 'Invalid photo URL protocol. Must use http:// or https://' };
      }

      const dbPayload = {
        name: sanitizeInput(submission.name),
        area: sanitizeInput(submission.area),
        lat: Number(submission.lat),
        lng: Number(submission.lng),
        address: sanitizeInput(submission.address),
        description: sanitizeInput(submission.description || ''),
        photo_url: sanitizedPhoto,
        gallery: submission.gallery || [sanitizedPhoto],
        history: sanitizeInput(submission.history || ''),
        darshan_timings: sanitizeInput(submission.darshanTimings),
        aarti_timings: sanitizeInput(submission.aartiTimings),
        eco_friendly: Boolean(submission.ecoFriendly),
        is_24_hours: Boolean(submission.is24Hours),
        crowd_level: submission.crowdLevel,
        nearest_station: sanitizeInput(submission.nearestStation),
        visarjan_date: sanitizeInput(submission.visarjanDate),
        status: 'pending', // Enforced by RLS & schema
      };

      const insertPromise = supabase
        .from('pandals')
        .insert([dbPayload]);

      const { error } = await withTimeout(insertPromise);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown submission error';
      return { success: false, error: msg };
    }
  }

  /**
   * Fetch all pandals for admin moderation (pending, approved, rejected).
   * Requires authenticated Supabase session.
   */
  public async getAdminPandals(): Promise<Pandal[]> {
    if (!isSupabaseConfigured) {
      return this.parseJsonFallback();
    }

    const adminQuery = supabase
      .from('pandals')
      .select('*')
      .order('created_at', { ascending: false });

    const { data, error } = await withTimeout(adminQuery);

    if (error) {
      throw new Error(`Admin fetch failed: ${error.message}`);
    }

    return (data as unknown as PandalDbRow[]).map(mapDbRowToPandal);
  }

  /**
   * Update status of a pandal (e.g. approve or reject).
   */
  public async updatePandalStatus(id: string, status: PandalStatus): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    const updatePromise = supabase
      .from('pandals')
      .update({ status })
      .eq('id', id);

    const { error } = await withTimeout(updatePromise);

    if (error) {
      throw new Error(`Failed to update status: ${error.message}`);
    }

    this.cachedPandals = null;
    return true;
  }

  /**
   * Edit pandal details (as admin).
   */
  public async updatePandal(id: string, updates: Partial<Pandal>): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    const rowUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) rowUpdates.name = sanitizeInput(updates.name);
    if (updates.area !== undefined) rowUpdates.area = sanitizeInput(updates.area);
    if (updates.lat !== undefined) rowUpdates.lat = Number(updates.lat);
    if (updates.lng !== undefined) rowUpdates.lng = Number(updates.lng);
    if (updates.address !== undefined) rowUpdates.address = sanitizeInput(updates.address);
    if (updates.description !== undefined) rowUpdates.description = sanitizeInput(updates.description);
    if (updates.photoUrl !== undefined) {
      if (!isValidImageUrl(updates.photoUrl)) {
        throw new Error('Invalid photo URL protocol');
      }
      rowUpdates.photo_url = updates.photoUrl.trim();
    }
    if (updates.darshanTimings !== undefined) rowUpdates.darshan_timings = sanitizeInput(updates.darshanTimings);
    if (updates.aartiTimings !== undefined) rowUpdates.aarti_timings = sanitizeInput(updates.aartiTimings);
    if (updates.ecoFriendly !== undefined) rowUpdates.eco_friendly = updates.ecoFriendly;
    if (updates.is24Hours !== undefined) rowUpdates.is_24_hours = updates.is24Hours;
    if (updates.crowdLevel !== undefined) rowUpdates.crowd_level = updates.crowdLevel;
    if (updates.nearestStation !== undefined) rowUpdates.nearest_station = sanitizeInput(updates.nearestStation);
    if (updates.visarjanDate !== undefined) rowUpdates.visarjan_date = sanitizeInput(updates.visarjanDate);
    if (updates.status !== undefined) rowUpdates.status = updates.status;

    const updatePromise = supabase
      .from('pandals')
      .update(rowUpdates)
      .eq('id', id);

    const { error } = await withTimeout(updatePromise);

    if (error) {
      throw new Error(`Failed to update pandal: ${error.message}`);
    }

    this.cachedPandals = null;
    return true;
  }

  /**
   * Delete a pandal (as admin).
   */
  public async deletePandal(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    const deletePromise = supabase
      .from('pandals')
      .delete()
      .eq('id', id);

    const { error } = await withTimeout(deletePromise);

    if (error) {
      throw new Error(`Failed to delete pandal: ${error.message}`);
    }

    this.cachedPandals = null;
    return true;
  }
}

export const pandalService = new PandalService();

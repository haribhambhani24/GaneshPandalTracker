import type { Pandal, PandalSubmission, PandalStatus, CrowdLevel } from '../types/pandal';
import rawPandalsData from '../data/pandals.json?raw';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const CACHE_STORAGE_KEY = 'pandal_map_offline_pandals';

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
 * Maps a PostgreSQL database row (snake_case) to the frontend Pandal model (camelCase).
 */
export function mapDbRowToPandal(row: PandalDbRow): Pandal {
  return {
    id: row.id,
    name: row.name,
    area: row.area,
    lat: Number(row.lat),
    lng: Number(row.lng),
    address: row.address,
    description: row.description || '',
    photoUrl: row.photo_url,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    history: row.history || '',
    darshanTimings: row.darshan_timings,
    aartiTimings: row.aarti_timings,
    ecoFriendly: Boolean(row.eco_friendly),
    is24Hours: Boolean(row.is_24_hours),
    crowdLevel: row.crowd_level || 'Medium',
    nearestStation: row.nearest_station,
    visarjanDate: row.visarjan_date,
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
      return parsed.map((p) => ({ ...p, status: 'approved' as PandalStatus }));
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
        const { data, error } = await supabase
          .from('pandals')
          .select('*')
          .eq('status', 'approved')
          .order('name');

        if (!error && data && data.length > 0) {
          const mapped = (data as unknown as PandalDbRow[]).map(mapDbRowToPandal);
          this.cachedPandals = mapped;

          // Cache in localStorage for PWA offline experience
          try {
            localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(mapped));
          } catch {
            // Ignore quota issues
          }

          return mapped;
        } else if (error) {
          console.warn('Supabase query error, switching to fallback:', error.message);
        }
      } catch (err) {
        console.warn('Network or Supabase connection failure, falling back to local cache/json:', err);
      }
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

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pandal-photos')
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

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
      const dbPayload = {
        name: submission.name.trim(),
        area: submission.area.trim(),
        lat: Number(submission.lat),
        lng: Number(submission.lng),
        address: submission.address.trim(),
        description: submission.description?.trim() || '',
        photo_url: submission.photoUrl.trim(),
        gallery: submission.gallery || [submission.photoUrl.trim()],
        history: submission.history?.trim() || '',
        darshan_timings: submission.darshanTimings.trim(),
        aarti_timings: submission.aartiTimings.trim(),
        eco_friendly: Boolean(submission.ecoFriendly),
        is_24_hours: Boolean(submission.is24Hours),
        crowd_level: submission.crowdLevel,
        nearest_station: submission.nearestStation.trim(),
        visarjan_date: submission.visarjanDate.trim(),
        status: 'pending', // Enforced by RLS & schema
      };

      const { error } = await supabase
        .from('pandals')
        .insert([dbPayload]);

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

    const { data, error } = await supabase
      .from('pandals')
      .select('*')
      .order('created_at', { ascending: false });

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

    const { error } = await supabase
      .from('pandals')
      .update({ status })
      .eq('id', id);

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
    if (updates.name !== undefined) rowUpdates.name = updates.name;
    if (updates.area !== undefined) rowUpdates.area = updates.area;
    if (updates.lat !== undefined) rowUpdates.lat = Number(updates.lat);
    if (updates.lng !== undefined) rowUpdates.lng = Number(updates.lng);
    if (updates.address !== undefined) rowUpdates.address = updates.address;
    if (updates.description !== undefined) rowUpdates.description = updates.description;
    if (updates.photoUrl !== undefined) rowUpdates.photo_url = updates.photoUrl;
    if (updates.darshanTimings !== undefined) rowUpdates.darshan_timings = updates.darshanTimings;
    if (updates.aartiTimings !== undefined) rowUpdates.aarti_timings = updates.aartiTimings;
    if (updates.ecoFriendly !== undefined) rowUpdates.eco_friendly = updates.ecoFriendly;
    if (updates.is24Hours !== undefined) rowUpdates.is_24_hours = updates.is24Hours;
    if (updates.crowdLevel !== undefined) rowUpdates.crowd_level = updates.crowdLevel;
    if (updates.nearestStation !== undefined) rowUpdates.nearest_station = updates.nearestStation;
    if (updates.visarjanDate !== undefined) rowUpdates.visarjan_date = updates.visarjanDate;
    if (updates.status !== undefined) rowUpdates.status = updates.status;

    const { error } = await supabase
      .from('pandals')
      .update(rowUpdates)
      .eq('id', id);

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

    const { error } = await supabase
      .from('pandals')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete pandal: ${error.message}`);
    }

    this.cachedPandals = null;
    return true;
  }
}

export const pandalService = new PandalService();

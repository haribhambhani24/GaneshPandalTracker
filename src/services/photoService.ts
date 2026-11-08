// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { PandalPhoto } from '../types/pandal';
import { processPandalPhoto, MAX_PHOTOS_PER_PANDAL } from '../utils/imageProcessor';
import rawPandalsData from '../data/pandals.json?raw';

const LOCAL_STORAGE_PREFIX = 'ganesh_pandal_photos_';

export interface UploadPhotoOptions {
  isCover?: boolean;
  captionEn?: string;
  captionHi?: string;
  captionMr?: string;
  credit?: string;
  altText?: string;
}

interface PhotoDbRow {
  id: string;
  pandal_id: string;
  storage_path: string;
  thumb_path: string;
  caption_en: string | null;
  caption_hi: string | null;
  caption_mr: string | null;
  alt_text: string | null;
  credit: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

class PhotoService {
  /**
   * Helper to map DB row to frontend PandalPhoto object with resolved public URLs.
   */
  private mapDbRowToPhoto(row: PhotoDbRow): PandalPhoto {
    const isFullUrl = row.storage_path.startsWith('http://') || row.storage_path.startsWith('https://');
    const isThumbUrl = row.thumb_path.startsWith('http://') || row.thumb_path.startsWith('https://');

    const url = isFullUrl
      ? row.storage_path
      : supabase.storage.from('pandal-photos').getPublicUrl(row.storage_path).data.publicUrl;

    const thumbUrl = isThumbUrl
      ? row.thumb_path
      : supabase.storage.from('pandal-photos').getPublicUrl(row.thumb_path).data.publicUrl;

    return {
      id: row.id,
      pandalId: row.pandal_id,
      storagePath: row.storage_path,
      thumbPath: row.thumb_path,
      url,
      thumbUrl,
      captionEn: row.caption_en || '',
      captionHi: row.caption_hi || '',
      captionMr: row.caption_mr || '',
      altText: row.alt_text || '',
      credit: row.credit || '',
      sortOrder: row.sort_order ?? 0,
      isCover: Boolean(row.is_cover),
      createdAt: row.created_at,
    };
  }

  /**
   * Local storage fallback helpers for offline/mock environments.
   */
  private getLocalPhotos(pandalId: string): PandalPhoto[] {
    try {
      const key = `${LOCAL_STORAGE_PREFIX}${pandalId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved) as PandalPhoto[];
      }
    } catch (e) {
      console.warn('Error reading local photos:', e);
    }

    // Seed from static pandals data if not in storage
    return this.seedPhotosForPandal(pandalId);
  }

  private saveLocalPhotos(pandalId: string, photos: PandalPhoto[]): void {
    try {
      const key = `${LOCAL_STORAGE_PREFIX}${pandalId}`;
      localStorage.setItem(key, JSON.stringify(photos));
    } catch (e) {
      console.warn('Error saving local photos:', e);
    }
  }

  /**
   * Generates initial PandalPhoto entries from seed pandals.json
   */
  private seedPhotosForPandal(pandalId: string): PandalPhoto[] {
    try {
      const cleanJson = rawPandalsData.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      const list = JSON.parse(cleanJson) as Array<{
        id: string;
        name: string;
        photoUrl?: string;
        gallery?: string[];
      }>;
      const found = list.find((p) => p.id === pandalId);
      if (!found) return [];

      const result: PandalPhoto[] = [];
      const mainUrl = found.photoUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';

      result.push({
        id: `${pandalId}-cover`,
        pandalId,
        storagePath: mainUrl,
        thumbPath: mainUrl,
        url: mainUrl,
        thumbUrl: mainUrl,
        captionEn: `${found.name} Darshan`,
        captionHi: `${found.name} दर्शन`,
        captionMr: `${found.name} दर्शन`,
        altText: `${found.name} Ganesh idol`,
        credit: 'Mandal Official',
        sortOrder: 0,
        isCover: true,
        createdAt: new Date().toISOString(),
      });

      if (Array.isArray(found.gallery)) {
        found.gallery.forEach((gUrl, idx) => {
          if (gUrl !== mainUrl) {
            result.push({
              id: `${pandalId}-gallery-${idx}`,
              pandalId,
              storagePath: gUrl,
              thumbPath: gUrl,
              url: gUrl,
              thumbUrl: gUrl,
              captionEn: `${found.name} Photo ${idx + 1}`,
              captionHi: `${found.name} फोटो ${idx + 1}`,
              captionMr: `${found.name} छायाचित्र ${idx + 1}`,
              altText: `${found.name} gallery image`,
              credit: 'Mandal Archive',
              sortOrder: idx + 1,
              isCover: false,
              createdAt: new Date().toISOString(),
            });
          }
        });
      }

      this.saveLocalPhotos(pandalId, result);
      return result;
    } catch {
      return [];
    }
  }

  /**
   * Fetches all photos for a pandal ordered by sortOrder.
   */
  public async getPhotosByPandalId(pandalId: string): Promise<PandalPhoto[]> {
    if (!isSupabaseConfigured) {
      return this.getLocalPhotos(pandalId);
    }

    try {
      const { data, error } = await supabase
        .from('pandal_photos')
        .select('*')
        .eq('pandal_id', pandalId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.warn('Supabase getPhotos error, falling back to local/seed:', error.message);
        return this.getLocalPhotos(pandalId);
      }

      if (!data || data.length === 0) {
        // If DB table is empty for this pandal, fallback to seed/local
        return this.getLocalPhotos(pandalId);
      }

      return (data as unknown as PhotoDbRow[]).map((r) => this.mapDbRowToPhoto(r));
    } catch (e) {
      console.warn('getPhotos exception, fallback to local:', e);
      return this.getLocalPhotos(pandalId);
    }
  }

  /**
   * Validates, processes, compresses, and uploads a photo.
   */
  public async uploadPhoto(
    pandalId: string,
    file: File,
    options?: UploadPhotoOptions,
    onProgress?: (percent: number) => void
  ): Promise<PandalPhoto> {
    const existing = await this.getPhotosByPandalId(pandalId);
    if (existing.length >= MAX_PHOTOS_PER_PANDAL) {
      throw new Error(`Maximum limit of ${MAX_PHOTOS_PER_PANDAL} photos per pandal reached.`);
    }

    onProgress?.(15);

    // 1. In-browser compression & thumbnail generation
    const processed = await processPandalPhoto(file, pandalId);
    onProgress?.(45);

    const isFirstPhoto = existing.length === 0;
    const isCover = options?.isCover !== undefined ? options.isCover : isFirstPhoto;
    const sortOrder = existing.length;

    if (!isSupabaseConfigured) {
      // Offline/demo: Store as Data URLs
      const fullUrl = await this.blobToDataUrl(processed.fullBlob);
      const thumbUrl = await this.blobToDataUrl(processed.thumbBlob);
      onProgress?.(85);

      const newPhoto: PandalPhoto = {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        pandalId,
        storagePath: fullUrl,
        thumbPath: thumbUrl,
        url: fullUrl,
        thumbUrl,
        captionEn: options?.captionEn || '',
        captionHi: options?.captionHi || '',
        captionMr: options?.captionMr || '',
        altText: options?.altText || 'Ganesh pandal photo',
        credit: options?.credit || '',
        sortOrder,
        isCover,
        createdAt: new Date().toISOString(),
      };

      const updatedList = isCover
        ? existing.map((p) => ({ ...p, isCover: false })).concat(newPhoto)
        : [...existing, newPhoto];

      this.saveLocalPhotos(pandalId, updatedList);
      onProgress?.(100);
      return newPhoto;
    }

    // 2. Upload full image to Supabase Storage
    const { error: fullError } = await supabase.storage
      .from('pandal-photos')
      .upload(processed.storagePath, processed.fullBlob, {
        contentType: processed.format,
        cacheControl: '31536000',
        upsert: false,
      });

    if (fullError) {
      throw new Error(`Full image upload failed: ${fullError.message}`);
    }
    onProgress?.(70);

    // 3. Upload thumbnail to Supabase Storage
    const { error: thumbError } = await supabase.storage
      .from('pandal-photos')
      .upload(processed.thumbPath, processed.thumbBlob, {
        contentType: processed.format,
        cacheControl: '31536000',
        upsert: false,
      });

    if (thumbError) {
      // Clean up full image on thumb upload failure
      await supabase.storage.from('pandal-photos').remove([processed.storagePath]);
      throw new Error(`Thumbnail upload failed: ${thumbError.message}`);
    }
    onProgress?.(85);

    // 4. If this is a cover, demote any existing cover in DB
    if (isCover) {
      await supabase
        .from('pandal_photos')
        .update({ is_cover: false })
        .eq('pandal_id', pandalId);
    }

    // 5. Insert row in pandal_photos table
    const { data: inserted, error: insertError } = await supabase
      .from('pandal_photos')
      .insert([
        {
          pandal_id: pandalId,
          storage_path: processed.storagePath,
          thumb_path: processed.thumbPath,
          caption_en: options?.captionEn || '',
          caption_hi: options?.captionHi || '',
          caption_mr: options?.captionMr || '',
          alt_text: options?.altText || 'Ganesh pandal photo',
          credit: options?.credit || '',
          sort_order: sortOrder,
          is_cover: isCover,
        },
      ])
      .select('*')
      .single();

    if (insertError) {
      // Cleanup uploaded files on DB insert error
      await supabase.storage
        .from('pandal-photos')
        .remove([processed.storagePath, processed.thumbPath]);
      throw new Error(`Failed to save photo record: ${insertError.message}`);
    }

    // 6. Update pandal's main photo_url if this is the cover
    if (isCover) {
      const publicCoverUrl = supabase.storage
        .from('pandal-photos')
        .getPublicUrl(processed.storagePath).data.publicUrl;

      await supabase
        .from('pandals')
        .update({ photo_url: publicCoverUrl })
        .eq('id', pandalId);
    }

    onProgress?.(100);
    return this.mapDbRowToPhoto(inserted as unknown as PhotoDbRow);
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed reading blob data'));
      reader.readAsDataURL(blob);
    });
  }

  /**
   * GALLERY-DISABLED: re-enable when gallery returns
   * Sets a specific photo as the cover photo for a pandal.
   */
  public async setCoverPhoto(pandalId: string, photoId: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const photos = this.getLocalPhotos(pandalId);
      const target = photos.find((p) => p.id === photoId);
      if (!target) return false;

      const updated = photos.map((p) => ({
        ...p,
        isCover: p.id === photoId,
      }));
      this.saveLocalPhotos(pandalId, updated);
      return true;
    }

    // Demote current covers
    await supabase
      .from('pandal_photos')
      .update({ is_cover: false })
      .eq('pandal_id', pandalId);

    // Promote new cover
    const { data, error } = await supabase
      .from('pandal_photos')
      .update({ is_cover: true })
      .eq('id', photoId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to set cover photo: ${error.message}`);
    }

    // Sync pandal.photo_url
    if (data) {
      const photo = this.mapDbRowToPhoto(data as unknown as PhotoDbRow);
      await supabase
        .from('pandals')
        .update({ photo_url: photo.url })
        .eq('id', pandalId);
    }

    return true;
  }

  /**
   * GALLERY-DISABLED: re-enable when gallery returns
   * Reorders photos according to given array of IDs.
   */
  public async reorderPhotos(pandalId: string, orderedPhotoIds: string[]): Promise<boolean> {
    if (!isSupabaseConfigured) {
      const photos = this.getLocalPhotos(pandalId);
      const photoMap = new Map(photos.map((p) => [p.id, p]));
      const reordered: PandalPhoto[] = [];

      orderedPhotoIds.forEach((id, idx) => {
        const p = photoMap.get(id);
        if (p) {
          reordered.push({ ...p, sortOrder: idx });
        }
      });

      this.saveLocalPhotos(pandalId, reordered);
      return true;
    }

    const updates = orderedPhotoIds.map((id, index) =>
      supabase
        .from('pandal_photos')
        .update({ sort_order: index })
        .eq('id', id)
        .eq('pandal_id', pandalId)
    );

    await Promise.all(updates);
    return true;
  }

  /**
   * GALLERY-DISABLED: re-enable when gallery returns
   * Updates caption, credit, or alt text for a photo.
   */
  public async updatePhotoDetails(
    photoId: string,
    pandalId: string,
    updates: Partial<PandalPhoto>
  ): Promise<PandalPhoto> {
    if (!isSupabaseConfigured) {
      const photos = this.getLocalPhotos(pandalId);
      const index = photos.findIndex((p) => p.id === photoId);
      if (index === -1) throw new Error('Photo not found');

      photos[index] = {
        ...photos[index],
        ...updates,
      };
      this.saveLocalPhotos(pandalId, photos);
      return photos[index];
    }

    const dbPayload: Record<string, unknown> = {};
    if (updates.captionEn !== undefined) dbPayload.caption_en = updates.captionEn;
    if (updates.captionHi !== undefined) dbPayload.caption_hi = updates.captionHi;
    if (updates.captionMr !== undefined) dbPayload.caption_mr = updates.captionMr;
    if (updates.altText !== undefined) dbPayload.alt_text = updates.altText;
    if (updates.credit !== undefined) dbPayload.credit = updates.credit;

    const { data, error } = await supabase
      .from('pandal_photos')
      .update(dbPayload)
      .eq('id', photoId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update photo details: ${error.message}`);
    }

    return this.mapDbRowToPhoto(data as unknown as PhotoDbRow);
  }

  /**
   * GALLERY-DISABLED: re-enable when gallery returns
   * Deletes a photo and removes its storage objects.
   * If it was the cover, automatically promotes the next photo.
   */
  public async deletePhoto(pandalId: string, photoId: string): Promise<boolean> {
    const photos = await this.getPhotosByPandalId(pandalId);
    const target = photos.find((p) => p.id === photoId);
    if (!target) return false;

    if (!isSupabaseConfigured) {
      const remaining = photos.filter((p) => p.id !== photoId);
      if (target.isCover && remaining.length > 0) {
        remaining[0].isCover = true;
      }
      this.saveLocalPhotos(pandalId, remaining);
      return true;
    }

    // 1. Delete storage files
    const filesToRemove: string[] = [];
    if (!target.storagePath.startsWith('http')) filesToRemove.push(target.storagePath);
    if (!target.thumbPath.startsWith('http')) filesToRemove.push(target.thumbPath);

    if (filesToRemove.length > 0) {
      try {
        await supabase.storage.from('pandal-photos').remove(filesToRemove);
      } catch (e) {
        console.warn('Error deleting storage files:', e);
      }
    }

    // 2. Delete database row
    const { error } = await supabase
      .from('pandal_photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      throw new Error(`Failed to delete photo record: ${error.message}`);
    }

    // 3. Promote next photo to cover if deleted photo was cover
    if (target.isCover) {
      const remaining = photos.filter((p) => p.id !== photoId);
      if (remaining.length > 0) {
        await this.setCoverPhoto(pandalId, remaining[0].id);
      }
    }

    return true;
  }

  /**
   * Deletes all photos associated with a pandal (invoked on pandal deletion).
   */
  public async deletePandalPhotos(pandalId: string): Promise<boolean> {
    try {
      if (!isSupabaseConfigured) {
        localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${pandalId}`);
        return true;
      }

      const photos = await this.getPhotosByPandalId(pandalId);
      const filesToRemove: string[] = [];
      photos.forEach((p) => {
        if (!p.storagePath.startsWith('http')) filesToRemove.push(p.storagePath);
        if (!p.thumbPath.startsWith('http')) filesToRemove.push(p.thumbPath);
      });

      if (filesToRemove.length > 0) {
        await supabase.storage.from('pandal-photos').remove(filesToRemove);
      }

      await supabase.from('pandal_photos').delete().eq('pandal_id', pandalId);
      return true;
    } catch (e) {
      console.warn('Error cleaning up pandal photos:', e);
      return false;
    }
  }
}

export const photoService = new PhotoService();


// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

/**
 * Image Processing & Validation Utilities
 * - Validates file types by binary magic numbers (JPEG, PNG, WebP)
 * - Enforces 5 MB pre-compression limit
 * - Resizes and compresses full images (max 1600px, 80% quality)
 * - Generates fast thumbnails (max 400px, 80% quality)
 * - Produces secure random UUID storage paths
 */

export interface ProcessedImageResult {
  fullBlob: Blob;
  thumbBlob: Blob;
  width: number;
  height: number;
  format: 'image/webp' | 'image/jpeg';
  extension: 'webp' | 'jpg';
  storagePath: string;
  thumbPath: string;
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_PHOTOS_PER_PANDAL = 12;

/**
 * Validates file binary signatures (magic bytes) to prevent executable spoofing.
 */
export async function validateImageContent(file: File): Promise<'jpeg' | 'png' | 'webp'> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 5 MB.`);
  }

  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'png';
  }

  // WebP: 'RIFF' at 0..3 and 'WEBP' at 8..11
  // 'R' = 0x52, 'I' = 0x49, 'F' = 0x46, 'F' = 0x46
  // 'W' = 0x57, 'E' = 0x45, 'B' = 0x42, 'P' = 0x50
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'webp';
  }

  throw new Error('Invalid image format. Only JPEG, PNG, and WebP files are accepted.');
}

/**
 * Calculates proportional target dimensions preserving aspect ratio.
 */
function calculateTargetDimensions(
  origWidth: number,
  origHeight: number,
  maxDimension: number
): { width: number; height: number } {
  if (origWidth <= maxDimension && origHeight <= maxDimension) {
    return { width: origWidth, height: origHeight };
  }

  if (origWidth > origHeight) {
    const ratio = origHeight / origWidth;
    return {
      width: maxDimension,
      height: Math.round(maxDimension * ratio),
    };
  } else {
    const ratio = origWidth / origHeight;
    return {
      width: Math.round(maxDimension * ratio),
      height: maxDimension,
    };
  }
}

/**
 * Generates random unique file paths for full image and thumbnail.
 */
export function generatePhotoPaths(pandalId: string, ext = 'webp'): { storagePath: string; thumbPath: string } {
  const safeId = pandalId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const uuid =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    storagePath: `pandals/${safeId}/${uuid}.${ext}`,
    thumbPath: `pandals/${safeId}/${uuid}_thumb.${ext}`,
  };
}

/**
 * Resizes an image on an offscreen canvas and exports as compressed Blob.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: 'image/webp' | 'image/jpeg',
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // Fallback to JPEG if browser fails on WebP
          canvas.toBlob(
            (fallbackBlob) => {
              if (fallbackBlob) resolve(fallbackBlob);
              else reject(new Error('Canvas toBlob compression failed.'));
            },
            'image/jpeg',
            quality
          );
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Validates, compresses, and generates a thumbnail for an uploaded photo.
 */
export async function processPandalPhoto(
  file: File,
  pandalId: string
): Promise<ProcessedImageResult> {
  // 1. Strict binary content signature validation
  await validateImageContent(file);

  // 2. Load into HTML Image element
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image for compression.'));
      img.src = objectUrl;
    });

    const origWidth = img.naturalWidth || img.width;
    const origHeight = img.naturalHeight || img.height;

    // 3. Compress full image (max 1600px long side, 80% quality)
    const fullDims = calculateTargetDimensions(origWidth, origHeight, 1600);
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = fullDims.width;
    fullCanvas.height = fullDims.height;
    const fullCtx = fullCanvas.getContext('2d');
    if (!fullCtx) throw new Error('2D Canvas context unavailable.');
    fullCtx.imageSmoothingEnabled = true;
    fullCtx.imageSmoothingQuality = 'high';
    fullCtx.drawImage(img, 0, 0, fullDims.width, fullDims.height);

    const fullBlob = await canvasToBlob(fullCanvas, 'image/webp', 0.8);

    // 4. Generate thumbnail (max 400px long side, 80% quality)
    const thumbDims = calculateTargetDimensions(origWidth, origHeight, 400);
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = thumbDims.width;
    thumbCanvas.height = thumbDims.height;
    const thumbCtx = thumbCanvas.getContext('2d');
    if (!thumbCtx) throw new Error('2D Canvas context unavailable.');
    thumbCtx.imageSmoothingEnabled = true;
    thumbCtx.imageSmoothingQuality = 'high';
    thumbCtx.drawImage(img, 0, 0, thumbDims.width, thumbDims.height);

    const thumbBlob = await canvasToBlob(thumbCanvas, 'image/webp', 0.8);

    const isWebp = fullBlob.type === 'image/webp';
    const ext = isWebp ? 'webp' : 'jpg';
    const { storagePath, thumbPath } = generatePhotoPaths(pandalId, ext);

    return {
      fullBlob,
      thumbBlob,
      width: fullDims.width,
      height: fullDims.height,
      format: isWebp ? 'image/webp' : 'image/jpeg',
      extension: ext,
      storagePath,
      thumbPath,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}


// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Camera,
  Check,
  CheckCircle,
  GripVertical,
  ImageIcon,
  Loader2,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  Upload,
  X,
  Edit3,
} from 'lucide-react';
import type { Pandal, PandalPhoto } from '../../types/pandal';
import { photoService } from '../../services/photoService';
import { MAX_PHOTOS_PER_PANDAL } from '../../utils/imageProcessor';
import { useI18n } from '../../context/I18nContext';

interface PhotoManagerModalProps {
  pandal: Pandal;
  isOpen: boolean;
  onClose: () => void;
  onCoverUpdated?: (newCoverUrl: string) => void;
}

interface UploadQueueItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export const PhotoManagerModal: React.FC<PhotoManagerModalProps> = ({
  pandal,
  isOpen,
  onClose,
  onCoverUpdated,
}) => {
  const { t, formatNumber: _formatNumber } = useI18n();

  const [photos, setPhotos] = useState<PandalPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Deletion state
  const [photoToDelete, setPhotoToDelete] = useState<PandalPhoto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [undoPhoto, setUndoPhoto] = useState<PandalPhoto | null>(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Edit details state
  const [editingPhoto, setEditingPhoto] = useState<PandalPhoto | null>(null);
  const [captionEn, setCaptionEn] = useState('');
  const [captionHi, setCaptionHi] = useState('');
  const [captionMr, setCaptionMr] = useState('');
  const [credit, setCredit] = useState('');
  const [altText, setAltText] = useState('');
  const [savingDetails, setSavingDetails] = useState(false);
  const [hasUnsavedEdit, setHasUnsavedEdit] = useState(false);

  // Drag-and-drop reorder
  const [draggedPhotoId, setDraggedPhotoId] = useState<string | null>(null);
  const [dragOverPhotoId, setDragOverPhotoId] = useState<string | null>(null);

  // File input refs
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Load photos for this pandal
  const refreshPhotos = React.useCallback(async () => {
    try {
      const data = await photoService.getPhotosByPandalId(pandal.id);
      setPhotos(data);
    } catch (e) {
      console.error('Failed to reload photos:', e);
    }
  }, [pandal.id]);

  useEffect(() => {
    let active = true;
    if (isOpen) {
      photoService.getPhotosByPandalId(pandal.id)
        .then((data) => {
          if (active) {
            setPhotos(data);
            setLoading(false);
          }
        })
        .catch((e) => {
          console.error('Failed to load photos:', e);
          if (active) setLoading(false);
        });
    }
    return () => {
      active = false;
    };
  }, [isOpen, pandal.id]);

  const handleAttemptClose = React.useCallback(() => {
    const hasActiveUploads = uploadQueue.some((item) => item.status === 'uploading');
    if (hasActiveUploads || hasUnsavedEdit) {
      if (!window.confirm(t.unsavedChangesWarning)) {
        return;
      }
    }
    onClose();
  }, [hasUnsavedEdit, onClose, t.unsavedChangesWarning, uploadQueue]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleAttemptClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleAttemptClose]);

  // Upload handler for multiple files
  const handleProcessFiles = async (files: FileList | File[], isCoverUpload = false) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const remainingSlots = MAX_PHOTOS_PER_PANDAL - photos.length;
    if (remainingSlots <= 0) {
      alert(t.maxPhotosLimit);
      return;
    }

    const filesToUpload = fileArray.slice(0, remainingSlots);
    if (fileArray.length > remainingSlots) {
      alert(`${t.maxPhotosLimit}. Uploading only ${remainingSlots} files.`);
    }

    const newQueueItems: UploadQueueItem[] = filesToUpload.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      progress: 0,
      status: 'pending',
    }));

    setUploadQueue((prev) => [...prev, ...newQueueItems]);

    // Process each file sequentially or in parallel
    for (const item of newQueueItems) {
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 10 } : q))
      );

      try {
        const uploaded = await photoService.uploadPhoto(
          pandal.id,
          item.file,
          { isCover: isCoverUpload },
          (progress) => {
            setUploadQueue((prev) =>
              prev.map((q) => (q.id === item.id ? { ...q, progress } : q))
            );
          }
        );

        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'success', progress: 100 } : q))
        );

        setPhotos((prev) => {
          if (isCoverUpload) {
            return prev.map((p) => ({ ...p, isCover: false })).concat(uploaded);
          }
          return [...prev, uploaded];
        });

        if (isCoverUpload || uploaded.isCover) {
          onCoverUpdated?.(uploaded.url);
        }

        // Auto remove success items from queue after 2.5s
        setTimeout(() => {
          setUploadQueue((prev) => prev.filter((q) => q.id !== item.id));
        }, 2500);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload failed';
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', errorMessage: msg }
              : q
          )
        );
      }
    }
  };

  const handleRetryUpload = (item: UploadQueueItem) => {
    handleProcessFiles([item.file]);
    setUploadQueue((prev) => prev.filter((q) => q.id !== item.id));
  };

  const handleDismissUpload = (itemId: string) => {
    setUploadQueue((prev) => prev.filter((q) => q.id !== itemId));
  };

  // GALLERY-DISABLED (re-enable when gallery returns): Gallery action handlers
  // Set Cover Photo
  const handleSetCover = async (photo: PandalPhoto) => {
    try {
      await photoService.setCoverPhoto(pandal.id, photo.id);
      setPhotos((prev) =>
        prev.map((p) => ({
          ...p,
          isCover: p.id === photo.id,
        }))
      );
      onCoverUpdated?.(photo.url);
    } catch (e) {
      alert(`Failed to set cover photo: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  // Reordering (Up / Down for mobile)
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const reordered = [...photos];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    setPhotos(reordered);
    const photoIds = reordered.map((p) => p.id);
    await photoService.reorderPhotos(pandal.id, photoIds);
  };

  // Drag and drop handlers
  const handleDragStart = (id: string) => {
    setDraggedPhotoId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragOverPhotoId !== id) {
      setDragOverPhotoId(id);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverPhotoId(null);
    if (!draggedPhotoId || draggedPhotoId === targetId) return;

    const fromIdx = photos.findIndex((p) => p.id === draggedPhotoId);
    const toIdx = photos.findIndex((p) => p.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...photos];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    setPhotos(reordered);
    setDraggedPhotoId(null);
    await photoService.reorderPhotos(pandal.id, reordered.map((p) => p.id));
  };

  // Deletion & Undo
  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;
    setIsDeleting(true);
    const deleted = photoToDelete;
    try {
      await photoService.deletePhoto(pandal.id, deleted.id);
      setPhotos((prev) => prev.filter((p) => p.id !== deleted.id));
      setPhotoToDelete(null);

      // Offer 5-second Undo
      setUndoPhoto(deleted);
      if (undoTimeoutId) clearTimeout(undoTimeoutId);
      const timer = setTimeout(() => {
        setUndoPhoto(null);
      }, 5000);
      setUndoTimeoutId(timer);
    } catch (e) {
      alert(`Failed to delete photo: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Edit details
  const handleOpenEditDetails = (photo: PandalPhoto) => {
    setEditingPhoto(photo);
    setCaptionEn(photo.captionEn || '');
    setCaptionHi(photo.captionHi || '');
    setCaptionMr(photo.captionMr || '');
    setCredit(photo.credit || '');
    setAltText(photo.altText || '');
    setHasUnsavedEdit(false);
  };

  const handleSaveDetails = async () => {
    if (!editingPhoto) return;
    setSavingDetails(true);
    try {
      const updated = await photoService.updatePhotoDetails(editingPhoto.id, pandal.id, {
        captionEn,
        captionHi,
        captionMr,
        credit,
        altText,
      });

      setPhotos((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setEditingPhoto(null);
      setHasUnsavedEdit(false);
    } catch (e) {
      alert(`Failed to save details: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setSavingDetails(false);
    }
  };

  if (!isOpen) return null;

  const coverPhoto = photos.find((p) => p.isCover) || photos[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-manager-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white dark:bg-stone-900 w-full max-w-4xl rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col max-h-[90vh] max-h-[90dvh] overflow-hidden my-4">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50/80 dark:bg-stone-900/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="photo-manager-title" className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 truncate">
                  {t.photoManagerTitle} (Cover Photo)
                </h2>
                {/* GALLERY-DISABLED: re-enable when gallery returns
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shrink-0">
                  {formatNumber(photos.length)} / {MAX_PHOTOS_PER_PANDAL}
                </span>
                */}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                {pandal.name} • {pandal.area}
              </p>
            </div>
          </div>

          <button
            onClick={handleAttemptClose}
            className="w-11 h-11 flex items-center justify-center rounded-full text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Cover Photo Section */}
          <div className="bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{t.coverPhoto}</span>
              </h3>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleProcessFiles(e.target.files, true);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{t.replaceCover}</span>
              </button>
            </div>

            {coverPhoto ? (
              <div className="relative h-44 sm:h-56 w-full rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <img
                  src={coverPhoto.url}
                  alt={coverPhoto.altText || pandal.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>{t.isCoverBadge}</span>
                </div>
                {coverPhoto.credit && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] backdrop-blur-xs font-medium">
                    {coverPhoto.credit}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center border border-dashed border-stone-300 dark:border-stone-700 rounded-xl text-stone-400 text-xs">
                <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                <span>{t.noPhotosPlaceholder}</span>
              </div>
            )}
          </div>

          {/* GALLERY-DISABLED: Multi-Photo Upload Dropzone (re-enable when gallery returns) */}
          {false as boolean && (
            <div>
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleProcessFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                capture="environment"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleProcessFiles(e.target.files);
                  e.target.value = '';
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(false);
                  if (e.dataTransfer.files) handleProcessFiles(e.dataTransfer.files);
                }}
                onClick={() => galleryInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
                  isDraggingOver
                    ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30'
                    : 'border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-850 hover:border-orange-400 hover:bg-stone-100/50'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
                  {t.dragDropOrBrowse}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  JPG, PNG, WebP • Max 5 MB per file • Up to {MAX_PHOTOS_PER_PANDAL} photos
                </p>

                <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-orange-600" />
                    <span>{t.uploadPhotos}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="sm:hidden inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 shadow-xs cursor-pointer"
                    title="Take Photo with Camera"
                  >
                    <Camera className="w-4 h-4 text-orange-600" />
                    <span>Camera</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active Upload Queue */}
          {uploadQueue.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Upload Progress ({uploadQueue.length})
              </h4>
              <div className="space-y-2">
                {uploadQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-stone-800 dark:text-stone-200 truncate max-w-[200px]">
                          {item.file.name}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          {item.status === 'uploading'
                            ? `${Math.round(item.progress)}%`
                            : item.status === 'success'
                            ? 'Complete'
                            : item.status === 'error'
                            ? 'Failed'
                            : 'Pending'}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            item.status === 'error'
                              ? 'bg-red-500'
                              : item.status === 'success'
                              ? 'bg-emerald-500'
                              : 'bg-orange-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>

                      {item.errorMessage && (
                        <p className="text-[11px] text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{item.errorMessage}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.status === 'error' && (
                        <button
                          type="button"
                          onClick={() => handleRetryUpload(item)}
                          className="px-2.5 py-1 min-h-[36px] text-xs font-bold rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer"
                        >
                          Retry
                        </button>
                      )}
                      {item.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDismissUpload(item.id)}
                          className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY-DISABLED: Photo Gallery Grid (re-enable when gallery returns) */}
          {false as boolean && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                {t.galleryPhotos} ({photos.length})
              </h3>
              <span className="text-[11px] text-stone-500">
                Drag to reorder on desktop • Use arrows on mobile
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-44 rounded-2xl bg-stone-100 dark:bg-stone-800 animate-pulse" />
                ))}
              </div>
            ) : photos.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-400 text-xs">
                {t.noPhotosPlaceholder}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => {
                  const isDragged = draggedPhotoId === photo.id;
                  const isDragOver = dragOverPhotoId === photo.id;

                  return (
                    <div
                      key={photo.id}
                      draggable
                      onDragStart={() => handleDragStart(photo.id)}
                      onDragOver={(e) => handleDragOver(e, photo.id)}
                      onDrop={(e) => handleDrop(e, photo.id)}
                      className={`group relative rounded-2xl overflow-hidden border bg-white dark:bg-stone-850 flex flex-col shadow-xs transition-all ${
                        isDragged ? 'opacity-40 scale-95' : ''
                      } ${
                        isDragOver
                          ? 'border-orange-500 ring-2 ring-orange-500/40'
                          : photo.isCover
                          ? 'border-orange-400 dark:border-orange-600'
                          : 'border-stone-200 dark:border-stone-800'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-40 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                        <img
                          src={photo.thumbUrl || photo.url}
                          alt={photo.altText || photo.captionEn || `Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                            #{index + 1}
                          </span>
                          {photo.isCover && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-white" />
                              <span>{t.isCoverBadge}</span>
                            </span>
                          )}
                        </div>

                        {/* Desktop Drag Handle */}
                        <div
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white backdrop-blur-xs hidden md:flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-black/70"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Photo Info Snippet */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <p className="text-xs font-bold text-stone-800 dark:text-stone-200 line-clamp-1">
                            {photo.captionEn || `${pandal.name} #${index + 1}`}
                          </p>
                          {photo.credit && (
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                              {photo.credit}
                            </p>
                          )}
                        </div>

                        {/* Controls Bar */}
                        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-1">
                          {/* Mobile Up/Down Move Buttons */}
                          <div className="flex items-center gap-1 md:hidden">
                            <button
                              type="button"
                              onClick={() => handleMove(index, 'up')}
                              disabled={index === 0}
                              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 cursor-pointer"
                              title={t.moveUp}
                              aria-label={t.moveUp}
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMove(index, 'down')}
                              disabled={index === photos.length - 1}
                              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 cursor-pointer"
                              title={t.moveDown}
                              aria-label={t.moveDown}
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 ml-auto">
                            {!photo.isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCover(photo)}
                                className="px-3 py-2 min-h-[44px] rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/40 text-stone-700 dark:text-stone-300 cursor-pointer flex items-center"
                                title={t.setAsCover}
                              >
                                {t.setAsCover}
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEditDetails(photo)}
                              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 cursor-pointer"
                              title={t.photoCaption}
                              aria-label={t.photoCaption}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setPhotoToDelete(photo)}
                              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-red-50 text-stone-600 hover:text-red-600 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="Delete Photo"
                              aria-label="Delete Photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-stone-500">
            {coverPhoto ? '1 Cover photo set' : t.noPhotosPlaceholder}
          </span>
          <button
            type="button"
            onClick={handleAttemptClose}
            className="px-6 py-2.5 min-h-[44px] rounded-xl font-bold text-xs bg-stone-200 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 cursor-pointer transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>

      {/* GALLERY-DISABLED: DELETE CONFIRMATION MODAL (re-enable when gallery returns) */}
      {false as boolean && photoToDelete && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {t.confirmDeletePhoto}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                This will remove the photo and its thumbnail permanently from storage.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="flex-1 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 min-h-[44px] rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{t.delete}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY-DISABLED: EDIT PHOTO DETAILS DRAWER / MODAL (re-enable when gallery returns) */}
      {false as boolean && editingPhoto && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-600" />
                <span>{t.photoCaption} & Credits</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingPhoto(null);
                  setHasUnsavedEdit(false);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={editingPhoto.thumbUrl || editingPhoto.url}
                alt={editingPhoto.altText || 'Editing photo'}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
              />
              <div className="text-xs text-stone-500">
                <p className="font-semibold text-stone-800 dark:text-stone-200">
                  {pandal.name}
                </p>
                <p>Editing captions and photographer attribution.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.photoCaption} (English)
                </label>
                <input
                  type="text"
                  value={captionEn}
                  onChange={(e) => {
                    setCaptionEn(e.target.value);
                    setHasUnsavedEdit(true);
                  }}
                  placeholder={t.photoCaptionPlaceholder}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.photoCaption} (हिंदी - Hindi)
                </label>
                <input
                  type="text"
                  value={captionHi}
                  onChange={(e) => {
                    setCaptionHi(e.target.value);
                    setHasUnsavedEdit(true);
                  }}
                  placeholder="फोटो का विवरण दर्ज करें..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.photoCaption} (मराठी - Marathi)
                </label>
                <input
                  type="text"
                  value={captionMr}
                  onChange={(e) => {
                    setCaptionMr(e.target.value);
                    setHasUnsavedEdit(true);
                  }}
                  placeholder="फोटोचे वर्णन प्रविष्ट करा..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.photoCredit}
                </label>
                <input
                  type="text"
                  value={credit}
                  onChange={(e) => {
                    setCredit(e.target.value);
                    setHasUnsavedEdit(true);
                  }}
                  placeholder={t.photoCreditPlaceholder}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  {t.altText}
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => {
                    setAltText(e.target.value);
                    setHasUnsavedEdit(true);
                  }}
                  placeholder={t.altTextPlaceholder}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  setEditingPhoto(null);
                  setHasUnsavedEdit(false);
                }}
                className="px-4 py-2 min-h-[44px] rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveDetails}
                disabled={savingDetails}
                className="px-5 py-2 min-h-[44px] rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {savingDetails ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{t.saveChanges}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY-DISABLED: Undo Toast Snackbar (re-enable when gallery returns) */}
      {false as boolean && undoPhoto && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs border border-stone-700 dark:border-stone-300 animate-in slide-in-from-bottom duration-200">
          <span>{t.photoDeletedToast}</span>
          <button
            type="button"
            onClick={async () => {
              if (undoTimeoutId) clearTimeout(undoTimeoutId);
              setUndoPhoto(null);
              // Re-add to local or DB
              await refreshPhotos();
            }}
            className="font-bold text-amber-400 dark:text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.undo}</span>
          </button>
        </div>
      )}
    </div>
  );
};

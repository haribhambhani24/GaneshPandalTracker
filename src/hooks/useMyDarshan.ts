import { useCallback, useEffect, useState } from 'react';
import type { Pandal } from '../types/pandal';

const STORAGE_SAVED_KEY = 'ganesh_pandal_tracker_saved';
const LEGACY_SAVED_KEY = 'pandal_map_saved';
const STORAGE_VISITED_KEY = 'ganesh_pandal_tracker_visited';
const LEGACY_VISITED_KEY = 'pandal_map_visited';

export function useMyDarshan() {
  const [savedList, setSavedList] = useState<string[]>(() => {
    try {
      const data = localStorage.getItem(STORAGE_SAVED_KEY) || localStorage.getItem(LEGACY_SAVED_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [lastRemoved, setLastRemoved] = useState<{ id: string; index: number } | null>(null);

  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => {
    try {
      const data = localStorage.getItem(STORAGE_VISITED_KEY) || localStorage.getItem(LEGACY_VISITED_KEY);
      return data ? new Set(JSON.parse(data)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  // Sync savedList to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedList));
    } catch {
      // Storage quota exceeded or private browsing
    }
  }, [savedList]);

  // Sync visitedIds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_VISITED_KEY, JSON.stringify(Array.from(visitedIds)));
    } catch {
      // Storage quota exceeded or private browsing
    }
  }, [visitedIds]);

  const savedIds = new Set(savedList);

  const toggleSave = useCallback((pandalId: string) => {
    setSavedList((prev) => {
      if (prev.includes(pandalId)) {
        const idx = prev.indexOf(pandalId);
        setLastRemoved({ id: pandalId, index: idx });
        return prev.filter((id) => id !== pandalId);
      } else {
        setLastRemoved(null);
        return [...prev, pandalId];
      }
    });
  }, []);

  const removeSaved = useCallback((pandalId: string) => {
    setSavedList((prev) => {
      const idx = prev.indexOf(pandalId);
      if (idx !== -1) {
        setLastRemoved({ id: pandalId, index: idx });
      }
      return prev.filter((id) => id !== pandalId);
    });
  }, []);

  const undoLastRemoval = useCallback(() => {
    if (!lastRemoved) return;
    setSavedList((prev) => {
      if (prev.includes(lastRemoved.id)) return prev;
      const next = [...prev];
      next.splice(lastRemoved.index, 0, lastRemoved.id);
      return next;
    });
    setLastRemoved(null);
  }, [lastRemoved]);

  const reorderSaved = useCallback((newOrder: string[]) => {
    setSavedList(newOrder);
  }, []);

  const toggleVisited = useCallback((pandalId: string) => {
    setVisitedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pandalId)) {
        next.delete(pandalId);
      } else {
        next.add(pandalId);
      }
      return next;
    });
  }, []);

  const isSaved = useCallback((pandalId: string) => savedList.includes(pandalId), [savedList]);
  const isVisited = useCallback((pandalId: string) => visitedIds.has(pandalId), [visitedIds]);

  /**
   * Generates a multi-stop Google Maps directions link for saved pandals
   */
  const generateGoogleMapsRouteUrl = useCallback(
    (pandals: Pandal[], userLocation?: { lat: number; lng: number } | null): string => {
      if (pandals.length === 0) {
        return 'https://www.google.com/maps';
      }

      if (pandals.length === 1) {
        const p = pandals[0];
        if (userLocation) {
          return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${p.lat},${p.lng}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}+${encodeURIComponent(p.area)}+Mumbai`;
      }

      // Max 9 waypoints in standard Google Maps URL
      if (userLocation) {
        const origin = `${userLocation.lat},${userLocation.lng}`;
        const destinationPandal = pandals[pandals.length - 1];
        const destination = `${destinationPandal.lat},${destinationPandal.lng}`;
        const waypoints = pandals
          .slice(0, pandals.length - 1)
          .slice(0, 9)
          .map((p) => `${p.lat},${p.lng}`)
          .join('|');

        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=walking`;
      } else {
        const origin = `${pandals[0].lat},${pandals[0].lng}`;
        const destination = `${pandals[pandals.length - 1].lat},${pandals[pandals.length - 1].lng}`;
        const waypoints = pandals
          .slice(1, pandals.length - 1)
          .slice(0, 8)
          .map((p) => `${p.lat},${p.lng}`)
          .join('|');

        if (waypoints) {
          return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=walking`;
        }
        return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
      }
    },
    []
  );

  return {
    savedIds,
    savedList,
    visitedIds,
    savedCount: savedList.length,
    visitedCount: visitedIds.size,
    lastRemoved,
    toggleSave,
    removeSaved,
    undoLastRemoval,
    reorderSaved,
    toggleVisited,
    isSaved,
    isVisited,
    generateGoogleMapsRouteUrl,
  };
}

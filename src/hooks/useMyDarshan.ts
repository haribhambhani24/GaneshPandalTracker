import { useCallback, useEffect, useState } from 'react';

const STORAGE_SAVED_KEY = 'pandal_map_saved';
const STORAGE_VISITED_KEY = 'pandal_map_visited';

export function useMyDarshan() {
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const data = localStorage.getItem(STORAGE_SAVED_KEY);
      return data ? new Set(JSON.parse(data)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const [visitedIds, setVisitedIds] = useState<Set<string>>(() => {
    try {
      const data = localStorage.getItem(STORAGE_VISITED_KEY);
      return data ? new Set(JSON.parse(data)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(Array.from(savedIds)));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_VISITED_KEY, JSON.stringify(Array.from(visitedIds)));
  }, [visitedIds]);

  const toggleSave = useCallback((pandalId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pandalId)) {
        next.delete(pandalId);
      } else {
        next.add(pandalId);
      }
      return next;
    });
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

  const isSaved = useCallback((pandalId: string) => savedIds.has(pandalId), [savedIds]);
  const isVisited = useCallback((pandalId: string) => visitedIds.has(pandalId), [visitedIds]);

  return {
    savedIds,
    visitedIds,
    savedCount: savedIds.size,
    visitedCount: visitedIds.size,
    toggleSave,
    toggleVisited,
    isSaved,
    isVisited,
  };
}


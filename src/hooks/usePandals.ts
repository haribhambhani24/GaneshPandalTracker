// Copyright (c) 2026 Hari Bhambhani. All rights reserved.
// See LICENSE for terms of use.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { pandalService } from '../services/pandalService';
import type { CrowdLevel, Pandal } from '../types/pandal';
import type { UserLocation } from './useUserLocation';
import { calculateDistanceKm } from '../utils/geoUtils';
import { matchesSearchQuery } from '../utils/searchUtils';

export type SortOption = 'default' | 'distance' | 'name' | 'crowd';

const SESSION_FILTERS_KEY = 'ganesh_pandal_filters_state';

interface StoredFilters {
  searchQuery?: string;
  crowdFilter?: 'All' | CrowdLevel;
  ecoFriendlyFilter?: boolean;
  twentyFourHoursFilter?: boolean;
  selectedArea?: string;
  sortBy?: SortOption;
}

function loadSavedFilters(): StoredFilters {
  try {
    const raw = sessionStorage.getItem(SESSION_FILTERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function usePandals(userLocation: UserLocation | null) {
  const initial = useMemo(() => loadSavedFilters(), []);

  const [pandals, setPandals] = useState<Pandal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(initial.searchQuery || '');
  const [crowdFilter, setCrowdFilter] = useState<'All' | CrowdLevel>(initial.crowdFilter || 'All');
  const [ecoFriendlyFilter, setEcoFriendlyFilter] = useState<boolean>(Boolean(initial.ecoFriendlyFilter));
  const [twentyFourHoursFilter, setTwentyFourHoursFilter] = useState<boolean>(Boolean(initial.twentyFourHoursFilter));
  const [selectedArea, setSelectedArea] = useState<string>(initial.selectedArea || 'All');
  const [sortBy, setSortBy] = useState<SortOption>(initial.sortBy || 'default');
  const [error, setError] = useState<string | null>(null);
  const [isFallbackActive, setIsFallbackActive] = useState<boolean>(false);

  // Sync filters to sessionStorage for back-navigation preservation
  useEffect(() => {
    try {
      const stateToSave: StoredFilters = {
        searchQuery,
        crowdFilter,
        ecoFriendlyFilter,
        twentyFourHoursFilter,
        selectedArea,
        sortBy,
      };
      sessionStorage.setItem(SESSION_FILTERS_KEY, JSON.stringify(stateToSave));
    } catch {
      // sessionStorage unavailable
    }
  }, [searchQuery, crowdFilter, ecoFriendlyFilter, twentyFourHoursFilter, selectedArea, sortBy]);

  useEffect(() => {
    let mounted = true;
    pandalService
      .getPandals()
      .then((data) => {
        if (mounted) {
          setPandals(data);
          setIsFallbackActive(pandalService.isFallbackActive);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch pandal data');
          setIsFallbackActive(pandalService.isFallbackActive);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const refetch = useCallback(async (bypassCache = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = bypassCache
        ? await pandalService.refreshPandals()
        : await pandalService.getPandals();
      setPandals(data);
      setIsFallbackActive(pandalService.isFallbackActive);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pandal data');
      setIsFallbackActive(pandalService.isFallbackActive);
    } finally {
      setLoading(false);
    }
  }, []);

  // Compute map of distances for each pandal
  const distancesMap = useMemo(() => {
    const map = new Map<string, number>();
    if (!userLocation) return map;

    pandals.forEach((pandal) => {
      const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, pandal.lat, pandal.lng);
      map.set(pandal.id, dist);
    });
    return map;
  }, [pandals, userLocation]);

  const areas = useMemo(() => {
    const set = new Set<string>();
    pandals.forEach((p) => set.add(p.area));
    return ['All', ...Array.from(set).sort()];
  }, [pandals]);

  const sortByDistance = sortBy === 'distance';

  const setSortByDistance = useCallback((enable: boolean) => {
    setSortBy(enable ? 'distance' : 'default');
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedArea !== 'All' ||
      ecoFriendlyFilter ||
      twentyFourHoursFilter ||
      crowdFilter !== 'All' ||
      sortBy !== 'default'
    );
  }, [searchQuery, selectedArea, ecoFriendlyFilter, twentyFourHoursFilter, crowdFilter, sortBy]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedArea('All');
    setEcoFriendlyFilter(false);
    setTwentyFourHoursFilter(false);
    setCrowdFilter('All');
    setSortBy('default');
  }, []);

  const filteredPandals = useMemo(() => {
    const list = pandals.filter((pandal) => {
      // 1. Multilingual + typo-tolerant fuzzy search
      if (searchQuery.trim() !== '') {
        if (!matchesSearchQuery(pandal, searchQuery)) {
          return false;
        }
      }

      if (crowdFilter !== 'All' && pandal.crowdLevel !== crowdFilter) {
        return false;
      }

      if (ecoFriendlyFilter && !pandal.ecoFriendly) {
        return false;
      }

      if (twentyFourHoursFilter) {
        const is24 = pandal.is24Hours || pandal.darshanTimings.toLowerCase().includes('24');
        if (!is24) return false;
      }

      if (selectedArea !== 'All' && pandal.area !== selectedArea) {
        return false;
      }

      return true;
    });

    // 2. Multi-criteria sorting
    const sorted = [...list];
    if (sortBy === 'distance' && userLocation) {
      sorted.sort((a, b) => {
        const distA = distancesMap.get(a.id) ?? Infinity;
        const distB = distancesMap.get(b.id) ?? Infinity;
        return distA - distB;
      });
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'crowd') {
      const crowdRank: Record<CrowdLevel, number> = { Low: 1, Medium: 2, High: 3 };
      sorted.sort((a, b) => crowdRank[a.crowdLevel] - crowdRank[b.crowdLevel]);
    }

    return sorted;
  }, [
    pandals,
    searchQuery,
    crowdFilter,
    ecoFriendlyFilter,
    twentyFourHoursFilter,
    selectedArea,
    sortBy,
    userLocation,
    distancesMap,
  ]);

  return {
    pandals,
    filteredPandals,
    loading,
    error,
    isFallbackActive,
    refetch,
    selectedPandal,
    setSelectedPandal,
    searchQuery,
    setSearchQuery,
    crowdFilter,
    setCrowdFilter,
    ecoFriendlyFilter,
    setEcoFriendlyFilter,
    twentyFourHoursFilter,
    setTwentyFourHoursFilter,
    selectedArea,
    setSelectedArea,
    sortBy,
    setSortBy,
    sortByDistance,
    setSortByDistance,
    hasActiveFilters,
    clearAllFilters,
    areas,
    distancesMap,
  };
}

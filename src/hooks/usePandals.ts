import { useEffect, useMemo, useState } from 'react';
import { pandalService } from '../services/pandalService';
import type { CrowdLevel, Pandal } from '../types/pandal';
import type { UserLocation } from './useUserLocation';
import { calculateDistanceKm } from '../utils/geoUtils';

export function usePandals(userLocation: UserLocation | null) {
  const [pandals, setPandals] = useState<Pandal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [crowdFilter, setCrowdFilter] = useState<'All' | CrowdLevel>('All');
  const [ecoFriendlyFilter, setEcoFriendlyFilter] = useState<boolean>(false);
  const [twentyFourHoursFilter, setTwentyFourHoursFilter] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [sortByDistance, setSortByDistance] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    pandalService.getPandals().then((data) => {
      if (mounted) {
        setPandals(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
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

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedArea !== 'All' ||
      ecoFriendlyFilter ||
      twentyFourHoursFilter ||
      crowdFilter !== 'All' ||
      sortByDistance
    );
  }, [searchQuery, selectedArea, ecoFriendlyFilter, twentyFourHoursFilter, crowdFilter, sortByDistance]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedArea('All');
    setEcoFriendlyFilter(false);
    setTwentyFourHoursFilter(false);
    setCrowdFilter('All');
    setSortByDistance(false);
  };

  const filteredPandals = useMemo(() => {
    const list = pandals.filter((pandal) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = pandal.name.toLowerCase().includes(q);
        const matchesArea = pandal.area.toLowerCase().includes(q);
        const matchesStation = pandal.nearestStation.toLowerCase().includes(q);
        const matchesDesc = pandal.description.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesStation && !matchesDesc) {
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

    // Distance sorting
    if (sortByDistance && userLocation) {
      return [...list].sort((a, b) => {
        const distA = distancesMap.get(a.id) ?? Infinity;
        const distB = distancesMap.get(b.id) ?? Infinity;
        return distA - distB;
      });
    }

    return list;
  }, [
    pandals,
    searchQuery,
    crowdFilter,
    ecoFriendlyFilter,
    twentyFourHoursFilter,
    selectedArea,
    sortByDistance,
    userLocation,
    distancesMap,
  ]);

  return {
    pandals,
    filteredPandals,
    loading,
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
    sortByDistance,
    setSortByDistance,
    hasActiveFilters,
    clearAllFilters,
    areas,
    distancesMap,
  };
}

import React, { useState } from 'react';
import { LeafletMap } from '../components/Map/LeafletMap';
import { MUMBAI_CENTER } from '../utils/geoUtils';
import { Navbar } from '../components/Header/Navbar';
import { FestivalCountdownBanner } from '../components/Banner/FestivalCountdownBanner';
import { FilterChips } from '../components/Filters/FilterChips';
import { MapControls } from '../components/Controls/MapControls';
import { PandalBottomSheet } from '../components/BottomSheet/PandalBottomSheet';
import { PandalListView } from '../components/ListView/PandalListView';
import { LocationDeniedModal } from '../components/Modal/LocationDeniedModal';
import { usePandals } from '../hooks/usePandals';
import { useUserLocation } from '../hooks/useUserLocation';
import type { Pandal } from '../types/pandal';

export const MapPage: React.FC = () => {
  const {
    location: userLocation,
    loading: locating,
    isPermissionDenied,
    requestLocation,
    clearLocationError,
  } = useUserLocation();

  const {
    pandals,
    filteredPandals,
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
  } = usePandals(userLocation);

  const [isListView, setIsListView] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(MUMBAI_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [zoomTarget, setZoomTarget] = useState<{ lat: number; lng: number; zoom: number; timestamp: number } | null>(null);
  const [showLocationDeniedModal, setShowLocationDeniedModal] = useState<boolean>(false);

  // Handle selecting a pandal from marker or list
  const handleSelectPandal = (pandal: Pandal) => {
    setSelectedPandal(pandal);
  };

  // Handle selecting a suggestion from the live search bar:
  // "the map zooms to the selected result"
  const handleSelectSuggestion = (pandal: Pandal) => {
    setSelectedPandal(pandal);
    setZoomTarget({
      lat: pandal.lat,
      lng: pandal.lng,
      zoom: 16,
      timestamp: Date.now(),
    });
    // If on list view, switch back to map view
    if (isListView) {
      setIsListView(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedPandal(null);
  };

  // Handle "Near Me" button click
  const handleToggleNearMe = async () => {
    if (sortByDistance) {
      setSortByDistance(false);
      return;
    }

    if (userLocation) {
      setSortByDistance(true);
      // Zoom map to user location
      setZoomTarget({
        lat: userLocation.lat,
        lng: userLocation.lng,
        zoom: 14,
        timestamp: Date.now(),
      });
    } else {
      const loc = await requestLocation();
      if (loc) {
        setSortByDistance(true);
        setZoomTarget({
          lat: loc.lat,
          lng: loc.lng,
          zoom: 14,
          timestamp: Date.now(),
        });
      } else {
        setShowLocationDeniedModal(true);
      }
    }
  };

  const handleResetCenter = () => {
    setMapCenter(MUMBAI_CENTER);
    setMapZoom(12);
    setZoomTarget({
      lat: MUMBAI_CENTER[0],
      lng: MUMBAI_CENTER[1],
      zoom: 12,
      timestamp: Date.now(),
    });
    setSelectedPandal(null);
  };

  const userDistanceKm =
    userLocation && selectedPandal
      ? distancesMap.get(selectedPandal.id) ?? null
      : null;

  return (
    <div className="relative w-screen h-[100dvh] flex flex-col overflow-hidden bg-stone-50 dark:bg-stone-950 font-sans">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pandals={pandals}
        onSelectPandalSuggestion={handleSelectSuggestion}
        isListView={isListView}
        onToggleView={() => setIsListView((prev) => !prev)}
        totalPandals={pandals.length}
        filteredCount={filteredPandals.length}
        distancesMap={distancesMap}
      />

      {/* Festival Dates & Countdown Banner */}
      <FestivalCountdownBanner />

      {/* Filter Chips & Active Filters Row */}
      <FilterChips
        selectedArea={selectedArea}
        onAreaChange={setSelectedArea}
        areas={areas}
        ecoFriendlyFilter={ecoFriendlyFilter}
        onEcoFriendlyFilterChange={setEcoFriendlyFilter}
        twentyFourHoursFilter={twentyFourHoursFilter}
        onTwentyFourHoursFilterChange={setTwentyFourHoursFilter}
        crowdFilter={crowdFilter}
        onCrowdFilterChange={setCrowdFilter}
        sortByDistance={sortByDistance}
        onToggleSortByDistance={handleToggleNearMe}
        locatingDistance={locating}
        searchQuery={searchQuery}
        onClearSearchQuery={() => setSearchQuery('')}
        onClearAllFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Location Denied Friendly Modal */}
      <LocationDeniedModal
        isOpen={showLocationDeniedModal || isPermissionDenied}
        onClose={() => {
          setShowLocationDeniedModal(false);
          clearLocationError();
        }}
        onSelectArea={() => {
          setShowLocationDeniedModal(false);
          clearLocationError();
        }}
      />

      {/* Main View Area: Map or List */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {isListView ? (
          <div className="w-full h-full overflow-y-auto bg-stone-50 dark:bg-stone-950">
            <PandalListView
              pandals={filteredPandals}
              onSelectPandal={(p) => {
                handleSelectPandal(p);
                setIsListView(false);
              }}
              selectedPandal={selectedPandal}
              distancesMap={distancesMap}
            />
          </div>
        ) : (
          <>
            <LeafletMap
              pandals={filteredPandals}
              selectedPandal={selectedPandal}
              onSelectPandal={handleSelectPandal}
              userLocation={userLocation}
              center={mapCenter}
              zoom={mapZoom}
              zoomTarget={zoomTarget}
            />

            {/* Floating Map Controls (Thumb-friendly) */}
            <MapControls
              onZoomIn={() => setMapZoom((z) => Math.min(z + 1, 18))}
              onZoomOut={() => setMapZoom((z) => Math.max(z - 1, 10))}
              onLocateMe={handleToggleNearMe}
              onResetCenter={handleResetCenter}
              locating={locating}
            />

            {/* Bottom Sheet for Mobile & Side Card for Desktop */}
            <PandalBottomSheet
              pandal={selectedPandal}
              onClose={handleCloseDetail}
              userDistanceKm={userDistanceKm}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default MapPage;

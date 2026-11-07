import React, { useEffect, useState } from 'react';
import { LeafletMap } from '../components/Map/LeafletMap';
import { MUMBAI_CENTER } from '../utils/geoUtils';
import { Navbar } from '../components/Header/Navbar';
import { FestivalCountdownBanner } from '../components/Banner/FestivalCountdownBanner';
import { FilterChips } from '../components/Filters/FilterChips';
import { MapControls } from '../components/Controls/MapControls';
import { PandalBottomSheet } from '../components/BottomSheet/PandalBottomSheet';
import { PandalListView } from '../components/ListView/PandalListView';
import { LocationDeniedModal } from '../components/Modal/LocationDeniedModal';
import { CircuitsModal } from '../components/Circuits/CircuitsModal';
import { ActiveCircuitBanner } from '../components/Circuits/ActiveCircuitBanner';
import { usePandals } from '../hooks/usePandals';
import { useUserLocation } from '../hooks/useUserLocation';
import { useMyDarshan } from '../hooks/useMyDarshan';
import { circuitService } from '../services/circuitService';
import type { Pandal } from '../types/pandal';
import type { Circuit } from '../types/circuit';

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

  const { isSaved, savedCount } = useMyDarshan();

  const [isListView, setIsListView] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(MUMBAI_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [zoomTarget, setZoomTarget] = useState<{ lat: number; lng: number; zoom: number; timestamp: number } | null>(null);
  const [showLocationDeniedModal, setShowLocationDeniedModal] = useState<boolean>(false);

  // Circuits & Walking Trails state
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [activeCircuit, setActiveCircuit] = useState<Circuit | null>(null);
  const [showCircuitsModal, setShowCircuitsModal] = useState<boolean>(false);

  // My Darshan bookmark filter
  const [myDarshanFilterOnly, setMyDarshanFilterOnly] = useState<boolean>(false);

  useEffect(() => {
    circuitService.getCircuits().then(setCircuits);
  }, []);

  // Compute displayed pandals (accounting for My Darshan filter)
  const displayedPandals = myDarshanFilterOnly
    ? filteredPandals.filter((p) => isSaved(p.id))
    : filteredPandals;

  // Handle selecting a pandal from marker or list
  const handleSelectPandal = (pandal: Pandal) => {
    setSelectedPandal(pandal);
  };

  // Handle selecting a suggestion from live search bar
  const handleSelectSuggestion = (pandal: Pandal) => {
    setSelectedPandal(pandal);
    setZoomTarget({
      lat: pandal.lat,
      lng: pandal.lng,
      zoom: 16,
      timestamp: Date.now(),
    });
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

  const handleSelectCircuit = (circuit: Circuit) => {
    setActiveCircuit(circuit);
    setShowCircuitsModal(false);
    if (isListView) {
      setIsListView(false);
    }
  };

  const handleClearCircuit = () => {
    setActiveCircuit(null);
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
        filteredCount={displayedPandals.length}
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
        onClearAllFilters={() => {
          clearAllFilters();
          setActiveCircuit(null);
          setMyDarshanFilterOnly(false);
        }}
        hasActiveFilters={hasActiveFilters}
        onOpenCircuits={() => setShowCircuitsModal(true)}
        activeCircuit={activeCircuit}
        onClearCircuit={handleClearCircuit}
        myDarshanFilterOnly={myDarshanFilterOnly}
        onToggleMyDarshanFilter={() => setMyDarshanFilterOnly((prev) => !prev)}
        myDarshanCount={savedCount}
      />

      {/* Walking Tours Modal */}
      <CircuitsModal
        isOpen={showCircuitsModal}
        onClose={() => setShowCircuitsModal(false)}
        circuits={circuits}
        pandals={pandals}
        activeCircuit={activeCircuit}
        onSelectCircuit={handleSelectCircuit}
        onClearCircuit={handleClearCircuit}
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
              pandals={displayedPandals}
              onSelectPandal={(p) => {
                handleSelectPandal(p);
                setIsListView(false);
              }}
              selectedPandal={selectedPandal}
              distancesMap={distancesMap}
              onClearFilters={() => {
                clearAllFilters();
                setMyDarshanFilterOnly(false);
                setActiveCircuit(null);
              }}
              searchQuery={searchQuery}
            />
          </div>
        ) : (
          <>
            <LeafletMap
              pandals={pandals}
              selectedPandal={selectedPandal}
              onSelectPandal={handleSelectPandal}
              userLocation={userLocation}
              center={mapCenter}
              zoom={mapZoom}
              zoomTarget={zoomTarget}
              activeCircuit={activeCircuit}
            />

            {/* Active Circuit Floating Banner */}
            {activeCircuit && (
              <ActiveCircuitBanner
                circuit={activeCircuit}
                onClear={handleClearCircuit}
                onOpenDetails={() => setShowCircuitsModal(true)}
              />
            )}

            {/* Empty State Overlay for Map View when 0 results */}
            {displayedPandals.length === 0 && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[500] w-[90%] max-w-sm">
                <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-amber-300 dark:border-amber-800 text-center space-y-2">
                  <div className="text-2xl">🕉️</div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {myDarshanFilterOnly
                      ? 'No pandals saved in My Darshan yet'
                      : 'No pandals match your filters'}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {myDarshanFilterOnly
                      ? 'Tap the bookmark icon on any pandal card to save it for your festival visit.'
                      : 'Try adjusting or clearing your search and filters.'}
                  </p>
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMyDarshanFilterOnly(false);
                      setActiveCircuit(null);
                    }}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow cursor-pointer transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

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

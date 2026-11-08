import React, { useEffect, useRef, useState } from 'react';
import { LeafletMap, type LeafletMapRef } from '../components/Map/LeafletMap';
import { MUMBAI_CENTER } from '../utils/geoUtils';
import { Navbar } from '../components/Header/Navbar';
import { FestivalCountdownBanner } from '../components/Banner/FestivalCountdownBanner';
import { FilterChips } from '../components/Filters/FilterChips';
import { MapControls } from '../components/Controls/MapControls';
import { PandalBottomSheet } from '../components/BottomSheet/PandalBottomSheet';
import { PandalListView } from '../components/ListView/PandalListView';
import { LocationDeniedModal } from '../components/Modal/LocationDeniedModal';
import { PrePromptGpsModal } from '../components/Modal/PrePromptGpsModal';
import { CircuitsModal } from '../components/Circuits/CircuitsModal';
import { ActiveCircuitBanner } from '../components/Circuits/ActiveCircuitBanner';
import { MyDarshanModal } from '../components/MyDarshan/MyDarshanModal';
import { usePandals } from '../hooks/usePandals';
import { useUserLocation } from '../hooks/useUserLocation';
import { useMyDarshan } from '../hooks/useMyDarshan';
import { useI18n } from '../context/I18nContext';
import { circuitService } from '../services/circuitService';
import type { Pandal } from '../types/pandal';
import type { Circuit } from '../types/circuit';
import { Sparkles, WifiOff, X } from 'lucide-react';
import { Footer } from '../components/Footer/Footer';
import { AboutBottomSheet } from '../components/Footer/AboutBottomSheet';

const HINT_STORAGE_KEY = 'ganesh_pandal_hint_dismissed';
const LANG_CHOSEN_KEY = 'ganesh_pandal_lang_chosen';
const MAP_POS_KEY = 'ganesh_pandal_map_pos';

export const MapPage: React.FC = () => {
  const { t, setLanguage } = useI18n();
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
    sortByDistance,
    setSortByDistance,
    hasActiveFilters,
    clearAllFilters,
    areas,
    distancesMap,
  } = usePandals(userLocation);

  const { isSaved, savedCount } = useMyDarshan();

  const [isListView, setIsListView] = useState<boolean>(false);

  // Preserve map center and zoom in sessionStorage
  const [mapCenter, setMapCenter] = useState<[number, number]>(() => {
    try {
      const saved = sessionStorage.getItem(MAP_POS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.center) && parsed.center.length === 2) {
          return parsed.center;
        }
      }
    } catch {}
    return MUMBAI_CENTER;
  });

  const [mapZoom, setMapZoom] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem(MAP_POS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.zoom === 'number') return parsed.zoom;
      }
    } catch {}
    return 12;
  });

  const mapRef = useRef<LeafletMapRef>(null);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    } else {
      setMapZoom((z) => Math.min(z + 1, 19));
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    } else {
      setMapZoom((z) => Math.max(z - 1, 10));
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setMapZoom(newZoom);
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(
        MAP_POS_KEY,
        JSON.stringify({ center: mapCenter, zoom: mapZoom })
      );
    } catch {}
  }, [mapCenter, mapZoom]);

  const [zoomTarget, setZoomTarget] = useState<{ lat: number; lng: number; zoom: number; timestamp: number } | null>(null);
  const [zoomCounter, setZoomCounter] = useState<number>(1);
  const [showLocationDeniedModal, setShowLocationDeniedModal] = useState<boolean>(false);
  const [showPrePromptGps, setShowPrePromptGps] = useState<boolean>(false);

  // Circuits & Walking Trails state
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [activeCircuit, setActiveCircuit] = useState<Circuit | null>(null);
  const [showCircuitsModal, setShowCircuitsModal] = useState<boolean>(false);
  const [showAboutSheet, setShowAboutSheet] = useState<boolean>(false);

  // My Darshan bookmark filter & Modal
  const [myDarshanFilterOnly, setMyDarshanFilterOnly] = useState<boolean>(false);
  const [showMyDarshanModal, setShowMyDarshanModal] = useState<boolean>(false);

  // First-visit dismissible hint
  const [showFirstVisitHint, setShowFirstVisitHint] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(HINT_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  // First-visit language chooser prompt
  const [showFirstVisitLangPrompt, setShowFirstVisitLangPrompt] = useState<boolean>(() => {
    try {
      return !localStorage.getItem(LANG_CHOSEN_KEY);
    } catch {
      return false;
    }
  });

  // Offline banner & auto-reconnect
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnectedBanner, setShowReconnectedBanner] = useState<boolean>(false);

  useEffect(() => {
    circuitService.getCircuits().then(setCircuits);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedBanner(true);
      refetch(true);
      setTimeout(() => setShowReconnectedBanner(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refetch]);

  // Compute displayed pandals (accounting for My Darshan filter)
  const displayedPandals = myDarshanFilterOnly
    ? filteredPandals.filter((p) => isSaved(p.id))
    : filteredPandals;

  const handleSelectPandal = (pandal: Pandal) => {
    setSelectedPandal(pandal);
  };

  const handleSelectSuggestion = (pandal: Pandal) => {
    setSelectedPandal(pandal);
    const nextSeq = zoomCounter + 1;
    setZoomCounter(nextSeq);
    setZoomTarget({
      lat: pandal.lat,
      lng: pandal.lng,
      zoom: 16,
      timestamp: nextSeq,
    });
    if (isListView) {
      setIsListView(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedPandal(null);
  };

  // Near Me trigger with pre-prompt explanation
  const handleToggleNearMe = async () => {
    if (sortByDistance) {
      setSortByDistance(false);
      return;
    }

    if (userLocation) {
      setSortByDistance(true);
      const nextSeq = zoomCounter + 1;
      setZoomCounter(nextSeq);
      setZoomTarget({
        lat: userLocation.lat,
        lng: userLocation.lng,
        zoom: 14,
        timestamp: nextSeq,
      });
      return;
    }

    const explained = localStorage.getItem('ganesh_pandal_gps_explained');
    if (!explained) {
      setShowPrePromptGps(true);
    } else {
      executeLocationRequest();
    }
  };

  const executeLocationRequest = async () => {
    try {
      localStorage.setItem('ganesh_pandal_gps_explained', 'true');
    } catch {}
    setShowPrePromptGps(false);
    const loc = await requestLocation();
    if (loc) {
      setSortByDistance(true);
      const nextSeq = zoomCounter + 1;
      setZoomCounter(nextSeq);
      setZoomTarget({
        lat: loc.lat,
        lng: loc.lng,
        zoom: 14,
        timestamp: nextSeq,
      });
    } else {
      setShowLocationDeniedModal(true);
    }
  };

  const handleResetCenter = () => {
    setMapCenter(MUMBAI_CENTER);
    setMapZoom(12);
    const nextSeq = zoomCounter + 1;
    setZoomCounter(nextSeq);
    setZoomTarget({
      lat: MUMBAI_CENTER[0],
      lng: MUMBAI_CENTER[1],
      zoom: 12,
      timestamp: nextSeq,
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

  const handleDismissHint = () => {
    setShowFirstVisitHint(false);
    try {
      localStorage.setItem(HINT_STORAGE_KEY, 'true');
    } catch {}
  };

  const handleSelectFirstVisitLanguage = (lang: 'en' | 'hi' | 'mr') => {
    setLanguage(lang);
    setShowFirstVisitLangPrompt(false);
    try {
      localStorage.setItem(LANG_CHOSEN_KEY, 'true');
    } catch {}
  };

  const handleDismissLangPrompt = () => {
    setShowFirstVisitLangPrompt(false);
    try {
      localStorage.setItem(LANG_CHOSEN_KEY, 'true');
    } catch {}
  };

  const userDistanceKm =
    userLocation && selectedPandal
      ? distancesMap.get(selectedPandal.id) ?? null
      : null;

  return (
    <div className="relative w-full max-w-full h-[100vh] h-[100dvh] flex flex-col overflow-hidden bg-stone-50 dark:bg-stone-950 font-sans">
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
        onOpenAboutSheet={() => setShowAboutSheet(true)}
      />

      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-bold px-3 py-1.5 flex items-center justify-center gap-1.5 shadow-xs z-[990]">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{t.offlineBanner}</span>
        </div>
      )}

      {/* Reconnected Status Banner */}
      {showReconnectedBanner && (
        <div className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 flex items-center justify-center gap-1.5 shadow-xs z-[990] animate-in slide-in-from-top-2">
          <span>✓</span>
          <span>{t.onlineBanner}</span>
        </div>
      )}

      {/* First-Visit Language Chooser Banner */}
      {showFirstVisitLangPrompt && (
        <div className="bg-amber-100 dark:bg-stone-800 border-b border-amber-300 dark:border-stone-700 px-3 py-2 flex items-center justify-between gap-2 z-[980] text-xs animate-in fade-in">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-amber-950 dark:text-amber-300">
              {t.chooseLanguagePrompt}:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSelectFirstVisitLanguage('en')}
                className="px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600 hover:bg-amber-50 cursor-pointer"
              >
                English
              </button>
              <button
                onClick={() => handleSelectFirstVisitLanguage('hi')}
                className="px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600 hover:bg-amber-50 cursor-pointer"
              >
                हिंदी
              </button>
              <button
                onClick={() => handleSelectFirstVisitLanguage('mr')}
                className="px-2.5 py-0.5 rounded-full font-bold bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-600 hover:bg-amber-50 cursor-pointer"
              >
                मराठी
              </button>
            </div>
          </div>
          <button
            onClick={handleDismissLangPrompt}
            className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
        onToggleMyDarshanFilter={() => setShowMyDarshanModal(true)}
        myDarshanCount={savedCount}
        filteredCount={displayedPandals.length}
        totalCount={pandals.length}
      />

      {/* First-Visit Lightweight Dismissible Hint */}
      {showFirstVisitHint && (
        <div className="bg-amber-50 dark:bg-stone-900 border-b border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-200 text-xs px-3.5 py-1.5 flex items-center justify-between gap-2 z-[960] shadow-xs">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t.firstVisitHint}</span>
          </span>
          <button
            onClick={handleDismissHint}
            className="font-bold underline text-amber-800 hover:text-amber-950 dark:text-amber-300 dark:hover:text-amber-100 shrink-0 cursor-pointer ml-2"
          >
            {t.firstVisitDismiss}
          </button>
        </div>
      )}

      {/* Pre-Prompt GPS Modal */}
      <PrePromptGpsModal
        isOpen={showPrePromptGps}
        onConfirm={executeLocationRequest}
        onCancel={() => setShowPrePromptGps(false)}
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

      {/* Location Denied Friendly Modal with Popular Areas */}
      <LocationDeniedModal
        isOpen={showLocationDeniedModal || isPermissionDenied}
        onClose={() => {
          setShowLocationDeniedModal(false);
          clearLocationError();
        }}
        onSelectArea={(area) => {
          setSelectedArea(area);
          setShowLocationDeniedModal(false);
          clearLocationError();
        }}
      />

      {/* My Darshan Multi-Stop Route Modal */}
      <MyDarshanModal
        isOpen={showMyDarshanModal}
        onClose={() => setShowMyDarshanModal(false)}
        pandals={pandals}
        userLocation={userLocation}
        onSelectPandal={(p) => {
          handleSelectSuggestion(p);
        }}
      />

      {/* Main View Area: Map or List */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {loading && pandals.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-6 text-center space-y-3 z-[600]">
            <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-2" />
            <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              {t.loadingPandalDetails || 'Loading pandals...'}
            </p>
          </div>
        ) : error && pandals.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-6 text-center space-y-4 z-[600]">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center text-3xl shadow-inner">
              ⚠️
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="font-extrabold text-base text-stone-900 dark:text-white">
                Unable to load pandal data
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {error}
              </p>
            </div>
            <button
              onClick={() => refetch(true)}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              Retry Connection
            </button>
          </div>
        ) : isListView ? (
          <div className="w-full h-full overflow-y-auto bg-stone-50 dark:bg-stone-950 flex flex-col justify-between">
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
            <Footer
              onOpenMyDarshan={() => setShowMyDarshanModal(true)}
              onOpenCircuits={() => setShowCircuitsModal(true)}
            />
          </div>
        ) : (
          <>
            <LeafletMap
              ref={mapRef}
              pandals={pandals}
              selectedPandal={selectedPandal}
              onSelectPandal={handleSelectPandal}
              userLocation={userLocation}
              center={mapCenter}
              zoom={mapZoom}
              onZoomChange={handleZoomChange}
              zoomTarget={zoomTarget}
              activeCircuit={activeCircuit}
            />

            {/* Offline Fallback Badge */}
            {isFallbackActive && (
              <div className="absolute top-3 left-3 z-[500] px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-600/90 text-white backdrop-blur-md shadow-md border border-amber-300/40 flex items-center gap-1.5 pointer-events-none">
                <span>⚡</span>
                <span>Offline / Local Fallback Data</span>
              </div>
            )}

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
                      ? t.noSavedDarshanTitle
                      : t.noPandalsFound}
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {myDarshanFilterOnly
                      ? t.noSavedDarshanMsg
                      : t.adjustFiltersMsg}
                  </p>
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setMyDarshanFilterOnly(false);
                      setActiveCircuit(null);
                    }}
                    className="mt-2 px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow cursor-pointer transition-colors"
                  >
                    {t.clearAllFilters}
                  </button>
                </div>
              </div>
            )}

            {/* Floating Map Controls (Thumb-friendly & responsive to bottom sheet) */}
            <MapControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              canZoomIn={mapZoom < 19}
              canZoomOut={mapZoom > 10}
              onLocateMe={handleToggleNearMe}
              onResetCenter={handleResetCenter}
              locating={locating}
              isSheetOpen={!!selectedPandal}
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

      {/* About & Quick Links Bottom Sheet for Mobile Map View */}
      <AboutBottomSheet
        isOpen={showAboutSheet}
        onClose={() => setShowAboutSheet(false)}
        onOpenMyDarshan={() => setShowMyDarshanModal(true)}
        onOpenCircuits={() => setShowCircuitsModal(true)}
      />
    </div>
  );
};

export default MapPage;

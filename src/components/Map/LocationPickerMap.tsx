import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hand, MapPin, Navigation } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { MUMBAI_CENTER } from '../../utils/geoUtils';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  onChange,
}) => {
  const { t } = useI18n();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [detecting, setDetecting] = useState<boolean>(false);
  const [isMapActive, setIsMapActive] = useState<boolean>(false);

  // Initialize interactive Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = lat || MUMBAI_CENTER[0];
    const initialLng = lng || MUMBAI_CENTER[1];

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      minZoom: 10,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false, // Disabled initially so page scrolls freely
      touchZoom: true,
      doubleClickZoom: true,
      dragging: true,
    });

    // Add customized zoom controls matching app theme
    L.control
      .zoom({
        position: 'topleft',
        zoomInTitle: t.zoomIn,
        zoomOutTitle: t.zoomOut,
        zoomInText: '+',
        zoomOutText: '−',
      })
      .addTo(map);

    // Apply translated aria-labels
    const inBtn = mapContainerRef.current?.querySelector('.leaflet-control-zoom-in');
    const outBtn = mapContainerRef.current?.querySelector('.leaflet-control-zoom-out');
    if (inBtn) inBtn.setAttribute('aria-label', t.zoomIn);
    if (outBtn) outBtn.setAttribute('aria-label', t.zoomOut);

    // Standard OpenStreetMap tiles (free, no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Custom Draggable Pin Icon
    const customIcon = L.divIcon({
      html: `
        <div class="relative flex flex-col items-center cursor-grab active:cursor-grabbing transform -translate-y-2">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-orange-600 to-amber-500 border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold text-lg animate-bounce">
            🕉️
          </div>
          <div class="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-red-600 -mt-1 filter drop-shadow"></div>
          <span class="mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 text-white whitespace-nowrap shadow backdrop-blur-xs">
            ${t.dragToSet}
          </span>
        </div>
      `,
      className: 'picker-marker-icon',
      iconSize: [40, 52],
      iconAnchor: [20, 50],
    });

    const marker = L.marker([initialLat, initialLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    markerRef.current = marker;

    // When pin is dragged
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });

    // When user clicks anywhere on the map
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      const formattedLat = Number(clickLat.toFixed(6));
      const formattedLng = Number(clickLng.toFixed(6));
      marker.setLatLng([formattedLat, formattedLng]);
      onChange(formattedLat, formattedLng);
      // Enable scroll wheel zoom on click
      map.scrollWheelZoom.enable();
      setIsMapActive(true);
    });

    // Disable scrollWheelZoom on mouse leave so page scrolling resumes
    const container = mapContainerRef.current;
    const handleMouseLeave = () => {
      map.scrollWheelZoom.disable();
      setIsMapActive(false);
    };
    container.addEventListener('mouseleave', handleMouseLeave);

    // Two-finger touch gesture handling on mobile:
    // If 1 finger touch, disable map dragging so page scrolls smoothly.
    // If 2 fingers touch, enable map dragging so user can pan/pinch zoom.
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        map.dragging.disable();
      } else if (e.touches.length >= 2) {
        map.dragging.enable();
      }
    };

    const handleTouchEnd = () => {
      // Re-enable dragging for next potential interaction
      map.dragging.enable();
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    mapInstanceRef.current = map;

    setTimeout(() => map.invalidateSize(), 50);
    setTimeout(() => map.invalidateSize(), 200);
    setTimeout(() => map.invalidateSize(), 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      map.remove();
      mapInstanceRef.current = null;
    };
    // Intentionally initialize map instance once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external lat/lng changes
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (Math.abs(currentPos.lat - lat) > 0.0001 || Math.abs(currentPos.lng - lng) > 0.0001) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.panTo([lat, lng]);
      }
    }
  }, [lat, lng]);

  // GPS "Detect Location" handler
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetecting(false);
        const userLat = Number(pos.coords.latitude.toFixed(6));
        const userLng = Number(pos.coords.longitude.toFixed(6));
        onChange(userLat, userLng);
        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng([userLat, userLng]);
          mapInstanceRef.current.setView([userLat, userLng], 16, { animate: true });
        }
      },
      (err) => {
        setDetecting(false);
        alert(`Could not retrieve location: ${err.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
        <span className="flex items-center gap-1 font-medium">
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          {t.tapMapOrDragPin}
        </span>
        <button
          type="button"
          onClick={handleDetectCurrentLocation}
          disabled={detecting}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-100 dark:bg-stone-800 text-orange-700 dark:text-orange-300 font-semibold text-[11px] hover:bg-orange-200 transition-colors cursor-pointer"
        >
          <Navigation className={`w-3 h-3 ${detecting ? 'animate-spin' : ''}`} />
          <span>{detecting ? t.detectingLocation : t.useMyGps}</span>
        </button>
      </div>

      {/* Map Container with fixed 300px height on mobile and touch-action pan-y */}
      <div className="relative w-full h-[300px] sm:h-[340px] rounded-2xl overflow-hidden border border-amber-300/80 dark:border-amber-900 shadow-inner z-0 touch-pan-y">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Coordinates Overlay */}
        <div className="absolute bottom-2 left-2 z-[400] bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-amber-200 border border-white/20 shadow pointer-events-none">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </div>

        {/* Mobile touch hint overlay */}
        <div className="absolute top-2 right-2 z-[400] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-stone-200 border border-white/20 shadow pointer-events-none flex items-center gap-1">
          <Hand className="w-3 h-3 text-amber-300" />
          <span>{t.twoFingersToPan}</span>
        </div>

        {/* Click to zoom indicator on desktop */}
        {!isMapActive && (
          <div className="hidden sm:block absolute bottom-2 right-2 z-[400] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-stone-300 border border-white/15 pointer-events-none">
            {t.clickMapToEnableZoom}
          </div>
        )}
      </div>
    </div>
  );
};

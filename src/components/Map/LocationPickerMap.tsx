import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';
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
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [detecting, setDetecting] = useState<boolean>(false);

  // Initialize interactive Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = lat || MUMBAI_CENTER[0];
    const initialLng = lng || MUMBAI_CENTER[1];

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

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
            Drag to Set
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
    });

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
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
          Tap map or drag pin to position:
        </span>
        <button
          type="button"
          onClick={handleDetectCurrentLocation}
          disabled={detecting}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-100 dark:bg-stone-800 text-orange-700 dark:text-orange-300 font-semibold text-[11px] hover:bg-orange-200 transition-colors cursor-pointer"
        >
          <Navigation className={`w-3 h-3 ${detecting ? 'animate-spin' : ''}`} />
          <span>{detecting ? 'Detecting...' : 'Use My GPS'}</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-amber-300/80 dark:border-amber-900 shadow-inner z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Coordinates Overlay */}
        <div className="absolute bottom-2 left-2 z-[400] bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-amber-200 border border-white/20 shadow">
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
};


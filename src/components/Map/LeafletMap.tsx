import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix global window.L for leaflet.markercluster UMD
if (typeof window !== 'undefined') {
  (window as unknown as { L: typeof L }).L = L;
}
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import type { Pandal } from '../../types/pandal';
import type { Circuit } from '../../types/circuit';
import type { UserLocation } from '../../hooks/useUserLocation';
import { createClusterIcon, createGaneshaIcon } from './ganeshaMarker';

import { MUMBAI_CENTER, DEFAULT_ZOOM } from '../../utils/geoUtils';

interface LeafletMapProps {
  pandals: Pandal[];
  selectedPandal: Pandal | null;
  onSelectPandal: (pandal: Pandal) => void;
  userLocation: UserLocation | null;
  center?: [number, number];
  zoom?: number;
  zoomTarget?: { lat: number; lng: number; zoom: number; timestamp: number } | null;
  activeCircuit?: Circuit | null;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  pandals,
  selectedPandal,
  onSelectPandal,
  userLocation,
  center = MUMBAI_CENTER,
  zoom = DEFAULT_ZOOM,
  zoomTarget,
  activeCircuit,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | L.FeatureGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  const circuitPolylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    // Standard OpenStreetMap tiles (100% free, no API key required)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Attribution
    L.control
      .attribution({
        position: 'bottomleft',
        prefix: 'Leaflet | © OpenStreetMap',
      })
      .addTo(map);

    // Initialize MarkerClusterGroup
    try {
      if (typeof (L as unknown as { markerClusterGroup?: unknown }).markerClusterGroup === 'function') {
        const clusterGroup = (L as unknown as {
          markerClusterGroup: (opts?: unknown) => L.MarkerClusterGroup;
        }).markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 40,
          spiderfyOnMaxZoom: true,
          iconCreateFunction: (cluster: unknown) =>
            createClusterIcon(cluster as { getChildCount: () => number }),
        });
        clusterGroup.addTo(map);
        clusterGroupRef.current = clusterGroup;
      } else {
        const featureGroup = L.featureGroup().addTo(map);
        clusterGroupRef.current = featureGroup;
      }
    } catch (e) {
      console.warn('MarkerCluster fallback to FeatureGroup:', e);
      const featureGroup = L.featureGroup().addTo(map);
      clusterGroupRef.current = featureGroup;
    }

    mapInstanceRef.current = map;

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Also observe container size changes (e.g. mobile bottom sheet open/close or layout reflow)
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      resizeObserver?.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
    // Intentionally initialize Leaflet map instance once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync Pandals & Markers (with circuit stop numbers if circuit active)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const cluster = clusterGroupRef.current;
    if (!map || !cluster) return;

    cluster.clearLayers();
    markersMapRef.current.clear();

    pandals.forEach((pandal) => {
      const isSelected = selectedPandal?.id === pandal.id;
      let stopNumber: number | undefined = undefined;

      if (activeCircuit) {
        const idx = activeCircuit.pandalIds.indexOf(pandal.id);
        if (idx !== -1) {
          stopNumber = idx + 1;
        }
      }

      const marker = L.marker([pandal.lat, pandal.lng], {
        icon: createGaneshaIcon(pandal, isSelected, stopNumber),
        title: pandal.name,
      });

      marker.on('click', () => {
        onSelectPandal(pandal);
        map.panTo([pandal.lat, pandal.lng], { animate: true, duration: 0.5 });
      });

      cluster.addLayer(marker);
      markersMapRef.current.set(pandal.id, marker);
    });
    // Marker selection icon updates are handled separately by the effect below to avoid recreating cluster layers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pandals, onSelectPandal, activeCircuit]);

  // Update Selected Marker Icon & pan
  useEffect(() => {
    markersMapRef.current.forEach((marker, id) => {
      const pandal = pandals.find((p) => p.id === id);
      if (pandal) {
        const isSelected = selectedPandal?.id === id;
        let stopNumber: number | undefined = undefined;

        if (activeCircuit) {
          const idx = activeCircuit.pandalIds.indexOf(pandal.id);
          if (idx !== -1) {
            stopNumber = idx + 1;
          }
        }

        marker.setIcon(createGaneshaIcon(pandal, isSelected, stopNumber));
        if (isSelected) {
          marker.setZIndexOffset(1000);
        } else {
          marker.setZIndexOffset(0);
        }
      }
    });

    if (selectedPandal && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([selectedPandal.lat, selectedPandal.lng], {
        animate: true,
        duration: 0.5,
      });
      // Invalidate size smoothly after bottom sheet opens
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 350);
    } else if (mapInstanceRef.current) {
      // Invalidate size after bottom sheet closes
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 350);
    }
  }, [selectedPandal, pandals, activeCircuit]);

  // Handle Active Circuit Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (circuitPolylineRef.current) {
      circuitPolylineRef.current.remove();
      circuitPolylineRef.current = null;
    }

    if (activeCircuit && activeCircuit.pandalIds.length > 1) {
      const stops: [number, number][] = [];
      activeCircuit.pandalIds.forEach((id) => {
        const found = pandals.find((p) => p.id === id);
        if (found) {
          stops.push([found.lat, found.lng]);
        }
      });

      if (stops.length > 1) {
        const polyline = L.polyline(stops, {
          color: activeCircuit.themeColor || '#EA580C',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.85,
        }).addTo(map);

        circuitPolylineRef.current = polyline;

        // Auto-fit bounds of the circuit
        map.fitBounds(polyline.getBounds(), {
          padding: [50, 50],
          maxZoom: 16,
          animate: true,
        });
      }
    }
  }, [activeCircuit, pandals]);

  // Zoom target effect
  useEffect(() => {
    if (zoomTarget && mapInstanceRef.current) {
      mapInstanceRef.current.setView([zoomTarget.lat, zoomTarget.lng], zoomTarget.zoom, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [zoomTarget]);

  // User GPS Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation) {
      const userIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-blue-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-lg"></span>
          </div>
        `,
        className: 'user-location-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 2000,
        }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0 outline-none" />
    </div>
  );
};

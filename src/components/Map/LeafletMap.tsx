import React, { useEffect, useImperativeHandle, useRef } from 'react';
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
import type { RouteResult, MultiStopRouteResult, Coordinates } from '../../services/routing';
import { createClusterIcon, createGaneshaIcon } from './ganeshaMarker';

import { MUMBAI_CENTER, DEFAULT_ZOOM } from '../../utils/geoUtils';

export interface LeafletMapRef {
  zoomIn: () => void;
  zoomOut: () => void;
  getZoom: () => number;
  invalidateSize: () => void;
  panTo: (lat: number, lng: number, zoom?: number) => void;
}

export interface LeafletMapProps {
  pandals: Pandal[];
  selectedPandal: Pandal | null;
  onSelectPandal: (pandal: Pandal) => void;
  userLocation: UserLocation | null;
  center?: [number, number];
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  zoomTarget?: { lat: number; lng: number; zoom: number; timestamp: number } | null;
  activeCircuit?: Circuit | null;
  navigationRoute?: RouteResult | null;
  navigationMultiStopRoute?: MultiStopRouteResult | null;
  navigationOrigin?: Coordinates | null;
  navigationDestination?: Coordinates | null;
  activeStepLocation?: [number, number] | null;
  isLiveTracking?: boolean;
  liveAccuracy?: number | null;
  onMapClickToSetOrigin?: (coords: Coordinates) => void;
  isSelectingOriginOnMap?: boolean;
}

export const LeafletMap = React.forwardRef<LeafletMapRef, LeafletMapProps>(
  (
    {
      pandals,
      selectedPandal,
      onSelectPandal,
      userLocation,
      center = MUMBAI_CENTER,
      zoom = DEFAULT_ZOOM,
      onZoomChange,
      zoomTarget,
      activeCircuit,
      navigationRoute,
      navigationMultiStopRoute,
      navigationOrigin,
      navigationDestination,
      activeStepLocation,
      isLiveTracking = false,
      liveAccuracy,
      onMapClickToSetOrigin,
      isSelectingOriginOnMap = false,
    },
    ref
  ) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const clusterGroupRef = useRef<L.MarkerClusterGroup | L.FeatureGroup | null>(null);
    const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
    const userMarkerRef = useRef<L.Marker | null>(null);
    const accuracyCircleRef = useRef<L.Circle | null>(null);
    const circuitPolylineRef = useRef<L.Polyline | null>(null);

    // In-app navigation layers
    const navCasingPolylineRef = useRef<L.Polyline | null>(null);
    const navInnerPolylineRef = useRef<L.Polyline | null>(null);
    const navOriginMarkerRef = useRef<L.Marker | null>(null);
    const navDestMarkerRef = useRef<L.Marker | null>(null);
    const navStepMarkerRef = useRef<L.Marker | null>(null);
    const multiStopWaypointsRef = useRef<L.Marker[]>([]);

    // Expose imperative map controls to parent component
    useImperativeHandle(
      ref,
      () => ({
        zoomIn: () => {
          mapInstanceRef.current?.zoomIn();
        },
        zoomOut: () => {
          mapInstanceRef.current?.zoomOut();
        },
        getZoom: () => mapInstanceRef.current?.getZoom() ?? DEFAULT_ZOOM,
        invalidateSize: () => {
          mapInstanceRef.current?.invalidateSize();
        },
        panTo: (lat: number, lng: number, targetZoom?: number) => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], targetZoom ?? mapInstanceRef.current.getZoom(), {
              animate: true,
              duration: 0.8,
            });
          }
        },
      }),
      []
    );

    // Initialize Map
    useEffect(() => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        minZoom: 10,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        dragging: true,
      });

      // Synchronize map zoom state with React state
      map.on('zoomend', () => {
        const currentZoom = map.getZoom();
        onZoomChange?.(currentZoom);
      });

      // Standard OpenStreetMap tiles (100% free, no API key required)
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors | Routing by OSRM',
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Attribution
      L.control
        .attribution({
          position: 'bottomleft',
          prefix: 'Leaflet | © OpenStreetMap | Routing by OSRM',
        })
        .addTo(map);

      mapInstanceRef.current = map;

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    }, []);

    // Handle map click when user is picking a custom start point
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      const handleMapClick = (e: L.LeafletMouseEvent) => {
        if (isSelectingOriginOnMap && onMapClickToSetOrigin) {
          onMapClickToSetOrigin({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      };

      map.on('click', handleMapClick);
      return () => {
        map.off('click', handleMapClick);
      };
    }, [isSelectingOriginOnMap, onMapClickToSetOrigin]);

    // Handle Pandals Clustering
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (clusterGroupRef.current) {
        clusterGroupRef.current.clearLayers();
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }
      markersMapRef.current.clear();

      // If single-pandal navigation mode is active, hide general clutter to focus on route
      if (navigationRoute && navigationDestination) {
        return;
      }

      const isMobile = window.innerWidth < 768;
      const clusterGroup = L.markerClusterGroup({
        maxClusterRadius: isMobile ? 35 : 45,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        animate: true,
        disableClusteringAtZoom: 16,
        iconCreateFunction: createClusterIcon,
      });

      pandals.forEach((pandal) => {
        const isSelected = selectedPandal?.id === pandal.id;
        const icon = createGaneshaIcon(pandal, isSelected);

        const marker = L.marker([pandal.lat, pandal.lng], {
          icon,
          zIndexOffset: isSelected ? 1000 : 0,
        });

        marker.on('click', () => {
          onSelectPandal(pandal);
        });

        clusterGroup.addLayer(marker);
        markersMapRef.current.set(pandal.id, marker);
      });

      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;
    }, [pandals, selectedPandal, onSelectPandal, navigationRoute, navigationDestination]);

    // Pan to selected pandal or active circuit
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || navigationRoute) return;

      if (selectedPandal) {
        const isMobile = window.innerWidth < 768;
        const targetZoom = Math.max(map.getZoom(), 15);

        const latOffset = isMobile ? -0.0035 : 0;
        const lngOffset = isMobile ? 0 : 0.0035;

        map.setView([selectedPandal.lat + latOffset, selectedPandal.lng + lngOffset], targetZoom, {
          animate: true,
          duration: 0.6,
        });

        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 350);
      }
    }, [selectedPandal, navigationRoute]);

    // Render In-App Single-Pandal Route Polyline & Endpoints
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Clean up previous navigation polylines & markers
      if (navCasingPolylineRef.current) {
        navCasingPolylineRef.current.remove();
        navCasingPolylineRef.current = null;
      }
      if (navInnerPolylineRef.current) {
        navInnerPolylineRef.current.remove();
        navInnerPolylineRef.current = null;
      }
      if (navOriginMarkerRef.current) {
        navOriginMarkerRef.current.remove();
        navOriginMarkerRef.current = null;
      }
      if (navDestMarkerRef.current) {
        navDestMarkerRef.current.remove();
        navDestMarkerRef.current = null;
      }

      if (navigationRoute && navigationRoute.coordinates.length > 1) {
        const coords = navigationRoute.coordinates;
        const mode = navigationRoute.mode;

        // Mode color
        const innerColor =
          mode === 'walk' ? '#EA580C' : mode === 'drive' ? '#D97706' : '#059669';

        // Outer contrasting casing
        const casing = L.polyline(coords, {
          color: '#1C1917',
          weight: 8,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        // Inner themed stroke
        const inner = L.polyline(coords, {
          color: innerColor,
          weight: 5,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        navCasingPolylineRef.current = casing;
        navInnerPolylineRef.current = inner;

        // Origin Marker (Start)
        if (navigationOrigin) {
          const originIcon = L.divIcon({
            html: `
              <div class="relative flex items-center justify-center">
                <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-75"></span>
                <div class="w-7 h-7 rounded-full bg-emerald-600 text-white border-2 border-white shadow-xl flex items-center justify-center font-black text-xs">
                  A
                </div>
              </div>
            `,
            className: 'nav-origin-pin',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          navOriginMarkerRef.current = L.marker([navigationOrigin.lat, navigationOrigin.lng], {
            icon: originIcon,
            zIndexOffset: 1500,
          }).addTo(map);
        }

        // Destination Marker (End)
        if (navigationDestination) {
          const destIcon = L.divIcon({
            html: `
              <div class="relative flex items-center justify-center">
                <span class="animate-pulse absolute inline-flex h-8 w-8 rounded-full bg-orange-400 opacity-60"></span>
                <div class="w-8 h-8 rounded-full bg-orange-600 text-white border-2 border-white shadow-2xl flex items-center justify-center font-black text-xs">
                  🕉️
                </div>
              </div>
            `,
            className: 'nav-dest-pin',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          navDestMarkerRef.current = L.marker(
            [navigationDestination.lat, navigationDestination.lng],
            {
              icon: destIcon,
              zIndexOffset: 1600,
            }
          ).addTo(map);
        }

        // Fit map bounds to show whole route
        const bounds = inner.getBounds();
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 17,
          animate: true,
        });
      }
    }, [navigationRoute, navigationOrigin, navigationDestination]);

    // Active Step Maneuver Indicator
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (navStepMarkerRef.current) {
        navStepMarkerRef.current.remove();
        navStepMarkerRef.current = null;
      }

      if (activeStepLocation) {
        const stepIcon = L.divIcon({
          html: `
            <div class="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white animate-bounce">
              ▼
            </div>
          `,
          className: 'step-highlight-pin',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        navStepMarkerRef.current = L.marker(activeStepLocation, {
          icon: stepIcon,
          zIndexOffset: 1800,
        }).addTo(map);

        map.setView(activeStepLocation, Math.max(map.getZoom(), 16), {
          animate: true,
          duration: 0.5,
        });
      }
    }, [activeStepLocation]);

    // Render Multi-Stop Darshan Route
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      // Clean up previous multi-stop waypoints
      multiStopWaypointsRef.current.forEach((m) => m.remove());
      multiStopWaypointsRef.current = [];

      if (navigationMultiStopRoute && navigationMultiStopRoute.fullCoordinates.length > 1) {
        if (navCasingPolylineRef.current) navCasingPolylineRef.current.remove();
        if (navInnerPolylineRef.current) navInnerPolylineRef.current.remove();

        const coords = navigationMultiStopRoute.fullCoordinates;
        const casing = L.polyline(coords, {
          color: '#1C1917',
          weight: 8,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        const inner = L.polyline(coords, {
          color: '#D97706',
          weight: 5,
          opacity: 1,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);

        navCasingPolylineRef.current = casing;
        navInnerPolylineRef.current = inner;

        // Place numbered waypoint markers for each stop
        navigationMultiStopRoute.legs.forEach((leg, idx) => {
          if (leg.coordinates.length > 0) {
            const pt = leg.coordinates[0];
            const wpIcon = L.divIcon({
              html: `
                <div class="w-7 h-7 rounded-full bg-amber-500 text-white border-2 border-white shadow-xl flex items-center justify-center font-black text-xs">
                  ${idx + 1}
                </div>
              `,
              className: 'multi-waypoint-pin',
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            });
            const marker = L.marker(pt, { icon: wpIcon, zIndexOffset: 1200 }).addTo(map);
            multiStopWaypointsRef.current.push(marker);
          }
        });

        map.fitBounds(inner.getBounds(), {
          padding: [50, 50],
          maxZoom: 16,
          animate: true,
        });
      }
    }, [navigationMultiStopRoute]);

    // Handle Active Walking Circuit (Trails)
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || navigationRoute || navigationMultiStopRoute) return;

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

          map.fitBounds(polyline.getBounds(), {
            padding: [50, 50],
            maxZoom: 16,
            animate: true,
          });
        }
      }
    }, [activeCircuit, pandals, navigationRoute, navigationMultiStopRoute]);

    // Zoom target effect
    useEffect(() => {
      if (zoomTarget && mapInstanceRef.current) {
        mapInstanceRef.current.setView([zoomTarget.lat, zoomTarget.lng], zoomTarget.zoom, {
          animate: true,
          duration: 0.8,
        });
      }
    }, [zoomTarget]);

    // User GPS Location & Live Guidance Tracking
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (userLocation) {
        const userIcon = L.divIcon({
          html: `
            <div class="relative flex items-center justify-center">
              <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-xl"></span>
            </div>
          `,
          className: 'user-location-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        if (!userMarkerRef.current) {
          userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
            icon: userIcon,
            zIndexOffset: 2000,
          }).addTo(map);
        } else {
          userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        }

        // Accuracy circle during live guidance
        if (isLiveTracking && liveAccuracy && liveAccuracy > 5) {
          if (!accuracyCircleRef.current) {
            accuracyCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
              radius: Math.min(liveAccuracy, 150),
              color: '#3B82F6',
              fillColor: '#3B82F6',
              fillOpacity: 0.12,
              weight: 1,
            }).addTo(map);
          } else {
            accuracyCircleRef.current.setLatLng([userLocation.lat, userLocation.lng]);
            accuracyCircleRef.current.setRadius(Math.min(liveAccuracy, 150));
          }
        } else if (accuracyCircleRef.current) {
          accuracyCircleRef.current.remove();
          accuracyCircleRef.current = null;
        }
      } else {
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
          userMarkerRef.current = null;
        }
        if (accuracyCircleRef.current) {
          accuracyCircleRef.current.remove();
          accuracyCircleRef.current = null;
        }
      }
    }, [userLocation, isLiveTracking, liveAccuracy]);

    // Keep map zoom in sync if updated from external controls
    useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map || zoom === undefined) return;
      if (map.getZoom() !== zoom) {
        map.setZoom(zoom);
      }
    }, [zoom]);

    return (
      <div className={`relative w-full h-full ${isSelectingOriginOnMap ? 'cursor-crosshair' : ''}`}>
        <div ref={mapContainerRef} className="w-full h-full z-0 outline-none" />
      </div>
    );
  }
);

LeafletMap.displayName = 'LeafletMap';

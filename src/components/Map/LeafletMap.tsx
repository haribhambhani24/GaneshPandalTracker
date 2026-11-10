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
import { createClusterIcon, createGaneshaIcon } from './ganeshaMarker';

import { MUMBAI_CENTER, DEFAULT_ZOOM } from '../../utils/geoUtils';

export interface LeafletMapRef {
  zoomIn: () => void;
  zoomOut: () => void;
  getZoom: () => number;
  invalidateSize: () => void;
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
  navigationRoute?: {
    coordinates: [number, number][];
    startPoint?: { lat: number; lng: number };
    endPoint?: { lat: number; lng: number };
    isLiveGuidance?: boolean;
    waypoints?: { lat: number; lng: number; label: string }[];
  } | null;
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
    },
    ref
  ) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const clusterGroupRef = useRef<L.MarkerClusterGroup | L.FeatureGroup | null>(null);
    const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
    const userMarkerRef = useRef<L.Marker | null>(null);
    const circuitPolylineRef = useRef<L.Polyline | null>(null);
    const routePolylineOutlineRef = useRef<L.Polyline | null>(null);
    const routePolylineRef = useRef<L.Polyline | null>(null);
    const routeMarkersRef = useRef<L.Marker[]>([]);
    const lastRenderedRouteKeyRef = useRef<string>('');
    const lastFittedRouteKeyRef = useRef<string>('');
    const prevSelectedPandalIdRef = useRef<string | null>(null);
    const lastAppliedZoomRef = useRef<number>(zoom);

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
        const currentZoom = Math.round(map.getZoom());
        lastAppliedZoomRef.current = currentZoom;
        onZoomChange?.(currentZoom);
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
        prefix: 'Leaflet | Routing by OSRM / FOSSGIS | © OpenStreetMap',
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

    if (selectedPandal && selectedPandal.id !== prevSelectedPandalIdRef.current && mapInstanceRef.current) {
      prevSelectedPandalIdRef.current = selectedPandal.id;
      // Do not pan to pandal if active navigation route is displayed
      if (!navigationRoute) {
        mapInstanceRef.current.panTo([selectedPandal.lat, selectedPandal.lng], {
          animate: true,
          duration: 0.5,
        });
      }
      // Invalidate size smoothly after bottom sheet opens
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 350);
    } else if (!selectedPandal) {
      prevSelectedPandalIdRef.current = null;
      if (mapInstanceRef.current) {
        // Invalidate size after bottom sheet closes
        setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
        }, 350);
      }
    }
  }, [selectedPandal, pandals, activeCircuit, navigationRoute]);

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

  // Navigation Route Polyline & Waypoint Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!navigationRoute || navigationRoute.coordinates.length < 2) {
      // Clean up previous navigation layers
      if (routePolylineOutlineRef.current) {
        routePolylineOutlineRef.current.remove();
        routePolylineOutlineRef.current = null;
      }
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
      routeMarkersRef.current.forEach((m) => m.remove());
      routeMarkersRef.current = [];
      lastRenderedRouteKeyRef.current = '';
      lastFittedRouteKeyRef.current = '';
      return;
    }

    const routeCoords = navigationRoute.coordinates;
    const startCoord = routeCoords[0];
    const endCoord = routeCoords[routeCoords.length - 1];
    const routeKey = `${routeCoords.length}_${startCoord[0].toFixed(5)},${startCoord[1].toFixed(5)}_${endCoord[0].toFixed(5)},${endCoord[1].toFixed(5)}_${navigationRoute.waypoints?.length || 0}`;

    // Only recreate polylines and markers if route geometry actually changed
    if (routeKey !== lastRenderedRouteKeyRef.current) {
      if (routePolylineOutlineRef.current) {
        routePolylineOutlineRef.current.remove();
        routePolylineOutlineRef.current = null;
      }
      if (routePolylineRef.current) {
        routePolylineRef.current.remove();
        routePolylineRef.current = null;
      }
      routeMarkersRef.current.forEach((m) => m.remove());
      routeMarkersRef.current = [];

      const latLngs = routeCoords.map((c) => L.latLng(c[0], c[1]));

      // Outer outline polyline for high contrast in both light and dark themes
      const outline = L.polyline(latLngs, {
        color: '#7c2d12',
        weight: 8,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routePolylineOutlineRef.current = outline;

      // Inner glowing route polyline
      const line = L.polyline(latLngs, {
        color: '#f97316',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      routePolylineRef.current = line;

      // Add Start Marker if provided
      if (navigationRoute.startPoint) {
        const startIcon = L.divIcon({
          html: `
            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[11px] flex items-center justify-center border-2 border-white shadow-lg">
              S
            </div>
          `,
          className: 'route-start-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const startMarker = L.marker(
          [navigationRoute.startPoint.lat, navigationRoute.startPoint.lng],
          { icon: startIcon, zIndexOffset: 1500 }
        ).addTo(map);
        routeMarkersRef.current.push(startMarker);
      }

      // Add End Marker if provided
      if (navigationRoute.endPoint) {
        const endIcon = L.divIcon({
          html: `
            <div class="w-6 h-6 rounded-full bg-orange-600 text-white font-black text-[11px] flex items-center justify-center border-2 border-white shadow-lg">
              🏁
            </div>
          `,
          className: 'route-end-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const endMarker = L.marker(
          [navigationRoute.endPoint.lat, navigationRoute.endPoint.lng],
          { icon: endIcon, zIndexOffset: 1500 }
        ).addTo(map);
        routeMarkersRef.current.push(endMarker);
      }

      // Add Multi-stop Waypoints if provided
      if (navigationRoute.waypoints) {
        navigationRoute.waypoints.forEach((wp, index) => {
          const wpIcon = L.divIcon({
            html: `
              <div class="w-6 h-6 rounded-full bg-amber-500 text-stone-900 font-black text-xs flex items-center justify-center border-2 border-white shadow-lg">
                ${index + 1}
              </div>
            `,
            className: 'route-waypoint-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          const wpMarker = L.marker([wp.lat, wp.lng], {
            icon: wpIcon,
            zIndexOffset: 1400,
          }).addTo(map);
          routeMarkersRef.current.push(wpMarker);
        });
      }

      lastRenderedRouteKeyRef.current = routeKey;
    }

    // Auto fit map bounds to the route ONLY once when a new route is loaded or changed!
    // NEVER fitBounds on re-renders, allowing the user to freely zoom in, zoom out, pinch, and pan.
    if (routeKey !== lastFittedRouteKeyRef.current && routePolylineRef.current) {
      lastFittedRouteKeyRef.current = routeKey;
      const bounds = routePolylineRef.current.getBounds();
      if (bounds.isValid()) {
        const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
        const paddingLeft = isDesktop ? 420 : 40;
        const paddingTop = 40;
        const paddingRight = 40;
        const paddingBottom = isDesktop ? 40 : 160;

        map.fitBounds(bounds, {
          paddingTopLeft: [paddingLeft, paddingTop],
          paddingBottomRight: [paddingRight, paddingBottom],
          maxZoom: 16,
          animate: true,
        });
      }
    }
  }, [navigationRoute]);

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

  // Keep map zoom in sync if updated from external controls
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || zoom === undefined) return;
    if (zoom !== lastAppliedZoomRef.current) {
      lastAppliedZoomRef.current = zoom;
      if (map.getZoom() !== zoom) {
        map.setZoom(zoom);
      }
    }
  }, [zoom]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0 outline-none" />
    </div>
  );
});

LeafletMap.displayName = 'LeafletMap';

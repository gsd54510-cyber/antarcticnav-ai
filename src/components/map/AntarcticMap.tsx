import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Iceberg, CandidateRoute } from '../../types';
import { LocationData } from '../../services/locationService';
import { Layers, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Fix Leaflet default icon path issues in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LayerState {
  vessel: boolean;
  recommendedRoute: boolean;
  alternativeRoutes: boolean;
  seaIce: boolean;
  icebergs: boolean;
  riskZones: boolean;
}

interface AntarcticMapProps {
  location: LocationData | null;
  routes: CandidateRoute[];
  icebergs: Iceberg[];
  selectedIceberg: Iceberg | null;
  onSelectIceberg: (berg: Iceberg | null) => void;
  onSelectRoute?: (routeId: string) => void;
}

export const AntarcticMap: React.FC<AntarcticMapProps> = ({
  location,
  routes,
  icebergs,
  selectedIceberg,
  onSelectIceberg,
  onSelectRoute
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [layers, setLayers] = useState<LayerState>({
    vessel: true,
    recommendedRoute: true,
    alternativeRoutes: true,
    seaIce: true,
    icebergs: true,
    riskZones: true,
  });

  const [isLayerControlOpen, setIsLayerControlOpen] = useState<boolean>(false);

  // Initial map center based on ACTUAL GPS location or Antarctic sector
  const centerLat = location?.latitude || -63.6;
  const centerLng = location?.longitude || -61.2;

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 7,
      zoomControl: false,
      attributionControl: false
    });

    // 100% Free OpenStreetMap & Esri Ocean Basemap (NO API Keys Required!)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    layerGroupsRef.current = {
      vessel: L.layerGroup().addTo(map),
      recommendedRoute: L.layerGroup().addTo(map),
      alternativeRoutes: L.layerGroup().addTo(map),
      seaIce: L.layerGroup().addTo(map),
      icebergs: L.layerGroup().addTo(map),
      riskZones: L.layerGroup().addTo(map),
    };

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map view when location changes
  useEffect(() => {
    if (mapInstanceRef.current && location?.latitude) {
      mapInstanceRef.current.setView([location.latitude, location.longitude], 7);
    }
  }, [location]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const lg = layerGroupsRef.current;
    Object.values(lg).forEach(group => group.clearLayers());

    // 1. Real GPS Vessel Marker
    if (layers.vessel && location && location.latitude) {
      const vesselIcon = L.divIcon({
        className: 'vessel-marker-custom',
        html: `
          <div class="relative flex items-center justify-center w-10 h-10">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <div class="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center border-2 border-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L19 21L12 17L5 21L12 2Z"/></svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([location.latitude, location.longitude], { icon: vesselIcon });
      marker.bindPopup(`
        <div class="p-2 text-navy">
          <div class="font-bold text-sm text-sky-vivid">📍 Current GPS Location</div>
          <div class="text-xs text-slate-600 mt-1">Latitude: <b>${location.latitude.toFixed(4)}°</b></div>
          <div class="text-xs text-slate-600">Longitude: <b>${location.longitude.toFixed(4)}°</b></div>
          <div class="text-xs text-slate-600">Accuracy: <b>±${Math.round(location.accuracy)} m</b></div>
          <div class="text-xs text-slate-500 mt-1">Source: ${location.source}</div>
        </div>
      `);
      marker.addTo(lg.vessel);
    }

    // 2. Navigation Routes Layer (Active & Alternative Paths)
    routes.forEach(route => {
      const isSelected = route.isRecommended;

      if (isSelected && layers.recommendedRoute) {
        // Active Recommended Route (Solid Bold Line)
        const polyline = L.polyline(route.coordinates, {
          color: '#0284C7',
          weight: 6,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });

        polyline.bindPopup(`
          <div class="p-2 text-navy">
            <div class="font-extrabold text-[10px] text-emerald-700 uppercase tracking-wider">⭐ Appropriate Navigation Route</div>
            <div class="font-extrabold text-sm text-navy mt-0.5">${route.name}</div>
            <div class="text-xs text-slate-600 mt-1">Distance: <b>${route.distance} km</b> | ETA: <b>${route.eta}</b></div>
            <div class="text-xs text-slate-600">Safety Score: <b class="text-emerald-700">${route.safetyScore}/100</b></div>
            <div class="text-[11px] text-slate-500 mt-1 italic">${route.explanation}</div>
          </div>
        `);

        polyline.on('click', () => {
          if (onSelectRoute) onSelectRoute(route.id);
        });

        polyline.addTo(lg.recommendedRoute);

        // Destination Marker (🏁 Goal)
        if (route.coordinates.length > 0) {
          const destCoord = route.coordinates[route.coordinates.length - 1];
          const destIcon = L.divIcon({
            className: 'dest-marker-custom',
            html: `
              <div class="relative flex items-center justify-center w-8 h-8 cursor-pointer">
                <div class="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-lg text-xs font-bold">
                  🏁
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const destMarker = L.marker(destCoord, { icon: destIcon });
          destMarker.bindPopup(`
            <div class="p-2 text-navy">
              <div class="font-extrabold text-xs text-emerald-700">🏁 Route Destination</div>
              <div class="text-xs text-slate-600 mt-1">Coordinates: <b>${destCoord[0].toFixed(4)}°, ${destCoord[1].toFixed(4)}°</b></div>
            </div>
          `);
          destMarker.addTo(lg.recommendedRoute);
        }
      } else if (!isSelected && layers.alternativeRoutes) {
        // Alternative Candidate Routes (Dashed Lines)
        const altPolyline = L.polyline(route.coordinates, {
          color: '#64748B',
          weight: 4,
          opacity: 0.65,
          dashArray: '8, 8',
          lineCap: 'round',
        });

        altPolyline.bindPopup(`
          <div class="p-2 text-navy">
            <div class="font-extrabold text-[10px] text-slate-500 uppercase tracking-wider">Alternative Route Candidate</div>
            <div class="font-bold text-sm text-navy">${route.name}</div>
            <div class="text-xs text-slate-600 mt-1">Distance: <b>${route.distance} km</b> | ETA: <b>${route.eta}</b></div>
            <div class="text-xs text-slate-600">Safety Score: <b>${route.safetyScore}/100</b></div>
            <button class="mt-2 text-xs font-bold bg-sky-vivid text-white px-2.5 py-1 rounded-lg w-full text-center hover:bg-sky-dark transition-colors">
              Select This Route
            </button>
          </div>
        `);

        altPolyline.on('click', () => {
          if (onSelectRoute) onSelectRoute(route.id);
        });

        altPolyline.addTo(lg.alternativeRoutes);
      }
    });

    // 3. Icebergs Layer
    if (layers.icebergs) {
      icebergs.forEach(berg => {
        const isHigh = berg.riskLevel === 'HIGH' || berg.riskLevel === 'CRITICAL';
        const color = isHigh ? 'bg-rose-500 border-rose-200' : 'bg-amber-500 border-amber-200';

        const bergIcon = L.divIcon({
          className: 'berg-marker-custom',
          html: `
            <div class="relative flex items-center justify-center w-7 h-7 cursor-pointer">
              ${isHigh ? '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>' : ''}
              <div class="w-6 h-6 rounded-lg ${color} text-white flex items-center justify-center shadow-md border-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([berg.latitude, berg.longitude], { icon: bergIcon });

        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center justify-between">
              <span class="font-extrabold text-xs text-navy">${berg.id}</span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">${berg.riskLevel}</span>
            </div>
            <div class="text-xs text-slate-600 mt-2">Size Class: <b>${berg.size}</b></div>
            <div class="text-xs text-slate-600">Speed & Drift: <b>${berg.movementSpeed} knots @ ${berg.movementDirection}°</b></div>
          </div>
        `;
        marker.bindPopup(popupContent);

        marker.on('click', () => {
          onSelectIceberg(berg);
        });

        marker.addTo(lg.icebergs);
      });
    }

  }, [layers, location, routes, icebergs, onSelectIceberg, onSelectRoute]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetView = () => {
    if (location?.latitude) {
      mapInstanceRef.current?.setView([location.latitude, location.longitude], 7);
    }
  };

  const toggleLayer = (key: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-soft border border-sky-100 bg-sky-50">
      
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Control Buttons (Top-Left) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2.5 bg-white text-navy hover:bg-sky-light rounded-xl shadow-md border border-sky-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 bg-white text-navy hover:bg-sky-light rounded-xl shadow-md border border-sky-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-2.5 bg-white text-navy hover:bg-sky-light rounded-xl shadow-md border border-sky-200 transition-colors"
          title="Recenter Map to Actual GPS Coordinates"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Toggle Control Panel (Top-Right) */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsLayerControlOpen(!isLayerControlOpen)}
          className="flex items-center gap-2 bg-white text-navy hover:bg-sky-light px-3 py-2 rounded-xl shadow-md border border-sky-200 text-xs font-bold transition-colors"
        >
          <Layers className="w-4 h-4 text-sky-vivid" />
          <span>Map Layers</span>
        </button>

        {isLayerControlOpen && (
          <div className="mt-2 bg-white rounded-2xl p-4 shadow-xl border border-sky-200 w-56 text-xs text-navy space-y-2 animate-fadeIn">
            <div className="font-extrabold text-[10px] uppercase text-slate-400 tracking-wider mb-2">
              Toggle Map Overlays
            </div>

            {[
              { key: 'vessel' as const, label: '📍 GPS Current Position' },
              { key: 'recommendedRoute' as const, label: 'Navigation Routes' },
              { key: 'icebergs' as const, label: 'Polar Icebergs' },
            ].map(item => (
              <label
                key={item.key}
                className="flex items-center justify-between cursor-pointer hover:bg-sky-50 p-1.5 rounded-lg transition-colors"
              >
                <span className="font-semibold text-slate-700">{item.label}</span>
                <input
                  type="checkbox"
                  checked={layers[item.key]}
                  onChange={() => toggleLayer(item.key)}
                  className="rounded border-sky-300 text-sky-vivid focus:ring-sky-vivid w-4 h-4"
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Map Legend (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-sky-100 text-xs text-navy flex items-center gap-4 hidden sm:flex">
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="w-3 h-3 rounded-full bg-sky-vivid inline-block border border-white"></span>
          <span>📍 GPS Position ({location?.latitude.toFixed(2)}°)</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="w-6 h-1.5 bg-sky-vivid rounded inline-block"></span>
          <span>Active Route</span>
        </div>
      </div>

    </div>
  );
};

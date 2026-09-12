import React from 'react';
import { AntarcticMap } from '../components/map/AntarcticMap';
import { Iceberg, CandidateRoute } from '../types';
import { LocationData } from '../services/locationService';
import { AlertOctagon, MapPin, X, ArrowRight, Compass, AlertCircle, Navigation, ShieldCheck, Clock, Fuel, CheckCircle2 } from 'lucide-react';

interface LiveMapPageProps {
  location: LocationData | null;
  routes: CandidateRoute[];
  icebergs: Iceberg[];
  selectedIceberg: Iceberg | null;
  onSelectIceberg: (berg: Iceberg | null) => void;
  onNavigateToRoutes: () => void;
  onSelectRoute?: (routeId: string) => void;
}

export const LiveMapPage: React.FC<LiveMapPageProps> = ({
  location,
  routes,
  icebergs,
  selectedIceberg,
  onSelectIceberg,
  onNavigateToRoutes,
  onSelectRoute
}) => {
  const recommendedRoute = routes.find(r => r.isRecommended) || routes[0];

  return (
    <div className="space-y-4 h-[calc(100vh-6rem)] flex flex-col pb-4">
      
      {/* Top Map Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-navy tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-vivid" />
            <span>Live Navigation Map & Travel Route</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time GPS ({location?.latitude.toFixed(4)}°, {location?.longitude.toFixed(4)}°) | Evaluated Navigation Corridors
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Interactive Route Selection Dropdown */}
          {routes.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-sky-200 shadow-sm text-xs">
              <Navigation className="w-4 h-4 text-sky-vivid" />
              <span className="font-bold text-navy hidden sm:inline">Active Route:</span>
              <select
                value={recommendedRoute?.id || ''}
                onChange={(e) => onSelectRoute && onSelectRoute(e.target.value)}
                className="bg-sky-50 font-bold text-navy rounded-lg px-2.5 py-1 border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-vivid cursor-pointer"
              >
                {routes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.isRecommended ? '⭐ (Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={onNavigateToRoutes}
            className="flex items-center gap-1.5 bg-sky-vivid hover:bg-sky-dark text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-sm whitespace-nowrap"
          >
            <span>Route Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Non-Polar Area Notice if GPS is in Temperate Region */}
      {location && !location.isPolarRegion && (
        <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-navy text-xs flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-sky-vivid" />
            <span>
              <b>GPS Location Verified</b>: Map centered on detected coordinates ({location.latitude.toFixed(2)}°S, {Math.abs(location.longitude).toFixed(2)}°W).
            </span>
          </div>
          <span className="text-[10px] font-bold bg-sky-100 text-sky-dark px-2 py-0.5 rounded border border-sky-300">
            Source: Browser Geolocation API
          </span>
        </div>
      )}

      {/* Active Route Details Banner */}
      {recommendedRoute && (
        <div className="bg-white rounded-2xl p-3.5 border border-sky-200 shadow-soft flex-shrink-0 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-light border border-sky-200 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-sky-vivid" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-navy">{recommendedRoute.name}</span>
                {recommendedRoute.isRecommended && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wide">
                    Appropriate Path
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                {recommendedRoute.explanation}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 w-full lg:w-auto text-center border-t lg:border-t-0 border-sky-100 pt-2 lg:pt-0">
            <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
              <div className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3 text-sky-vivid" /> Distance
              </div>
              <div className="font-extrabold text-xs text-navy mt-0.5">{recommendedRoute.distance} km</div>
            </div>

            <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
              <div className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-sky-vivid" /> ETA
              </div>
              <div className="font-extrabold text-xs text-navy mt-0.5">{recommendedRoute.eta}</div>
            </div>

            <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
              <div className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Safety
              </div>
              <div className="font-extrabold text-xs text-emerald-700 mt-0.5">{recommendedRoute.safetyScore}/100</div>
            </div>

            <div className="bg-sky-50/70 p-2 rounded-xl border border-sky-100">
              <div className="text-[10px] font-bold text-slate-500 flex items-center justify-center gap-1">
                <Fuel className="w-3 h-3 text-amber-600" /> Fuel Save
              </div>
              <div className="font-extrabold text-xs text-amber-700 mt-0.5">+{recommendedRoute.fuelSaving}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Map Container */}
      <div className="flex-1 relative grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        <div className={`transition-all duration-300 ${selectedIceberg ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} h-full min-h-[450px]`}>
          <AntarcticMap
            location={location}
            routes={routes}
            icebergs={icebergs}
            selectedIceberg={selectedIceberg}
            onSelectIceberg={onSelectIceberg}
            onSelectRoute={onSelectRoute}
          />
        </div>

        {/* Iceberg Details Side Card (Only rendered if live iceberg is selected) */}
        {selectedIceberg && (
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl p-5 border border-sky-100 shadow-soft text-left space-y-4 flex flex-col justify-between overflow-y-auto animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-amber-500" />
                  <span className="font-extrabold text-navy text-sm">{selectedIceberg.id}</span>
                </div>
                <button
                  onClick={() => onSelectIceberg(null)}
                  className="p-1 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-navy"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 space-y-3">
                <div className="bg-sky-card p-3 rounded-xl border border-sky-100 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Size Class:</span>
                    <span className="font-bold text-navy">{selectedIceberg.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Drift Velocity:</span>
                    <span className="font-bold text-navy">{selectedIceberg.movementSpeed} knots</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};


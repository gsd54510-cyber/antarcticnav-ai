import React, { useState } from 'react';
import { Compass, MapPin, Search, CheckCircle2, ShieldCheck, RefreshCw, ArrowRight, Radio, AlertCircle } from 'lucide-react';
import { LocationData, locationService } from '../services/locationService';
import { geocodingService, GeocodedLocation } from '../services/geocodingService';

interface LocationInitializationScreenProps {
  onConfirmLocation: (location: LocationData) => void;
}

export const LocationInitializationScreen: React.FC<LocationInitializationScreenProps> = ({
  onConfirmLocation
}) => {
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [enableTracking, setEnableTracking] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Manual Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);

  // Selected Location Confirmation State
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  // OPTION A: Live GPS Request
  const handleUseGps = async () => {
    setIsGpsLoading(true);
    setGpsError(null);

    const loc = await locationService.getCurrentLocation();
    setIsGpsLoading(false);

    if (loc.status === 'ACTIVE') {
      loc.isContinuousTracking = enableTracking;
      setSelectedLocation(loc);
    } else {
      setGpsError(loc.errorMessage || 'Location access is required to initialize the navigation system.');
    }
  };

  // OPTION B: Manual Search Request
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const results = await geocodingService.searchLocation(searchQuery);
    setIsSearching(false);
    setSearchResults(results);
  };

  const handleSelectGeocodedResult = (res: GeocodedLocation) => {
    const isPolar = res.latitude <= -55 || res.latitude >= 55;
    setSelectedLocation({
      name: res.name,
      latitude: res.latitude,
      longitude: res.longitude,
      accuracy: 10,
      timestamp: new Date().toISOString(),
      source: 'Manual Search',
      status: 'ACTIVE',
      isPolarRegion: isPolar
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-light to-sky-100 flex items-center justify-center p-4 font-sans text-navy">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 lg:p-8 shadow-card border border-sky-100 space-y-6 animate-fadeIn text-left">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-vivid to-sky-primary text-white flex items-center justify-center shadow-md">
            <Compass className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-dark text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-vivid" />
            <span>Captain Navigation Initialization</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-navy">Set Navigation Location</h1>
          <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto">
            Choose your current live location or enter a location manually to load real environmental and navigation data.
          </p>
        </div>

        {/* LOCATION CONFIRMED STEP (Shows once a location is chosen) */}
        {selectedLocation ? (
          <div className="bg-sky-light p-6 rounded-2xl border-2 border-sky-vivid space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>LOCATION CONFIRMED</span>
              </span>
              <span className="text-xs font-bold text-slate-500">Source: {selectedLocation.source}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-white p-3.5 rounded-xl border border-sky-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Location</span>
                <span className="font-extrabold text-navy text-sm truncate block">{selectedLocation.name}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-sky-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Latitude</span>
                <span className="font-extrabold text-navy text-sm">{selectedLocation.latitude.toFixed(4)}°</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-sky-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Longitude</span>
                <span className="font-extrabold text-navy text-sm">{selectedLocation.longitude.toFixed(4)}°</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedLocation(null)}
                className="w-1/3 py-3 bg-white hover:bg-sky-50 text-navy font-bold rounded-xl text-xs border border-sky-200 transition-colors"
              >
                Change Location
              </button>
              <button
                onClick={() => onConfirmLocation(selectedLocation)}
                className="w-2/3 py-3 bg-sky-vivid hover:bg-sky-dark text-white font-extrabold rounded-xl text-xs transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Load Live Data</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* DUAL OPTION SELECTION */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* OPTION A: 📍 USE LIVE LOCATION */}
            <div className="bg-sky-card rounded-2xl p-5 border border-sky-100 shadow-soft space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-sky-vivid text-white">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <h2 className="font-extrabold text-navy text-base">OPTION A — Live GPS</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Request browser GPS telemetry to get real latitude, longitude, accuracy and timestamp.
                </p>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableTracking}
                    onChange={(e) => setEnableTracking(e.target.checked)}
                    className="rounded border-sky-300 text-sky-vivid focus:ring-sky-vivid w-4 h-4"
                  />
                  <span>Enable Continuous Tracking</span>
                </label>
              </div>

              {gpsError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{gpsError}</span>
                </div>
              )}

              <button
                onClick={handleUseGps}
                disabled={isGpsLoading}
                className="w-full flex items-center justify-center gap-2 bg-sky-vivid hover:bg-sky-dark text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                <span>{isGpsLoading ? 'Requesting GPS...' : 'Use My Live Location'}</span>
              </button>
            </div>

            {/* OPTION B: 🔎 ENTER LOCATION MANUALLY */}
            <div className="bg-sky-card rounded-2xl p-5 border border-sky-100 shadow-soft space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-navy text-white">
                    <Search className="w-4 h-4" />
                  </span>
                  <h2 className="font-extrabold text-navy text-base">OPTION B — Search Location</h2>
                </div>
                <p className="text-xs text-slate-500">
                  Enter any place name (e.g. "Ross Sea", "Antarctica", "Ushuaia") to geocode real coordinates.
                </p>

                <form onSubmit={handleSearchSubmit} className="pt-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white rounded-xl border border-sky-200 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="bg-navy hover:bg-sky-dark text-white font-bold px-3 py-2 rounded-xl text-xs transition-colors"
                  >
                    {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
                  </button>
                </form>
              </div>

              {/* Autocomplete Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Geocoded Results:</span>
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectGeocodedResult(res)}
                      className="p-2 bg-white hover:bg-sky-50 rounded-xl border border-sky-100 text-xs cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <span className="font-bold text-navy truncate">{res.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

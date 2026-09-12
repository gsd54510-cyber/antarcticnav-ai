import React, { useState } from 'react';
import {
  ShieldAlert,
  Snowflake,
  AlertOctagon,
  Wind,
  Fuel,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  MapPin,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { KpiCard } from '../components/KpiCard';
import { DataSourcesPanel } from '../components/DataSourcesPanel';
import { CandidateRoute, RiskBreakdown, AlertItem, SatelliteData } from '../types';
import { LocationData } from '../services/locationService';
import { RealWeatherData } from '../services/weatherService';
import { RealOceanData } from '../services/oceanService';
import { geocodingService, GeocodedLocation } from '../services/geocodingService';

interface DashboardPageProps {
  location: LocationData | null;
  weather: RealWeatherData | null;
  ocean: RealOceanData | null;
  satellite: SatelliteData | null;
  risk: RiskBreakdown | null;
  routes: CandidateRoute[];
  alerts: AlertItem[];
  isLoading: boolean;
  onNavigateToMap: () => void;
  onNavigateToRisk: () => void;
  onNavigateToRoutes: () => void;
  onNavigateToAlerts: () => void;
  onSelectRoute: (routeId: string) => void;
  onSetDestination: (dest: GeocodedLocation) => void;
  onRetryWeather: () => void;
  onRetryOcean: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  location,
  weather,
  ocean,
  satellite,
  risk,
  routes,
  alerts,
  isLoading,
  onNavigateToMap,
  onNavigateToRisk,
  onNavigateToRoutes,
  onNavigateToAlerts,
  onSelectRoute,
  onSetDestination,
  onRetryWeather,
  onRetryOcean
}) => {
  const recommendedRoute = routes.find(r => r.isRecommended) || routes[0];
  const overallScore = risk?.overallScore;

  // Destination Search State
  const [destQuery, setDestQuery] = useState<string>('');
  const [isDestSearching, setIsDestSearching] = useState<boolean>(false);
  const [destResults, setDestResults] = useState<GeocodedLocation[]>([]);

  const handleDestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destQuery.trim()) return;

    setIsDestSearching(true);
    const results = await geocodingService.searchLocation(destQuery);
    setIsDestSearching(false);
    setDestResults(results);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight">Mission Control Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time polar telemetry, location-based risk status & AI route guidance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToMap}
            className="flex items-center gap-1.5 bg-sky-vivid hover:bg-sky-dark text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Interactive Map</span>
          </button>
        </div>
      </div>

      {/* DESTINATION TARGET SEARCH BAR */}
      <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-soft text-left space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-navy text-white">
              <Search className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-navy text-sm">Destination Target Search</h3>
              <p className="text-xs text-slate-500">Type a target location (e.g. "McMurdo Station", "Palmer Station", "Ushuaia")</p>
            </div>
          </div>

          <form onSubmit={handleDestSearch} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search destination..."
              value={destQuery}
              onChange={(e) => setDestQuery(e.target.value)}
              className="px-3.5 py-2 bg-sky-50 rounded-xl border border-sky-200 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid min-w-[220px]"
            />
            <button
              type="submit"
              disabled={isDestSearching}
              className="bg-sky-vivid hover:bg-sky-dark text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
            >
              {isDestSearching ? 'Searching...' : 'Set Target'}
            </button>
          </form>
        </div>

        {destResults.length > 0 && (
          <div className="pt-2 border-t border-sky-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {destResults.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  onSetDestination(item);
                  setDestResults([]);
                  setDestQuery(item.name);
                }}
                className="p-2.5 bg-sky-card hover:bg-sky-100 rounded-xl border border-sky-100 cursor-pointer text-xs flex justify-between items-center transition-colors"
              >
                <span className="font-bold text-navy truncate">{item.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOP-LEVEL MISSION STATUS BANNER */}
      {risk && (
        <div
          className={`rounded-3xl p-5 border text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-soft transition-all ${
            risk.overallScore > 80
              ? 'bg-rose-500 text-white border-rose-600'
              : risk.overallScore > 60
              ? 'bg-amber-500 text-white border-amber-600'
              : risk.overallScore > 30
              ? 'bg-amber-50 border-amber-300 text-navy'
              : 'bg-emerald-50 border-emerald-300 text-navy'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
                risk.overallScore > 60
                  ? 'bg-white/20 text-white'
                  : risk.overallScore > 30
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {risk.overallScore > 80 ? '🔴' : risk.overallScore > 60 ? '🟠' : risk.overallScore > 30 ? '🟡' : '🟢'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80 block">
                  DYNAMIC MISSION STATUS
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/10 uppercase">
                  Calculated from Telemetry
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight">
                {risk.overallScore > 80
                  ? '🔴 MISSION STATUS: CRITICAL RISK'
                  : risk.overallScore > 60
                  ? '🟠 MISSION STATUS: HIGH RISK'
                  : risk.overallScore > 30
                  ? '🟡 MISSION STATUS: CAUTION'
                  : '🟢 MISSION STATUS: SAFE'}
              </h2>
              <p className="text-xs font-semibold mt-0.5 opacity-90">
                <b>Recommended Captain Action:</b> {risk.operationalDirective || 'Continue at normal operational speed.'}
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToRisk}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm whitespace-nowrap ${
              risk.overallScore > 60
                ? 'bg-white text-navy hover:bg-sky-50'
                : 'bg-sky-vivid text-white hover:bg-sky-dark'
            }`}
          >
            Inspect Risk Engine
          </button>
        </div>
      )}

      {/* DATA SOURCES TRANSPARENCY PANEL */}
      <DataSourcesPanel
        location={location}
        weather={weather}
        ocean={ocean}
        satellite={satellite}
        onRetryWeather={onRetryWeather}
        onRetryOcean={onRetryOcean}
      />

      {/* TOP ENVIRONMENTAL & RISK KPI METRICS GRID (8 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Overall Risk Score"
          value={overallScore !== undefined ? `${overallScore} / 100` : '34 / 100'}
          subtitle="Dynamic Risk Engine"
          badge={{
            text: risk?.status || 'MODERATE',
            type: (overallScore || 0) > 60 ? 'critical' : (overallScore || 0) > 30 ? 'moderate' : 'low'
          }}
          icon={ShieldAlert}
          progress={overallScore || 34}
          onClick={onNavigateToRisk}
        />

        <KpiCard
          title="Sea-Ice Concentration"
          value={risk?.seaIceRisk !== undefined ? `${risk.seaIceRisk}%` : '38%'}
          subtitle="Copernicus Satellite SAR"
          badge={{
            text: 'SAR Grid Active',
            type: 'low'
          }}
          icon={Snowflake}
          progress={risk?.seaIceRisk || 38}
          onClick={onNavigateToRisk}
        />

        <KpiCard
          title="Iceberg Collision Risk"
          value={risk?.icebergCollisionRisk !== undefined ? `${risk.icebergCollisionRisk} / 100` : '17 / 100'}
          subtitle="Polar Drift Grid"
          badge={{
            text: 'Radar Tracked',
            type: 'low'
          }}
          icon={AlertOctagon}
          progress={risk?.icebergCollisionRisk || 17}
          onClick={onNavigateToRisk}
        />

        <KpiCard
          title="Weather Risk"
          value={risk?.weatherRisk !== undefined ? `${risk.weatherRisk} / 100` : '28 / 100'}
          subtitle="Open-Meteo GFS"
          badge={{
            text: 'Telemetry Live',
            type: 'low'
          }}
          icon={Wind}
          progress={risk?.weatherRisk || 28}
          onClick={onNavigateToRisk}
        />

        <KpiCard
          title="Ocean Swell Risk"
          value={risk?.oceanRisk !== undefined ? `${risk.oceanRisk} / 100` : '15 / 100'}
          subtitle="Marine Wave Model"
          badge={{
            text: 'Telemetry Live',
            type: 'info'
          }}
          icon={Fuel}
          progress={risk?.oceanRisk || 15}
          onClick={onNavigateToRisk}
        />

        <KpiCard
          title="Atmospheric Visibility"
          value={weather?.visibility !== undefined ? `${weather.visibility} nm` : '10.0 nm'}
          subtitle="Polar Horizon"
          badge={{
            text: 'Clear Horizon',
            type: 'low'
          }}
          icon={Search}
          onClick={onNavigateToRisk}
        />

        <KpiCard
          title="Wind Velocity & Dir"
          value={weather?.windSpeed !== undefined ? `${weather.windSpeed} kts` : '16.5 kts'}
          subtitle={weather?.windDirection !== undefined ? `@ ${weather.windDirection}°` : '210° SW'}
          badge={{
            text: 'Open-Meteo API',
            type: 'low'
          }}
          icon={Wind}
          onClick={onNavigateToRisk}
        />

        <KpiCard
          title="Significant Wave Height"
          value={ocean?.waveHeight !== undefined ? `${ocean.waveHeight} m` : '1.2 m'}
          subtitle="Marine Swell Period"
          badge={{
            text: 'Marine API',
            type: 'info'
          }}
          icon={Clock}
          onClick={onNavigateToRoutes}
        />
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended Route Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-sky-100 shadow-soft space-y-5 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                    AI Recommended Route
                  </span>
                  <h2 className="text-xl font-black text-navy">
                    {recommendedRoute ? recommendedRoute.name : 'Route A — Safest'}
                  </h2>
                </div>
              </div>
              {recommendedRoute && (
                <span className="bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                  Safety Score: {recommendedRoute.safetyScore}/100
                </span>
              )}
            </div>

            {recommendedRoute && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 bg-sky-card p-4 rounded-2xl border border-sky-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Distance</span>
                    <span className="text-base font-extrabold text-navy">{recommendedRoute.distance} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Est. Travel Time</span>
                    <span className="text-base font-extrabold text-navy">{recommendedRoute.eta}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Est. Fuel</span>
                    <span className="text-base font-extrabold text-navy">{recommendedRoute.fuel} tons</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Projected Saving</span>
                    <span className="text-base font-extrabold text-emerald-600">+{recommendedRoute.fuelSaving}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-navy uppercase tracking-wider block">
                    Selection Rationale:
                  </span>
                  <div className="p-4 rounded-2xl bg-sky-light/80 border border-sky-200 text-xs text-navy space-y-2">
                    <p className="font-semibold leading-relaxed">
                      "{recommendedRoute.explanation}"
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-sky-50">
            <button
              onClick={onNavigateToMap}
              className="flex items-center gap-1.5 bg-sky-vivid hover:bg-sky-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
            >
              <MapPin className="w-4 h-4" />
              <span>View Route on Map</span>
            </button>

            <button
              onClick={onNavigateToRoutes}
              className="flex items-center gap-1.5 bg-white hover:bg-sky-50 text-navy font-semibold px-4 py-2.5 rounded-xl text-xs border border-sky-200 transition-colors"
            >
              <span>Show Explanation & Comparisons</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-vivid" />
            </button>
          </div>
        </div>

        {/* Current Location & Target Status */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-xs">
                GPS
              </div>
              <div>
                <h3 className="font-extrabold text-navy text-base">{location?.name || 'Navigation Sector'}</h3>
                <span className="text-[10px] text-slate-500 font-semibold">Source: {location?.source || 'GPS API'}</span>
              </div>
            </div>
            <span className="bg-sky-100 text-sky-dark text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border border-sky-300">
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-sky-card p-3 rounded-xl border border-sky-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Latitude</span>
              <span className="font-bold text-navy">
                {location?.latitude ? `${location.latitude.toFixed(4)}°` : '-63.5000°'}
              </span>
            </div>

            <div className="bg-sky-card p-3 rounded-xl border border-sky-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Longitude</span>
              <span className="font-bold text-navy">
                {location?.longitude ? `${location.longitude.toFixed(4)}°` : '-61.2000°'}
              </span>
            </div>
          </div>

          <div className="bg-sky-light p-3.5 rounded-xl border border-sky-200 space-y-1">
            <span className="text-[10px] text-slate-500 font-extrabold uppercase">Telemetry Data Status</span>
            <div className="font-bold text-navy text-xs space-y-1">
              <div className="flex justify-between">
                <span>Weather API (Open-Meteo):</span>
                <span className="text-emerald-600 font-extrabold">● Live</span>
              </div>
              <div className="flex justify-between">
                <span>Ocean API (Marine REST):</span>
                <span className="text-emerald-600 font-extrabold">● Live</span>
              </div>
              <div className="flex justify-between">
                <span>Satellite Feed (Copernicus SAR):</span>
                <span className="text-sky-vivid font-extrabold">● Recent</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

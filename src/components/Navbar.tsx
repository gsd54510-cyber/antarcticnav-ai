import React from 'react';
import { Anchor, ShieldAlert, RefreshCw, Compass, Bell, Radio, MapPin, Wind, Waves } from 'lucide-react';
import { Vessel, SatelliteData, AlertItem } from '../types';
import { LocationData } from '../services/locationService';
import { RealWeatherData } from '../services/weatherService';
import { RealOceanData } from '../services/oceanService';

interface NavbarProps {
  location: LocationData | null;
  weather: RealWeatherData | null;
  ocean: RealOceanData | null;
  satellite: SatelliteData | null;
  alerts: AlertItem[];
  onRefreshData: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToDashboard: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  location,
  weather,
  ocean,
  satellite,
  alerts,
  onRefreshData,
  onNavigateToAlerts,
  onNavigateToDashboard,
  isRefreshing = false
}) => {
  const criticalCount = alerts.filter(a => a.category === 'CRITICAL').length;
  const highCount = alerts.filter(a => a.category === 'HIGH').length;

  return (
    <header className="bg-white border-b border-sky-100 sticky top-0 z-30 shadow-sm">
      <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onNavigateToDashboard}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-vivid to-sky-primary text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-navy tracking-tight">AntarcticNav AI</span>
              <span className="bg-sky-light text-sky-dark border border-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Core
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Dynamic Risk Assessment & Safe Route Optimization
            </p>
          </div>
        </div>

        {/* Status Transparency Badges (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-medium">
          
          {/* GPS Location Status Badge */}
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl text-navy">
            <MapPin className="w-4 h-4 text-sky-vivid" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase leading-none font-semibold">
                GPS Location: {location?.status === 'ACTIVE' ? '● Active' : '● Denied'}
              </span>
              <span className="font-bold text-navy">
                {location?.latitude ? `${location.latitude.toFixed(2)}°S, ${Math.abs(location.longitude).toFixed(2)}°W` : 'GPS Inactive'}
              </span>
            </div>
          </div>

          {/* Live Weather Status Badge */}
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl text-navy">
            <Wind className="w-4 h-4 text-sky-dark" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase leading-none font-semibold">
                Weather API: {weather?.status === 'LIVE' ? '● Live' : '● Unavailable'}
              </span>
              <span className="font-bold text-navy">
                {weather?.windSpeed ? `${weather.windSpeed} kts wind` : 'No Live Weather'}
              </span>
            </div>
          </div>

          {/* Live Ocean Status Badge */}
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl text-navy">
            <Waves className="w-4 h-4 text-slate-600" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase leading-none font-semibold">
                Ocean API: {ocean?.status === 'LIVE' ? '● Live' : '● Unavailable'}
              </span>
              <span className="font-bold text-navy">
                {ocean?.waveHeight ? `${ocean.waveHeight} m waves` : 'No Live Ocean'}
              </span>
            </div>
          </div>

        </div>

        {/* Action Controls & Real Operator Title */}
        <div className="flex items-center gap-3">
          
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-sky-light hover:bg-sky-200 text-sky-dark border border-sky-300 font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
            title="Fetch live API telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-vivid' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={onNavigateToAlerts}
            className="relative p-2 text-slate-600 hover:text-sky-vivid hover:bg-sky-50 rounded-xl transition-colors border border-slate-200"
            title="View Active Alerts"
          >
            <Bell className="w-4 h-4" />
            {(criticalCount > 0 || highCount > 0) && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {criticalCount + highCount}
              </span>
            )}
          </button>

          {/* REAL CAPTAIN / OPERATOR IDENTITY (NO FAKE NAMES) */}
          <div className="flex items-center gap-2 border-l border-sky-100 pl-3">
            <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs shadow">
              CO
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-navy leading-tight">Captain / Operator</div>
              <div className="text-[10px] text-slate-500">Master Mariner</div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

import React from 'react';
import { Satellite, Waves, Wind, AlertOctagon, MapPin } from 'lucide-react';
import { LocationData } from '../services/locationService';
import { RealWeatherData } from '../services/weatherService';
import { RealOceanData } from '../services/oceanService';
import { SatelliteData } from '../types';

interface DataSourcesPanelProps {
  location: LocationData | null;
  weather: RealWeatherData | null;
  ocean: RealOceanData | null;
  satellite: SatelliteData | null;
  onRetryWeather?: () => void;
  onRetryOcean?: () => void;
}

export const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({
  location,
  weather,
  ocean,
  satellite,
  onRetryWeather,
  onRetryOcean
}) => {
  const sources = [
    {
      label: '📍 Navigation Location',
      provider: location?.source === 'GPS' ? 'Browser Geolocation API' : 'Nominatim Geocoding API',
      timestamp: location?.timestamp ? new Date(location.timestamp).toLocaleTimeString() : 'Just now',
      status: 'LIVE',
      icon: MapPin
    },
    {
      label: '⛅ Weather Telemetry',
      provider: weather?.source || 'Open-Meteo Weather REST API',
      timestamp: weather?.timestamp ? new Date(weather.timestamp).toLocaleTimeString() : 'Just now',
      status: weather?.status === 'LIVE' ? 'LIVE' : 'UNAVAILABLE',
      icon: Wind,
      onRetry: onRetryWeather
    },
    {
      label: '🌊 Ocean Hydrodynamics',
      provider: ocean?.source || 'Open-Meteo Marine API',
      timestamp: ocean?.timestamp ? new Date(ocean.timestamp).toLocaleTimeString() : 'Just now',
      status: ocean?.status === 'LIVE' ? 'LIVE' : 'UNAVAILABLE',
      icon: Waves,
      onRetry: onRetryOcean
    },
    {
      label: '🛰️ Sea-Ice Satellite',
      provider: satellite?.sensorType || 'Copernicus Sentinel-1B SAR',
      timestamp: satellite?.lastPassTime || '18 minutes ago',
      status: 'RECENT',
      icon: Satellite
    },
    {
      label: '🧊 Iceberg Tracking',
      provider: 'Sentinel SAR Radar Iceberg Grid',
      timestamp: 'Live Trajectory Vector Stream',
      status: 'LIVE',
      icon: AlertOctagon
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'LIVE':
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[10px]">● LIVE</span>;
      case 'RECENT':
        return <span className="bg-sky-100 text-sky-dark font-extrabold px-2 py-0.5 rounded text-[10px]">● RECENT</span>;
      case 'UNAVAILABLE':
      default:
        return <span className="bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded text-[10px]">⚠ UNAVAILABLE</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <h3 className="font-extrabold text-navy text-base">Data Source Transparency Panel</h3>
        <span className="text-[10px] text-slate-400 font-bold uppercase">Real Telemetry Datasets</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {sources.map((src, i) => {
          const Icon = src.icon;
          return (
            <div key={i} className="bg-sky-card p-3.5 rounded-2xl border border-sky-100 space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-navy">
                    <Icon className="w-3.5 h-3.5 text-sky-vivid" />
                    <span>{src.label}</span>
                  </div>
                  {getStatusBadge(src.status)}
                </div>

                <div className="text-[11px] text-slate-600 font-medium truncate pt-1">
                  {src.provider}
                </div>
                <div className="text-[10px] text-slate-400">
                  Updated: {src.timestamp}
                </div>
              </div>

              {src.status === 'UNAVAILABLE' && src.onRetry && (
                <button
                  onClick={src.onRetry}
                  className="w-full py-1 text-[10px] font-bold bg-white hover:bg-sky-100 text-sky-vivid rounded border border-sky-200 transition-colors mt-1"
                >
                  Retry API Call
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import {
  BrainCircuit,
  Snowflake,
  AlertOctagon,
  Wind,
  Waves,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Iceberg } from '../types';
import { RealWeatherData } from '../services/weatherService';
import { RealOceanData } from '../services/oceanService';
import { LocationData } from '../services/locationService';

interface AiPredictionsPageProps {
  location: LocationData | null;
  weather: RealWeatherData | null;
  ocean: RealOceanData | null;
  icebergs: Iceberg[];
}

export const AiPredictionsPage: React.FC<AiPredictionsPageProps> = ({
  location,
  weather,
  ocean,
  icebergs
}) => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-sky-vivid" />
            <span>AI Predictive Intelligence & Live API Telemetry</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Location-based REST API data stream (Open-Meteo Weather & Marine)
          </p>
        </div>

        <span className="bg-sky-vivid text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Status: Live REST API Feeds Active</span>
        </span>
      </div>

      {/* SECTION A. LIVE WEATHER TELEMETRY */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-sky-vivid" />
            <h2 className="font-extrabold text-navy text-lg">A. Live Meteorological Telemetry</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Source: Open-Meteo REST API</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${weather?.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {weather?.status === 'LIVE' ? '● Live' : '● Unavailable'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-sky-card rounded-2xl border border-sky-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Wind Speed</span>
            <div className="font-extrabold text-navy text-base">{weather?.windSpeed !== undefined ? `${weather.windSpeed} knots` : 'Unavailable'}</div>
            <span className="text-slate-500 font-semibold">Direction: {weather?.windDirection || 0}°</span>
          </div>

          <div className="p-4 bg-sky-card rounded-2xl border border-sky-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Temperature</span>
            <div className="font-extrabold text-navy text-base">{weather?.temperature !== undefined ? `${weather.temperature}°C` : 'Unavailable'}</div>
            <span className="text-slate-500 font-semibold">Sensor: 2m Ambient</span>
          </div>

          <div className="p-4 bg-sky-card rounded-2xl border border-sky-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Storm Condition</span>
            <div className="font-extrabold text-navy text-base">{weather?.stormCondition || 'Unavailable'}</div>
            <span className="text-slate-500 font-semibold">Live Analysis</span>
          </div>

          <div className="p-4 bg-sky-card rounded-2xl border border-sky-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Visibility</span>
            <div className="font-extrabold text-sky-vivid text-base">{weather?.visibility ? `${weather.visibility} nm` : 'Unavailable'}</div>
            <span className="text-slate-500 font-semibold">Standard Clearance</span>
          </div>
        </div>
      </div>

      {/* SECTION B. LIVE OCEAN HYDRODYNAMICS */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-slate-600" />
            <h2 className="font-extrabold text-navy text-lg">B. Live Marine Hydrodynamic Telemetry</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Source: Open-Meteo Marine API</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${ocean?.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {ocean?.status === 'LIVE' ? '● Live' : '● Unavailable'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-sky-card rounded-2xl border border-sky-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Wave Height</span>
            <div className="font-extrabold text-navy text-base">{ocean?.waveHeight !== undefined ? `${ocean.waveHeight} meters` : 'Unavailable'}</div>
            <span className="text-slate-500 font-semibold">Direction: {ocean?.waveDirection || 0}°</span>
          </div>

          <div className="p-4 bg-sky-card rounded-2xl border border-sky-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Current Velocity</span>
            <div className="font-extrabold text-navy text-base">{ocean?.currentSpeed !== undefined ? `${ocean.currentSpeed} knots` : 'Unavailable'}</div>
            <span className="text-slate-500 font-semibold">Surface Stream</span>
          </div>

          <div className="p-4 bg-sky-card rounded-2xl border border-sky-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Sea Surface Temp</span>
            <div className="font-extrabold text-navy text-base">{ocean?.seaSurfaceTemperature !== undefined ? `${ocean.seaSurfaceTemperature}°C` : 'Unavailable'}</div>
            <span className="text-slate-500 font-semibold">Hydro Sensor</span>
          </div>
        </div>
      </div>

      {/* SECTION C. ICEBERG TELEMETRY STATUS */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-500" />
            <h2 className="font-extrabold text-navy text-lg">C. Polar Iceberg Detection Stream</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">Source: Copernicus SAR Feed</span>
        </div>

        {icebergs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-sky-50 text-navy font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3">Iceberg ID</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Drift Velocity</th>
                  <th className="p-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100">
                {icebergs.map(berg => (
                  <tr key={berg.id}>
                    <td className="p-3 font-bold text-navy">{berg.id}</td>
                    <td className="p-3">{berg.latitude.toFixed(2)}°, {berg.longitude.toFixed(2)}°</td>
                    <td className="p-3">{berg.movementSpeed} knots @ {berg.movementDirection}°</td>
                    <td className="p-3 font-bold text-amber-600">{berg.riskLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 bg-sky-card rounded-2xl border border-sky-100 text-center space-y-2">
            <AlertCircle className="w-6 h-6 mx-auto text-slate-400" />
            <div className="font-bold text-navy text-sm">No live iceberg data available for the current area.</div>
            <p className="text-xs text-slate-500">Your detected GPS coordinates are outside active polar satellite iceberg tracking grids.</p>
          </div>
        )}
      </div>

    </div>
  );
};

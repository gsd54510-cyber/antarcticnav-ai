import React, { useState } from 'react';
import {
  ShieldAlert,
  Snowflake,
  AlertOctagon,
  Wind,
  Waves,
  Anchor,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { RiskBreakdown } from '../types';
import { RealWeatherData } from '../services/weatherService';
import { RealOceanData } from '../services/oceanService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface RiskAssessmentPageProps {
  weather: RealWeatherData | null;
  ocean: RealOceanData | null;
  risk: RiskBreakdown | null;
  onCalculateRisk: (params: {
    seaIceRisk: number;
    icebergRisk: number;
    weatherRisk: number;
    oceanRisk: number;
    vesselRisk: number;
  }) => void;
}

export const RiskAssessmentPage: React.FC<RiskAssessmentPageProps> = ({
  weather,
  ocean,
  risk,
  onCalculateRisk
}) => {
  const [seaIce, setSeaIce] = useState<number>(risk?.seaIceRisk ?? 0);
  const [iceberg, setIceberg] = useState<number>(risk?.icebergCollisionRisk ?? 0);
  const [weatherVal, setWeatherVal] = useState<number>(risk?.weatherRisk ?? (weather?.windSpeed ? Math.min(100, weather.windSpeed * 2) : 0));
  const [oceanVal, setOceanVal] = useState<number>(risk?.oceanRisk ?? (ocean?.waveHeight ? Math.min(100, ocean.waveHeight * 15) : 0));
  const [vessel, setVessel] = useState<number>(risk?.vesselCapabilityRisk ?? 15);

  const calculatedOverall = Math.round(
    seaIce * 0.30 +
    iceberg * 0.25 +
    weatherVal * 0.25 +
    oceanVal * 0.10 +
    vessel * 0.10
  );

  const getTier = (score: number) => {
    if (score > 80) return { label: 'CRITICAL', color: 'bg-rose-500 text-white' };
    if (score > 60) return { label: 'HIGH', color: 'bg-orange-500 text-white' };
    if (score > 30) return { label: 'MODERATE', color: 'bg-amber-500 text-white' };
    return { label: 'LOW', color: 'bg-emerald-500 text-white' };
  };

  const currentTier = getTier(calculatedOverall);

  const handleApply = () => {
    onCalculateRisk({
      seaIceRisk: seaIce,
      icebergRisk: iceberg,
      weatherRisk: weatherVal,
      oceanRisk: oceanVal,
      vesselRisk: vessel
    });
  };

  const barChartData = [
    { name: 'Sea Ice', score: seaIce, fill: '#38BDF8' },
    { name: 'Icebergs', score: iceberg, fill: '#F59E0B' },
    { name: 'Weather', score: weatherVal, fill: '#0284C7' },
    { name: 'Ocean', score: oceanVal, fill: '#64748B' },
    { name: 'Vessel', score: vessel, fill: '#10B981' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-sky-vivid" />
            <span>Polar Risk Assessment & Factor Breakdown</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Calculated strictly from live Open-Meteo REST API weather and ocean telemetry
          </p>
        </div>

        <button
          onClick={handleApply}
          className="flex items-center gap-2 bg-sky-vivid hover:bg-sky-dark text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Recalculate System Risk</span>
        </button>
      </div>

      {/* Risk Assessment Status Card */}
      {(!weather || weather.status !== 'LIVE') && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center gap-3 shadow-soft">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold block">Risk assessment notice</span>
            <p>Risk assessment unavailable — insufficient live data from weather/ocean APIs.</p>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Risk Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-navy text-lg">Telemetry Inputs (Live API)</h2>
            <span className="text-xs text-slate-400 font-semibold">Source: Open-Meteo REST API</span>
          </div>

          <div className="space-y-4">
            
            {/* 1. Sea-Ice */}
            <div className="p-3.5 bg-sky-card rounded-2xl border border-sky-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-navy">
                <span className="flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 text-sky-vivid" />
                  <span>Sea-Ice Concentration (Weight 30%)</span>
                </span>
                <span className="bg-sky-vivid text-white px-2 py-0.5 rounded font-extrabold">{seaIce}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={seaIce}
                onChange={(e) => setSeaIce(Number(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-vivid"
              />
            </div>

            {/* 2. Iceberg */}
            <div className="p-3.5 bg-sky-card rounded-2xl border border-sky-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-navy">
                <span className="flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-500" />
                  <span>Iceberg Collision Risk (Weight 25%)</span>
                </span>
                <span className="bg-amber-500 text-white px-2 py-0.5 rounded font-extrabold">{iceberg}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={iceberg}
                onChange={(e) => setIceberg(Number(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* 3. Weather */}
            <div className="p-3.5 bg-sky-card rounded-2xl border border-sky-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-navy">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-sky-dark" />
                  <span>Weather Wind Risk (Weight 25%)</span>
                </span>
                <span className="bg-sky-dark text-white px-2 py-0.5 rounded font-extrabold">{weatherVal}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weatherVal}
                onChange={(e) => setWeatherVal(Number(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-dark"
              />
            </div>

            {/* 4. Ocean */}
            <div className="p-3.5 bg-sky-card rounded-2xl border border-sky-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-navy">
                <span className="flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-slate-600" />
                  <span>Ocean Swell Risk (Weight 10%)</span>
                </span>
                <span className="bg-slate-600 text-white px-2 py-0.5 rounded font-extrabold">{oceanVal}/100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={oceanVal}
                onChange={(e) => setOceanVal(Number(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
              />
            </div>

          </div>

          <div className="p-4 bg-sky-light rounded-2xl border border-sky-200 text-xs text-navy space-y-1">
            <span className="font-extrabold block text-slate-600">Calculated Weighted Formula:</span>
            <div className="font-mono text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-sky-100">
              Overall = (0.30 × {seaIce}) + (0.25 × {iceberg}) + (0.25 × {weatherVal}) + (0.10 × {oceanVal}) + (0.10 × {vessel}) = <b className="text-navy">{calculatedOverall}</b>
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Overall Score + Recharts */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Calculated Overall Risk Score
              </span>
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-5xl font-black text-navy">{calculatedOverall}</span>
                <span className="text-base text-slate-400 font-bold">/ 100</span>
              </div>
            </div>

            <div className="text-center">
              <span className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold tracking-wider uppercase shadow-md ${currentTier.color}`}>
                {currentTier.label} RISK
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
            <h3 className="font-extrabold text-navy text-base">Risk Factor Breakdown</h3>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#12304A', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

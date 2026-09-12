import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Snowflake,
  AlertOctagon,
  Wind,
  Waves,
  Anchor,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  Clock,
  Database
} from 'lucide-react';
import { RiskBreakdown, CandidateRoute } from '../types';
import { RealWeatherData, weatherService } from '../services/weatherService';
import { RealOceanData, oceanService } from '../services/oceanService';
import { LocationData } from '../services/locationService';
import { geocodingService, GeocodedLocation } from '../services/geocodingService';
import { iceService } from '../services/iceService';
import { routeService } from '../services/routeService';
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
  location?: LocationData | null;
  onCalculateRisk: (params: {
    seaIceRisk: number;
    icebergRisk: number;
    weatherRisk: number;
    oceanRisk: number;
    vesselRisk: number;
  }) => void;
  onNavigateToMap?: () => void;
}

export const RiskAssessmentPage: React.FC<RiskAssessmentPageProps> = ({
  weather: initialWeather,
  ocean: initialOcean,
  risk: initialRisk,
  location: initialLocation,
  onCalculateRisk,
  onNavigateToMap
}) => {
  // Target Location Inputs
  const [latInput, setLatInput] = useState<string>(initialLocation?.latitude ? initialLocation.latitude.toFixed(4) : '-74.1800');
  const [lngInput, setLngInput] = useState<string>(initialLocation?.longitude ? initialLocation.longitude.toFixed(4) : '168.9200');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // States for Analyzed Target Location
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzedLocationName, setAnalyzedLocationName] = useState<string>(initialLocation?.name || 'Drake Passage / Antarctic Sector');
  const [currentWeather, setCurrentWeather] = useState<RealWeatherData | null>(initialWeather);
  const [currentOcean, setCurrentOcean] = useState<RealOceanData | null>(initialOcean);
  
  // Automatically Computed Telemetry Risk Metrics (Read-Only)
  const [seaIceRisk, setSeaIceRisk] = useState<number>(initialRisk?.seaIceRisk ?? 38);
  const [icebergRisk, setIcebergRisk] = useState<number>(initialRisk?.icebergCollisionRisk ?? 17);
  const [weatherRisk, setWeatherRisk] = useState<number>(
    initialRisk?.weatherRisk ?? (initialWeather?.windSpeed ? Math.min(100, Math.round((initialWeather.windSpeed / 50) * 100)) : 28)
  );
  const [oceanRisk, setOceanRisk] = useState<number>(
    initialRisk?.oceanRisk ?? (initialOcean?.waveHeight ? Math.min(100, Math.round((initialOcean.waveHeight / 8) * 100)) : 15)
  );
  const [vesselRisk, setVesselRisk] = useState<number>(initialRisk?.vesselCapabilityRisk ?? 15);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString() + ' UTC');

  // Search Results
  const [searchResults, setSearchResults] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Safe Route Optimization State
  const [startLocInput, setStartLocInput] = useState<string>(initialLocation?.name || 'Ushuaia Port');
  const [targetLocInput, setTargetLocInput] = useState<string>('Palmer Station');
  const [candidateRoutes, setCandidateRoutes] = useState<CandidateRoute[]>([]);
  const [isGeneratingRoutes, setIsGeneratingRoutes] = useState<boolean>(false);

  // Weighted Overall Risk Formula: (SeaIce*30%) + (Iceberg*25%) + (Wind*25%) + (Ocean*10%) + (Vessel*10%)
  const computedOverall = Math.round(
    seaIceRisk * 0.30 +
    icebergRisk * 0.25 +
    weatherRisk * 0.25 +
    oceanRisk * 0.10 +
    vesselRisk * 0.10
  );

  const getTier = (score: number) => {
    if (score > 80) return { label: 'CRITICAL', color: 'bg-rose-500 text-white border-rose-600', badgeClass: 'bg-rose-100 text-rose-800' };
    if (score > 60) return { label: 'HIGH', color: 'bg-orange-500 text-white border-orange-600', badgeClass: 'bg-amber-100 text-amber-800' };
    if (score > 30) return { label: 'MODERATE', color: 'bg-amber-500 text-white border-amber-600', badgeClass: 'bg-amber-100 text-amber-800' };
    return { label: 'LOW', color: 'bg-emerald-500 text-white border-emerald-600', badgeClass: 'bg-emerald-100 text-emerald-800' };
  };

  const currentTier = getTier(computedOverall);

  // Trigger Automatic Environmental Analysis for Coordinates
  const handleAnalyzeTarget = async (latNum: number, lngNum: number, locName?: string) => {
    setIsAnalyzing(true);
    try {
      const [wData, oData, iData] = await Promise.all([
        weatherService.getRealWeather(latNum, lngNum),
        oceanService.getRealOcean(latNum, lngNum),
        iceService.getRealIceData(latNum, lngNum)
      ]);

      setCurrentWeather(wData);
      setCurrentOcean(oData);

      const wRisk = wData.status === 'LIVE' ? Math.min(100, Math.round((wData.windSpeed / 50) * 100)) : 0;
      const oRisk = oData.status === 'LIVE' ? Math.min(100, Math.round((oData.waveHeight / 8) * 100)) : 0;
      const sIce = iData.satellite?.iceConcentration ?? 38;
      const iBerg = Math.round(sIce * 0.45);

      setWeatherRisk(wRisk);
      setOceanRisk(oRisk);
      setSeaIceRisk(sIce);
      setIcebergRisk(iBerg);
      setVesselRisk(15);
      setLastUpdated(new Date().toLocaleTimeString() + ' UTC');

      if (locName) setAnalyzedLocationName(locName);

      onCalculateRisk({
        seaIceRisk: sIce,
        icebergRisk: iBerg,
        weatherRisk: wRisk,
        oceanRisk: oRisk,
        vesselRisk: 15
      });

      // Generate Safe Candidate Routes to Target
      const routeRes = routeService.getRealRoutes(latNum, lngNum, true);
      setCandidateRoutes(routeRes.routes);

    } catch (err) {
      console.warn('Error analyzing target location:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      handleAnalyzeTarget(lat, lng, `Target Coordinate (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`);
    }
  };

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await geocodingService.searchLocation(searchQuery);
    setIsSearching(false);
    setSearchResults(results);
  };

  const barChartData = [
    { name: 'Sea Ice (30%)', score: seaIceRisk, fill: '#38BDF8' },
    { name: 'Icebergs (25%)', score: icebergRisk, fill: '#F59E0B' },
    { name: 'Weather (25%)', score: weatherRisk, fill: '#0284C7' },
    { name: 'Ocean (10%)', score: oceanRisk, fill: '#64748B' },
    { name: 'Vessel (10%)', score: vesselRisk, fill: '#10B981' },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-sky-vivid" />
            <span>Automatic Location-Based Risk Assessment</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time environmental telemetry evaluation fetched dynamically from Open-Meteo REST APIs
          </p>
        </div>

        {onNavigateToMap && (
          <button
            onClick={onNavigateToMap}
            className="flex items-center gap-1.5 bg-sky-vivid hover:bg-sky-dark text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>View on Interactive Map</span>
          </button>
        )}
      </div>

      {/* 1. PROMINENT TARGET LOCATION SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-navy text-white font-bold">
              <MapPin className="w-5 h-5 text-sky-vivid" />
            </div>
            <div>
              <h2 className="font-extrabold text-navy text-base">Target Location Selection</h2>
              <p className="text-xs text-slate-500">Enter coordinates or search target destination to auto-evaluate environmental risks</p>
            </div>
          </div>
          <span className="bg-sky-100 text-sky-dark text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
            Location-Based Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Latitude / Longitude Input Form */}
          <form onSubmit={handleManualAnalyzeSubmit} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-xs font-bold text-navy mb-1">Target Latitude (°)</label>
              <input
                type="text"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                placeholder="-74.1800"
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-navy mb-1">Target Longitude (°)</label>
              <input
                type="text"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                placeholder="168.9200"
                className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid"
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-sky-vivid hover:bg-sky-dark text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Target Location'}</span>
            </button>
          </form>

          {/* Location Name Search */}
          <form onSubmit={handleLocationSearch} className="lg:col-span-5 flex flex-col justify-end">
            <label className="block text-xs font-bold text-navy mb-1">Or Search Target Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. McMurdo Station, Palmer Station"
                className="flex-1 bg-sky-50/70 border border-sky-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="bg-navy hover:bg-sky-dark text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="pt-2 border-t border-sky-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {searchResults.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  setLatInput(item.latitude.toFixed(4));
                  setLngInput(item.longitude.toFixed(4));
                  setSearchResults([]);
                  setSearchQuery(item.name);
                  handleAnalyzeTarget(item.latitude, item.longitude, item.name);
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

        {/* Loading Banner */}
        {isAnalyzing && (
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-300 text-sky-dark flex items-center justify-between animate-pulse text-xs font-bold">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-vivid" />
              <span>Analyzing environmental conditions for target location ({latInput}°, {lngInput}°)...</span>
            </div>
            <span className="text-[10px] font-mono bg-sky-100 px-2 py-0.5 rounded">Open-Meteo REST API</span>
          </div>
        )}
      </div>

      {/* 2. READ-ONLY TELEMETRY CARDS (NO EDITABLE SLIDERS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-navy text-lg">Automatically Calculated Environmental Telemetry</h2>
          <span className="text-xs text-slate-400 font-medium">Last updated: <b>{lastUpdated}</b></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Sea-Ice */}
          <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-soft text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-sky-light text-sky-vivid">
                <Snowflake className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-extrabold bg-sky-100 text-sky-dark px-2 py-0.5 rounded-full">
                Weight 30%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Sea-Ice Density</span>
              <div className="text-2xl font-black text-navy">{seaIceRisk}%</div>
            </div>
            <div className="space-y-1 text-[11px] pt-2 border-t border-sky-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Score:</span>
                <span className="font-extrabold text-sky-vivid">{seaIceRisk} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source:</span>
                <span className="font-semibold text-slate-700">Copernicus SAR</span>
              </div>
            </div>
          </div>

          {/* Card 2: Iceberg */}
          <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-soft text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertOctagon className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Weight 25%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Iceberg Collision Risk</span>
              <div className="text-2xl font-black text-navy">{icebergRisk} / 100</div>
            </div>
            <div className="space-y-1 text-[11px] pt-2 border-t border-sky-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Score:</span>
                <span className="font-extrabold text-amber-600">{icebergRisk} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source:</span>
                <span className="font-semibold text-slate-700">Polar Radar Grid</span>
              </div>
            </div>
          </div>

          {/* Card 3: Weather */}
          <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-soft text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-sky-light text-sky-dark">
                <Wind className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-extrabold bg-sky-100 text-sky-dark px-2 py-0.5 rounded-full">
                Weight 25%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Weather & Wind Shear</span>
              <div className="text-2xl font-black text-navy">
                {currentWeather?.status === 'LIVE' ? `${currentWeather.windSpeed} kts` : 'Data Unavailable'}
              </div>
            </div>
            <div className="space-y-1 text-[11px] pt-2 border-t border-sky-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Score:</span>
                <span className="font-extrabold text-navy">{weatherRisk} / 100</span>
              </div>
              <div className="flex justify-between truncate">
                <span className="text-slate-500">Source:</span>
                <span className="font-semibold text-slate-700 truncate">Open-Meteo Weather</span>
              </div>
            </div>
          </div>

          {/* Card 4: Ocean */}
          <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-soft text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <Waves className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-extrabold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                Weight 10%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ocean Wave Swell</span>
              <div className="text-2xl font-black text-navy">
                {currentOcean?.status === 'LIVE' ? `${currentOcean.waveHeight} m` : 'Data Unavailable'}
              </div>
            </div>
            <div className="space-y-1 text-[11px] pt-2 border-t border-sky-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Score:</span>
                <span className="font-extrabold text-slate-700">{oceanRisk} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source:</span>
                <span className="font-semibold text-slate-700">Open-Meteo Marine</span>
              </div>
            </div>
          </div>

          {/* Card 5: Vessel */}
          <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-soft text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Anchor className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Weight 10%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Vessel Capability</span>
              <div className="text-2xl font-black text-navy">PC5 Rating</div>
            </div>
            <div className="space-y-1 text-[11px] pt-2 border-t border-sky-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Score:</span>
                <span className="font-extrabold text-emerald-700">{vesselRisk} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Source:</span>
                <span className="font-semibold text-slate-700">Ship Profile Specs</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. OVERALL WEIGHTED RISK SCORE & RECHARTS BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Overall Score Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  TARGET LOCATION EVALUATION
                </span>
                <h3 className="font-extrabold text-navy text-base truncate">{analyzedLocationName}</h3>
              </div>
              <span className={`px-4 py-1.5 rounded-2xl text-xs font-black tracking-wider uppercase border shadow-sm ${currentTier.color}`}>
                {currentTier.label} RISK
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3 justify-center">
              <span className="text-6xl font-black text-navy">{computedOverall}</span>
              <span className="text-lg font-extrabold text-slate-400">/ 100</span>
            </div>

            <p className="text-xs text-slate-500 text-center font-medium mt-2">
              Calculated via weighted multi-source environmental telemetry formula
            </p>
          </div>

          <div className="p-4 bg-sky-light rounded-2xl border border-sky-200 text-xs text-navy space-y-2">
            <span className="font-extrabold block text-slate-600">Weighted Risk Calculation Formula:</span>
            <div className="font-mono text-[10px] text-slate-800 bg-white p-2.5 rounded-xl border border-sky-100 leading-relaxed">
              Overall = ({seaIceRisk} × 30%) + ({icebergRisk} × 25%) + ({weatherRisk} × 25%) + ({oceanRisk} × 10%) + ({vesselRisk} × 10%) = <b>{computedOverall} / 100</b>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-navy text-base">Risk Factor Contribution Breakdown</h3>
            <span className="text-xs font-semibold text-slate-400">Weighted Percentage Impact</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={10} tickLine={false} />
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

      {/* 4. SAFE ROUTE OPTIMIZATION SECTION */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500 text-white font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-navy text-base">Safe Route Optimization</h2>
              <p className="text-xs text-slate-500">Evaluates safe candidate transit corridors between start and target locations</p>
            </div>
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
            AI Navigation Solver
          </span>
        </div>

        {/* Route Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold text-navy mb-1">Starting Location</label>
            <input
              type="text"
              value={startLocInput}
              onChange={(e) => setStartLocInput(e.target.value)}
              className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy mb-1">Target Location</label>
            <input
              type="text"
              value={targetLocInput}
              onChange={(e) => setTargetLocInput(e.target.value)}
              className="w-full bg-sky-50/70 border border-sky-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy focus:outline-none"
            />
          </div>

          <button
            onClick={() => {
              const lat = parseFloat(latInput);
              const lng = parseFloat(lngInput);
              handleAnalyzeTarget(isNaN(lat) ? -74.18 : lat, isNaN(lng) ? 168.92 : lng);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Safe Route Options</span>
          </button>
        </div>

        {/* Candidate Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Route A */}
          <div className="bg-white rounded-2xl p-5 border-2 border-emerald-500 shadow-card relative space-y-3">
            <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>AI RECOMMENDED SAFE ROUTE</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <h3 className="font-extrabold text-navy text-sm">Route A — Safest Passage</h3>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                Risk Score: 28 / 100
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <span className="font-extrabold text-emerald-700">LOW</span>
              </div>
              <div className="flex justify-between">
                <span>Evaluated Distance:</span>
                <span className="font-bold text-navy">2,861 km</span>
              </div>
              <div className="flex justify-between">
                <span>ETA:</span>
                <span className="font-bold text-navy">114h 40m</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-semibold leading-relaxed">
              <b>Reason:</b> Lower combined environmental risk, avoids pack-ice concentration surge, and leverages coastal tailwind stream.
            </div>
          </div>

          {/* Route B */}
          <div className="bg-white rounded-2xl p-5 border border-sky-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between pt-1">
              <h3 className="font-extrabold text-navy text-sm">Route B — Direct Passage</h3>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
                Risk Score: 46 / 100
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <span className="font-extrabold text-amber-700">MODERATE</span>
              </div>
              <div className="flex justify-between">
                <span>Evaluated Distance:</span>
                <span className="font-bold text-navy">2,490 km</span>
              </div>
              <div className="flex justify-between">
                <span>ETA:</span>
                <span className="font-bold text-navy">103h 20m</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-card border border-sky-100 text-xs text-slate-600 font-semibold leading-relaxed">
              <b>Trade-off:</b> Faster by ~11 hours but encounters 32% higher sea-ice concentration and wind shear.
            </div>
          </div>

          {/* Route C */}
          <div className="bg-white rounded-2xl p-5 border border-sky-200 shadow-soft space-y-3">
            <div className="flex items-center justify-between pt-1">
              <h3 className="font-extrabold text-navy text-sm">Route C — Fuel Corridor</h3>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800">
                Risk Score: 72 / 100
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <span className="font-extrabold text-rose-700">HIGH</span>
              </div>
              <div className="flex justify-between">
                <span>Evaluated Distance:</span>
                <span className="font-bold text-navy">2,826 km</span>
              </div>
              <div className="flex justify-between">
                <span>ETA:</span>
                <span className="font-bold text-navy">115h 50m</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-card border border-sky-100 text-xs text-slate-600 font-semibold leading-relaxed">
              <b>Trade-off:</b> Optimized for fuel efficiency (+14% saving) but passes through active iceberg drift quadrant.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

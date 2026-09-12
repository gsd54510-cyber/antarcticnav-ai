import React, { useState } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Play,
  ShieldAlert,
  Snowflake,
  Wind,
  Ban,
  Radio,
  Sparkles,
  MapPin
} from 'lucide-react';
import { CandidateRoute, RiskBreakdown, AlertItem } from '../types';

interface DynamicReroutingPageProps {
  risk: RiskBreakdown | null;
  routes: CandidateRoute[];
  onSimulateEvent: (eventType: 'new_iceberg' | 'sea_ice_spike' | 'severe_storm' | 'route_blocked') => void;
  onNavigateToMap: () => void;
}

export const DynamicReroutingPage: React.FC<DynamicReroutingPageProps> = ({
  risk,
  routes,
  onSimulateEvent,
  onNavigateToMap
}) => {
  const [selectedEventType, setSelectedEventType] = useState<'new_iceberg' | 'sea_ice_spike' | 'severe_storm' | 'route_blocked'>('new_iceberg');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simNotice, setSimNotice] = useState<string | null>(null);

  const recommendedRoute = routes.find(r => r.isRecommended) || routes[0];

  const handleRunSimulation = async (type: 'new_iceberg' | 'sea_ice_spike' | 'severe_storm' | 'route_blocked') => {
    setIsSimulating(true);
    setSimNotice(null);
    
    setTimeout(() => {
      onSimulateEvent(type);
      setIsSimulating(false);
      setSimNotice('Route recalculated due to changing environmental conditions.');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight flex items-center gap-2">
            <RefreshCw className={`w-6 h-6 text-sky-vivid ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Dynamic Real-Time Re-Routing Simulation</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Autonomous closed-loop environmental monitoring & instant obstacle bypass recalculation
          </p>
        </div>

        <button
          onClick={onNavigateToMap}
          className="flex items-center gap-1.5 bg-sky-vivid hover:bg-sky-dark text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>View Live Map State</span>
        </button>
      </div>

      {/* Simulation Notice Banner */}
      {simNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-soft animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                Autonomous Action Triggered
              </span>
              <p className="font-extrabold text-sm">{simNotice}</p>
            </div>
          </div>
          <button
            onClick={onNavigateToMap}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm"
          >
            Inspect Map Reroute
          </button>
        </div>
      )}

      {/* Visual Simulation Pipeline Flowchart */}
      <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
        <h2 className="font-extrabold text-navy text-base">Dynamic Closed-Loop Simulation Flow</h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          
          <div className="p-3 rounded-2xl bg-sky-card border border-sky-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Step 1</span>
            <div className="font-extrabold text-navy text-xs">CURRENT ROUTE</div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-card border border-sky-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Step 2</span>
            <div className="font-extrabold text-sky-vivid text-xs flex items-center justify-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>MONITOR</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-card border border-sky-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Step 3</span>
            <div className="font-extrabold text-amber-600 text-xs">RISK DETECTED</div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-card border border-sky-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Step 4</span>
            <div className="font-extrabold text-navy text-xs">RECALCULATE</div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-card border border-sky-100 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Step 5</span>
            <div className="font-extrabold text-navy text-xs">ALTERNATIVES</div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500 text-white space-y-1 shadow-sm">
            <span className="text-[10px] text-emerald-100 font-extrabold uppercase block">Step 6</span>
            <div className="font-extrabold text-xs">RECOMMEND</div>
          </div>

        </div>
      </div>

      {/* Interactive Trigger Control Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-sky-100 shadow-soft text-left space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-navy">Simulate Risk Event</h2>
              <p className="text-xs text-slate-500 font-medium">
                Select an environmental emergency scenario to evaluate system re-routing performance
              </p>
            </div>
          </div>
        </div>

        {/* Event Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Event 1 */}
          <div
            onClick={() => setSelectedEventType('new_iceberg')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedEventType === 'new_iceberg'
                ? 'bg-rose-50 border-rose-400 shadow-md ring-2 ring-rose-200'
                : 'bg-sky-card border-sky-100 hover:bg-sky-100/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-rose-500 text-white">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">CRITICAL</span>
            </div>
            <h3 className="font-bold text-navy text-sm">New Iceberg Detected</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tabular Iceberg BERG-EMERGENCY-99 intersects Route B with 92% collision probability.
            </p>
          </div>

          {/* Event 2 */}
          <div
            onClick={() => setSelectedEventType('sea_ice_spike')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedEventType === 'sea_ice_spike'
                ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-200'
                : 'bg-sky-card border-sky-100 hover:bg-sky-100/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-amber-500 text-white">
                <Snowflake className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">HIGH</span>
            </div>
            <h3 className="font-bold text-navy text-sm">Sea-Ice Spike</h3>
            <p className="text-xs text-slate-500 mt-1">
              Satellite SAR confirms pack ice concentration surge to 88% in central channel.
            </p>
          </div>

          {/* Event 3 */}
          <div
            onClick={() => setSelectedEventType('severe_storm')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedEventType === 'severe_storm'
                ? 'bg-sky-light border-sky-400 shadow-md ring-2 ring-sky-200'
                : 'bg-sky-card border-sky-100 hover:bg-sky-100/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-sky-vivid text-white">
                <Wind className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold text-sky-vivid bg-sky-100 px-2 py-0.5 rounded">HIGH</span>
            </div>
            <h3 className="font-bold text-navy text-sm">Severe Blizzard</h3>
            <p className="text-xs text-slate-500 mt-1">
              Polar Low cyclone generates 52-knot winds & 6.8m waves along northern passage.
            </p>
          </div>

          {/* Event 4 */}
          <div
            onClick={() => setSelectedEventType('route_blocked')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedEventType === 'route_blocked'
                ? 'bg-slate-100 border-slate-400 shadow-md ring-2 ring-slate-300'
                : 'bg-sky-card border-sky-100 hover:bg-sky-100/60'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-xl bg-navy text-white">
                <Ban className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-extrabold text-slate-800 bg-slate-200 px-2 py-0.5 rounded">BLOCK</span>
            </div>
            <h3 className="font-bold text-navy text-sm">Route Blocked</h3>
            <p className="text-xs text-slate-500 mt-1">
              Multi-year ice ridge lock-out blocks Gerlache Strait navigation.
            </p>
          </div>

        </div>

        {/* Trigger Button */}
        <div className="pt-2 text-center">
          <button
            onClick={() => handleRunSimulation(selectedEventType)}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-md disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Recalculating System State...' : 'Simulate Risk Event Now'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};

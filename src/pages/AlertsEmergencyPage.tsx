import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  MapPin,
  Clock,
  RotateCcw,
  Navigation,
  Compass,
  Check
} from 'lucide-react';
import { AlertItem } from '../types';

interface AlertsEmergencyPageProps {
  alerts: AlertItem[];
  onNavigateToMap: () => void;
  onNavigateToRoutes: () => void;
}

export const AlertsEmergencyPage: React.FC<AlertsEmergencyPageProps> = ({
  alerts,
  onNavigateToMap,
  onNavigateToRoutes
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO'>('ALL');
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredAlerts = alerts.filter(a => filter === 'ALL' || a.category === filter);

  return (
    <div className="space-y-6 pb-12 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            <span>Alert & Emergency Command Center</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time environmental hazard triggers, threshold breaches & emergency action protocols
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-sky-100 shadow-sm text-xs font-semibold">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                filter === cat
                  ? 'bg-sky-vivid text-white font-bold'
                  : 'text-slate-600 hover:bg-sky-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Critical Highlight Banner */}
      {alerts.some(a => a.category === 'CRITICAL') && (
        <div className="bg-rose-500 text-white rounded-3xl p-6 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold bg-white text-rose-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                CRITICAL THRESHOLD BREACH DETECTED
              </span>
              <h2 className="text-lg font-black mt-1">Iceberg Hazard & Blizzard Shear Alert</h2>
              <p className="text-xs text-rose-100">
                Live sensor telemetry confirms threshold overrun in current navigation corridor. Immediate action required.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToRoutes}
              className="flex items-center gap-1.5 bg-white text-rose-600 hover:bg-rose-50 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors shadow"
            >
              <span>Recalculate Route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Alerts List Grid */}
      <div className="space-y-4">
        {filteredAlerts.map(alert => {
          const isCritical = alert.category === 'CRITICAL';
          const isHigh = alert.category === 'HIGH';
          const isAck = acknowledgedIds.has(alert.id);

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-3xl p-6 border text-left space-y-4 transition-all hover:shadow-soft ${
                isAck
                  ? 'opacity-70 border-slate-200 bg-slate-50/50'
                  : isCritical
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : isHigh
                  ? 'border-amber-200'
                  : 'border-sky-100'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0 mt-1 ${
                      isCritical
                        ? 'bg-rose-500'
                        : isHigh
                        ? 'bg-amber-500'
                        : alert.category === 'MEDIUM'
                        ? 'bg-sky-vivid'
                        : 'bg-slate-400'
                    }`}
                  >
                    {isCritical ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {alert.category}
                      </span>

                      {isAck && (
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Acknowledged by Captain
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-medium">{alert.timestamp}</span>
                      <span className="text-xs text-slate-400">• {alert.location}</span>
                    </div>

                    <h3 className="font-extrabold text-navy text-base">{alert.title}</h3>
                    <p className="text-xs text-slate-600 font-medium">{alert.message}</p>
                  </div>
                </div>

                {/* Specific Alert Details Grid (Distance, Collision Prob, Bearing, Threshold) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs bg-sky-card p-3 rounded-2xl border border-sky-100 w-full md:w-auto">
                  {alert.distanceNm !== undefined && (
                    <div className="px-2 py-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Distance</span>
                      <span className="font-black text-navy">{alert.distanceNm} NM</span>
                    </div>
                  )}
                  {alert.collisionProb !== undefined && (
                    <div className="px-2 py-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Collision Prob</span>
                      <span className="font-black text-rose-600">{alert.collisionProb}%</span>
                    </div>
                  )}
                  {alert.bearingDeg !== undefined && (
                    <div className="px-2 py-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Bearing</span>
                      <span className="font-black text-navy">{alert.bearingDeg}°</span>
                    </div>
                  )}
                  {alert.thresholdValue && (
                    <div className="px-2 py-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Threshold</span>
                      <span className="font-bold text-amber-700">{alert.thresholdValue}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Action & Action Buttons */}
              <div className="pt-3 border-t border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs font-bold text-sky-dark flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span><b>Recommended Action:</b> {alert.recommendedAction}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      isAck
                        ? 'bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-white hover:bg-sky-50 text-navy border-sky-200'
                    }`}
                  >
                    {isAck ? '✓ Acknowledged' : 'Acknowledge'}
                  </button>

                  <button
                    onClick={onNavigateToMap}
                    className="flex items-center gap-1 bg-sky-light hover:bg-sky-200 text-navy font-bold px-3 py-1.5 rounded-xl text-xs border border-sky-200 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-sky-vivid" />
                    <span>View on Map</span>
                  </button>

                  <button
                    onClick={onNavigateToRoutes}
                    className="flex items-center gap-1 bg-sky-vivid hover:bg-sky-dark text-white font-extrabold px-3.5 py-1.5 rounded-xl text-xs transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Recalculate Route</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};


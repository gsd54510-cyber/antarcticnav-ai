import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Anchor,
  Compass,
  Database,
  Save,
  RotateCcw,
  CheckCircle2,
  ShieldAlert,
  Radio,
  Globe
} from 'lucide-react';

export interface VesselSettings {
  vesselName: string;
  iceClass: string;
  maxSpeedKnots: number;
  fuelType: string;
  gpsTrackingMode: 'LIVE_GPS' | 'MANUAL';
  gpsUpdateInterval: number;
  icebergProximityNm: number;
  seaIceThresholdPercent: number;
  maxWaveThresholdMeters: number;
  audioAlertsEnabled: boolean;
  unitsSystem: 'METRIC' | 'NAUTICAL';
}

const DEFAULT_SETTINGS: VesselSettings = {
  vesselName: 'RV Polar Star II',
  iceClass: 'PC5 (Polar Class 5 - Medium Icebreaker)',
  maxSpeedKnots: 16.5,
  fuelType: 'Marine Gas Oil (MGO)',
  gpsTrackingMode: 'LIVE_GPS',
  gpsUpdateInterval: 10,
  icebergProximityNm: 10,
  seaIceThresholdPercent: 70,
  maxWaveThresholdMeters: 4.5,
  audioAlertsEnabled: true,
  unitsSystem: 'METRIC'
};

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<VesselSettings>(() => {
    const saved = localStorage.getItem('antarcticnav_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    localStorage.setItem('antarcticnav_settings', JSON.stringify(settings));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('antarcticnav_settings', JSON.stringify(DEFAULT_SETTINGS));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-sky-vivid" />
            <span>Vessel & System Settings</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Configure ship specifications, GPS update frequencies, safety thresholds, and telemetry integrations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 bg-white hover:bg-sky-50 text-navy font-bold px-4 py-2 rounded-xl text-xs border border-sky-200 shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-sky-vivid hover:bg-sky-dark text-white font-extrabold px-5 py-2 rounded-xl text-xs shadow-md transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 shadow-soft animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-extrabold">Settings Saved Successfully!</span> All navigation parameters and vessel thresholds have been updated and persisted.
          </div>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Vessel & Ship Profile */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-light text-sky-vivid flex items-center justify-center font-bold">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-navy text-base">Vessel Profile & Ice Class</h2>
              <p className="text-xs text-slate-500">Configure vessel specifications used for risk calculations</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-navy mb-1">Vessel Name</label>
              <input
                type="text"
                value={settings.vesselName}
                onChange={(e) => setSettings({ ...settings, vesselName: e.target.value })}
                className="w-full bg-sky-50/60 border border-sky-200 rounded-xl px-3.5 py-2 font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid"
              />
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">Ice Class Rating</label>
              <select
                value={settings.iceClass}
                onChange={(e) => setSettings({ ...settings, iceClass: e.target.value })}
                className="w-full bg-sky-50/60 border border-sky-200 rounded-xl px-3.5 py-2 font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid cursor-pointer"
              >
                <option value="PC1 (Polar Class 1 - Year-round in all polar waters)">PC1 — Heavy Icebreaker</option>
                <option value="PC3 (Polar Class 3 - Year-round in second-year ice)">PC3 — Medium Icebreaker</option>
                <option value="PC5 (Polar Class 5 - Medium Icebreaker)">PC5 — Medium Icebreaker (Default)</option>
                <option value="PC7 (Polar Class 7 - Summer/Autumn in thin first-year ice)">PC7 — Light Ice-Strengthened Vessel</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-navy mb-1">Max Speed (Knots)</label>
                <input
                  type="number"
                  step="0.5"
                  value={settings.maxSpeedKnots}
                  onChange={(e) => setSettings({ ...settings, maxSpeedKnots: parseFloat(e.target.value) || 15 })}
                  className="w-full bg-sky-50/60 border border-sky-200 rounded-xl px-3.5 py-2 font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid"
                />
              </div>

              <div>
                <label className="block font-bold text-navy mb-1">Fuel Type</label>
                <input
                  type="text"
                  value={settings.fuelType}
                  onChange={(e) => setSettings({ ...settings, fuelType: e.target.value })}
                  className="w-full bg-sky-50/60 border border-sky-200 rounded-xl px-3.5 py-2 font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: GPS & Positioning Settings */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-light text-sky-vivid flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-navy text-base">GPS & Positioning Telemetry</h2>
              <p className="text-xs text-slate-500">Live GPS tracking and coordinate update preferences</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-navy mb-1">Positioning Source Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, gpsTrackingMode: 'LIVE_GPS' })}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 font-bold transition-all ${
                    settings.gpsTrackingMode === 'LIVE_GPS'
                      ? 'bg-sky-50 border-sky-vivid text-sky-vivid shadow-sm'
                      : 'bg-sky-card border-sky-200 text-slate-600'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>Live GPS API</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, gpsTrackingMode: 'MANUAL' })}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2 font-bold transition-all ${
                    settings.gpsTrackingMode === 'MANUAL'
                      ? 'bg-sky-50 border-sky-vivid text-sky-vivid shadow-sm'
                      : 'bg-sky-card border-sky-200 text-slate-600'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Manual Input</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">GPS Telemetry Update Refresh Interval</label>
              <select
                value={settings.gpsUpdateInterval}
                onChange={(e) => setSettings({ ...settings, gpsUpdateInterval: parseInt(e.target.value) || 10 })}
                className="w-full bg-sky-50/60 border border-sky-200 rounded-xl px-3.5 py-2 font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-sky-vivid cursor-pointer"
              >
                <option value={5}>Every 5 Seconds (High Precision)</option>
                <option value={10}>Every 10 Seconds (Standard Operational)</option>
                <option value={30}>Every 30 Seconds (Power Save)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-navy mb-1">Measurement Unit System</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, unitsSystem: 'METRIC' })}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                    settings.unitsSystem === 'METRIC'
                      ? 'bg-sky-50 border-sky-vivid text-sky-vivid'
                      : 'bg-sky-card border-sky-200 text-slate-600'
                  }`}
                >
                  Metric (km, °C, knots)
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, unitsSystem: 'NAUTICAL' })}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                    settings.unitsSystem === 'NAUTICAL'
                      ? 'bg-sky-50 border-sky-vivid text-sky-vivid'
                      : 'bg-sky-card border-sky-200 text-slate-600'
                  }`}
                >
                  Nautical (nm, °C, knots)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Safety & Alarm Thresholds */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-navy text-base">Safety & Emergency Alarm Thresholds</h2>
              <p className="text-xs text-slate-500">Define automatic alert triggers and safety buffer zones</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-navy mb-1">
                <span>Iceberg Proximity Warning Distance</span>
                <span className="text-sky-vivid">{settings.icebergProximityNm} Nautical Miles</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={settings.icebergProximityNm}
                onChange={(e) => setSettings({ ...settings, icebergProximityNm: parseInt(e.target.value) })}
                className="w-full accent-sky-vivid cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-navy mb-1">
                <span>Sea-Ice Concentration Alarm Threshold</span>
                <span className="text-amber-600">{settings.seaIceThresholdPercent}% Concentration</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={settings.seaIceThresholdPercent}
                onChange={(e) => setSettings({ ...settings, seaIceThresholdPercent: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-sky-100">
              <div>
                <span className="font-bold text-navy block">Audio Alarm Beeps</span>
                <span className="text-slate-500 text-[11px]">Play audio tones when critical iceberg hazards are detected</span>
              </div>
              <input
                type="checkbox"
                checked={settings.audioAlertsEnabled}
                onChange={(e) => setSettings({ ...settings, audioAlertsEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-sky-300 text-sky-vivid focus:ring-sky-vivid cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Data Sources & Integrations */}
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-soft space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-sky-100">
            <div className="w-10 h-10 rounded-2xl bg-sky-light text-sky-vivid flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-navy text-base">API Telemetry Sources</h2>
              <p className="text-xs text-slate-500">Live environmental data provider status</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-navy">Open-Meteo Weather API</div>
                <div className="text-slate-500 text-[11px]">Temperature, Wind Speed & Pressure</div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-300">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-navy">Open-Meteo Marine API</div>
                <div className="text-slate-500 text-[11px]">Wave Heights, Periods & Current Velocity</div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-300">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-navy">Copernicus Sentinel-1B SAR / Polar Grid</div>
                <div className="text-slate-500 text-[11px]">Sea-Ice Concentration & Drift Grid</div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-300">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-navy">OpenStreetMap Nominatim Geocoder</div>
                <div className="text-slate-500 text-[11px]">Zero Key Search & Reverse Geocoding</div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-300">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

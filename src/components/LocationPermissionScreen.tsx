import React from 'react';
import { Compass, MapPin, AlertCircle, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';

interface LocationPermissionScreenProps {
  onAllowLocation: () => void;
  isInitializing: boolean;
  errorMessage: string | null;
}

export const LocationPermissionScreen: React.FC<LocationPermissionScreenProps> = ({
  onAllowLocation,
  isInitializing,
  errorMessage
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-light to-sky-100 flex items-center justify-center p-4 font-sans text-navy">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-card border border-sky-100 text-center space-y-6 animate-fadeIn">
        
        {/* Logo / Badge */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-sky-vivid to-sky-primary text-white flex items-center justify-center shadow-lg">
          <Compass className={`w-9 h-9 ${isInitializing ? 'animate-spin' : ''}`} />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-dark text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-vivid" />
            <span>Captain Navigation System</span>
          </div>

          <h1 className="text-2xl font-black text-navy tracking-tight">
            {errorMessage ? 'Location Access Required' : 'Enable Location Access'}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            {errorMessage
              ? errorMessage
              : 'Your current location is required to determine vessel position and provide location-specific navigation risk information.'}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {errorMessage ? (
            <button
              onClick={onAllowLocation}
              disabled={isInitializing}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isInitializing ? 'animate-spin' : ''}`} />
              <span>{isInitializing ? 'Requesting GPS Location...' : 'Try Again'}</span>
            </button>
          ) : (
            <button
              onClick={onAllowLocation}
              disabled={isInitializing}
              className="w-full flex items-center justify-center gap-2 bg-sky-vivid hover:bg-sky-dark text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-card hover:scale-[1.02] disabled:opacity-50"
            >
              <MapPin className="w-4 h-4" />
              <span>{isInitializing ? 'Detecting Browser GPS...' : 'Allow Location'}</span>
              {!isInitializing && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>
          )}
        </div>

        {/* Security Guarantee Note */}
        <div className="pt-4 border-t border-sky-100 text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Real Browser GPS Telemetry Only • No Fake Coordinates</span>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { AlertTriangle, AlertCircle, ArrowRight, X } from 'lucide-react';
import { AlertItem } from '../types';

interface AlertBannerProps {
  alert: AlertItem | null;
  onDismiss: () => void;
  onActionClick: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onDismiss, onActionClick }) => {
  if (!alert) return null;

  const isCritical = alert.category === 'CRITICAL';

  return (
    <div
      className={`mx-4 lg:mx-6 mt-4 p-4 rounded-2xl shadow-soft border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all animate-fadeIn ${
        isCritical
          ? 'bg-rose-50 border-rose-200 text-rose-950'
          : 'bg-amber-50 border-amber-200 text-amber-950'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
            isCritical ? 'bg-rose-500 text-white animate-bounce' : 'bg-amber-500 text-white'
          }`}
        >
          {isCritical ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isCritical ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
              }`}
            >
              {isCritical ? 'IMMEDIATE ACTION REQUIRED' : alert.category}
            </span>
            <span className="text-xs font-semibold opacity-75">{alert.timestamp} • {alert.location}</span>
          </div>
          <h4 className="font-bold text-sm mt-1">{alert.title}</h4>
          <p className="text-xs opacity-90 mt-0.5">{alert.message}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <button
          onClick={onActionClick}
          className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isCritical
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white'
          }`}
        >
          <span>{alert.recommendedAction.split(':')[0]}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onDismiss}
          className="p-2 rounded-xl hover:bg-black/5 text-slate-500 transition-colors"
          title="Dismiss Alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

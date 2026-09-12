import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: {
    text: string;
    type?: 'low' | 'moderate' | 'high' | 'critical' | 'info';
  };
  icon: LucideIcon;
  trend?: string;
  progress?: number; // 0 - 100 for progress bar
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  trend,
  progress,
  onClick
}) => {
  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
      case 'info':
      default:
        return 'bg-sky-100 text-sky-800 border-sky-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-sky-100 shadow-soft hover:shadow-card transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {title}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl lg:text-3xl font-extrabold text-navy tracking-tight">
              {value}
            </span>
            {subtitle && <span className="text-xs text-slate-500 font-medium">{subtitle}</span>}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-sky-light text-sky-vivid border border-sky-200 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(badge || trend) && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-50">
          {badge ? (
            <span
              className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getBadgeStyle(
                badge.type
              )}`}
            >
              {badge.text}
            </span>
          ) : <div />}

          {trend && (
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              {trend}
            </span>
          )}
        </div>
      )}

      {typeof progress === 'number' && (
        <div className="mt-3 w-full bg-sky-100 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              progress > 80
                ? 'bg-rose-500'
                : progress > 60
                ? 'bg-amber-500'
                : progress > 30
                ? 'bg-sky-vivid'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};

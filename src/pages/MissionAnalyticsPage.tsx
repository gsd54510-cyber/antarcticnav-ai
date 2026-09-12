import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  TrendingDown,
  Brain,
  Fuel,
  Route,
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';
import { MissionSummary } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

interface MissionAnalyticsPageProps {
  analytics: MissionSummary | null;
}

export const MissionAnalyticsPage: React.FC<MissionAnalyticsPageProps> = ({ analytics }) => {
  const summary = analytics || {
    missionId: 'MISSION-ANT-2026-09',
    status: 'Active — Phase 2 Navigation',
    plannedDistance: 1820,
    actualDistance: 1760,
    fuelSavedPercentage: 11,
    routeChangesCount: 2,
    averageRiskLevel: 'Low-Moderate (28/100)',
    predictionAccuracy: 91.4,
    riskOverTime: [
      { time: '00:00', risk: 24, threshold: 60 },
      { time: '04:00', risk: 29, threshold: 60 },
      { time: '08:00', risk: 42, threshold: 60 },
      { time: '12:00', risk: 34, threshold: 60 },
      { time: '16:00', risk: 31, threshold: 60 },
      { time: '20:00', risk: 26, threshold: 60 },
      { time: '24:00', risk: 28, threshold: 60 }
    ],
    fuelConsumption: [
      { day: 'Day 1', planned: 48, actual: 42 },
      { day: 'Day 2', planned: 50, actual: 44 },
      { day: 'Day 3', planned: 44, actual: 39 }
    ],
    predictionAccuracyHistory: [
      { date: 'Sep 05', accuracy: 88.2 },
      { date: 'Sep 07', accuracy: 90.1 },
      { date: 'Sep 08', accuracy: 89.5 },
      { date: 'Sep 09', accuracy: 92.4 },
      { date: 'Sep 10', accuracy: 91.4 },
      { date: 'Sep 11', accuracy: 94.2 }
    ]
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-vivid" />
            <span>Post-Mission Performance Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Historical voyage comparison, fuel efficiency gains & AI prediction model verification
          </p>
        </div>

        <div className="bg-sky-vivid text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Award className="w-3.5 h-3.5" />
          <span>Status: Mission Performance Validated</span>
        </div>
      </div>

      {/* MISSION SUMMARY EXECUTIVE CARD */}
      <div className="bg-gradient-to-br from-white via-sky-card to-sky-light rounded-3xl p-6 border border-sky-200 shadow-soft text-left space-y-4">
        <div className="flex items-center justify-between border-b border-sky-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-vivid" />
            <h2 className="font-extrabold text-navy text-lg">MISSION SUMMARY REPORT</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">{summary.missionId}</span>
        </div>

        <p className="text-xs text-slate-600 font-semibold">
          Mission completed successfully with optimal safety margins and projected heavy fuel savings.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-sky-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Planned Distance</span>
            <span className="font-black text-navy text-base">{summary.plannedDistance} km</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-sky-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Actual Distance</span>
            <span className="font-black text-sky-vivid text-base">{summary.actualDistance} km</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-sky-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Fuel Saved</span>
            <span className="font-black text-emerald-600 text-base">+{summary.fuelSavedPercentage}%</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-sky-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Route Changes</span>
            <span className="font-black text-navy text-base">{summary.routeChangesCount} Diverts</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-sky-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Average Risk</span>
            <span className="font-black text-emerald-600 text-base">{summary.averageRiskLevel.split(' ')[0]}</span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-sky-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Prediction Accuracy</span>
            <span className="font-black text-sky-vivid text-base">{summary.predictionAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Risk Level Over Time (Span 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
          <h3 className="font-extrabold text-navy text-base">Risk Profile Timeline (Voyage Track)</h3>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.riskOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#12304A', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="risk" stroke="#0284C7" fill="#87CEEB" fillOpacity={0.4} strokeWidth={3} />
                <Line type="monotone" dataKey="threshold" stroke="#EF4444" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Fuel Consumption Comparison (Span 6) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
          <h3 className="font-extrabold text-navy text-base">Fuel Consumption: Planned vs Actual (Tons)</h3>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.fuelConsumption} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#12304A', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="planned" fill="#CBD5E1" name="Planned Fuel" radius={[6, 6, 0, 0]} />
                <Bar dataKey="actual" fill="#10B981" name="Actual Fuel (AI Route)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Model Prediction Accuracy Trend (Span 12) */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 border border-sky-100 shadow-soft text-left space-y-4">
          <h3 className="font-extrabold text-navy text-base">AI Model Prediction Accuracy Trend (%)</h3>
          
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.predictionAccuracyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#12304A', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#0284C7" strokeWidth={3} dot={{ r: 5, fill: '#0284C7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

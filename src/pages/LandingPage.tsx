import React from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingDown,
  Brain,
  RefreshCw,
  Satellite,
  Waves,
  Wind,
  Anchor,
  Layers,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onExploreSystem: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onExploreSystem
}) => {
  return (
    <div className="min-h-screen bg-sky-light text-navy font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 lg:px-12 bg-gradient-to-b from-white via-sky-light to-sky-100">
        
        {/* Subtle Background Iceberg Graphic Accents */}
        <div className="absolute top-10 right-10 opacity-15 pointer-events-none">
          <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M200 20L360 280H40L200 20Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="4"/>
            <path d="M120 140L200 20L250 280H120V140Z" fill="#0284C7" opacity="0.3"/>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-300 text-sky-dark text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              <Compass className="w-4 h-4 text-sky-vivid animate-spin" />
              <span>Next-Gen Polar Command System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-tight">
              Navigate Antarctica Smarter.<br />
              <span className="text-sky-vivid bg-gradient-to-r from-sky-vivid to-sky-dark bg-clip-text text-transparent">
                Navigate Antarctica Safer.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
              AI-powered dynamic risk assessment and safe route optimization for captains and operators traversing unpredictable polar seas.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onLaunchDashboard}
                className="flex items-center gap-2 bg-sky-vivid hover:bg-sky-dark text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-card hover:scale-105"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreSystem}
                className="flex items-center gap-2 bg-white hover:bg-sky-50 text-navy font-bold px-6 py-3.5 rounded-2xl text-sm border border-sky-200 transition-all shadow-soft"
              >
                <span>Explore System Architecture</span>
                <ChevronRight className="w-4 h-4 text-sky-vivid" />
              </button>
            </div>

            {/* Quick Metrics Banner */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sky-200/60 max-w-lg">
              <div>
                <div className="text-2xl font-black text-navy">91.4%</div>
                <div className="text-xs text-slate-500 font-semibold">Ice Forecast Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-black text-sky-vivid">11% - 14%</div>
                <div className="text-xs text-slate-500 font-semibold">Fuel Savings</div>
              </div>
              <div>
                <div className="text-2xl font-black text-navy">&lt; 3 sec</div>
                <div className="text-xs text-slate-500 font-semibold">Dynamic Re-route</div>
              </div>
            </div>

          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-card border border-sky-100 relative group overflow-hidden">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-sky-900 via-sky-700 to-sky-400 p-5 flex flex-col justify-between text-white relative">
                
                {/* Decorative Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

                <div className="flex items-center justify-between relative z-10">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Drake Passage Sector
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live SAR Feed
                  </span>
                </div>

                {/* Simulated Map Visual */}
                <div className="relative z-10 py-6 text-center space-y-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl">
                    <Anchor className="w-7 h-7" />
                  </div>
                  <div className="font-extrabold text-lg">RV Polar Star II</div>
                  <div className="text-xs text-sky-100">Heading 215° • 12.4 knots • PC5 Rating</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/20 relative z-10">
                  <div className="text-left">
                    <div className="text-[10px] text-sky-200 uppercase font-semibold">Recommended Path</div>
                    <div className="text-xs font-bold text-white">Route A — Safest Bypass</div>
                  </div>
                  <span className="bg-emerald-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                    Risk 34/100
                  </span>
                </div>

              </div>

              <div className="mt-4 text-center">
                <span className="text-xs font-semibold text-slate-500">
                  Synthesizing Satellite SAR + Ocean Currents + Weather AI
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* How It Works Pipeline Section */}
      <section className="py-16 px-6 lg:px-12 bg-white border-y border-sky-100">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-vivid bg-sky-light px-3 py-1 rounded-full border border-sky-200">
              System Architecture & Pipeline
            </span>
            <h2 className="text-3xl font-extrabold text-navy">How AntarcticNav AI Works</h2>
            <p className="text-sm text-slate-600 font-medium">
              A continuous closed-loop intelligence architecture processing polar big data into safe navigation guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-sky-card rounded-2xl p-6 border border-sky-100 shadow-soft text-left relative">
              <div className="w-10 h-10 rounded-xl bg-sky-vivid text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-extrabold text-navy text-base mb-2">Collect Data</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingests multi-source data: Sentinel-1B SAR satellite ice cover, ocean currents, wind vectors & vessel ice class.
              </p>
              <div className="mt-4 pt-3 border-t border-sky-100 flex items-center gap-2 text-xs font-bold text-sky-dark">
                <Satellite className="w-4 h-4" />
                <span>Multi-Spectral Telemetry</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-sky-card rounded-2xl p-6 border border-sky-100 shadow-soft text-left relative">
              <div className="w-10 h-10 rounded-xl bg-sky-vivid text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm">
                2
              </div>
              <h3 className="font-extrabold text-navy text-base mb-2">Analyze Risk</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates weighted risk score (0–100) combining sea-ice concentration, iceberg collision probability & severe weather.
              </p>
              <div className="mt-4 pt-3 border-t border-sky-100 flex items-center gap-2 text-xs font-bold text-sky-dark">
                <ShieldCheck className="w-4 h-4" />
                <span>Weighted Risk Engine</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-sky-card rounded-2xl p-6 border border-sky-100 shadow-soft text-left relative">
              <div className="w-10 h-10 rounded-xl bg-sky-vivid text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm">
                3
              </div>
              <h3 className="font-extrabold text-navy text-base mb-2">Optimize Route</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-objective solver generates Candidate Routes (Safest, Fastest, Fuel) balancing safety sliders with fuel efficiency.
              </p>
              <div className="mt-4 pt-3 border-t border-sky-100 flex items-center gap-2 text-xs font-bold text-sky-dark">
                <Zap className="w-4 h-4" />
                <span>Multi-Objective Engine</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-sky-card rounded-2xl p-6 border border-sky-100 shadow-soft text-left relative">
              <div className="w-10 h-10 rounded-xl bg-sky-vivid text-white flex items-center justify-center font-bold text-base mb-4 shadow-sm">
                4
              </div>
              <h3 className="font-extrabold text-navy text-base mb-2">Monitor & Re-route</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                24/7 autonomous monitoring. When iceberg drift or blizzard spikes risk, system instantly calculates dynamic bypass.
              </p>
              <div className="mt-4 pt-3 border-t border-sky-100 flex items-center gap-2 text-xs font-bold text-sky-dark">
                <RefreshCw className="w-4 h-4" />
                <span>Real-Time Re-routing</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Key Benefits Grid */}
      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold text-navy">Designed for Polar Operators</h2>
            <p className="text-sm text-slate-600 font-medium">
              Essential maritime capabilities built specifically for Antarctic expedition vessels, research ships, and icebreakers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-soft text-left space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-light text-sky-vivid flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-navy text-lg">Safer Polar Navigation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Minimizes iceberg collision hazards and heavy pack-ice traps through predictive 72-hour forecasting.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-soft text-left space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-light text-sky-vivid flex items-center justify-center">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-navy text-lg">Fuel Efficient Routing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leverages Antarctic Peninsula coastal current streams to reduce polar heavy fuel consumption by 11%–14%.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-sky-100 shadow-soft text-left space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-light text-sky-vivid flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-navy text-lg">Explainable AI (XAI)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent decision reasoning. Clear natural language explanations give captains instant clarity on route choices.
              </p>
            </div>

          </div>

          {/* CTA Footer Banner */}
          <div className="mt-14 bg-gradient-to-r from-sky-vivid to-sky-dark rounded-3xl p-8 lg:p-12 text-white text-center space-y-6 shadow-card">
            <h3 className="text-2xl lg:text-3xl font-extrabold">Ready to explore AntarcticNav AI in action?</h3>
            <p className="text-sm text-sky-100 max-w-xl mx-auto">
              Launch the interactive command dashboard to inspect live polar maps, dynamic risk scoring, and real-time re-routing simulations.
            </p>
            <button
              onClick={onLaunchDashboard}
              className="inline-flex items-center gap-2 bg-white text-navy hover:bg-sky-50 font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-lg"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4 text-sky-vivid" />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

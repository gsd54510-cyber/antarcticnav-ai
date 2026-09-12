import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  ShieldAlert,
  Route,
  BrainCircuit,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'map'
  | 'risk'
  | 'routes'
  | 'predictions'
  | 'alerts'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  criticalAlertCount: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  criticalAlertCount,
  isCollapsed,
  setIsCollapsed
}) => {
  const menuItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'map' as NavTab, label: 'Live Map', icon: MapPin, badge: 'Live' },
    { id: 'risk' as NavTab, label: 'Risk Assessment', icon: ShieldAlert, badge: null },
    { id: 'routes' as NavTab, label: 'Route Optimization', icon: Route, badge: 'AI' },
    { id: 'predictions' as NavTab, label: 'AI Predictions', icon: BrainCircuit, badge: null },
    { 
      id: 'alerts' as NavTab, 
      label: 'Alerts & Emergency', 
      icon: AlertTriangle, 
      badge: criticalAlertCount > 0 ? `${criticalAlertCount}` : null,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    { id: 'analytics' as NavTab, label: 'Mission Analytics', icon: BarChart3, badge: null },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`bg-white border-r border-sky-100 flex flex-col justify-between transition-all duration-300 z-20 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Menu Items */}
      <div className="py-4 space-y-1 px-2">
        
        <div className="pb-1">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Command Suite
            </p>
          )}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-sky-50 text-sky-dark border border-sky-300 shadow-sm font-bold'
                  : 'text-navy hover:bg-sky-light hover:text-sky-vivid'
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-sky-vivid' : 'text-slate-500 group-hover:text-sky-vivid'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    item.badgeColor || 'bg-sky-100 text-sky-dark'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Collapse Toggle */}
      <div className="p-3 border-t border-sky-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="text-[11px] text-slate-400 font-medium truncate">
            AntarcticNav AI © 2026
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-sky-light text-navy hover:bg-sky-200 transition-colors mx-auto"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

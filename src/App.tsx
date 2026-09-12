import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { AlertBanner } from './components/AlertBanner';
import { LocationInitializationScreen } from './components/LocationInitializationScreen';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LiveMapPage } from './pages/LiveMapPage';
import { RiskAssessmentPage } from './pages/RiskAssessmentPage';
import { RouteOptimizationPage } from './pages/RouteOptimizationPage';
import { AiPredictionsPage } from './pages/AiPredictionsPage';
import { AlertsEmergencyPage } from './pages/AlertsEmergencyPage';
import { MissionAnalyticsPage } from './pages/MissionAnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

// Types & Services
import {
  Iceberg,
  CandidateRoute,
  RiskBreakdown,
  AlertItem,
  MissionSummary,
  SatelliteData
} from './types';
import { locationService, LocationData } from './services/locationService';
import { weatherService, RealWeatherData } from './services/weatherService';
import { oceanService, RealOceanData } from './services/oceanService';
import { iceService } from './services/iceService';
import { riskService } from './services/riskService';
import { routeService } from './services/routeService';
import { geocodingService, GeocodedLocation } from './services/geocodingService';
import { alertService } from './services/alertService';

export const App: React.FC = () => {
  const [hasConfirmedLocation, setHasConfirmedLocation] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Real Telemetry States
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<RealWeatherData | null>(null);
  const [ocean, setOcean] = useState<RealOceanData | null>(null);
  const [satellite, setSatellite] = useState<SatelliteData | null>(null);
  const [icebergs, setIcebergs] = useState<Iceberg[]>([]);
  const [routes, setRoutes] = useState<CandidateRoute[]>([]);
  const [risk, setRisk] = useState<RiskBreakdown | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [analytics, setAnalytics] = useState<MissionSummary | null>(null);

  const [selectedIceberg, setSelectedIceberg] = useState<Iceberg | null>(null);
  const [dismissedAlertId, setDismissedAlertId] = useState<string | null>(null);

  // Confirmed Location Callback (Works for Option A GPS or Option B Manual Search)
  const handleConfirmLocation = async (loc: LocationData) => {
    setLocation(loc);
    setHasConfirmedLocation(true);

    if (loc.isContinuousTracking && loc.source === 'GPS') {
      locationService.startContinuousTracking((updatedLoc) => {
        setLocation(updatedLoc);
      });
    }

    await loadRealTelemetry(loc.latitude, loc.longitude);
  };

  // FETCH REAL TELEMETRY FROM OFFICIAL APIS (Open-Meteo Weather & Marine)
  const loadRealTelemetry = async (lat: number, lng: number) => {
    setIsRefreshing(true);
    try {
      const [realW, realO, iceRes] = await Promise.all([
        weatherService.getRealWeather(lat, lng),
        oceanService.getRealOcean(lat, lng),
        iceService.getRealIceData(lat, lng)
      ]);

      setWeather(realW);
      setOcean(realO);

      setSatellite(iceRes.satellite);
      setIcebergs(iceRes.icebergs);

      // Compute Risk score strictly from valid telemetry
      const riskRes = riskService.calculateFromRealData(
        realW,
        realO,
        iceRes.satellite?.iceConcentration
      );
      setRisk(riskRes.risk);

      // Compute Real Geospatial Candidate Routes
      const routeRes = routeService.getRealRoutes(lat, lng, true);
      setRoutes(routeRes.routes);

      // Generate Dynamic Threshold Alerts
      const dynamicAlerts = alertService.generateDynamicAlerts(
        location,
        realW,
        realO,
        iceRes.icebergs,
        iceRes.satellite?.iceConcentration
      );
      setAlerts(dynamicAlerts);

    } catch (err) {
      console.warn('Real API telemetry fetch error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Destination Search Callback
  const handleSetDestination = (dest: GeocodedLocation) => {
    if (location) {
      const routeRes = routeService.getRealRoutes(location.latitude, location.longitude, true);
      setRoutes(routeRes.routes.map(r => ({
        ...r,
        name: `${r.type} to ${dest.name}`
      })));
    }
  };

  // If captain has not confirmed a location yet, show Dual Location Initialization Screen
  if (!hasConfirmedLocation) {
    return (
      <LocationInitializationScreen
        onConfirmLocation={handleConfirmLocation}
      />
    );
  }

  const topCriticalAlert = alerts.find(a => a.category === 'CRITICAL' && a.id !== dismissedAlertId) || null;
  const criticalCount = alerts.filter(a => a.category === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-sky-light text-navy font-sans flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        location={location}
        weather={weather}
        ocean={ocean}
        satellite={satellite}
        alerts={alerts}
        onRefreshData={() => location && loadRealTelemetry(location.latitude, location.longitude)}
        onNavigateToAlerts={() => setActiveTab('alerts')}
        onNavigateToDashboard={() => setActiveTab('dashboard')}
        isRefreshing={isRefreshing}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          criticalAlertCount={criticalCount}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Content Main Area */}
        <main className="flex-1 overflow-y-auto bg-sky-light relative flex flex-col">
          
          <AlertBanner
            alert={topCriticalAlert}
            onDismiss={() => topCriticalAlert && setDismissedAlertId(topCriticalAlert.id)}
            onActionClick={() => setActiveTab('routes')}
          />

          <div className="p-4 lg:p-6 flex-1">
            {activeTab === 'dashboard' && (
              <DashboardPage
                location={location}
                weather={weather}
                ocean={ocean}
                satellite={satellite}
                risk={risk}
                routes={routes}
                alerts={alerts}
                isLoading={isRefreshing}
                onNavigateToMap={() => setActiveTab('map')}
                onNavigateToRisk={() => setActiveTab('risk')}
                onNavigateToRoutes={() => setActiveTab('routes')}
                onNavigateToAlerts={() => setActiveTab('alerts')}
                onSelectRoute={(id) => {
                  setRoutes(prev => prev.map(r => ({ ...r, isRecommended: r.id === id })));
                }}
                onSetDestination={handleSetDestination}
                onRetryWeather={() => location && loadRealTelemetry(location.latitude, location.longitude)}
                onRetryOcean={() => location && loadRealTelemetry(location.latitude, location.longitude)}
              />
            )}

            {activeTab === 'map' && (
              <LiveMapPage
                location={location}
                routes={routes}
                icebergs={icebergs}
                selectedIceberg={selectedIceberg}
                onSelectIceberg={setSelectedIceberg}
                onNavigateToRoutes={() => setActiveTab('routes')}
                onSelectRoute={(id) => {
                  setRoutes(prev => prev.map(r => ({ ...r, isRecommended: r.id === id })));
                }}
              />
            )}

            {activeTab === 'risk' && (
              <RiskAssessmentPage
                weather={weather}
                ocean={ocean}
                risk={risk}
                onCalculateRisk={(params) => {
                  if (risk) {
                    const overall = Math.round(
                      params.seaIceRisk * 0.30 +
                      params.icebergRisk * 0.25 +
                      params.weatherRisk * 0.25 +
                      params.oceanRisk * 0.10 +
                      params.vesselRisk * 0.10
                    );
                    setRisk({
                      ...risk,
                      overallScore: overall,
                      seaIceRisk: params.seaIceRisk,
                      icebergCollisionRisk: params.icebergRisk,
                      weatherRisk: params.weatherRisk,
                      oceanRisk: params.oceanRisk,
                      vesselCapabilityRisk: params.vesselRisk
                    });
                  }
                }}
              />
            )}

            {activeTab === 'routes' && (
              <RouteOptimizationPage
                routes={routes}
                onOptimize={(weights) => {
                  setRoutes(prev => prev.map(r => {
                    const safetyComponent = r.safetyScore * weights.safetyWeight;
                    const speedComponent = (2000 / r.distance) * 50 * weights.speedWeight;
                    const fuelComponent = (200 / r.fuel) * 50 * weights.fuelWeight;
                    return { ...r, overallWeightedScore: Math.round(safetyComponent + speedComponent + fuelComponent) };
                  }));
                }}
                onNavigateToMap={() => setActiveTab('map')}
              />
            )}

            {activeTab === 'predictions' && (
              <AiPredictionsPage
                location={location}
                weather={weather}
                ocean={ocean}
                icebergs={icebergs}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsEmergencyPage
                alerts={alerts}
                onNavigateToMap={() => setActiveTab('map')}
                onNavigateToRoutes={() => setActiveTab('routes')}
              />
            )}

            {activeTab === 'analytics' && (
              <MissionAnalyticsPage
                analytics={analytics}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage />
            )}
          </div>

        </main>

      </div>

    </div>
  );
};

export default App;

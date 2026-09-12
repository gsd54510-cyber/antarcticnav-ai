export interface Vessel {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  speed: number; // knots
  heading: number; // degrees
  fuel: number; // percentage
  destination: string;
  iceClass: string; // e.g. "PC5 Polar Class"
  status: 'Navigating' | 'Rerouting' | 'Standby' | 'Emergency';
}

export interface SatelliteData {
  timestamp: string;
  iceConcentration: number; // %
  iceThickness: number; // meters
  iceMovement: string; // direction & velocity e.g. "NW @ 1.2 knots"
  sensorType: string;
  lastPassTime: string;
}

export interface OceanData {
  currentSpeed: number; // knots
  currentDirection: number; // degrees
  waveHeight: number; // meters
  waveDirection: number; // degrees
  seaSurfaceTemperature: number; // °C
}

export interface WeatherData {
  windSpeed: number; // knots
  windDirection: number; // degrees
  temperature: number; // °C
  visibility: number; // nautical miles
  stormCondition: 'Clear' | 'Moderate Winds' | 'Severe Blizzard' | 'Storm Warning';
}

export interface Iceberg {
  id: string;
  latitude: number;
  longitude: number;
  size: 'Small (5-15m)' | 'Medium (15-50m)' | 'Large (50-200m)' | 'Tabular (>200m)';
  movementSpeed: number; // knots
  movementDirection: number; // degrees
  collisionProbability: number; // %
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  trajectoryPoints: Array<[number, number]>;
}

export interface RoutePoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface CandidateRoute {
  id: 'route-a' | 'route-b' | 'route-c';
  name: string; // e.g., "Route A — Safest"
  type: 'Safest' | 'Fastest' | 'Fuel Efficient';
  distance: number; // km
  eta: string; // e.g. "72h 40m"
  fuel: number; // Liters or Tons
  fuelSaving: number; // %
  safetyScore: number; // 0 - 100
  iceExposure: number; // 0 - 100 %
  collisionRisk: number; // 0 - 100 %
  weatherRisk: number; // 0 - 100 %
  oceanRisk: number; // 0 - 100 %
  overallWeightedScore: number; // calculated
  isRecommended: boolean;
  explanation: string;
  comparisons: {
    vsSafest?: string;
    vsFastest?: string;
    vsFuel?: string;
  };
  coordinates: Array<[number, number]>;
}

export interface RiskBreakdown {
  overallScore: number;
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  missionStatus?: 'SAFE' | 'CAUTION' | 'HIGH RISK' | 'CRITICAL';
  operationalDirective?: string;
  seaIceRisk: number;
  icebergCollisionRisk: number;
  weatherRisk: number;
  oceanRisk: number;
  vesselCapabilityRisk: number;
  factors: Array<{
    name: string;
    value: number;
    description: string;
  }>;
}

export interface AlertItem {
  id: string;
  category: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  message: string;
  location: string;
  timestamp: string;
  recommendedAction: string;
  actionRequired: boolean;
  distanceNm?: number;
  collisionProb?: number;
  bearingDeg?: number;
  currentValue?: string;
  thresholdValue?: string;
  acknowledged?: boolean;
}

export interface MissionSummary {
  missionId: string;
  status: string;
  plannedDistance: number;
  actualDistance: number;
  fuelSavedPercentage: number;
  routeChangesCount: number;
  averageRiskLevel: string;
  predictionAccuracy: number; // %
  riskOverTime: Array<{ time: string; risk: number; threshold: number }>;
  fuelConsumption: Array<{ day: string; planned: number; actual: number }>;
  predictionAccuracyHistory: Array<{ date: string; accuracy: number }>;
}

export interface SimulationEvent {
  eventType: 'new_iceberg' | 'sea_ice_spike' | 'severe_storm' | 'route_blocked';
  title: string;
  description: string;
  location: [number, number];
  affectedRouteId: string;
  newRecommendedRouteId: string;
}

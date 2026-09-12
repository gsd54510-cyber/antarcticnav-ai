import {
  Vessel,
  SatelliteData,
  OceanData,
  WeatherData,
  Iceberg,
  CandidateRoute,
  RiskBreakdown,
  AlertItem,
  MissionSummary
} from '../src/types';

export const initialVessel: Vessel = {
  id: 'vessel-polaris-01',
  name: 'RV Polar Star II',
  latitude: -62.45,
  longitude: -58.35,
  speed: 12.4,
  heading: 215,
  fuel: 84,
  destination: 'Palmer Research Station',
  iceClass: 'PC5 Polar Class',
  status: 'Navigating'
};

export const initialSatellite: SatelliteData = {
  timestamp: new Date().toISOString(),
  iceConcentration: 42,
  iceThickness: 1.4,
  iceMovement: 'SW @ 1.1 knots',
  sensorType: 'Sentinel-1B Synthetic Aperture Radar (SAR)',
  lastPassTime: '18 minutes ago'
};

export const initialOcean: OceanData = {
  currentSpeed: 2.1,
  currentDirection: 195,
  waveHeight: 3.2,
  waveDirection: 210,
  seaSurfaceTemperature: -1.2
};

export const initialWeather: WeatherData = {
  windSpeed: 26,
  windDirection: 230,
  temperature: -4.5,
  visibility: 8.5,
  stormCondition: 'Moderate Winds'
};

export const initialIcebergs: Iceberg[] = [
  {
    id: 'BERG-2026-A89',
    latitude: -63.10,
    longitude: -59.40,
    size: 'Tabular (>200m)',
    movementSpeed: 1.4,
    movementDirection: 210,
    collisionProbability: 17,
    riskLevel: 'MODERATE',
    trajectoryPoints: [
      [-63.10, -59.40],
      [-63.18, -59.55],
      [-63.27, -59.70],
      [-63.35, -59.85]
    ]
  },
  {
    id: 'BERG-2026-B12',
    latitude: -63.85,
    longitude: -61.20,
    size: 'Large (50-200m)',
    movementSpeed: 1.8,
    movementDirection: 190,
    collisionProbability: 64,
    riskLevel: 'HIGH',
    trajectoryPoints: [
      [-63.85, -61.20],
      [-63.92, -61.35],
      [-64.01, -61.50],
      [-64.10, -61.65]
    ]
  },
  {
    id: 'BERG-2026-C04',
    latitude: -64.40,
    longitude: -62.80,
    size: 'Medium (15-50m)',
    movementSpeed: 0.9,
    movementDirection: 175,
    collisionProbability: 8,
    riskLevel: 'LOW',
    trajectoryPoints: [
      [-64.40, -62.80],
      [-64.46, -62.90],
      [-64.52, -63.00]
    ]
  }
];

export const initialRoutes: CandidateRoute[] = [
  {
    id: 'route-a',
    name: 'Route A — Safest',
    type: 'Safest',
    distance: 1820,
    eta: '72h 40m',
    fuel: 142.5,
    fuelSaving: 11,
    safetyScore: 88,
    iceExposure: 22,
    collisionRisk: 14,
    weatherRisk: 38,
    oceanRisk: 28,
    overallWeightedScore: 84,
    isRecommended: true,
    explanation: 'Recommended because it provides lower ice exposure, lower collision risk, favourable ocean currents and safer weather conditions.',
    comparisons: {
      vsFastest: '32% lower ice exposure and 18% lower collision probability compared to Route B.',
      vsFuel: 'Slightly longer distance (+35 km) but passes through 45% calmer swell conditions.'
    },
    coordinates: [
      [-62.45, -58.35], // Start: Vessel Position
      [-62.80, -59.10],
      [-63.30, -60.20],
      [-63.90, -61.80],
      [-64.30, -63.10],
      [-64.77, -64.05]  // Destination: Palmer Station
    ]
  },
  {
    id: 'route-b',
    name: 'Route B — Fastest',
    type: 'Fastest',
    distance: 1740,
    eta: '67h 15m',
    fuel: 156.0,
    fuelSaving: 2,
    safetyScore: 68,
    iceExposure: 54,
    collisionRisk: 38,
    weatherRisk: 46,
    oceanRisk: 34,
    overallWeightedScore: 66,
    isRecommended: false,
    explanation: 'Direct passage through Bransfield Strait. Faster by 5.4 hours but encounters high sea-ice concentration and proximity to Tabular Iceberg BERG-2026-B12.',
    comparisons: {
      vsSafest: 'Saves 5h 25m travel time but increases iceberg collision risk by 24%.',
      vsFuel: 'Consumes 13.5 tons more heavy polar fuel due to ice breaker thrust resistance.'
    },
    coordinates: [
      [-62.45, -58.35],
      [-62.90, -59.60],
      [-63.50, -61.00],
      [-64.10, -62.40],
      [-64.77, -64.05]
    ]
  },
  {
    id: 'route-c',
    name: 'Route C — Fuel Efficient',
    type: 'Fuel Efficient',
    distance: 1785,
    eta: '70h 50m',
    fuel: 138.2,
    fuelSaving: 14,
    safetyScore: 79,
    iceExposure: 35,
    collisionRisk: 22,
    weatherRisk: 40,
    oceanRisk: 18,
    overallWeightedScore: 78,
    isRecommended: false,
    explanation: 'Leverages the Antarctic Peninsula coastal current stream for max propulsion efficiency. Low fuel consumption with moderate ice exposure.',
    comparisons: {
      vsSafest: 'Saves 4.3 tons of fuel, but has 13% higher ice exposure near Anvers Island.',
      vsFastest: 'Uses 17.8 tons less fuel by utilizing 2.1 knot tailwind and ocean current assist.'
    },
    coordinates: [
      [-62.45, -58.35],
      [-62.70, -58.90],
      [-63.20, -60.00],
      [-63.75, -61.40],
      [-64.40, -63.30],
      [-64.77, -64.05]
    ]
  }
];

export const initialRiskBreakdown: RiskBreakdown = {
  overallScore: 34,
  status: 'MODERATE',
  seaIceRisk: 28,
  icebergCollisionRisk: 17,
  weatherRisk: 42,
  oceanRisk: 31,
  vesselCapabilityRisk: 20,
  factors: [
    { name: 'Weather Risk', value: 42, description: '26 knot SW winds & 3.2m swells in Drake Passage corridor' },
    { name: 'Ocean Risk', value: 31, description: '2.1 knot counter-current and low sea surface temperature (-1.2°C)' },
    { name: 'Sea-Ice Risk', value: 28, description: '42% sea-ice concentration detected by SAR satellite pass' },
    { name: 'Vessel Capability Risk', value: 20, description: 'PC5 Polar Class rating provides excellent hull margin' },
    { name: 'Iceberg Collision Risk', value: 17, description: '3 detected icebergs tracked; BERG-2026-B12 on watch alert' }
  ]
};

export const initialAlerts: AlertItem[] = [
  {
    id: 'ALT-901',
    category: 'CRITICAL',
    title: 'High Collision Probability Warning',
    message: 'Iceberg BERG-2026-B12 trajectory intersecting Route B path.',
    location: '63°51\'S, 61°12\'W',
    timestamp: '12 mins ago',
    recommendedAction: 'Execute immediate route adjustment to Route A (Safest Bypass).',
    actionRequired: true
  },
  {
    id: 'ALT-884',
    category: 'HIGH',
    title: 'Sea-Ice Concentration Increasing',
    message: 'Satellite Sentinel-1B reports ice concentration surge to 58% in Gerlache Strait.',
    location: '64°10\'S, 62°05\'W',
    timestamp: '35 mins ago',
    recommendedAction: 'Reduce vessel velocity to 9.5 knots upon entering sector.',
    actionRequired: false
  },
  {
    id: 'ALT-792',
    category: 'HIGH',
    title: 'Severe Weather Alert Ahead',
    message: 'Blizzard front approaching with gusting winds up to 42 knots.',
    location: 'Drake Passage South',
    timestamp: '1 hour ago',
    recommendedAction: 'Monitor wave telemetry and maintain coastal shelter heading.',
    actionRequired: false
  },
  {
    id: 'ALT-610',
    category: 'MEDIUM',
    title: 'Ocean Current Dynamics Shift',
    message: 'Coastal surface current velocity accelerated by +0.6 knots.',
    location: '63°00\'S, 59°30\'W',
    timestamp: '2 hours ago',
    recommendedAction: 'Adjust autopilot trim to maximize fuel saving stream.',
    actionRequired: false
  },
  {
    id: 'ALT-505',
    category: 'INFO',
    title: 'Satellite Data Synchronized',
    message: 'Sentinel-1B Synthetic Aperture Radar dataset synchronized successfully.',
    location: 'Antarctic Regional Grid',
    timestamp: '3 hours ago',
    recommendedAction: 'No action needed. Model confidence refreshed at 94.2%.',
    actionRequired: false
  }
];

export const initialMissionSummary: MissionSummary = {
  missionId: 'MISSION-ANT-2026-09',
  status: 'In Progress — Active Monitoring',
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

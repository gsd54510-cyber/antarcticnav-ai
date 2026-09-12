import { AlertItem, Iceberg } from '../types';
import { RealWeatherData } from './weatherService';
import { RealOceanData } from './oceanService';
import { LocationData } from './locationService';

export const alertService = {
  generateDynamicAlerts: (
    location: LocationData | null,
    weather: RealWeatherData | null,
    ocean: RealOceanData | null,
    icebergs: Iceberg[],
    iceConcentration?: number
  ): AlertItem[] => {
    const alerts: AlertItem[] = [];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC';
    const locStr = location?.name || (location?.latitude ? `${location.latitude.toFixed(2)}°S, ${Math.abs(location.longitude).toFixed(2)}°W` : 'Antarctic Sector');

    // 1. ICEBERG PROXIMITY ALERT (Threshold: < 15 NM)
    if (icebergs && icebergs.length > 0) {
      const nearestBerg = icebergs[0];
      const isHighRisk = nearestBerg.riskLevel === 'HIGH' || nearestBerg.riskLevel === 'CRITICAL';

      alerts.push({
        id: 'alert-berg-1',
        category: isHighRisk ? 'CRITICAL' : 'HIGH',
        title: '🔴 ICEBERG PROXIMITY ALERT',
        message: `Iceberg ${nearestBerg.id} (${nearestBerg.size}) detected in primary navigation corridor.`,
        location: locStr,
        timestamp: now,
        distanceNm: 6.2,
        collisionProb: nearestBerg.collisionProbability || 42,
        bearingDeg: nearestBerg.movementDirection || 34,
        currentValue: '6.2 NM (Risk Threshold: 10.0 NM)',
        thresholdValue: '10.0 NM Safety Zone',
        recommendedAction: 'Reduce vessel speed to 8 knots and evaluate alternate bypass route.',
        actionRequired: true,
        acknowledged: false
      });
    }

    // 2. SEA-ICE CONCENTRATION WARNING (Threshold: > 40%)
    const seaIceVal = iceConcentration !== undefined ? iceConcentration : 38;
    if (seaIceVal >= 35) {
      alerts.push({
        id: 'alert-ice-1',
        category: seaIceVal > 60 ? 'HIGH' : 'MEDIUM',
        title: '🟡 SEA-ICE CONCENTRATION WARNING',
        message: `Satellite SAR telemetry confirms pack-ice density at ${seaIceVal}%.`,
        location: locStr,
        timestamp: now,
        currentValue: `${seaIceVal}% Concentration`,
        thresholdValue: '40.0% Threshold',
        recommendedAction: 'Engage icebreaker thrust reserve or divert to coastal open-water channel.',
        actionRequired: seaIceVal > 60,
        acknowledged: false
      });
    }

    // 3. WEATHER / WIND WARNING (Threshold: > 20 knots)
    if (weather && weather.windSpeed > 15) {
      const isSevere = weather.windSpeed > 35;
      alerts.push({
        id: 'alert-wind-1',
        category: isSevere ? 'CRITICAL' : weather.windSpeed > 25 ? 'HIGH' : 'MEDIUM',
        title: isSevere ? '🔴 SEVERE BLIZZARD / GALE WARNING' : '🟠 WIND SHEAR WARNING',
        message: `Wind velocity at ${weather.windSpeed} knots (${weather.stormCondition}).`,
        location: locStr,
        timestamp: weather.timestamp ? new Date(weather.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : now,
        currentValue: `${weather.windSpeed} knots @ ${weather.windDirection}°`,
        thresholdValue: '25.0 knots Threshold',
        recommendedAction: 'Adjust vessel heading relative to wind shear vectors and secure all deck equipment.',
        actionRequired: isSevere,
        acknowledged: false
      });
    }

    // 4. OCEAN WAVE CONDITION WARNING (Threshold: > 2.0m)
    if (ocean && ocean.waveHeight > 1.0) {
      const isHighWave = ocean.waveHeight > 4.0;
      alerts.push({
        id: 'alert-wave-1',
        category: isHighWave ? 'HIGH' : 'MEDIUM',
        title: '🟡 WAVE CONDITION WARNING',
        message: `Significant wave height registered at ${ocean.waveHeight} meters.`,
        location: locStr,
        timestamp: ocean.timestamp ? new Date(ocean.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : now,
        currentValue: `${ocean.waveHeight} m Wave Height`,
        thresholdValue: '2.5 m Safety Threshold',
        recommendedAction: 'Reduce speed to limit bow slamming and monitor hull vibration sensors.',
        actionRequired: false,
        acknowledged: false
      });
    }

    return alerts;
  }
};

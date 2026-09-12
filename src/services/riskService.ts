import { RiskBreakdown } from '../types';
import { RealWeatherData } from './weatherService';
import { RealOceanData } from './oceanService';

export interface CalculatedRiskResponse {
  risk: RiskBreakdown | null;
  status: 'LIVE_CALCULATED' | 'UNAVAILABLE';
  message: string;
}

export const riskService = {
  calculateFromRealData: (
    weather: RealWeatherData | null,
    ocean: RealOceanData | null,
    iceConcentration?: number
  ): CalculatedRiskResponse => {
    if (!weather || weather.status !== 'LIVE' || !ocean || ocean.status !== 'LIVE') {
      return {
        risk: null,
        status: 'UNAVAILABLE',
        message: 'Risk assessment unavailable — insufficient live data.'
      };
    }

    // Weather risk derived strictly from live wind speed
    const weatherRiskScore = Math.min(100, Math.round((weather.windSpeed / 50) * 100));

    // Ocean risk derived strictly from live wave height
    const oceanRiskScore = Math.min(100, Math.round((ocean.waveHeight / 8) * 100));

    // Sea ice risk
    const seaIceScore = iceConcentration !== undefined ? iceConcentration : 0;
    const icebergScore = iceConcentration !== undefined ? Math.round(seaIceScore * 0.5) : 0;
    const vesselMarginScore = 15; // Polar Class rating margin

    const overall = Math.round(
      seaIceScore * 0.30 +
      icebergScore * 0.25 +
      weatherRiskScore * 0.25 +
      oceanRiskScore * 0.10 +
      vesselMarginScore * 0.10
    );

    let tier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let missionStatus: 'SAFE' | 'CAUTION' | 'HIGH RISK' | 'CRITICAL' = 'SAFE';
    let directive = 'CONTINUE — Operational conditions optimal along recommended corridor.';

    if (overall > 80) {
      tier = 'CRITICAL';
      missionStatus = 'CRITICAL';
      directive = 'STOP / IMMEDIATE DIVERSION MANDATORY — Severe ice hazard or cyclone storm in sector.';
    } else if (overall > 60) {
      tier = 'HIGH';
      missionStatus = 'HIGH RISK';
      directive = 'REDUCE SPEED & EXECUTE ALTERNATIVE BYPASS ROUTE — High sea-ice concentration ahead.';
    } else if (overall > 30) {
      tier = 'MODERATE';
      missionStatus = 'CAUTION';
      directive = 'PROCEED WITH CAUTION / SLOW DOWN — Ice patches and wind turbulence present.';
    }

    const breakdown: RiskBreakdown = {
      overallScore: overall,
      status: tier,
      missionStatus,
      operationalDirective: directive,
      seaIceRisk: seaIceScore,
      icebergCollisionRisk: icebergScore,
      weatherRisk: weatherRiskScore,
      oceanRisk: oceanRiskScore,
      vesselCapabilityRisk: vesselMarginScore,
      factors: [
        { name: 'Weather Wind Risk', value: weatherRiskScore, description: `Live wind speed: ${weather.windSpeed} knots (${weather.stormCondition})` },
        { name: 'Ocean Swell Risk', value: oceanRiskScore, description: `Live wave height: ${ocean.waveHeight} m` },
        { name: 'Sea-Ice Concentration', value: seaIceScore, description: `Telemetry sea ice density: ${seaIceScore}%` },
        { name: 'Vessel Rating Reserve', value: vesselMarginScore, description: 'PC5 Hull Polar Rating Margin' }
      ]
    };

    return {
      risk: breakdown,
      status: 'LIVE_CALCULATED',
      message: 'Risk calculated directly from live API telemetry.'
    };
  }
};

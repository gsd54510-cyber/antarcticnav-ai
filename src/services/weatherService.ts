export interface RealWeatherData {
  windSpeed: number; // knots
  windDirection: number; // degrees
  temperature: number; // °C
  surfacePressure: number; // hPa
  visibility: number; // nautical miles
  stormCondition: string;
  source: string;
  status: 'LIVE' | 'UNAVAILABLE' | 'FETCHING';
  timestamp: string;
}

const API_BASE_URL = (
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001'
).replace(/\/$/, '');

export const weatherService = {
  getRealWeather: async (
    lat: number,
    lng: number
  ): Promise<RealWeatherData> => {
    try {
      const url = `${API_BASE_URL}/api/weather?lat=${lat.toFixed(
        4
      )}&lng=${lng.toFixed(4)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Weather API returned status ${response.status}`);
      }

      const result = await response.json();

      const data = result.data ?? result;
      const current = data.current;

      if (!current) {
        throw new Error('Weather data is missing current conditions');
      }

      const windSpeedKnots = parseFloat(
        (current.wind_speed_10m * 0.539957).toFixed(1)
      );

      const tempC = parseFloat(current.temperature_2m.toFixed(1));
      const windDir = Math.round(current.wind_direction_10m);

      const pressure = current.surface_pressure
        ? parseFloat(current.surface_pressure.toFixed(1))
        : 1013.2;

      let condition = 'Clear / Calm';

      if (current.weather_code >= 95)
        condition = 'Severe Thunderstorm Warning';
      else if (current.weather_code >= 80)
        condition = 'Heavy Rain / Blizzard';
      else if (current.weather_code >= 71)
        condition = 'Snowfall Drift';
      else if (current.weather_code >= 51)
        condition = 'Drizzle / Freezing Fog';
      else if (windSpeedKnots > 35)
        condition = 'Gale Force Winds';
      else if (windSpeedKnots > 20)
        condition = 'Moderate Winds';

      return {
        windSpeed: windSpeedKnots,
        windDirection: windDir,
        temperature: tempC,
        surfacePressure: pressure,
        visibility: 10,
        stormCondition: condition,
        source: 'Open-Meteo Global Weather REST API',
        status: 'LIVE',
        timestamp: current.time
          ? new Date(current.time + 'Z').toISOString()
          : new Date().toISOString()
      };
    } catch (err) {
      console.warn('Real weather API call failed:', err);

      return {
        windSpeed: 0,
        windDirection: 0,
        temperature: 0,
        surfacePressure: 0,
        visibility: 0,
        stormCondition: 'Weather data unavailable',
        source: 'Open-Meteo Global Weather REST API',
        status: 'UNAVAILABLE',
        timestamp: new Date().toISOString()
      };
    }
  }
};
export interface GeocodedLocation {
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  rawAddress?: string;
}

export const geocodingService = {
  searchLocation: async (query: string): Promise<GeocodedLocation[]> => {
    if (!query || query.trim().length < 2) return [];

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'AntarcticNav-AI/2.4 (Maritime Polar Command)'
        }
      });

      if (!response.ok) throw new Error(`Geocoding API HTTP ${response.status}`);
      const data = await response.json();

      return data.map((item: any) => ({
        name: item.display_name.split(',')[0] || item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        type: item.type || 'Location',
        rawAddress: item.display_name
      }));
    } catch (err) {
      console.warn('Geocoding search API error:', err);
      return [];
    }
  }
};

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  source: 'GPS' | 'Manual Search';
  status: 'ACTIVE' | 'DENIED' | 'UNAVAILABLE' | 'INITIALIZING';
  errorMessage?: string;
  isPolarRegion: boolean;
  isContinuousTracking?: boolean;
}

let watchId: number | null = null;

export const locationService = {
  getCurrentLocation: (): Promise<LocationData> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          name: 'Location Unavailable',
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          timestamp: new Date().toISOString(),
          source: 'GPS',
          status: 'UNAVAILABLE',
          errorMessage: 'Geolocation API is not supported by your browser.',
          isPolarRegion: false
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const isPolar = lat <= -55 || lat >= 55;

          resolve({
            name: `Live GPS Position (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
            latitude: lat,
            longitude: lng,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString(),
            source: 'GPS',
            status: 'ACTIVE',
            isPolarRegion: isPolar
          });
        },
        (error) => {
          let msg = 'Location access is required to initialize the navigation system.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission was denied by browser settings.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'GPS location position is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out. Please try again.';
          }

          resolve({
            name: 'GPS Denied',
            latitude: 0,
            longitude: 0,
            accuracy: 0,
            timestamp: new Date().toISOString(),
            source: 'GPS',
            status: 'DENIED',
            errorMessage: msg,
            isPolarRegion: false
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  },

  startContinuousTracking: (onUpdate: (location: LocationData) => void): void => {
    if (!navigator.geolocation) return;
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const isPolar = lat <= -55 || lat >= 55;

        onUpdate({
          name: `Continuous Tracking (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
          latitude: lat,
          longitude: lng,
          accuracy: position.coords.accuracy,
          timestamp: new Date(position.timestamp).toISOString(),
          source: 'GPS',
          status: 'ACTIVE',
          isPolarRegion: isPolar,
          isContinuousTracking: true
        });
      },
      (error) => console.warn('Continuous tracking watch error:', error),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  },

  stopContinuousTracking: (): void => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }
};

import { useCallback, useState } from 'react';

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
}

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPermissionDenied, setIsPermissionDenied] = useState<boolean>(false);

  const requestLocation = useCallback((): Promise<UserLocation | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setIsPermissionDenied(true);
        resolve(null);
        return;
      }

      setLoading(true);
      setError(null);
      setIsPermissionDenied(false);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(loc);
          setLoading(false);
          setIsPermissionDenied(false);
          resolve(loc);
        },
        (err) => {
          setLoading(false);
          setError(err.message || 'Unable to retrieve location.');
          if (err.code === err.PERMISSION_DENIED || err.code === 1) {
            setIsPermissionDenied(true);
          } else {
            setIsPermissionDenied(true);
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const clearLocationError = useCallback(() => {
    setIsPermissionDenied(false);
    setError(null);
  }, []);

  return {
    location,
    loading,
    error,
    isPermissionDenied,
    requestLocation,
    clearLocationError,
  };
}

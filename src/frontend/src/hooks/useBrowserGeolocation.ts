import { useState, useEffect, useCallback } from 'react';

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

export type GeolocationStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error' | 'timeout';

export interface GeolocationState {
  status: GeolocationStatus;
  coords: GeolocationCoords | null;
  error: string | null;
}

const TIMEOUT_MS = 10000; // 10 seconds

export function useBrowserGeolocation(autoRequest: boolean = false) {
  const [state, setState] = useState<GeolocationState>({
    status: 'idle',
    coords: null,
    error: null,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        status: 'error',
        coords: null,
        error: 'Geolocation is not supported by your browser',
      });
      return;
    }

    setState({ status: 'requesting', coords: null, error: null });

    const timeoutId = setTimeout(() => {
      setState({
        status: 'timeout',
        coords: null,
        error: 'Location request timed out',
      });
    }, TIMEOUT_MS);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        setState({
          status: 'granted',
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        clearTimeout(timeoutId);
        let errorMessage = 'Failed to get location';
        let status: GeolocationStatus = 'error';

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied';
          status = 'denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timed out';
          status = 'timeout';
        }

        setState({
          status,
          coords: null,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: TIMEOUT_MS,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  // One-shot fetch for forms (non-blocking)
  const fetchLocationOnce = useCallback(
    (): Promise<GeolocationCoords | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
          return;
        }

        const timeoutId = setTimeout(() => {
          resolve(null);
        }, 5000); // Shorter timeout for forms

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            clearTimeout(timeoutId);
            resolve(null);
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000,
          }
        );
      });
    },
    []
  );

  useEffect(() => {
    if (autoRequest) {
      requestLocation();
    }
  }, [autoRequest, requestLocation]);

  return {
    ...state,
    requestLocation,
    fetchLocationOnce,
    isRequesting: state.status === 'requesting',
    isGranted: state.status === 'granted',
    isDenied: state.status === 'denied',
    isError: state.status === 'error' || state.status === 'timeout',
  };
}

'use client';

import { useState, useCallback, useEffect, startTransition } from 'react';
import type { LocationData } from '@/lib/types';
import { reverseGeocode } from '@/lib/api/geocode';
import { fetchIpGeolocation } from '@/lib/api/ip-geolocation';
import { STORAGE_KEYS } from '@/lib/constants';

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  detectLocation: () => void;
  setManualLocation: (location: LocationData) => void;
  fallbackToIp: () => void;
}

const GPS_TIMEOUT_MS = 10000;
const LOCATION_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface PersistedLocation {
  data: LocationData;
  timestamp: number;
}

function loadPersistedLocation(): LocationData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCATION);
    if (!stored) return null;
    const parsed: PersistedLocation = JSON.parse(stored);
    if (Date.now() - parsed.timestamp > LOCATION_CACHE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEYS.LOCATION);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function persistLocation(location: LocationData) {
  const payload: PersistedLocation = { data: location, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(payload));
}

async function getGpsPosition(): Promise<{ latitude: number; longitude: number }> {
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: GPS_TIMEOUT_MS,
      maximumAge: 300000,
    });
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

async function getIpBasedLocation(): Promise<LocationData> {
  const location = await fetchIpGeolocation();

  try {
    const enriched = await reverseGeocode(location.latitude, location.longitude, 'ip_geolocation');
    return { ...enriched, confidence: location.confidence, isApproximate: true };
  } catch {
    return location;
  }
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    const hasGps = 'geolocation' in navigator;

    if (!hasGps) {
      try {
        const ipLoc = await getIpBasedLocation();
        setLocation(ipLoc);
        persistLocation(ipLoc);
      } catch {
        setError('Unable to determine your location. Please search for your city.');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const { latitude, longitude } = await getGpsPosition();
      const locData = await reverseGeocode(latitude, longitude, 'gps');
      setLocation(locData);
      persistLocation(locData);
      setError(null);
    } catch (gpsErr) {
      console.debug('GPS failed, falling back to IP geolocation:', gpsErr);

      try {
        const ipLoc = await getIpBasedLocation();

        if (ipLoc.confidence === 'high' || ipLoc.confidence === 'medium') {
          setLocation(ipLoc);
          persistLocation(ipLoc);
          setError(null);
        } else {
          setLocation(ipLoc);
          persistLocation(ipLoc);
          setError(
            'Approximate location detected. Please confirm your city below.'
          );
        }
      } catch {
        console.debug('IP geolocation also failed');

        const message =
          gpsErr instanceof GeolocationPositionError
            ? gpsErr.code === gpsErr.PERMISSION_DENIED
              ? 'Location access denied. You can search for your city or we can try an approximate location.'
              : 'Unable to determine precise location. You can search or try approximate location.'
            : 'Unable to determine location. Please search for your city.';

        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const setManualLocation = useCallback((loc: LocationData) => {
    const enriched: LocationData = {
      ...loc,
      locationSource: 'user_selected',
      confidence: 'high',
      isApproximate: false,
    };
    setLocation(enriched);
    setError(null);
    persistLocation(enriched);
  }, []);

  const fallbackToIp = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const ipLoc = await getIpBasedLocation();
      setLocation(ipLoc);
      persistLocation(ipLoc);
      setError(null);
    } catch {
      setError('Unable to determine approximate location. Please search for your city.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const persisted = loadPersistedLocation();
    if (persisted) {
      startTransition(() => {
        setLocation(persisted);
        setLoading(false);
      });
    } else {
      startTransition(() => {
        detectLocation();
      });
    }
  }, [detectLocation]);

  return { location, loading, error, detectLocation, setManualLocation, fallbackToIp };
}

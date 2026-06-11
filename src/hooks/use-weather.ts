'use client';

import { useState, useEffect } from 'react';
import type { WeatherData, LocationData } from '@/lib/types';

interface UseWeatherReturn {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(location: LocationData | null): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loading = location !== null && weather === null && error === null;

  useEffect(() => {
    if (!location) return;

    let cancelled = false;

    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    });

    fetch(`/api/weather?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error('Weather fetch failed');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setWeather(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load weather');
        }
      });

    return () => { cancelled = true; };
  }, [location]);

  return { weather, loading, error };
}

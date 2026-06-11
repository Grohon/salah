'use client';

import { useState, useEffect, useCallback } from 'react';
import { calculateQiblaDirection } from '@/lib/qibla';

export interface UseQiblaReturn {
  direction: number;
  heading: number | null;
  loading: boolean;
  sensorStatus: 'supported' | 'unsupported' | 'denied' | 'timeout' | 'active';
}

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

type DeviceOrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
};

const INIT_SUPPORTED = isSupported();

export function useQibla(
  userLat: number | null,
  userLng: number | null
): UseQiblaReturn {
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(INIT_SUPPORTED);
  const [sensorStatus, setSensorStatus] = useState<UseQiblaReturn['sensorStatus']>(
    INIT_SUPPORTED ? 'supported' : 'unsupported'
  );

  const direction = (userLat !== null && userLng !== null)
    ? calculateQiblaDirection(userLat, userLng)
    : 0;

  const startListening = useCallback(() => {
    let received = false;

    const handler = (event: DeviceOrientationEvent) => {
      let value: number | null = null;

      const webkitEvent = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      if (webkitEvent.webkitCompassHeading !== undefined && webkitEvent.webkitCompassHeading !== null) {
        value = webkitEvent.webkitCompassHeading;
      } else if (event.alpha !== null && event.alpha !== undefined) {
        value = (360 - event.alpha) % 360;
      }

      if (value !== null) {
        setHeading(value);
        setSensorStatus('active');
        received = true;
      }
      setLoading(false);
    };

    window.addEventListener('deviceorientation', handler, { passive: true });

    setTimeout(() => {
      setLoading(false);
      if (!received) {
        setSensorStatus('timeout');
      }
    }, 8000);

    return () => {
      window.removeEventListener('deviceorientation', handler);
    };
  }, []);

  useEffect(() => {
    if (!INIT_SUPPORTED) return;

    const Constructor = DeviceOrientationEvent as unknown as DeviceOrientationEventConstructor;

    if (typeof Constructor.requestPermission === 'function') {
      Constructor.requestPermission()
        .then((state) => {
          if (state === 'granted') return startListening();
          setLoading(false);
          setSensorStatus('denied');
          return undefined;
        })
        .catch(() => {
          setLoading(false);
          setSensorStatus('denied');
        });
    } else {
      return startListening();
    }
  }, [startListening]);

  return { direction, heading, loading, sensorStatus };
}

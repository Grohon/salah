'use client';

import { useState, useEffect, useRef } from 'react';
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

export function useQibla(
  userLat: number | null,
  userLng: number | null
): UseQiblaReturn {
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(() => isSupported());
  const [sensorStatus, setSensorStatus] = useState<'supported' | 'unsupported' | 'denied' | 'timeout' | 'active'>(
    () => isSupported() ? 'supported' : 'unsupported'
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const handlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  const direction = (userLat !== null && userLng !== null)
    ? calculateQiblaDirection(userLat, userLng)
    : 0;

  useEffect(() => {
    if (!isSupported()) return;

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

    handlerRef.current = handler;

    const startTimeout = () => {
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        if (!received) {
          setSensorStatus('timeout');
        }
      }, 8000);
    };

    const listen = () => {
      window.addEventListener('deviceorientation', handler, { passive: true });
      startTimeout();
    };

    const Constructor = DeviceOrientationEvent as unknown as DeviceOrientationEventConstructor;

    if (typeof Constructor.requestPermission === 'function') {
      Constructor.requestPermission()
        .then((state) => {
          if (state === 'granted') {
            listen();
          } else {
            setLoading(false);
            setSensorStatus('denied');
          }
        })
        .catch(() => {
          setLoading(false);
          setSensorStatus('denied');
        });
    } else {
      listen();
    }

    return () => {
      if (handlerRef.current) {
        window.removeEventListener('deviceorientation', handlerRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { direction, heading, loading, sensorStatus };
}

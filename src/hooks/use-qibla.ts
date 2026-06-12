'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { calculateQiblaDirection } from '@/lib/qibla';

export interface UseQiblaReturn {
  direction: number;
  heading: number | null;
  loading: boolean;
  sensorStatus: 'supported' | 'unsupported' | 'denied' | 'timeout' | 'active';
  requestPermission: () => void;
}

function isSupported(): boolean {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

function needsPermission(): boolean {
  if (typeof window === 'undefined') return false;
  const Ctor = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<string>;
  };
  return typeof Ctor.requestPermission === 'function';
}

export function useQibla(
  userLat: number | null,
  userLng: number | null
): UseQiblaReturn {
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(() => isSupported() && !needsPermission());
  const [sensorStatus, setSensorStatus] = useState<
    'supported' | 'unsupported' | 'denied' | 'timeout' | 'active'
  >(() => {
    if (!isSupported()) return 'unsupported';
    if (needsPermission()) return 'supported';
    return 'supported';
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cleanupRef = useRef<() => void>(() => {});

  const direction =
    userLat !== null && userLng !== null
      ? calculateQiblaDirection(userLat, userLng)
      : 0;

  const startListening = useCallback(() => {
    let received = false;

    const handleHeading = (raw: number) => {
      const value = (360 - raw) % 360;
      setHeading(value);
      setSensorStatus('active');
      received = true;
      setLoading(false);
    };

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.alpha !== undefined) {
        handleHeading(e.alpha);
      }
    };

    const absHandler = onOrientation as EventListener;
    const oriHandler = onOrientation as EventListener;

    window.addEventListener('deviceorientationabsolute', absHandler, { passive: true });
    window.addEventListener('deviceorientation', oriHandler, { passive: true });

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      if (!received) {
        setSensorStatus('timeout');
      }
    }, 8000);

    cleanupRef.current = () => {
      window.removeEventListener('deviceorientationabsolute', absHandler);
      window.removeEventListener('deviceorientation', oriHandler);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const requestPermission = useCallback(() => {
    if (!isSupported()) return;

    if (needsPermission()) {
      const Ctor = DeviceOrientationEvent as unknown as {
        requestPermission: () => Promise<'granted' | 'denied' | 'default'>;
      };
      Ctor.requestPermission()
        .then((state) => {
          if (state === 'granted') {
            startListening();
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
      startListening();
    }
  }, [startListening]);

  useEffect(() => {
    if (!isSupported()) return;
    if (needsPermission()) return;

    startListening();

    return () => {
      cleanupRef.current();
    };
  }, [startListening]);

  return { direction, heading, loading, sensorStatus, requestPermission };
}

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
  const Constructor = DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
  };
  return typeof Constructor.requestPermission === 'function';
}

export function useQibla(
  userLat: number | null,
  userLng: number | null
): UseQiblaReturn {
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(() => {
    if (!isSupported()) return false;
    if (needsPermission()) return false;
    return true;
  });
  const [sensorStatus, setSensorStatus] = useState<'supported' | 'unsupported' | 'denied' | 'timeout' | 'active'>(
    () => {
      if (!isSupported()) return 'unsupported';
      if (needsPermission()) return 'supported';
      return 'supported';
    }
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const handlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const absoluteHandlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  const direction = (userLat !== null && userLng !== null)
    ? calculateQiblaDirection(userLat, userLng)
    : 0;

  const startListening = useCallback(() => {
    let received = false;

    const handleValue = (value: number) => {
      setHeading(value);
      setSensorStatus('active');
      received = true;
      setLoading(false);
    };

    const fallbackHandler = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.alpha !== undefined) {
        handleValue((360 - event.alpha) % 360);
      }
    };

    const absoluteHandler = ((event: DeviceOrientationEvent) => {
      if (event.alpha !== null && event.alpha !== undefined) {
        handleValue((360 - event.alpha) % 360);
      }
    }) as EventListener;

    handlerRef.current = fallbackHandler;
    absoluteHandlerRef.current = absoluteHandler;

    const useAbsolute = 'ondeviceorientationabsolute' in window;
    const target = useAbsolute ? 'deviceorientationabsolute' : 'deviceorientation';
    const listener = useAbsolute ? absoluteHandler : fallbackHandler;
    window.addEventListener(target, listener as EventListener, { passive: true });

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      if (!received) {
        setSensorStatus('timeout');
      }
    }, 8000);
  }, []);

  const requestPermission = useCallback(() => {
    if (!isSupported()) return;

    if (needsPermission()) {
      const Constructor = DeviceOrientationEvent as unknown as {
        requestPermission: () => Promise<'granted' | 'denied' | 'default'>;
      };
      Constructor.requestPermission()
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

    if (needsPermission()) {
      return;
    }

    startListening();

    return () => {
      if (absoluteHandlerRef.current) {
        window.removeEventListener('deviceorientationabsolute', absoluteHandlerRef.current as EventListener);
      }
      if (handlerRef.current) {
        window.removeEventListener('deviceorientation', handlerRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startListening]);

  return { direction, heading, loading, sensorStatus, requestPermission };
}

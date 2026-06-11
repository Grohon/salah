'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateQiblaDirection } from '@/lib/qibla';

export interface UseQiblaReturn {
  direction: number;
  heading: number | null;
  smoothedHeading: number | null;
  loading: boolean;
  error: string | null;
  absolute: boolean;
}

function supportsOrientation(): boolean {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

type DeviceOrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
};

function lerpAngle(current: number, target: number, factor: number): number {
  let diff = target - current;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  const next = current + diff * factor;
  return ((next % 360) + 360) % 360;
}

export function useQibla(
  userLat: number | null,
  userLng: number | null
): UseQiblaReturn {
  const [heading, setHeading] = useState<number | null>(null);
  const [loading, setLoading] = useState(() => supportsOrientation());
  const [error, setError] = useState<string | null>(() =>
    supportsOrientation() ? null : 'Device orientation not supported by your browser.'
  );
  const [absolute, setAbsolute] = useState(false);

  const smoothedRef = useRef<number | null>(null);
  const [smoothedHeading, setSmoothedHeading] = useState<number | null>(null);
  const rafRef = useRef<number>(0);

  const direction = (userLat !== null && userLng !== null)
    ? calculateQiblaDirection(userLat, userLng)
    : 0;

  const startListening = useCallback(() => {
    let orientationReceived = false;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      let headingValue: number | null = null;
      let isAbsolute = false;

      const webkitEvent = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      if (webkitEvent.webkitCompassHeading !== undefined && webkitEvent.webkitCompassHeading !== null) {
        headingValue = webkitEvent.webkitCompassHeading;
        isAbsolute = true;
      } else if (event.alpha !== null && event.alpha !== undefined) {
        headingValue = event.absolute ? event.alpha : 360 - event.alpha;
        isAbsolute = !!event.absolute;
      }

      if (headingValue !== null) {
        setHeading(headingValue);
        setAbsolute(isAbsolute);
        orientationReceived = true;
      }
      setLoading(false);
    };

    window.addEventListener('deviceorientation', handleOrientation);

    const timeout = setTimeout(() => {
      setLoading(false);
      if (!orientationReceived) {
        setError('No compass data received. Ensure your device has a magnetometer.');
      }
    }, 8000);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!supportsOrientation()) return;

    const Constructor = DeviceOrientationEvent as unknown as DeviceOrientationEventConstructor;

    if (typeof Constructor.requestPermission === 'function') {
      Constructor.requestPermission()
        .then((state) => {
          if (state === 'granted') return startListening();
          setLoading(false);
          setError('Permission denied. Enable motion sensors in your browser settings.');
          return undefined;
        })
        .catch(() => {
          setLoading(false);
          setError('Failed to request sensor permission.');
        });
    } else {
      return startListening();
    }
  }, [startListening]);

  useEffect(() => {
    if (heading === null) return;

    let running = true;
    const tick = () => {
      if (!running) return;
      if (smoothedRef.current === null) {
        smoothedRef.current = heading;
      } else {
        smoothedRef.current = lerpAngle(smoothedRef.current, heading, 0.2);
      }
      setSmoothedHeading(smoothedRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [heading]);

  return { direction, heading, smoothedHeading, loading, error, absolute };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { calculateQiblaDirection } from '@/lib/qibla';

interface UseQiblaReturn {
  direction: number;
  deviceOrientation: number | null;
  loading: boolean;
  error: string | null;
  compassBearing: number;
}

function supportsOrientation(): boolean {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

type DeviceOrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
};

export function useQibla(
  userLat: number | null,
  userLng: number | null
): UseQiblaReturn {
  const [deviceOrientation, setDeviceOrientation] = useState<number | null>(null);
  const [loading, setLoading] = useState(() => supportsOrientation());
  const [error, setError] = useState<string | null>(() =>
    supportsOrientation() ? null : 'Device orientation not supported by your browser.'
  );

  const direction = (userLat !== null && userLng !== null)
    ? calculateQiblaDirection(userLat, userLng)
    : 0;

  const startListening = useCallback(() => {
    let orientationReceived = false;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const webkitEvent = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      if (webkitEvent.webkitCompassHeading !== null && webkitEvent.webkitCompassHeading !== undefined) {
        setDeviceOrientation(webkitEvent.webkitCompassHeading);
        orientationReceived = true;
      } else if (event.alpha !== null && event.alpha !== undefined) {
        setDeviceOrientation(360 - event.alpha);
        orientationReceived = true;
      }
      setLoading(false);
    };

    window.addEventListener('deviceorientation', handleOrientation);

    const timeout = setTimeout(() => {
      setLoading(false);
      if (!orientationReceived) {
        setError('Device orientation unavailable. Point your device toward the Qibla.');
      }
    }, 5000);

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
          if (state === 'granted') {
            return startListening();
          }
          setLoading(false);
          setError('Device orientation permission denied. Enable it in your browser settings.');
          return undefined;
        })
        .catch(() => {
          setLoading(false);
          setError('Failed to request device orientation permission.');
        });
    } else {
      return startListening();
    }
  }, [startListening]);

  const compassBearing = deviceOrientation !== null
    ? (direction - deviceOrientation + 360) % 360
    : direction;

  return { direction, deviceOrientation, loading, error, compassBearing };
}

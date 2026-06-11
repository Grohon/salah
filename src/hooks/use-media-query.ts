'use client';

import { useSyncExternalStore } from 'react';

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string): boolean {
  const getSnapshot = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  };

  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const media = window.matchMedia(query);
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

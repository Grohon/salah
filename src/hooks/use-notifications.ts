'use client';

import { useState, useCallback } from 'react';
import type { NotificationPreferences } from '@/lib/types';
import { STORAGE_KEYS, DEFAULT_NOTIFICATION_PREFS } from '@/lib/constants';

function loadStoredPrefs(): NotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_PREFS;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFS);
    if (stored) {
      return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(stored) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_NOTIFICATION_PREFS;
}

function getInitialPermission(): NotificationPermission {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission;
  }
  return 'default';
}

interface UseNotificationsReturn {
  permission: NotificationPermission;
  preferences: NotificationPreferences;
  requestPermission: () => Promise<NotificationPermission>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  schedulePrayerNotification: (prayerName: string, time: Date, minutesBefore: number) => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>(getInitialPermission);
  const [preferences, setPreferences] = useState<NotificationPreferences>(loadStoredPrefs);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return 'denied' as NotificationPermission;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...prefs };
      localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const schedulePrayerNotification = useCallback(
    (prayerName: string, time: Date, minutesBefore: number) => {
      if (permission !== 'granted' || !preferences.enabled) return;

      const notificationTime = new Date(time.getTime() - minutesBefore * 60000);
      const now = new Date();
      const delay = notificationTime.getTime() - now.getTime();

      if (delay <= 0) return;

      setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Prayer Time Reminder', {
            body: `${prayerName} is in ${minutesBefore} minutes.`,
            icon: '/icons/icon-192x192.png',
            tag: `prayer-${prayerName.toLowerCase()}`,
          });
        }
      }, delay);
    },
    [permission, preferences.enabled]
  );

  return {
    permission,
    preferences,
    requestPermission,
    updatePreferences,
    schedulePrayerNotification,
  };
}

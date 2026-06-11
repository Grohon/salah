import { Moon, Calendar, Compass, Settings } from 'lucide-react';

export const KAABA_LATITUDE = 21.4225;
export const KAABA_LONGITUDE = 39.8262;

export const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

export const DEFAULT_CALC_METHOD = 1;

export const STORAGE_KEYS = {
  LOCATION: 'prayer-location',
  PRAYER_TIMES: 'prayer-times-cache',
  NOTIFICATION_PREFS: 'prayer-notification-prefs',
  CALC_METHOD: 'prayer-calculation-method',
} as const;

export const DEFAULT_NOTIFICATION_PREFS = {
  enabled: false,
  beforeFajr: 15,
  beforeDhuhr: 15,
  beforeAsr: 15,
  beforeMaghrib: 15,
  beforeIsha: 15,
};

export const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Moon },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/qibla', label: 'Qibla', icon: Compass },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

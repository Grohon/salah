export enum PrayerName {
  Fajr = 'Fajr',
  Sunrise = 'Sunrise',
  Dhuhr = 'Dhuhr',
  Asr = 'Asr',
  Maghrib = 'Maghrib',
  Isha = 'Isha',
  Tahajjud = 'Tahajjud',
}

export type PrayerKey = Lowercase<PrayerName>;

export type PrayerStatus = 'completed' | 'current' | 'upcoming' | 'next';

export interface PrayerTimeData {
  name: PrayerName;
  key: PrayerKey;
  time: string;
  timeDate: Date;
  endTime?: string;
  endTimeDate?: Date;
  makruhTime?: string;
  status: PrayerStatus;
  isNext: boolean;
}

export type LocationSource = 'gps' | 'ip_geolocation' | 'user_selected';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  countryCode?: string;
  state?: string;
  locationSource: LocationSource;
  confidence: ConfidenceLevel;
  isApproximate: boolean;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
}

export interface HijriDate {
  day: string;
  month: string;
  monthAr: string;
  year: string;
  weekday: string;
  weekdayAr: string;
}

export interface GregorianDate {
  day: string;
  month: string;
  year: string;
  weekday: string;
}

export interface PrayerTimesData {
  timings: Record<PrayerKey, string>;
  hijri: HijriDate;
  gregorian: GregorianDate;
  timezone: string;
  dateTimestamp: string;
}

export interface IslamicEvent {
  name: string;
  nameAr?: string;
  date: Date;
  type: 'important' | 'normal';
  description?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  beforeFajr: number;
  beforeDhuhr: number;
  beforeAsr: number;
  beforeMaghrib: number;
  beforeIsha: number;
}

export type CalculationMethod = 0 | 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

const VALID_METHODS: number[] = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14];

export function isValidCalculationMethod(v: unknown): v is CalculationMethod {
  return typeof v === 'number' && Number.isInteger(v) && VALID_METHODS.includes(v);
}

export function safeParseMethod(stored: string | null, fallback: CalculationMethod): CalculationMethod {
  if (stored === null) return fallback;
  try {
    const v = JSON.parse(stored);
    if (isValidCalculationMethod(v)) return v;
  } catch {}
  return fallback;
}

export interface CalculationMethodOption {
  id: CalculationMethod;
  name: string;
}

export const CALCULATION_METHODS: CalculationMethodOption[] = [
  { id: 0, name: 'Shia Ithna-Ansari' },
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore' },
  { id: 12, name: 'Union Organization Islamic de France' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
];

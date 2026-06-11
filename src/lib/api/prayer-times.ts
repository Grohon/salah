import type { PrayerTimesData, CalculationMethod } from '../types';

const ALADHAN_BASE = 'https://api.aladhan.com/v1';

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 1,
  date?: Date
): Promise<PrayerTimesData> {
  const dateStr = date
    ? `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`
    : undefined;

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    method: method.toString(),
    school: '1',
  });

  if (dateStr) params.set('date', dateStr);

  const url = dateStr
    ? `${ALADHAN_BASE}/timings/${dateStr}?${params}`
    : `${ALADHAN_BASE}/timings?${params}`;

  const response = await fetch(url, {
    next: { revalidate: 86400 },
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Prayer times API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.code !== 200) {
    throw new Error(`Prayer times API error: ${json.data || json.code}`);
  }

  const data = json.data;

  const timings: Record<string, string> = {};
  const prayerKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  for (const key of prayerKeys) {
    timings[key.toLowerCase()] = data.timings[key];
  }

  return {
    timings: timings as PrayerTimesData['timings'],
    hijri: {
      day: data.date.hijri.day,
      month: data.date.hijri.month.en,
      monthAr: data.date.hijri.month.ar,
      year: data.date.hijri.year,
      weekday: data.date.hijri.weekday.en,
      weekdayAr: data.date.hijri.weekday.ar,
    },
    gregorian: {
      day: data.date.gregorian.day,
      month: data.date.gregorian.month.en,
      year: data.date.gregorian.year,
      weekday: data.date.gregorian.weekday.en,
    },
    timezone: data.meta.timezone,
    dateTimestamp: data.date.timestamp,
  };
}

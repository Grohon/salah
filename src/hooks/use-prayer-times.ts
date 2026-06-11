'use client';

import { useState, useEffect, useMemo } from 'react';
import type { PrayerTimeData, PrayerTimesData, LocationData, CalculationMethod } from '@/lib/types';
import { PrayerName, safeParseMethod } from '@/lib/types';
import { STORAGE_KEYS, PRAYER_ORDER } from '@/lib/constants';
import { formatTo12h } from '@/lib/utils';

interface PrayerTimesState {
  prayerTimes: PrayerTimeData[];
  hijriDate: PrayerTimesData['hijri'] | null;
  gregorianDate: PrayerTimesData['gregorian'] | null;
  loading: boolean;
  error: string | null;
  nextPrayer: PrayerTimeData | null;
  currentPrayer: PrayerTimeData | null;
}

function parseTime(timeStr: string | undefined, timezone?: string): Date {
  if (!timeStr) return new Date(0);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();

  if (timezone) {
    const tzDateStr = now.toLocaleString('sv-SE', { timeZone: timezone });
    const [datePart] = tzDateStr.split(' ');
    const [tzYear, tzMonth, tzDay] = datePart.split('-').map(Number);

    const referenceUtc = Date.UTC(tzYear, tzMonth - 1, tzDay, 12, 0, 0);
    const refParts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit', minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date(referenceUtc));

    const refHour = parseInt(refParts.find(p => p.type === 'hour')?.value || '12', 10);
    const refMinute = parseInt(refParts.find(p => p.type === 'minute')?.value || '0', 10);

    const offsetMs = ((refHour - 12) * 60 + refMinute) * 60 * 1000;

    return new Date(Date.UTC(tzYear, tzMonth - 1, tzDay, hours, minutes, 0) - offsetMs);
  }

  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  return new Date(Date.UTC(year, month, day, hours, minutes, 0));
}

const OBLIGATORY_PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function usePrayerTimes(
  location: LocationData | null,
  method?: CalculationMethod
): PrayerTimesState {
  const [effectiveMethod] = useState<CalculationMethod>(() => {
    if (typeof window === 'undefined') return method ?? 1;
    const stored = localStorage.getItem(STORAGE_KEYS.CALC_METHOD);
    if (stored !== null) return safeParseMethod(stored, method ?? 1);
    return method ?? 1;
  });
  const [timesData, setTimesData] = useState<PrayerTimesData | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.PRAYER_TIMES);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const loading = location !== null && timesData === null && error === null;

  useEffect(() => {
    if (!location) return;

    let cancelled = false;

    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      method: effectiveMethod.toString(),
    });

    fetch(`/api/prayer-times?${params}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch prayer times: ${res.status}`);
        return res.json();
      })
      .then((data: PrayerTimesData) => {
        if (cancelled) return;
        setTimesData(data);
        localStorage.setItem(STORAGE_KEYS.PRAYER_TIMES, JSON.stringify(data));
      })
      .catch((err) => {
        if (cancelled) return;
        const cached = localStorage.getItem(STORAGE_KEYS.PRAYER_TIMES);
        if (cached) {
          try {
            setTimesData(JSON.parse(cached));
          } catch {
            // ignore
          }
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch prayer times');
      });

    return () => { cancelled = true; };
  }, [location, effectiveMethod]);

  const prayerTimes = useMemo((): PrayerTimeData[] => {
    if (!timesData) return [];

    const now = new Date();
    const fajrStr = timesData.timings.fajr;

    const prayerEntries: PrayerTimeData[] = PRAYER_ORDER.map((key, i) => {
      const timeStr = timesData.timings[key];
      const prayerDate = parseTime(timeStr, timesData.timezone);

      let endTimeDate: Date | undefined;
      let makruhTime: string | undefined;

      if (key === 'isha') {
        const fajrDate = parseTime(fajrStr, timesData.timezone);
        fajrDate.setDate(fajrDate.getDate() + 1);

        const maghribStr = timesData.timings.maghrib;
        const maghribDate = parseTime(maghribStr, timesData.timezone);

        endTimeDate = new Date(fajrDate.getTime() - 60_000);

        const midpoint = new Date((maghribDate.getTime() + fajrDate.getTime()) / 2);
        makruhTime = formatTo12h(midpoint);
      } else {
        const nextKey = PRAYER_ORDER[i + 1];
        if (nextKey) {
          const endStr = timesData.timings[nextKey];
          const nextStart = parseTime(endStr, timesData.timezone);
          endTimeDate = new Date(nextStart.getTime() - 60_000);
        }
      }

      return {
        name: key.charAt(0).toUpperCase() + key.slice(1) as PrayerName,
        key: key as PrayerTimeData['key'],
        time: formatTo12h(prayerDate),
        timeDate: prayerDate,
        endTime: endTimeDate ? formatTo12h(endTimeDate) : undefined,
        endTimeDate,
        makruhTime,
        status: 'upcoming' as PrayerTimeData['status'],
        isNext: false,
      };
    });

    const obligatoryEntries = prayerEntries.filter(p =>
      OBLIGATORY_PRAYERS.includes(p.key)
    );

    const upcomingObligatory = obligatoryEntries.filter(p => p.timeDate > now);

    let nextPrayerEntry: PrayerTimeData;

    if (upcomingObligatory.length > 0) {
      nextPrayerEntry = upcomingObligatory.reduce((earliest, current) =>
        current.timeDate < earliest.timeDate ? current : earliest
      );
    } else {
      const fajrEntry = obligatoryEntries.find(p => p.key === 'fajr');
      if (fajrEntry) {
        const tomorrow = new Date(fajrEntry.timeDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        nextPrayerEntry = { ...fajrEntry, timeDate: tomorrow };
      } else {
        nextPrayerEntry = prayerEntries[0];
      }
    }

    const completedObligatory = obligatoryEntries.filter(p => p.timeDate <= now);
    const currentPrayerEntry = completedObligatory.length > 0
      ? completedObligatory[completedObligatory.length - 1]
      : null;

    prayerEntries.forEach((prayer) => {
      const isNext = prayer.key === nextPrayerEntry.key;
      const isCurrent = currentPrayerEntry !== null && prayer.key === currentPrayerEntry.key;

      if (isCurrent) {
        prayer.status = 'current';
      } else if (prayer.timeDate <= now) {
        prayer.status = 'completed';
      } else if (isNext) {
        prayer.status = 'next';
      } else {
        prayer.status = 'upcoming';
      }

      prayer.isNext = isNext;
    });

    const maghribDate = parseTime(timesData.timings.maghrib, timesData.timezone);
    const sunriseNext = parseTime(timesData.timings.sunrise, timesData.timezone);
    sunriseNext.setDate(sunriseNext.getDate() + 1);
    const nightDuration = sunriseNext.getTime() - maghribDate.getTime();
    const tahajjudDate = new Date(maghribDate.getTime() + (nightDuration * 2 / 3));

    const fajrNext = parseTime(fajrStr, timesData.timezone);
    fajrNext.setDate(fajrNext.getDate() + 1);

    prayerEntries.push({
      name: PrayerName.Tahajjud,
      key: 'tahajjud',
      time: formatTo12h(tahajjudDate),
      timeDate: tahajjudDate,
      endTime: formatTo12h(fajrNext),
      endTimeDate: fajrNext,
      status: tahajjudDate <= now ? 'completed' : 'upcoming' as PrayerTimeData['status'],
      isNext: false,
    });

    return prayerEntries;
  }, [timesData]);

  const nextPrayer = useMemo(
    () => prayerTimes.find(p => p.isNext) || null,
    [prayerTimes]
  );

  const currentPrayer = useMemo(
    () => prayerTimes.find(p => p.status === 'current') || null,
    [prayerTimes]
  );

  return {
    prayerTimes,
    hijriDate: timesData?.hijri || null,
    gregorianDate: timesData?.gregorian || null,
    loading,
    error,
    nextPrayer,
    currentPrayer,
  };
}

'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn, formatTimeStrTo12h } from '@/lib/utils';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import type { LocationData, CalculationMethod } from '@/lib/types';
import { safeParseMethod } from '@/lib/types';
import { STORAGE_KEYS, PRAYER_ORDER } from '@/lib/constants';

interface PrayerCalendarProps {
  location: LocationData | null;
  method?: CalculationMethod;
}

export function PrayerCalendar({ location, method: methodProp }: PrayerCalendarProps) {
  const [method] = useState<CalculationMethod>(() => {
    if (methodProp !== undefined) return methodProp;
    if (typeof window === 'undefined') return 1;
    return safeParseMethod(localStorage.getItem(STORAGE_KEYS.CALC_METHOD), 1);
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [prayerTimesForDate, setPrayerTimesForDate] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const cacheRef = useRef<Map<string, Record<string, string>>>(new Map());

  useEffect(() => {
    if (!showPicker) return;
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPicker]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const weeks = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    const result: (number | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [year, month]);

  const years = Array.from({ length: new Date().getFullYear() + 2 - 1970 + 1 }, (_, i) => 1970 + i);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const loadPrayerTimes = async (day: number) => {
    if (!location) return;

    const date = new Date(year, month, day);
    setSelectedDate(date);

    const dateStr = `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${year}`;
    const cacheKey = `${method}-${location.latitude}-${location.longitude}-${dateStr}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setPrayerTimesForDate(cached);
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
        method: method.toString(),
        date: dateStr,
      });

      const response = await fetch(`/api/prayer-times?${params}`);
      const data = await response.json();

      if (data.timings) {
        cacheRef.current.set(cacheKey, data.timings);
        setPrayerTimesForDate(data.timings);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const today = new Date();
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!location || initialLoadDone.current) return;
    initialLoadDone.current = true;
    if (today.getMonth() === month && today.getFullYear() === year) {
      const day = today.getDate();
      setTimeout(() => loadPrayerTimes(day), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <button
              onClick={() => setShowPicker(v => !v)}
              className="flex items-center gap-1.5 text-lg font-semibold text-foreground hover:dark:text-emerald-400 hover:text-emerald-700 transition-colors"
            >
              {monthNames[month]} {year}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {showPicker && (
              <div
                ref={pickerRef}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 flex gap-2 rounded-xl border border-border bg-popover p-3 shadow-2xl backdrop-blur-xl"
              >
                <select
                  value={month}
                  onChange={e => { setCurrentMonth(new Date(year, parseInt(e.target.value), 1)); }}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-emerald-500/50"
                >
                  {monthNames.map((name, i) => (
                    <option key={i} value={i} className="bg-card">{name}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={e => { setCurrentMonth(new Date(parseInt(e.target.value), month, 1)); }}
                  className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-emerald-500/50"
                >
                  {years.map(y => (
                    <option key={y} value={y} className="bg-card">{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Next month">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {weeks.map((week, weekIdx) =>
            week.map((day, dayIdx) => {
              const isToday =
                day !== null &&
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              const isSelected =
                day !== null &&
                selectedDate !== null &&
                day === selectedDate.getDate() &&
                month === selectedDate.getMonth() &&
                year === selectedDate.getFullYear();

              return (
                <motion.button
                  key={`${weekIdx}-${dayIdx}`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => day !== null && loadPrayerTimes(day)}
                  disabled={day === null || !location}
                  className={cn(
                    'aspect-square rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    day === null && 'invisible',
                    isToday && 'dark:bg-emerald-500/20 bg-emerald-100 dark:text-emerald-400 text-emerald-700',
                    isSelected && 'dark:bg-amber-500/20 bg-amber-200 dark:text-amber-400 text-amber-800',
                    !isToday && !isSelected && day !== null && 'hover:bg-muted/30 text-foreground',
                    !location && 'opacity-40 cursor-not-allowed'
                  )}
                  aria-label={day !== null ? `${monthNames[month]} ${day}, ${year}` : undefined}
                >
                  {day}
                </motion.button>
              );
            })
          )}
        </div>
      </GlassCard>

      {selectedDate && (
        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h3>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/30" />
              ))}
            </div>
          ) : prayerTimesForDate ? (
            <div className="space-y-2">
              {PRAYER_ORDER.map((key) => {
                const timeStr = prayerTimesForDate[key];
                if (!timeStr) return null;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-muted/30"
                  >
                    <span className="font-medium capitalize">{key}</span>
                    <span className="text-muted-foreground">
                      {formatTimeStrTo12h(timeStr.split(' ')[0])}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null}
        </GlassCard>
      )}
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';
import type { PrayerTimeData } from '@/lib/types';
import { Check } from 'lucide-react';

interface PrayerTimelineProps {
  prayers: PrayerTimeData[];
}

export function PrayerTimeline({ prayers }: PrayerTimelineProps) {
  const completedCount = prayers.filter(p => p.status === 'completed' || p.status === 'current').length;
  const totalCount = prayers.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground">Today&apos;s Progress</h3>
        <span className="text-xs text-muted-foreground">
          {completedCount} / {totalCount}
        </span>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-muted/30">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="relative flex justify-between gap-1">
        {prayers.map((prayer, index) => {
          const isDone = prayer.status === 'completed';
          const isCurrent = prayer.status === 'current';
          const isNext = prayer.isNext;

          return (
            <div key={prayer.key} className="flex flex-1 flex-col items-center">
              <div
                className={cn(
                  'relative flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300',
                   isDone && 'border-emerald-500 bg-emerald-500/20',
                  isCurrent && 'border-amber-400 bg-amber-400/20 shadow-sm shadow-amber-500/20',
                  isNext && 'border-sky-400 bg-sky-400/20 shadow-sm shadow-sky-500/20',
                  !isDone && !isCurrent && !isNext && 'border-border bg-muted/30'
                )}
              >
                  {isDone ? (
                  <Check className="h-3 w-3 dark:text-emerald-400 text-emerald-700" />
                ) : (
                  <span
                    className={cn(
                      'text-xs font-semibold',
                      isCurrent && 'dark:text-amber-400 text-amber-700',
                      isNext && 'dark:text-sky-400 text-sky-700',
                      !isCurrent && !isNext && 'text-muted-foreground'
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs font-semibold text-center',
                  isCurrent && 'dark:text-amber-400 text-amber-700',
                  isNext && 'dark:text-sky-400 text-sky-700',
                  isDone && 'dark:text-emerald-400 text-emerald-700',
                  !isDone && !isCurrent && !isNext && 'text-muted-foreground'
                )}
              >
                {prayer.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

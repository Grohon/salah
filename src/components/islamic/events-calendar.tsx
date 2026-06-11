'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { getIslamicEvents, getUpcomingEvents, getDaysUntilEvent } from '@/lib/islamic-calendar';
import { CalendarDays, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HijriDate } from '@/lib/types';

export function IslamicEventsCalendar({ hijriDate }: { hijriDate?: HijriDate | null }) {
  const events = useMemo(() => getIslamicEvents(hijriDate ?? null), [hijriDate]);
  const upcoming = useMemo(() => getUpcomingEvents(events, 3), [events]);

  return (
    <GlassCard>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <CalendarDays className="h-5 w-5 dark:text-emerald-400 text-emerald-700" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Islamic Events</h3>
          <p className="text-sm text-muted-foreground">Upcoming Islamic dates</p>
        </div>
      </div>

      <div className="space-y-4">
        {upcoming.map((event, index) => {
          const daysUntil = getDaysUntilEvent(event);
          return (
            <motion.div
              key={event.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center gap-4 rounded-xl p-4 transition-colors',
                event.type === 'important' ? 'dark:bg-amber-500/5 bg-amber-50' : 'bg-muted/30'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  event.type === 'important' ? 'dark:bg-amber-500/10 bg-amber-100' : 'bg-emerald-500/10'
                )}
              >
                <Star
                  className={cn(
                    'h-5 w-5',
                    event.type === 'important' ? 'dark:text-amber-400 text-amber-700' : 'dark:text-emerald-400 text-emerald-700'
                  )}
                />
              </div>

              <div className="flex-1">
                <p
                  className={cn(
                    'font-semibold',
                    event.type === 'important' ? 'dark:text-amber-400 text-amber-700' : 'text-foreground'
                  )}
                >
                  {event.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {event.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="text-right">
                <p
                  className={cn(
                    'text-sm font-bold',
                    daysUntil <= 7 ? 'dark:text-amber-400 text-amber-700' : 'text-muted-foreground'
                  )}
                >
                  {daysUntil}d
                </p>
                <p className="text-xs text-muted-foreground">away</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {upcoming.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No upcoming events found.
        </p>
      )}
    </GlassCard>
  );
}

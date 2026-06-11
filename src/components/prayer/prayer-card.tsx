'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/shared/glass-card';
import type { PrayerTimeData } from '@/lib/types';
import { Sunrise, Sunset, CloudMoon, Sun, Moon, Star } from 'lucide-react';

const PRAYER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  fajr: Star,
  sunrise: Sunrise,
  dhuhr: Sun,
  asr: Sun,
  maghrib: Sunset,
  isha: Moon,
};

interface PrayerCardProps {
  prayer: PrayerTimeData;
  sunriseTime?: string;
}

export function PrayerCard({ prayer, sunriseTime }: PrayerCardProps) {
  const Icon = PRAYER_ICONS[prayer.key] || CloudMoon;
  const isNext = prayer.isNext;
  const isCompleted = prayer.status === 'completed';
  const isCurrent = prayer.status === 'current';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <GlassCard
        glow={isNext ? 'gold' : 'none'}
        hover={!isCompleted}
        className={cn(
          'flex h-full flex-col items-center gap-3 px-4 py-5 text-center overflow-hidden transition-all duration-300',
          isNext && 'ring-1 ring-amber-500/30',
          isCurrent && 'ring-1 ring-emerald-500/30'
        )}
      >
        {isNext && (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
        )}
        {isCurrent && (
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        )}

        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            isNext && 'dark:bg-amber-500/10 bg-amber-100 dark:text-amber-400 text-amber-700',
            isCurrent && 'bg-emerald-500/10 dark:text-emerald-400 text-emerald-700',
            !isNext && !isCurrent && 'bg-muted/30 text-muted-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p
            className={cn(
              'text-sm font-semibold',
              isNext && 'dark:text-amber-400 text-amber-700',
              isCurrent && 'dark:text-emerald-400 text-emerald-700',
              isCompleted && 'text-muted-foreground'
            )}
          >
            {prayer.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {isNext && 'Next'}
            {isCurrent && 'Current'}
            {isCompleted && 'Done'}
            {!isNext && !isCurrent && !isCompleted && 'Upcoming'}
          </p>
        </div>

        <div className="text-center">
          <p
            className={cn(
              'text-lg font-bold tracking-tight',
              isNext && 'dark:text-amber-400 text-amber-700',
              isCurrent && 'dark:text-emerald-400 text-emerald-700',
              isCompleted && 'dark:text-muted-foreground text-muted-foreground'
            )}
          >
            {prayer.time}
          </p>
          {prayer.endTime && (
            <p className={cn('text-xs', isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground/60')}>
              until {prayer.endTime}
            </p>
          )}
          {sunriseTime && (
            <p className={cn('text-xs', isCompleted ? 'text-muted-foreground/70' : 'text-muted-foreground/60')}>
              Sunrise {sunriseTime}
            </p>
          )}
          {prayer.makruhTime && (
            <p className="text-xs dark:text-red-400 text-red-700">Makruh: {prayer.makruhTime}</p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

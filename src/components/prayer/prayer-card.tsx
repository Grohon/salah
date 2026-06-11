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
}

export function PrayerCard({ prayer }: PrayerCardProps) {
  const Icon = PRAYER_ICONS[prayer.key] || CloudMoon;
  const isNext = prayer.isNext;
  const isCompleted = prayer.status === 'completed';
  const isCurrent = prayer.status === 'current';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard
        glow={isNext ? 'gold' : 'none'}
        hover={!isCompleted}
        className={cn(
          'relative flex items-center justify-between overflow-hidden transition-all duration-300',
          isCompleted && 'opacity-40',
          isNext && 'ring-1 ring-amber-500/30',
          isCurrent && 'ring-1 ring-emerald-500/30'
        )}
      >
        {isNext && (
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent" />
        )}
        {isCurrent && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent" />
        )}

        <div className="relative z-10 flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              isNext && 'dark:bg-amber-500/10 bg-amber-100 dark:text-amber-400 text-amber-700',
              isCurrent && 'bg-emerald-500/10 dark:text-emerald-400 text-emerald-700',
              !isNext && !isCurrent && 'bg-muted/30 text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p
              className={cn(
                'text-lg font-semibold',
                isNext && 'dark:text-amber-400 text-amber-700',
                isCurrent && 'dark:text-emerald-400 text-emerald-700'
              )}
            >
              {prayer.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {isNext && 'Next Prayer'}
              {isCurrent && 'Current Prayer'}
              {isCompleted && 'Completed'}
              {!isNext && !isCurrent && !isCompleted && 'Upcoming'}
            </p>
          </div>
        </div>

        <div className="relative z-10 text-right">
          <p
            className={cn(
              'text-2xl font-bold tracking-tight',
              isNext && 'dark:text-amber-400 text-amber-700',
              isCurrent && 'dark:text-emerald-400 text-emerald-700'
            )}
          >
            {prayer.time}{prayer.endTime ? ` — ${prayer.endTime}` : ''}
          </p>
          {prayer.makruhTime && (
            <p className="text-xs dark:text-red-400 text-red-700">
              Makruh: {prayer.makruhTime}
            </p>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}

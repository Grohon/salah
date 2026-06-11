'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { CountdownTimer } from '@/components/prayer/countdown-timer';
import type { PrayerTimeData } from '@/lib/types';
import { PrayerName } from '@/lib/types';
import { Star, Sunrise, Sun, Sunset, Moon, CloudMoon, Play } from 'lucide-react';

const PRAYER_LARGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  [PrayerName.Fajr]: Star,
  [PrayerName.Sunrise]: Sunrise,
  [PrayerName.Dhuhr]: Sun,
  [PrayerName.Asr]: Sun,
  [PrayerName.Maghrib]: Sunset,
  [PrayerName.Isha]: Moon,
};

interface CurrentPrayerHeroProps {
  currentPrayer: PrayerTimeData | null;
  nextPrayer: PrayerTimeData | null;
}

export function CurrentPrayerHero({ currentPrayer, nextPrayer }: CurrentPrayerHeroProps) {
  if (!currentPrayer) return null;

  const Icon = PRAYER_LARGE_ICONS[currentPrayer.name] || CloudMoon;

  return (
    <section className="relative">
      <GlassCard glow="gold" className="overflow-hidden p-5 md:p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium dark:text-emerald-400 text-emerald-700">
            <Play className="h-2.5 w-2.5 dark:fill-emerald-400 fill-emerald-700" />
            <span>Current Prayer</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-3 md:flex-row md:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 md:h-14 md:w-14">
                <Icon className="h-6 w-6 dark:text-emerald-400 text-emerald-700 md:h-7 md:w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground md:text-2xl">
                  {currentPrayer.name}
                </h2>
                <p className="text-lg font-semibold dark:text-emerald-400 text-emerald-700 md:text-xl">
                  {currentPrayer.time}
                </p>
              </div>
            </div>

            {nextPrayer && (
              <div className="w-full md:w-auto">
                <CountdownTimer
                  targetDate={nextPrayer.timeDate}
                  prayerName={nextPrayer.name}
                  targetTime={nextPrayer.time}
                />
              </div>
            )}
          </motion.div>
        </div>
      </GlassCard>
    </section>
  );
}

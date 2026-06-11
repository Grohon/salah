'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GreetingHero } from '@/components/prayer/greeting-hero';
import { CurrentPrayerHero } from '@/components/prayer/current-prayer-hero';
import { PrayerCard } from '@/components/prayer/prayer-card';
import { PrayerTimeline } from '@/components/prayer/prayer-timeline';
import { WeatherWidget } from '@/components/weather/weather-widget';
import { IslamicEventsCalendar } from '@/components/islamic/events-calendar';
import { LocationDetect } from '@/components/location/location-detect';
import { CitySearch } from '@/components/location/city-search';
import { useLocation } from '@/hooks/use-location';
import { usePrayerTimes } from '@/hooks/use-prayer-times';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/shared/glass-card';
import { CalendarDays, RefreshCw, Wifi } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { location, loading: locLoading, error: locError, detectLocation, setManualLocation, fallbackToIp } = useLocation();
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  const { prayerTimes, hijriDate, gregorianDate, loading: prayerLoading, error: prayerError, nextPrayer, currentPrayer } = usePrayerTimes(location);

  const timelinePrayers = useMemo(
    () => prayerTimes.filter(p => p.key !== 'sunrise' && p.key !== 'tahajjud'),
    [prayerTimes]
  );

  const isLoading = locLoading || prayerLoading;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 py-4 md:py-8"
    >
      {isLoading && !location && (
        <motion.div variants={itemVariants} className="space-y-6">
          <Skeleton className="h-16 w-72" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </motion.div>
      )}

      {locError && !location && (
        <motion.div variants={itemVariants}>
          <LocationDetect
            loading={locLoading}
            error={locError}
            onDetect={detectLocation}
            onSelect={setManualLocation}
            onFallbackToIp={fallbackToIp}
          />
        </motion.div>
      )}

      {location && (
        <>
          {location.confidence === 'low' && (
            <motion.div
              variants={itemVariants}
              className="rounded-2xl border dark:border-amber-500/20 border-amber-300 dark:bg-amber-500/5 bg-amber-50 px-5 py-3 text-center text-sm dark:text-amber-400 text-amber-700"
            >
              Approximate location detected. Prayer times may vary.
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <motion.div variants={itemVariants}>
              <GreetingHero
                location={location}
                hijriDate={hijriDate}
                gregorianDate={gregorianDate}
                onChangeLocation={() => setShowLocationSearch(v => !v)}
              />
            </motion.div>

            <div className="flex flex-col gap-4">
              <motion.div variants={itemVariants}>
                <CurrentPrayerHero currentPrayer={currentPrayer} nextPrayer={nextPrayer} />
              </motion.div>

              {timelinePrayers.length > 0 && (
                <motion.div variants={itemVariants}>
                  <GlassCard className="p-4">
                    <PrayerTimeline prayers={timelinePrayers} />
                  </GlassCard>
                </motion.div>
              )}
            </div>

            {showLocationSearch && (
              <motion.div
                variants={itemVariants}
                className="md:col-span-2"
              >
                <div className="space-y-3 rounded-2xl border border-border bg-muted/50 p-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { detectLocation(); setShowLocationSearch(false); }}
                      className="dark:text-emerald-400 text-emerald-700 hover:dark:text-emerald-300 hover:text-emerald-600"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Detect GPS
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { fallbackToIp(); setShowLocationSearch(false); }}
                      className="dark:text-amber-400 text-amber-700 hover:text-amber-300"
                    >
                      <Wifi className="mr-2 h-4 w-4" />
                      Use IP
                    </Button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-3 text-xs text-muted-foreground">
                        or search city
                      </span>
                    </div>
                  </div>
                  <CitySearch onSelect={(loc) => { setManualLocation(loc); setShowLocationSearch(false); }} />
                </div>
              </motion.div>
            )}

            {prayerError && (
              <motion.div
                variants={itemVariants}
                className="md:col-span-2"
              >
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-center text-sm dark:text-red-400 text-red-700">
                  {prayerError}
                </div>
              </motion.div>
            )}

            {prayerLoading && !currentPrayer && (
              <motion.div variants={itemVariants} className="md:col-span-2">
                <Skeleton className="h-48 w-full rounded-2xl" />
              </motion.div>
            )}
          </div>

          {prayerTimes.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">Today&apos;s Prayer Times</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 items-stretch">
                {prayerTimes
                  .filter(p => p.key !== 'sunrise' && p.key !== 'tahajjud')
                  .map((prayer) => (
                    <PrayerCard
                      key={prayer.key}
                      prayer={prayer}
                      sunriseTime={prayer.key === 'fajr' ? prayerTimes.find(p => p.key === 'sunrise')?.time : undefined}
                    />
                  ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <IslamicEventsCalendar hijriDate={hijriDate} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              href="/calendar"
              className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-muted/50 px-6 py-4 backdrop-blur-xl transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/5"
            >
              <CalendarDays className="h-5 w-5 dark:text-emerald-400 text-emerald-700" />
              <span className="font-medium text-foreground">View Monthly Prayer Calendar</span>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <WeatherWidget location={location} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

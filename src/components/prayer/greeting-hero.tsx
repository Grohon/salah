'use client';

import { motion } from 'framer-motion';
import { DigitalClock } from '@/components/shared/digital-clock';
import { MapPin, Wifi, Satellite, AlertTriangle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LocationData } from '@/lib/types';

interface GreetingHeroProps {
  location: LocationData | null;
  hijriDate: { weekday: string; day: string; month: string; year: string } | null;
  gregorianDate: { weekday: string; day: string; month: string; year: string } | null;
  onChangeLocation?: () => void;
}

function getGreeting(): string {
  return 'Assalamu Alaikum';
}

const SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  gps: Satellite,
  ip_geolocation: Wifi,
  user_selected: MapPin,
};

const SOURCE_LABELS: Record<string, string> = {
  gps: 'Precise GPS',
  ip_geolocation: 'Approximate location',
  user_selected: 'Selected city',
};

export function GreetingHero({ location, hijriDate, gregorianDate, onChangeLocation }: GreetingHeroProps) {
  const SourceIcon = location ? SOURCE_ICONS[location.locationSource] || MapPin : MapPin;
  const sourceLabel = location ? SOURCE_LABELS[location.locationSource] : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center md:text-left"
    >
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl"
      >
        {getGreeting()}
      </motion.h1>

      {location && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 flex flex-col items-center gap-2 md:flex-row md:justify-start"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 dark:text-emerald-400 text-emerald-700" />
            <span>
              {location.city}, {location.country}
            </span>
            {onChangeLocation && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onChangeLocation}
                className="ml-1 h-6 w-6 text-muted-foreground hover:dark:text-emerald-400 hover:text-emerald-700"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
          </div>

          <div
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
              location.locationSource === 'gps' && 'bg-emerald-500/10 dark:text-emerald-400 text-emerald-700',
              location.locationSource === 'ip_geolocation' && 'dark:bg-amber-500/10 bg-amber-100 dark:text-amber-400 text-amber-700',
              location.locationSource === 'user_selected' && 'bg-blue-500/10 dark:text-blue-400 text-blue-700'
            )}
          >
            <SourceIcon className="h-3 w-3" />
            <span>{sourceLabel}</span>
            {location.isApproximate && (
              <AlertTriangle className="ml-0.5 h-3 w-3 dark:text-amber-400 text-amber-700" />
            )}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4 flex flex-col items-center gap-1 md:items-start"
      >
        {gregorianDate && (
          <p className="text-lg text-muted-foreground">
            {gregorianDate.weekday}, {gregorianDate.month} {gregorianDate.day}, {gregorianDate.year}
          </p>
        )}
        {hijriDate && (
          <p className="text-base dark:text-emerald-400 text-emerald-700">
            {hijriDate.weekday}, {hijriDate.month} {hijriDate.day}, {hijriDate.year} AH
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-5"
      >
        <DigitalClock
          className="tabular-nums text-5xl font-bold text-muted-foreground md:text-6xl"
          format="12h"
        />
      </motion.div>
    </motion.div>
  );
}

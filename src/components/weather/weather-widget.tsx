'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { useWeather } from '@/hooks/use-weather';
import type { LocationData } from '@/lib/types';
import { getWeatherDescription, getWeatherIcon } from '@/lib/api/weather';
import { Sun, CloudSun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherWidgetProps {
  location: LocationData | null;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: Sun,
  'cloud-sun': CloudSun,
  'cloud-fog': CloudFog,
  'cloud-drizzle': CloudRain,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'cloud-lightning': CloudLightning,
};

export function WeatherWidget({ location }: WeatherWidgetProps) {
  const { weather, loading, error } = useWeather(location);

  if (!location) return null;

  if (error) {
    return (
      <GlassCard>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30">
            <Cloud className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weather unavailable</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!weather) return null;

  const iconKey = getWeatherIcon(weather.weatherCode);
  const Icon = ICON_MAP[iconKey] || Cloud;
  const description = getWeatherDescription(weather.weatherCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <GlassCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <Icon className="h-6 w-6 dark:text-emerald-400 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{description}</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(weather.temperature)}&deg;C
              </p>
            </div>
          </div>

          <div className="hidden text-right text-xs text-muted-foreground sm:block">
            <div className="flex items-center gap-2">
              <Sun className="h-3 w-3" />
              <span>
                {new Date(weather.sunrise).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="h-3 w-3" />
              <span>
                {new Date(weather.sunset).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

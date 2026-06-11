'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { useQibla } from '@/hooks/use-qibla';
import { Loader2, Compass as CompassIcon } from 'lucide-react';
import { getCompassDirection } from '@/lib/qibla';

interface QiblaCompassProps {
  latitude: number | null;
  longitude: number | null;
}

export function QiblaCompass({ latitude, longitude }: QiblaCompassProps) {
  const { direction, deviceOrientation, loading, error, compassBearing } = useQibla(
    latitude,
    longitude
  );

  return (
    <GlassCard className="flex flex-col items-center p-8 md:p-12">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Qibla Direction</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Facing Makkah from your location
      </p>

      {loading && (
        <div className="flex items-center gap-3 py-12">
          <Loader2 className="h-5 w-5 animate-spin dark:text-emerald-400 text-emerald-700" />
          <p className="text-muted-foreground">Calibrating compass...</p>
        </div>
      )}

      {error && (
        <div className="py-12 text-center">
          <CompassIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Qibla direction: {direction.toFixed(1)}&deg;
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative h-64 w-64 md:h-80 md:w-80">
            <motion.div
              className="h-full w-full rounded-full border-2 border-border"
              animate={{ rotate: deviceOrientation !== null ? -deviceOrientation : 0 }}
              transition={{ type: 'spring', stiffness: 10, damping: 20 }}
            />

            {deviceOrientation !== null && (
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: compassBearing }}
                transition={{ type: 'spring', stiffness: 50, damping: 15 }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-2xl">▲</div>
                  <div className="mt-1 text-xs font-bold dark:text-amber-400 text-amber-700">Qibla</div>
                </div>
              </motion.div>
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
            </div>
          </div>

          <div className="mt-6 text-3xl font-bold dark:text-emerald-400 text-emerald-700">
            {direction.toFixed(1)}&deg;
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-6 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Qibla Direction</p>
          <p className="text-xl font-bold text-foreground">{direction.toFixed(1)}&deg;</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">From North</p>
          <p className="text-xl font-bold text-foreground">
            {getCompassDirection(direction)}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

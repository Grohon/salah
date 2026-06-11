'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '@/hooks/use-location';
import { QiblaCompass } from '@/components/qibla/qibla-compass';
import { LocationDetect } from '@/components/location/location-detect';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/shared/glass-card';
import { Compass } from 'lucide-react';

export default function QiblaPage() {
  const { location, loading, error, detectLocation, setManualLocation, fallbackToIp } = useLocation();

  useEffect(() => {
    document.title = 'Qibla Direction | Salah';
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 py-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full max-w-md rounded-2xl" />
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="space-y-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">Qibla Direction</h1>
          <p className="mb-8 text-muted-foreground">
            Find the direction of the Kaaba in Makkah from your location.
          </p>
          <LocationDetect
            loading={loading}
            error={error}
            onDetect={detectLocation}
            onSelect={setManualLocation}
            onFallbackToIp={fallbackToIp}
          />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 py-4 md:py-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">Qibla Direction</h1>
        <p className="mt-1 text-muted-foreground">
          Find the direction of the Kaaba from your location
        </p>
      </div>

      {location ? (
        <div className="flex justify-center">
          <QiblaCompass latitude={location.latitude} longitude={location.longitude} />
        </div>
      ) : (
        <GlassCard>
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <Compass className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              Select a location to find the Qibla direction.
            </p>
          </div>
        </GlassCard>
      )}
    </motion.div>
  );
}

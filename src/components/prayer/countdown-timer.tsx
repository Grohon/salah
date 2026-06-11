'use client';

import { motion } from 'framer-motion';
import { useCountdown } from '@/hooks/use-countdown';
import { AnimatedNumber } from '@/components/shared/animated-number';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date | null;
  prayerName?: string;
  targetTime?: string;
  className?: string;
}

export function CountdownTimer({ targetDate, prayerName, targetTime, className }: CountdownTimerProps) {
  const { hours, minutes, seconds, isComplete } = useCountdown(targetDate);

  if (!targetDate || isComplete) {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-lg dark:text-emerald-400 text-emerald-700">Prayer time is here</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('text-center', className)}
    >
      {prayerName && (
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Time until <span className="dark:text-amber-400 text-amber-700">{prayerName}</span>
          {targetTime && <span className="ml-1.5 text-muted-foreground">— {targetTime}</span>}
        </p>
      )}

      <div className="flex items-center justify-center gap-4" role="timer" aria-label={`Countdown to ${prayerName || 'next prayer'}`}>
        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <AnimatedNumber value={hours} className="text-4xl font-bold tabular-nums md:text-5xl" digits={2} />
            <span className="text-lg text-muted-foreground">h</span>
          </div>
        </div>

        <span className="mt-2 text-3xl font-bold text-muted-foreground">:</span>

        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <AnimatedNumber value={minutes} className="text-4xl font-bold tabular-nums md:text-5xl" digits={2} />
            <span className="text-lg text-muted-foreground">m</span>
          </div>
        </div>

        <span className="mt-2 text-3xl font-bold text-muted-foreground">:</span>

        <div className="flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <AnimatedNumber value={seconds} className="text-4xl font-bold tabular-nums md:text-5xl" digits={2} />
            <span className="text-lg text-muted-foreground">s</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

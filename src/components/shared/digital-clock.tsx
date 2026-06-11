'use client';

import { useClock } from '@/hooks/use-clock';
import { cn } from '@/lib/utils';

interface DigitalClockProps {
  className?: string;
  format?: '12h' | '24h';
}

export function DigitalClock({ className, format = '24h' }: DigitalClockProps) {
  const { formattedTime, formatted12 } = useClock();

  return (
    <div className={cn('tabular-nums tracking-wider', className)}>
      {format === '24h' ? formattedTime : formatted12}
    </div>
  );
}

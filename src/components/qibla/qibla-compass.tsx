'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { useQibla } from '@/hooks/use-qibla';
import { Loader2, Compass as CompassIcon, Navigation } from 'lucide-react';
import { getCompassDirection } from '@/lib/qibla';

interface QiblaCompassProps {
  latitude: number | null;
  longitude: number | null;
}

const S = 400;
const C = S / 2;

function polar(r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) };
}

function CompassRose() {
  const ticks: React.ReactNode[] = [];
  for (let a = 0; a < 360; a += 15) {
    const isCard = a % 90 === 0;
    const isMid = a % 45 === 0;
    const ri = isCard ? 148 : isMid ? 155 : 162;
    const ro = 175;
    const p1 = polar(ri, a);
    const p2 = polar(ro, a);
    ticks.push(
      <line
        key={a}
        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        className={isCard ? 'stroke-foreground stroke-[2.5]' : isMid ? 'stroke-muted-foreground/60 stroke-[2]' : 'stroke-border stroke-[1]'}
      />
    );
  }

  const labels = [
    [0, 'N', true],
    [90, 'E', false],
    [180, 'S', false],
    [270, 'W', false],
  ] as const;
  const labelEls = labels.map(([deg, text, isN]) => {
    const p = polar(138, deg);
    return (
      <text
        key={text}
        x={p.x} y={p.y}
        textAnchor="middle"
        dominantBaseline="central"
        className={isN ? 'fill-red-500 dark:fill-red-400 text-[16px] font-bold' : 'fill-muted-foreground text-[14px] font-bold'}
      >
        {text}
      </text>
    );
  });

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="h-full w-full select-none overflow-visible">
      <circle cx={C} cy={C} r={183} fill="none" className="stroke-border stroke-[1.5]" />
      <circle cx={C} cy={C} r={175} fill="none" className="stroke-border/40 stroke-[1]" />
      {ticks}
      {labelEls}
    </svg>
  );
}

function HeadingNeedle({ angle }: { angle: number }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      animate={{ rotate: angle }}
      transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 0.3 }}
      style={{ originX: '50%', originY: '50%' }}
    >
      <svg width="16" height="120" viewBox="0 0 16 120" className="drop-shadow-md">
        <polygon points="8,4 4,60 8,54 12,60" className="fill-red-500 dark:fill-red-400" />
        <polygon points="4,60 8,116 12,60 8,54" className="fill-gray-300 dark:fill-gray-600" />
        <circle cx="8" cy="57" r="3" className="fill-white dark:fill-gray-900" />
      </svg>
    </motion.div>
  );
}

function QiblaNeedle({ angle }: { angle: number }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      animate={{ rotate: angle }}
      transition={{ type: 'spring', stiffness: 60, damping: 18, mass: 0.4 }}
      style={{ originX: '50%', originY: '50%' }}
    >
      <svg width="20" height="130" viewBox="0 0 20 130" className="drop-shadow-lg">
        <defs>
          <filter id="qibla-glow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="currentColor" floodOpacity="0.4" />
          </filter>
        </defs>
        <g filter="url(#qibla-glow)" className="text-amber-500 dark:text-amber-400">
          <polygon points="10,4 5,66 10,58 15,66" fill="currentColor" />
          <polygon points="5,66 10,126 15,66 10,58" className="fill-gray-400 dark:fill-gray-500" />
          <circle cx="10" cy="62" r="4" className="fill-white dark:fill-gray-900" />
          <circle cx="10" cy="62" r="2" fill="currentColor" />
        </g>
      </svg>
    </motion.div>
  );
}

export function QiblaCompass({ latitude, longitude }: QiblaCompassProps) {
  const { direction, heading, loading, error } = useQibla(
    latitude,
    longitude
  );

  const active = !loading && heading !== null;
  const qiblaAngle = heading !== null
    ? (direction - heading + 360) % 360
    : direction;
  const headingAngle = heading !== null ? -heading : 0;

  const dimClass = 'dark:text-emerald-400 text-emerald-700';

  return (
    <GlassCard className="flex flex-col items-center p-8 md:p-12">
      <h2 className="mb-2 text-2xl font-bold text-foreground">Qibla Direction</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Facing Makkah from your location
      </p>

      {loading && (
        <div className="flex items-center gap-3 py-12">
          <Loader2 className={`h-5 w-5 animate-spin ${dimClass}`} />
          <p className="text-muted-foreground">Calibrating compass...</p>
        </div>
      )}

      {error && !active && (
        <div className="py-12 text-center">
          <CompassIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">{error}</p>
          <p className={`mt-2 text-sm ${dimClass}`}>
            Qibla direction: {direction.toFixed(1)}&deg;
          </p>
        </div>
      )}

      {(!loading || active) && (
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative h-72 w-72 md:h-80 md:w-80">
            <CompassRose />

            {active && <HeadingNeedle angle={headingAngle} />}

            <QiblaNeedle angle={qiblaAngle} />

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="h-5 w-5 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-lg shadow-emerald-500/40 z-10 relative" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Qibla</p>
              <p className={`text-xl font-bold ${dimClass}`}>
                {direction.toFixed(1)}&deg;
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Direction</p>
              <p className={`text-xl font-bold ${dimClass}`}>
                {getCompassDirection(direction)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{active ? 'Heading' : 'Bearing'}</p>
              <p className="text-xl font-bold text-foreground">
                {active ? `${heading!.toFixed(0)}°` : `${direction.toFixed(0)}°`}
              </p>
            </div>
          </div>

          {active && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Turn until the gold arrow points up
            </p>
          )}

          {!active && heading === null && !loading && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Navigation className="h-3 w-3" />
              Point your phone north to activate the compass
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
}

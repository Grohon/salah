'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { useQibla } from '@/hooks/use-qibla';
import { Loader2, Compass as CompassIcon, AlertTriangle } from 'lucide-react';
import { getCompassDirection } from '@/lib/qibla';

interface QiblaCompassProps {
  latitude: number | null;
  longitude: number | null;
}

const SVG_SIZE = 400;
const CX = SVG_SIZE / 2;
const CY = SVG_SIZE / 2;
const OUTER_R = 185;
const INNER_R = 175;
const TICK_OUTER = 175;
const TICK_MAJOR_INNER = 150;
const TICK_MINOR_INNER = 160;
const LABEL_R = 142;
const NEEDLE_LEN = 120;

function polarX(r: number, angleDeg: number): number {
  return CX + r * Math.cos(((angleDeg - 90) * Math.PI) / 180);
}
function polarY(r: number, angleDeg: number): number {
  return CY + r * Math.sin(((angleDeg - 90) * Math.PI) / 180);
}

function CompassDial({ direction }: { direction: number }) {
  const ticks: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];

  for (let a = 0; a < 360; a += 15) {
    const major = a % 90 === 0;
    const medium = a % 45 === 0;
    const innerR = major ? TICK_MAJOR_INNER : medium ? 154 : TICK_MINOR_INNER;
    ticks.push(
      <line
        key={`t-${a}`}
        x1={polarX(innerR, a)}
        y1={polarY(innerR, a)}
        x2={polarX(TICK_OUTER, a)}
        y2={polarY(TICK_OUTER, a)}
        className={
          major
            ? 'stroke-foreground stroke-[2.5]'
            : medium
              ? 'stroke-muted-foreground/60 stroke-[2]'
              : 'stroke-border stroke-[1]'
        }
      />
    );
  }

  const cardinals: [number, string, boolean][] = [
    [0, 'N', true],
    [90, 'E', false],
    [180, 'S', false],
    [270, 'W', false],
  ];
  for (const [angle, text, isNorth] of cardinals) {
    labels.push(
      <text
        key={`c-${angle}`}
        x={polarX(LABEL_R, angle)}
        y={polarY(LABEL_R, angle)}
        textAnchor="middle"
        dominantBaseline="central"
        className={
          isNorth
            ? 'fill-red-500 dark:fill-red-400 text-[16px] font-bold'
            : 'fill-muted-foreground text-[14px] font-bold'
        }
      >
        {text}
      </text>
    );
  }

  return (
    <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="h-full w-full select-none overflow-visible">
      <defs>
        <filter id="qibla-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="currentColor" floodOpacity="0.5" />
        </filter>
        <filter id="needle-shadow">
          <feDropShadow dx="1" dy="1" stdDeviation="2" floodOpacity="0.25" />
        </filter>
      </defs>

      <circle
        cx={CX} cy={CY} r={OUTER_R}
        fill="none"
        className="stroke-border stroke-[1.5]"
      />

      <circle
        cx={CX} cy={CY} r={INNER_R}
        fill="none"
        className="stroke-border/50 stroke-[1]"
      />

      <circle
        cx={CX} cy={CY} r={TICK_OUTER}
        fill="none"
        className="stroke-border/30 stroke-[0.5]"
      />

      {ticks}
      {labels}

      <g transform={`rotate(${direction}, ${CX}, ${CY})`}>
        <line
          x1={CX} y1={CY}
          x2={CX} y2={CY - NEEDLE_LEN}
          className="stroke-amber-500 dark:stroke-amber-400 stroke-[3]"
          strokeLinecap="round"
          filter="url(#qibla-glow)"
        />
        <polygon
          points={`${CX - 8},${CY - NEEDLE_LEN + 4} ${CX},${CY - NEEDLE_LEN - 8} ${CX + 8},${CY - NEEDLE_LEN + 4}`}
          className="fill-amber-500 dark:fill-amber-400"
          filter="url(#qibla-glow)"
        />
        <circle
          cx={CX} cy={CY - NEEDLE_LEN - 1} r={2}
          className="fill-amber-500 dark:fill-amber-400"
        />
      </g>

      <circle
        cx={CX} cy={CY} r={8}
        className="fill-emerald-500 dark:fill-emerald-400"
      />
      <circle
        cx={CX} cy={CY} r={3}
        className="fill-white/80 dark:fill-white/80"
      />
    </svg>
  );
}

function HeadingIndicator() {
  return (
    <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
      <div className="flex flex-col items-center">
        <svg width="16" height="20" viewBox="0 0 16 20" className="drop-shadow-md">
          <polygon
            points="8,20 0,0 16,0"
            className="fill-emerald-500 dark:fill-emerald-400"
          />
        </svg>
        <span className="mt-0.5 whitespace-nowrap text-[10px] font-bold tracking-tight text-muted-foreground">
          FACING
        </span>
      </div>
    </div>
  );
}

export function QiblaCompass({ latitude, longitude }: QiblaCompassProps) {
  const { direction, heading, smoothedHeading, loading, error, absolute } = useQibla(
    latitude,
    longitude
  );

  const active = !loading && heading !== null;
  const rot = smoothedHeading !== null ? -smoothedHeading : 0;

  const dimClass = 'dark:text-emerald-400 text-emerald-700';
  const mutedDimClass = 'dark:text-amber-400/70 text-amber-700/70';

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
        <>
          <div className="relative flex items-center justify-center">
            <div className="relative h-72 w-72 md:h-80 md:w-80">
              <motion.div
                className="h-full w-full"
                animate={{ rotate: rot }}
                transition={{ type: 'spring', stiffness: 40, damping: 20, mass: 0.5 }}
              >
                <CompassDial direction={direction} />
              </motion.div>

              {active && <HeadingIndicator />}
            </div>
          </div>

          {active && !absolute && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              <span>Relative heading — accuracy may vary by device orientation.</span>
            </div>
          )}
        </>
      )}

      <div className="mt-6 grid grid-cols-2 gap-6 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Qibla Direction</p>
          <p className={`text-3xl font-bold ${dimClass}`}>
            {direction.toFixed(1)}&deg;
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">From North</p>
          <p className={`text-3xl font-bold ${dimClass}`}>
            {getCompassDirection(direction)}
          </p>
        </div>
      </div>

      {active && (
        <p className={`mt-2 text-xs ${mutedDimClass}`}>
          Rotate your body until the gold arrow points up to face Qibla
        </p>
      )}
    </GlassCard>
  );
}

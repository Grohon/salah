'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'emerald' | 'gold' | 'none';
  hover?: boolean;
}

export function GlassCard({ children, className, glow = 'none', hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-2xl border border-border bg-muted/50 backdrop-blur-xl p-6 shadow-lg',
        'transition-shadow duration-300',
        glow === 'emerald' && 'shadow-emerald-500/10 hover:shadow-emerald-500/20',
        glow === 'gold' && 'shadow-amber-500/10 hover:shadow-amber-500/20',
        hover && 'hover:border-muted-foreground/20',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

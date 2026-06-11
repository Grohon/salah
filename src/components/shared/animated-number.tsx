'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  digits?: number;
}

export function AnimatedNumber({ value, className, digits = 2 }: AnimatedNumberProps) {
  const strValue = String(value).padStart(digits, '0');

  return (
    <span className={cn('inline-flex tabular-nums', className)}>
      {strValue.split('').map((digit, index) => (
        <AnimatePresence mode="popLayout" key={`${index}-${digit}`}>
          <motion.span
            key={`${index}-${digit}`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="inline-block"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      ))}
    </span>
  );
}

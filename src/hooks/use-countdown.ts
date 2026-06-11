'use client';

import { useState, useEffect, useRef } from 'react';

interface CountdownData {
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function calc(targetDate: Date | null): CountdownData {
  if (!targetDate) {
    return { totalSeconds: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { totalSeconds: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { totalSeconds, hours, minutes, seconds, isComplete: false };
}

export function useCountdown(targetDate: Date | null): CountdownData {
  const [countdown, setCountdown] = useState<CountdownData>(() => calc(targetDate));
  const targetRef = useRef(targetDate);

  useEffect(() => {
    targetRef.current = targetDate;

    const interval = setInterval(() => {
      setCountdown(calc(targetRef.current));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}

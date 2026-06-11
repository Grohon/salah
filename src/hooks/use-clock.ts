'use client';

import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const period = hours >= 12 ? 'PM' : 'AM';
  const formatted12 = `${String(hours % 12 || 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;

  return { time, formattedTime, formatted12, hours, minutes, seconds };
}

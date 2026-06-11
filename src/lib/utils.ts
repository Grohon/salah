import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTo12h(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTimeStrTo12h(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date(0, 0, 0, h, m);
  return formatTo12h(date);
}

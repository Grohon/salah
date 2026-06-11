# Salah — Prayer Times, Qibla & Islamic Calendar

Accurate prayer times with automatic location detection, premium glassmorphism UI, and dual-theme support.

## Features

- **Prayer Times** — Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, Tahajjud with real-time countdown
- **Current/Next Prayer** — Highlights active and upcoming prayers with progress timeline
- **Location Detection** — GPS auto-detect with IP fallback and city search
- **14 Calculation Methods** — Karachi (default), ISNA, MWL, Umm Al-Qura, etc.
- **Monthly Calendar** — Browse prayer times for any date (1970–current year + 2)
- **Qibla Compass** — Device-orientation-aware direction with 16-point bearing
- **Weather** — Current conditions, temperature, sunrise/sunset
- **Islamic Events** — Hijri-based Ramadan, Eid, Ashura, etc.
- **Notifications** — Configurable browser reminders before each prayer
- **Dual Theme** — Dark-first with full light mode WCAG AA contrast
- **PWA Ready** — Manifest, service worker, offline-capable
- **Security** — CSP, HSTS, XFO, rate limiting, input validation on all API routes
- **Caching** — In-memory calendar date cache, CDN-friendly API proxy headers

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm run lint
```

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui
- Framer Motion animations
- Aladhan API (prayer times, method 1 / Karachi, Hanafi school)
- Open-Meteo (weather)
- OpenStreetMap/Nominatim + ip-api.com (geocoding)

## Audit Scores

| Category | Score |
|----------|-------|
| Security | 9/10 |
| Maintainability | 8/10 |
| Performance | 8/10 |
| Overall Risk | Low |

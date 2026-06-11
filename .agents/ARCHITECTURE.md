# Architecture — Salah App

## Folder Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (providers, fonts, metadata)
│   ├── page.tsx              # Homepage
│   ├── loading.tsx           # Global loading state
│   ├── error.tsx             # Global error boundary
│   ├── not-found.tsx         # 404 page
│   ├── calendar/
│   │   └── page.tsx          # Monthly prayer calendar
│   ├── qibla/
│   │   └── page.tsx          # Qibla direction finder
│   ├── settings/
│   │   └── page.tsx          # User settings
│   └── api/                  # Next.js API routes
│       ├── prayer-times/     # Proxy/cache for prayer times API
│       ├── weather/          # Weather data proxy
│       └── geocode/          # Reverse geocoding proxy
├── components/               # Shared UI components
│   ├── ui/                   # shadcn/ui primitives (button, input, select, switch, skeleton)
│   ├── prayer/               # Prayer-specific components
│   │   ├── prayer-card.tsx
│   │   ├── prayer-timeline.tsx
│   │   ├── prayer-calendar.tsx
│   │   ├── current-prayer-hero.tsx
│   │   ├── greeting-hero.tsx
│   │   └── countdown-timer.tsx
│   ├── location/             # Location components
│   │   ├── location-detect.tsx
│   │   └── city-search.tsx
│   ├── qibla/                # Qibla components
│   │   └── qibla-compass.tsx
│   ├── weather/              # Weather components
│   │   └── weather-widget.tsx
│   ├── islamic/              # Islamic events/components
│   │   └── events-calendar.tsx
│   ├── layout/               # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── theme-provider.tsx
│   │   └── background-particles.tsx
│   └── shared/               # Shared/reusable components
│       ├── digital-clock.tsx
│       ├── animated-number.tsx
│       ├── glass-card.tsx
│       └── theme-toggle.tsx
├── hooks/                    # Custom React hooks
│   ├── use-prayer-times.ts
│   ├── use-location.ts
│   ├── use-countdown.ts
│   ├── use-clock.ts
│   ├── use-qibla.ts
│   ├── use-notifications.ts
│   ├── use-weather.ts
│   └── use-media-query.ts
├── lib/                      # Utilities and configuration
│   ├── api/                  # API clients
│   │   ├── prayer-times.ts   # Aladhan client (extracts 6 timings, Tahajjud computed client-side)
│   │   ├── weather.ts
│   │   ├── geocode.ts
│   │   └── ip-geolocation.ts
│   ├── utils.ts              # Tailwind cn() helper + general utils
│   ├── constants.ts          # App-wide constants (NAV_ITEMS, STORAGE_KEYS, etc.)
│   ├── types.ts              # TypeScript type definitions + validation helpers
│   ├── qibla.ts              # Qibla bearing + compass direction calculation
│   └── islamic-calendar.ts   # Islamic events/dates logic
├── styles/                   # Global styles
│   └── globals.css
├── public/                   # Static assets
│   ├── manifest.json         # PWA manifest
│   ├── icons/                # App icons
│   └── patterns/             # SVG geometric patterns
```

## Data Flow

```
User opens app
    │
    ▼
Root Layout (Server Component)
    │
    ├── Provides: fonts, metadata, theme
    │
    ▼
Homepage (Client Component — "use client")
    │
    ├── useLocation() → GPS / IP / manual city search
    │   ├── navigator.geolocation → coordinates
    │   └── Fallback: ip-api.com → reverse geocode → coordinates
    │
    ├── usePrayerTimes(location) → fetch(/api/prayer-times?lat=...&lng=...&method=...)
    │   └── API route proxies to Aladhan, sets Cache-Control headers
    │
    ├── Coordinates also flow to:
    │   ├── WeatherWidget → fetch(/api/weather)
    │   └── QiblaCompass → local calculation
    │
    ▼
CurrentPrayerHero + CountdownTimer
    ├── Displays currently active prayer
    ├── Shows HH:MM:SS countdown to next prayer
    └── Highlights progress bar
```

## API Architecture

```
Client ──► Next.js API Routes (proxy/cache layer)
                │
                ├── Aladhan API (prayer times)
                │   GET https://api.aladhan.com/v1/timings/{date}
                │   ?latitude={lat}&longitude={lng}&method={method}&school=1
                │
                ├── Open-Meteo (weather, free, no API key)
                │   GET https://api.open-meteo.com/v1/forecast
                │   ?latitude={lat}&longitude={lng}
                │
                └── OpenStreetMap/Nominatim (reverse geocoding)
                    GET https://nominatim.openstreetmap.org/reverse
                    ?lat={lat}&lon={lng}&format=json
```

API Routes act as a proxy layer to:
- Add server-side caching (HTTP cache headers)
- Transform API responses to our types
- Handle errors consistently
- Protect API keys (if any)

## Security

- **CSP** — Content-Security-Policy restricts scripts, styles, fonts, and connections
- **HSTS** — Strict-Transport-Security with 2-year max-age
- **Validation** — Input validation on all API routes: coordinate range checks, calculation method validation
- **No secrets** — All external APIs are free/open and require no authentication
- **SSRF protection** — External API URLs are hardcoded; user input only controls query params/path segments

## State Management

- **Server State**: Next.js API routes with Cache-Control headers
- **Client State**: `useState` + `useMemo` for component-local state
- **Persisted State**: localStorage for location cache (24h TTL), prayer times (no TTL), notification prefs, calc method
- **Theme**: `next-themes` for dark/light mode
- **No global state library** — app complexity is moderate

## Component Hierarchy

```
RootLayout
├── ThemeProvider (next-themes)
├── BackgroundParticles
├── Header
│   ├── Logo / App name
│   └── Navigation (desktop, from NAV_ITEMS)
│
├── HomePage
│   ├── GreetingHero
│   │   ├── "Assalamu Alaikum"
│   │   ├── Location display (GPS/IP/Selected)
│   │   ├── Gregorian + Hijri date
│   │   └── DigitalClock
│   │
│   ├── CurrentPrayerHero
│   │   └── CountdownTimer
│   │
│   ├── PrayerTimeline
│   │   └── 5-prayer dot progress indicator
│   │
│   ├── PrayerCard[] × 7 (Fajr → Isha + Tahajjud)
│   │
│   ├── IslamicEventsCalendar
│   │
│   ├── CalendarPage link
│   │
│   └── WeatherWidget
│
├── CalendarPage
│   └── PrayerCalendar (monthly grid)
│
├── QiblaPage
│   └── QiblaCompass
│
├── SettingsPage
│   ├── CalculationMethod selector
│   ├── NotificationSettings
│   └── Theme toggle
│
├── MobileNav (mobile, from NAV_ITEMS)
│
└── Footer
```

## Performance

### Caching Layers
1. **Prayer times**: API route sets `s-maxage=86400, stale-while-revalidate=43200`
2. **Weather**: API route sets `s-maxage=1800, stale-while-revalidate=900`
3. **Geocoding**: API route sets `s-maxage=31536000, immutable`
4. **Client**: localStorage with TTL-based expiry

### Known Optimizations Needed
- Add Server Components for static page shells (all pages currently `"use client"`)
- Add dynamic imports for Calendar, Qibla, BackgroundParticles
- Add service worker for offline PWA support
- Add React.memo to list items
- Fix BackgroundParticles `ctx.scale` accumulation on window resize
- Add client-side date cache for Calendar (currently re-fetches each date change)
- Fix `::selection` contrast in globals.css

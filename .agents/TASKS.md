# Tasks — Salah App

## Progress Overview

- **Phase 1 (Foundation)**: ✅ Complete
- **Phase 2 (API & Data)**: ✅ Complete
- **Phase 3 (UI Components)**: ✅ Complete
- **Phase 4 (Pages & Routing)**: ✅ Complete
- **Phase 5 (Polish & PWA)**: ✅ Complete
- **Phase 6 (Security & Quality)**: ✅ Complete

---

## Detailed Task List

### Phase 1: Foundation ✅
- [x] Initialize Next.js project
- [x] Configure TypeScript strict mode
- [x] Install Tailwind CSS + shadcn/ui
- [x] Create documentation files
- [x] Set up folder structure
- [x] Create base layout (dark theme)
- [x] Configure fonts (Inter + Noto Naskh Arabic)
- [x] Create global CSS with design tokens
- [x] Add Framer Motion dependency
- [x] Configure metadata + viewport

### Phase 2: API & Data ✅
- [x] Define TypeScript types (`src/lib/types.ts`)
- [x] Create API utility layer (`src/lib/api/`)
- [x] Implement Aladhan prayer times client
- [x] Implement Open-Meteo weather client
- [x] Implement Nominatim geocoding client
- [x] Create prayer calculation logic
- [x] Implement localStorage caching
- [x] Create API routes (proxy layer with cache headers)
- [x] Implement Hijri date display

### Phase 3: Custom Hooks ✅
- [x] `use-location.ts` — geolocation + fallback search
- [x] `use-prayer-times.ts` — fetch via proxy + determine current/next prayer
- [x] `use-countdown.ts` — real-time countdown to next prayer
- [x] `use-clock.ts` — live digital clock
- [x] `use-qibla.ts` — Qibla direction calculation
- [x] `use-notifications.ts` — browser notification permission + scheduling
- [x] `use-weather.ts` — weather data fetching
- [x] `use-media-query.ts` — responsive breakpoint detection

### Phase 4: UI Components ✅
- [x] `glass-card.tsx` — reusable glassmorphism card
- [x] `digital-clock.tsx` — live time display
- [x] `animated-number.tsx` — number with entrance animation
- [x] `background-particles.tsx` — floating decorative particles
- [x] `theme-toggle.tsx` — dark/light/system theme toggle
- [x] `header.tsx` — navigation header (desktop)
- [x] `footer.tsx` — app footer
- [x] `mobile-nav.tsx` — bottom navigation for mobile
- [x] `theme-provider.tsx` — next-themes provider wrapper
- [x] `location-detect.tsx` — geolocation request UI
- [x] `city-search.tsx` — searchable city input with autocomplete
- [x] `prayer-card.tsx` — individual prayer time card with status
- [x] `prayer-timeline.tsx` — visual timeline of all prayers
- [x] `prayer-calendar.tsx` — monthly prayer times grid
- [x] `countdown-timer.tsx` — animated countdown with flip digits
- [x] `current-prayer-hero.tsx` — highlighted current prayer hero
- [x] `greeting-hero.tsx` — "Assalamu Alaikum" + date + clock
- [x] `qibla-compass.tsx` — compass UI with needle
- [x] `weather-widget.tsx` — current weather card
- [x] `events-calendar.tsx` — upcoming Islamic events display

### Phase 5: Pages ✅
- [x] Homepage (`/`)
- [x] Calendar page (`/calendar`)
- [x] Qibla page (`/qibla`)
- [x] Settings page (`/settings`)
- [x] Loading page (`/loading`)
- [x] Error boundary (`/error`)
- [x] 404 page (`/not-found`)

### Phase 6: Security & Quality ✅
- [x] HTTP security headers (CSP, HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy)
- [x] Input validation on all API routes (coordinate ranges, calc method)
- [x] Runtime type validation for CalculationMethod (isValidCalculationMethod / safeParseMethod)
- [x] Removed 10 unused shadcn/ui components (dead code)
- [x] Deduplicated NAV_ITEMS to constants.ts
- [x] Replaced 16-way ternary with getCompassDirection() lookup
- [x] Rerouted prayer times through proxy for CDN caching
- [x] ADA contrast fixes (removed text opacity)
- [x] Minimum 12px font size across site

---

## Completed Tasks

| Date | Task | Status |
|------|------|--------|
| 2026-06-10 | Project scaffolding | ✅ |
| 2026-06-10 | Documentation created | ✅ |
| 2026-06-10 | Types + Utils + API layer | ✅ |
| 2026-06-10 | Hooks | ✅ |
| 2026-06-10 | UI Components | ✅ |
| 2026-06-10 | Pages + Routing | ✅ |
| 2026-06-10 | Build passing | ✅ |
| 2026-06-11 | Security audit + fixes | ✅ |
| 2026-06-11 | Performance audit | ✅ |
| 2026-06-11 | Code quality audit + cleanup | ✅ |
| 2026-06-11 | ADA compliance fixes | ✅ |
| 2026-06-11 | Dual-theme color contrast audit (57 fixes, 18 files) | ✅ |
| 2026-06-11 | Calendar year range (1970–current+2) | ✅ |
| 2026-06-11 | Tahajjud client-side computation | ✅ |
| 2026-06-11 | Full architecture audit (Passes 1–5) | ✅ |

## Next Steps

- Add PWA service worker for offline support
- Add unit tests (Vitest + Testing Library)
- Add E2E tests (Playwright)
- Add dynamic imports for heavy components (Calendar, Qibla, BackgroundParticles)
- Fix BackgroundParticles ctx.scale accumulation on resize
- Add client-side date cache for Calendar
- Add Arabic language localization
- Add Tasbih counter feature
- Add Mosque finder feature

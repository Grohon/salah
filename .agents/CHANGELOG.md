# Changelog

## [0.4.0] — 2026-06-11

### Fixed
- **Dual-theme color contrast** — fixed 57 instances across 18 files where `text-emerald-400`, `text-amber-400`, `text-amber-600`, `text-sky-400`, `text-red-400`, `text-purple-400`, `text-blue-400` failed WCAG AA contrast (≥4.5:1) in light mode. All now use `dark:text-XXX-400 text-XXX-700` pattern.
- **Calendar year range** — changed from sliding ±2 year window to fixed 1970–currentYear+2 range
- **Selected date contrast** — `text-amber-700` → `text-amber-800` on `bg-amber-200` to meet 4.5:1
- **Calendar month hover** — `hover:text-emerald-400` → `hover:dark:text-emerald-400 hover:text-emerald-700`
- **`::selection` style** — `text-emerald-400` → `dark:text-emerald-400 text-emerald-700` in globals.css
- **Guard in PRAYER_ORDER loop** — skips undefined timings to prevent `parseTime(undefined)` crash
- **Button cursor** — `cursor-pointer` added to `button.tsx` base variant (Tailwind v4 preflight fix)

### Security
- HTTP security headers in `next.config.ts` (CSP, HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy)
- Proxy routing: `usePrayerTimes` calls `/api/prayer-times` instead of direct Aladhan
- Input validation on all API routes (coordinate ranges, calculation method)
- `isValidCalculationMethod()` + `safeParseMethod()` guards on all localStorage read sites

### Quality
- Removed 10 unused shadcn/ui components (1,241 lines dead code)
- NAV_ITEMS deduplicated to `constants.ts`
- 16-way ternary → `getCompassDirection()` lookup
- Minimum 12px font size enforced site-wide
- ADA compliance: "Approximate (IP)" → "Approximate location"

### Changed
- Calendar detail view: Tahajjud computed client-side from maghrib/sunrise
- Calendar year dropdown: fixed range 1970–currentYear+2 (was sliding ±2)
- Ramadan/Eid events from Hijri tabular calendar (30-year cycle)

## [0.3.0] — 2026-06-11

### Changed
- **Renamed to Salah** — app name, metadata, manifest, header, footer, page titles all updated
- **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy added via `next.config.ts`
- **Proxy routing** — `usePrayerTimes` hook now calls `/api/prayer-times` instead of direct Aladhan, enabling CDN caching
- **Calculation method validation** — `isValidCalculationMethod()` + `safeParseMethod()` guard all localStorage reads; API route validates method param
- **NAV_ITEMS deduplicated** — extracted to `constants.ts`, shared by header and mobile-nav

### Fixed
- **ADA contrast** — removed all opacity-reduced text colors (`/60`, `/80`) that failed WCAG AA; "Approximate (IP)" → "Approximate location"
- **Font size minimum** — all text bumped to 12px minimum across the site
- **16-way ternary → lookup** — `qibla-compass.tsx` now uses `getCompassDirection()` from `qibla.ts`
- **Timeline names** — removed `slice(0, 3)` truncation; prayer names display in full
- **Timeline colors** — current prayer (amber) and next prayer (sky) use distinct colors

### Removed
- **10 unused shadcn/ui components** — `badge`, `card`, `command`, `dialog`, `dropdown-menu`, `input-group`, `scroll-area`, `separator`, `sheet`, `textarea` (1,241 lines dead code)

## [0.2.0] — 2026-06-11

### Added
- **Current Prayer Hero** — dedicated section showing the currently active prayer with emerald theme
- **Location Switcher** — inline panel with GPS detect, IP fallback, and city search
- **Progress bar** — visual indicator of elapsed time in current prayer window
- **12-hour time format** — all prayer times now display with AM/PM
- **Cache expiry** — location cache invalidates after 24 hours

### Changed
- **Countdown moved** to CurrentPrayer section (was in NextPrayer section)
- **Weather widget** moved to bottom of page
- **Greeting** simplified (Assalamu Alaikum always shown)
- **Prayer time parsing** — now uses API timezone instead of assuming UTC

### Removed
- Separate NextPrayerHero section (prayer list covers it)
- Dead code: `PRAYER_DISPLAY_NAMES`, `PRAYER_TIMES`, `ApiError` type, `getPrayerStatus` function
- Unused `locationRef` in use-weather hook
- `next-prayer-hero.tsx` component file

## [0.1.0] — 2026-06-10

### Added
- **Initial release** — Muslim Prayer Times web application

### Core Features
- Prayer times display (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
- Location detection via browser geolocation with city search fallback
- Real-time countdown to next prayer
- Digital clock display
- Gregorian and Hijri date display
- Prayer progress timeline
- Monthly prayer calendar with day selection
- Qibla direction compass with device orientation support
- Weather widget (temperature, conditions, sunrise/sunset)
- Islamic events calendar (Ramadan, Eid, etc.)
- Browser notification support with configurable timing
- Multiple calculation methods (ISNA, MWL, Umm Al-Qura, etc.)
- Dark/light theme toggle

### Technical
- Next.js 15 with App Router
- TypeScript strict mode
- Tailwind CSS v4 with custom design tokens
- shadcn/ui v4 components (Button, Input, Select, Switch, Skeleton)
- Framer Motion animations (page transitions, card hover, countdown)
- PWA manifest
- Server Components + Client Components architecture
- API proxy layer with caching (Next.js API routes)
- Responsive design (mobile-first, desktop progressive enhancement)
- Glassmorphism card design system
- SEO metadata (Open Graph, Twitter Cards)
- Accessibility (ARIA labels, semantic HTML, keyboard navigation)

### Architecture
- Custom hooks: useLocation, usePrayerTimes, useCountdown, useClock, useQibla, useNotifications, useWeather, useMediaQuery
- API integration: Aladhan (prayer times), Open-Meteo (weather), OpenStreetMap/Nominatim (geocoding)
- Qibla calculation using Great Circle formula
- localStorage caching for offline resilience

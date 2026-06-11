# Project Plan — Salah App

## High-Level Roadmap

```
Phase 1 — Foundation (Days 1-2)
├── Project scaffolding (Next.js, TS, Tailwind, shadcn/ui)
├── Documentation files
├── Project structure / folder layout
├── Core types and utilities
└── Base layout with dark theme

Phase 2 — API & Data (Days 2-3)
├── Aladhan API integration
├── Prayer times calculation logic
├── Hijri date conversion
├── Location detection (geolocation + fallback search)
└── Caching layer

Phase 3 — UI Components (Days 3-5)
├── Prayer card components
├── Hero section with current prayer
├── Countdown timer
├── Prayer timeline
├── Monthly calendar
├── Qibla compass
├── Notification settings
├── Weather widget
└── Islamic events widget

Phase 4 — Pages & Routing (Days 5-6)
├── Homepage (Hero + Prayer Times + Timeline + Weather + Events)
├── Calendar page
├── Settings page
├── Qibla page
└── Error + Not-found pages

Phase 5 — Polish & PWA (Days 6-7)
├── Animations (Framer Motion)
├── PWA manifest
├── SEO metadata
├── Lighthouse optimisation
├── Accessibility audit
└── Final QA

Phase 6 — Security & Cleanup (Day 8)
├── HTTP security headers (CSP, HSTS, etc.)
├── Input validation hardening
├── Dead code removal
├── Component deduplication
├── Proxy routing for caching
└── ADA compliance fixes
```

## Milestones

| Milestone | Target | Deliverable |
|-----------|--------|-------------|
| M1: Foundation | Day 2 | Running Next.js app with dark theme |
| M2: Data Layer | Day 3 | Prayer times loading from API |
| M3: Core UI | Day 5 | All components built and styled |
| M4: Full App | Day 6 | All pages functional |
| M5: Production | Day 7 | PWA-ready, Lighthouse >95 |
| M6: Secure | Day 8 | Security audit, headers, cleanup |

## Feature Status

### Core (P0)
- [x] Prayer times display (Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha)
- [x] Next/current prayer highlight + countdown
- [x] Location detection (geolocation + city search + IP fallback)
- [x] Hijri date display
- [x] Dark mode (default)
- [x] Responsive design

### Enhanced (P1)
- [x] Monthly prayer calendar
- [x] Prayer progress timeline
- [x] Islamic events calendar
- [x] Weather widget
- [x] Qibla direction compass
- [x] Browser notifications

### Premium (P2)
- [x] Multiple calculation methods
- [ ] Quran verse/ayah of the day
- [ ] Tasbih (digital prayer beads) counter
- [ ] Mosque finder nearby
- [ ] Theme customization (accent colors)
- [ ] Language localization (EN/AR)

## Next Steps

1. Add PWA service worker for offline support
2. Add unit tests (Vitest + Testing Library)
3. Add E2E tests (Playwright)
4. Add dynamic imports for heavy components (Calendar, Qibla, BackgroundParticles)
5. Fix `::selection` contrast in globals.css
6. Fix BackgroundParticles `ctx.scale` accumulation on resize
7. Add client-side date cache for Calendar
8. Add Arabic language localization
9. Add Tasbih counter feature
10. Add Mosque finder feature

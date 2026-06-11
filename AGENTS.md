# AGENTS.md — Project Guide for AI Coding Agents

## Project Goals

Build a production-ready Muslim Prayer Times web application that:
- Automatically detects user location and calculates accurate Islamic prayer times
- Provides a premium, award-winning UI with calm spiritual Islamic aesthetics
- Scores >95 on Lighthouse audits
- Functions as a PWA with offline support
- Delivers real-time prayer notifications
- Ranks competitively with Apple, Linear, Stripe, and Vercel in design quality

## Coding Standards

- **TypeScript strict mode** — no `any` types unless unavoidable (document with `// eslint-disable-next-line`)
- **ESLint + Prettier** — code must pass lint before commit
- **No commented-out code** — delete, don't comment
- **Always run `npm run lint` after any change** — fix all errors before proceeding; zero tolerance
- **Git commit after major changes and fixes** — always stage and commit with a descriptive message after completing significant work
- **No console.log in production** — use a proper logger or `console.debug` gated by env
- **Functional components** — no class components unless interfacing with legacy libs
- **Server Components by default** — only add `"use client"` when browser APIs, state, or effects are needed
- **Async components** for data fetching; use Suspense boundaries

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|---------|
| Files (components) | PascalCase | `PrayerCard.tsx` |
| Files (utilities) | camelCase | `formatTime.ts` |
| Files (hooks) | camelCase, prefixed `use` | `usePrayerTimes.ts` |
| Components | PascalCase | `export function PrayerCard()` |
| Functions | camelCase | `getNextPrayer()` |
| Types/Interfaces | PascalCase | `PrayerTimeData` |
| Enums | PascalCase | `PrayerName` |
| Props | PascalCase with `Props` suffix | `PrayerCardProps` |
| CSS classes | Tailwind utility classes | — |

## Component Architecture Rules

1. **Single Responsibility** — each component does one thing
2. **Composition over inheritance** — compose small components
3. **Server/Client split** — data fetching in Server Components; interactivity in Client Components
4. **Props interface** — always define and export props types
5. **Default exports** — avoid; use named exports for better tree-shaking
6. **Shadcn/ui primitives** — extend shadcn/ui components instead of building from scratch

## Accessibility Requirements

- All interactive elements must be keyboard-accessible
- ARIA labels on icon-only buttons
- Color contrast ratios ≥ 4.5:1 (normal text), ≥ 3:1 (large text)
- Focus indicators visible on all interactive elements
- `role` attributes on custom interactive widgets
- Semantic HTML (nav, main, section, article, aside, footer)
- Skip-to-content link
- Screen-reader-friendly announcements for dynamic updates
- **Dual-theme contrast** — when adding or modifying any text color or background color, verify contrast ≥ 4.5:1 in both dark mode and light mode; use `dark:` prefix to provide separate colors per theme

## Performance Requirements

- Lighthouse performance score ≥ 95
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.0s
- Cumulative Layout Shift (CLS) < 0.05
- First Input Delay (FID) < 50ms
- Bundle size budget: < 200kB initial JS (gzipped)
- Dynamic imports for heavy components (calendar, Qibla compass)
- Debounced/throttled event handlers (resize, scroll)
- Memoize expensive computations (useMemo, useCallback)

## Design Principles

- **Calm & Spiritual** — muted colors, generous whitespace, subtle animations
- **Premium Minimalism** — every element earns its place; nothing decorative without purpose
- **Islamic Aesthetic** — geometric patterns, calligraphy-inspired typography, crescent motifs
- **Dark-First** — dark mode is default; light mode is secondary
- **Glassy & Layered** — glassmorphism cards with depth via shadows and backdrop-blur
- **Responsive** — mobile-first; tablet and desktop progressively enhance

## Progress

### Completed — Full Audit Flags

| # | Finding | Status |
|---|---------|--------|
| H1 | `parseTime` guards undefined input | ✅ |
| M1 | `::selection` contrast (`/80` → `text-emerald-700`) | ✅ |
| M2 | `ctx.scale` accumulates → `setTransform` | ✅ |
| M3 | Particles run off-screen → IntersectionObserver | ✅ |
| M4 | Calendar re-fetches same date → in-memory `Map` cache | ✅ |
| M5 | `Math.round` days-until → `Math.ceil` capped at 0 | ✅ |
| Low | Rate limiting → `proxy.ts` (30 req/min/IP on `/api/*`) | ✅ |
| Low | `formatTimeStrTo12h` duplicated logic → delegates to `formatTo12h` | ✅ |
| Low | Hardcoded `bg-emerald-600` → `variant="default"` | ✅ |
| Low | Reverse geo lat/lng validation → range check | ✅ |
| Low | `endTime` now 1 min before next prayer start | ✅ |
| — | Karachi method (1) default, Hanafi, Tahajjud client-side | ✅ |
| — | `src/middleware.ts` → `src/proxy.ts` (Next.js 16 migration) | ✅ |

### Not Actioned

| # | Reason |
|---|--------|
| M6 (test suite) | Needs framework decision (Vitest/Jest) |
| M7 (`className="dark"`) | Intentional dark-first design |
| `as` casts (3 files) | No lint rule flags them; TypeScript can't verify runtime shapes |

### Key Decisions

- **endTime**: Each prayer's valid window is `[start, next_start - 1min]` to avoid overlap
- **Rate limiting**: 30 req/min/IP in-memory, no external store needed for single-instance deploy
- **`proxy.ts`**: Next.js 16 renamed middleware convention; export must be named `proxy`
- **Dual-theme contrast**: All hardcoded colors use `dark:text-XXX-400 text-XXX-700` pattern; verify ≥4.5:1 in both themes

## Deployment Requirements

- Build must pass `npm run build` with no errors
- Environment variables prefixed with `NEXT_PUBLIC_`
- API keys stored server-side only (Next.js API routes or server actions)
- Static exports where possible; ISR for dynamic content
- Cache API responses at multiple layers (CDN, server, client)
- Error monitoring integration (Sentry or similar)
- Analytics without compromising privacy (Plausible or Umami)

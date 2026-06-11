# Design System — Salah App

## Brand Essence

> "Calm spirituality meets premium technology."
>
> Every pixel should evoke peace, devotion, and trust. The interface breathes — generous whitespace, deliberate motion, and a color palette inspired by dawn, dusk, and the night sky.

---

## Color Palette

### Dark Theme (Default)

| Token | HEX | Usage |
|-------|-----|-------|
| `--background` | `#0a0e1a` | Main page background (deep midnight) |
| `--surface` | `#111827` | Card/sheet backgrounds |
| `--surface-elevated` | `#1e293b` | Modals, dropdowns |
| `--border` | `#1e293b` | Subtle borders |
| `--border-active` | `#334155` | Active/focused border |
| `--text-primary` | `#f1f5f9` | Primary text |
| `--text-secondary` | `#94a3b8` | Secondary/metadata text |
| `--text-muted` | `#64748b` | Muted/disabled text |
| `--accent-emerald` | `#34d399` | Primary accent — success, current prayer, completed |
| `--accent-teal` | `#2dd4bf` | Secondary accent — interactive elements |
| `--accent-gold` | `#fbbf24` | Current prayer highlight |
| `--accent-sky` | `#38bdf8` | Next prayer highlight |
| `--accent-navy` | `#1e3a5f` | Deep accent — gradients, backgrounds |

### Light Theme (Secondary)

| Token | HEX | Usage |
|-------|-----|-------|
| `--background` | `#f8fafc` | Page background |
| `--surface` | `#ffffff` | Card backgrounds |
| `--text-primary` | `#0f172a` | Primary text |
| `--text-secondary` | `#475569` | Secondary text |
| `--accent-emerald` | `#059669` | Primary accent |

> **Dual-theme contrast rule**: All text color overrides must pass WCAG AA ≥4.5:1 in BOTH themes. Use `dark:text-XXX-400 text-XXX-700` pattern for accent colors (e.g., `dark:text-emerald-400 text-emerald-700`). Verified values below.

### Semantic Colors

| Context | Token | Dark | Light (text-700) |
|---------|-------|------|-------------------|
| **Current prayer** | `--prayer-current` | Amber `#fbbf24` (amber-400) | Amber `#b45309` (amber-700) |
| **Next prayer** | `--prayer-next` | Sky `#38bdf8` (sky-400) | Sky `#0369a1` (sky-700) |
| **Completed prayer** | `--prayer-completed` | Emerald `#34d399` (emerald-400) | Emerald `#047857` (emerald-700) |
| **Error** | `--error` | Red `#f87171` (red-400) | Red `#b91c1c` (red-700) |
| **Success** | `--success` | Green `#4ade80` (green-400) | Green `#15803d` (green-700) |
| **Also applies to** | | Blue `#60a5fa` (blue-400) | Blue `#1d4ed8` (blue-700) |
| | | Purple `#c084fc` (purple-400) | Purple `#7e22ce` (purple-700) |

---

## Typography Scale

| Token | Size | Weight | Usage |
|-------|------|--------|-------|
| `text-xs` | 0.75rem (12px) | 400-600 | Captions, metadata, timeline labels |
| `text-sm` | 0.875rem (14px) | 400-500 | Body small, helper text |
| `text-base` | 1rem (16px) | 400 | Body text |
| `text-lg` | 1.125rem (18px) | 500 | Large body |
| `text-xl` | 1.25rem (20px) | 600 | Subheadings |
| `text-2xl` | 1.5rem (24px) | 600 | Section headings |
| `text-3xl` | 1.875rem (30px) | 700 | Major headings |
| `text-4xl` | 2.25rem (36px) | 700 | Hero headings |
| `text-5xl` | 3rem (48px) | 800 | Large hero |
| `text-6xl` | 3.75rem (60px) | 800 | Display text |

Minimum font size across the app is 12px (text-xs) for ADA compliance. No opacity-reduced text classes (`/60`, `/80`) should be used for body text — they fail WCAG AA contrast in one or both themes.

### Font Family

```css
--font-primary: 'Inter', system-ui, -apple-system, sans-serif;
--font-display: 'Inter', system-ui, -apple-system, sans-serif;
--font-arabic: 'Noto Naskh Arabic', 'Traditional Arabic', serif;
```

### Font Loading
- `Inter` — variable font, loaded via next/font with `display: swap`
- `Noto Naskh Arabic` — for Arabic text, loaded on-demand

---

## Spacing System

Based on 4px increments (Tailwind defaults):

| Token | Rem | Pixels |
|-------|-----|--------|
| `space-1` | 0.25rem | 4px |
| `space-2` | 0.5rem | 8px |
| `space-3` | 0.75rem | 12px |
| `space-4` | 1rem | 16px |
| `space-5` | 1.25rem | 20px |
| `space-6` | 1.5rem | 24px |
| `space-8` | 2rem | 32px |
| `space-10` | 2.5rem | 40px |
| `space-12` | 3rem | 48px |
| `space-16` | 4rem | 64px |
| `space-20` | 5rem | 80px |
| `space-24` | 6rem | 96px |

### Layout Max Widths
- Mobile: 100% (with 16px padding)
- Tablet: 720px
- Desktop: 1200px

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.375rem | Buttons small |
| `--radius-md` | 0.5rem | Cards default |
| `--radius-lg` | 0.75rem | Cards prominent |
| `--radius-xl` | 1rem | Dialogs, modals |
| `--radius-2xl` | 1.5rem | Hero cards |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows & Glows

```css
--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
--shadow-card-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
--shadow-card-elevated: 0 20px 25px -5px rgba(0, 0, 0, 0.5);

--glow-emerald: 0 0 20px rgba(52, 211, 153, 0.3);
--glow-gold: 0 0 20px rgba(251, 191, 36, 0.3);
--glow-card: 0 0 30px rgba(52, 211, 153, 0.1);
```

---

## Animation Principles

### Duration & Easing

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--ease-out` | 200ms | cubic-bezier(0.16, 1, 0.3, 1) | Default interactions |
| `--ease-in-out` | 300ms | cubic-bezier(0.65, 0, 0.35, 1) | Page transitions |
| `--ease-spring` | 500ms | spring(1, 100, 10) | Hero animations |
| `--ease-glow` | 1500ms | ease-in-out | Pulse glow effects |

### Motion Design
- **Page transitions**: Fade + slight scale (0.95 → 1) over 300ms
- **Card hover**: Lift 4px, intensify shadow, subtle border glow
- **Countdown tick**: Scale pulse on digit change
- **Prayer active glow**: Slow pulse using box-shadow
- **Background particles**: Continuous drift at low opacity
- **Qibla compass**: Smooth rotation with device orientation

### Reduced Motion
- Respect `prefers-reduced-motion`
- Disable all continuous animations
- Keep essential fades (no scale/translate)
- Replace spring with `ease-out 200ms`

---

## Component Design Guidelines

### Glassmorphism Cards
```css
.glass-card {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
}
```

### Interactive States
- **Hover**: Lift, intensify shadow, accent border glow
- **Active**: Slight scale-down (0.98), reduced shadow
- **Focus**: Visible ring using accent color
- **Disabled**: Opacity 0.4, no interactions

### Iconography
- Lucide icons (consistent with shadcn/ui ecosystem)
- 20x20px default, 16x16px inline
- Stroke width 1.5
- Custom crescent/Islamic star SVG only where Lucide doesn't cover

### Loading States
- Skeleton shimmer with emerald-tinted gradient
- Pulse animation on card skeletons
- Spinner only for button loading states

### Empty States
- Illustrated with relevant icon
- Clear title + description + action button
- Centered layout with generous padding

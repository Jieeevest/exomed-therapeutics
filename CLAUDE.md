# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server on http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # preview production build
```

No test runner is configured. TypeScript strict mode is on — `npm run build` acts as a type-check.

## Environment

Copy `.env.local` and set:
```
VITE_API_URL=http://localhost:3001   # backend REST base URL
```

## Architecture

**Stack:** React 18 + TypeScript + Vite. Routing via react-router-dom v7. State via Zustand. Animations via Framer Motion. Styling via Tailwind CSS + CSS custom properties.

**Path alias:** `@/` maps to `src/`. Use it for all internal imports.

**Source layout:**
```
src/
  pages/       # one file per route
  components/  # shared UI components
  hooks/       # custom React hooks
  store/       # Zustand stores
  lib/         # pure utilities (no React)
  constants/   # API URL map
  types/       # shared TypeScript types
```

## Auth Flow

Auth state lives in `src/store/useAuth.ts` — a Zustand store persisted to `sessionStorage` under the key `app-auth-storage`. It holds `accessToken`, `refreshToken`, and `user`.

`src/lib/api.ts` exports `fetchWithAuth(endpoint, options)` which:
1. Attaches `Authorization: Bearer <token>` to every request.
2. On 401, attempts a token refresh via `POST /api/auth/refresh`.
3. On refresh failure, calls `logout()` and redirects to `/login`.

Use `fetchWithAuth` for all authenticated API calls in pages/hooks. Direct `fetch` is only acceptable for public endpoints.

`useSessionGuard()` (hook) must be called at the top of every protected page. It polls sessionStorage every 30 seconds and on tab focus/visibility-change — if the storage entry disappears or the token is missing, it logs out and redirects.

## Routing & Access Control

Three route guard wrappers in `src/components/ProtectedRoute.tsx`:
- `<ProtectedRoute>` — redirects unauthenticated users to `/login`
- `<AdminRoute>` — additionally checks `user.role === 'admin'`, redirects others to `/app`

Feature gating by subscription tier uses `<ProGate feature="...">` — wraps children in a blurred overlay with an upgrade CTA when `user.subscription_tier !== 'pro'`.

## Design System

**Theme:** Dark-first. CSS custom properties defined in `src/index.css` using HSL. Key tokens: `--background` (4% lightness), `--card` (7%), `--primary` (gold, hsl 45 93% 47%).

**Gold gradient:** Use utility classes `bg-gold-gradient` and `text-gold-gradient` (defined in `@layer utilities` in `index.css`) for primary CTAs and accent text.

**Font:** Space Grotesk, loaded via `@fontsource/space-grotesk` in `main.tsx`.

**`cn(...)`** — helper from `src/lib/utils.ts` (clsx + tailwind-merge). Use for all conditional className strings.

**Glassmorphism pattern:** `bg-white/[0.03] border border-white/[0.08]` for cards on dark backgrounds. Hover: `bg-white/[0.06] border-amber-500/30`.

**Motion:** Wrap interactive elements with `motion.button` + `whileTap={{ scale: 0.96 }}`. Use `AnimatePresence` + `motion.div` for conditional renders with `initial/animate/exit`. Standard easing for entrances: `ease: [0.16, 1, 0.3, 1]`.

**Scrollbar:** Custom 4px scrollbar defined globally in `index.css`.

## Public Pages (Navbar)

Pages outside `/app` (`Articles`, `ArticleDetail`, `Support`, `StaticPage`) use `<Navbar>` from `src/components/Navbar.tsx` — a scroll-aware fixed nav that transitions from transparent to opaque.

`Landing.tsx` has its own inline nav (identical pattern, but tightly coupled to landing-specific state like mobile menu).

## API URL Constants

All backend endpoints are centralised in `src/constants/apiUrls.ts` as `API_URLS.*`. Use these instead of hardcoding strings. The base URL is `API_BASE = import.meta.env.VITE_API_URL`.

## UI Components (`src/components/`)

All components use the project's dark theme, `cn()` for class merging, and Framer Motion for animation where relevant.

| Component | Description |
|-----------|-------------|
| `Button` | `primary` / `secondary` / `ghost` / `destructive` / `outline` variants + `loading` state |
| `Input` | Icon slots (left/right), `label`, `error`, `hint` |
| `Textarea` | Same API as Input, `resizable` prop |
| `Select` | `react-select` based — supports searchable, multi-select, async, grouping. Full dark-theme styling baked in. Generic `<V>` type param for value type. |
| `Pagination` | Numbered pages with ellipsis collapse, `siblingCount` prop, Prev/Next buttons |
| `Alert` | `success` / `error` / `warning` / `info` — animated height collapse via AnimatePresence |
| `Badge` | Status chip: `success` / `warning` / `error` / `info` / `pro` / `muted` / `primary` / `amber` |
| `Spinner` | `sm` / `md` / `lg`, color `primary` / `black` / `white` |
| `Modal` | Backdrop + panel with `title`, `footer` slot, size `sm`/`md`/`lg`/`xl` |
| `Card` | Dark card wrapper with optional hover glow; sub-components `Card.Header`, `Card.Footer` |
| `StatCard` | Metric card: label + large value + change indicator + icon |
| `Table` | `Table.Head`, `Table.HeadCell`, `Table.Body`, `Table.Row`, `Table.Cell`, `Table.Empty` + loading overlay |
| `EmptyState` | Icon + title + description + optional action button |
| `Avatar` | Initials fallback, auto-colour by name hash, `useGold` for gold-gradient |
| `Tabs` | Radix-based; variant `underline` (Dashboard style) or `pill` (Profile style) |
| `PageHeader` | `title` + optional `description` + optional `action` slot |
| `SidebarNav` | Item list with active state, icon, optional badge |
| `Navbar` | Fixed scroll-aware top nav for public pages |
| `ProGate` | Blurred overlay for Pro-only features |
| `ProtectedRoute` / `AdminRoute` | Route-level auth guards |
| `Logo` | `icon` or `horizontal` variant |

## Key Conventions

- **No comments** unless the why is non-obvious.
- **Strict TypeScript** — `noUnusedLocals` and `noUnusedParameters` are enforced; remove unused imports before building.
- **Subscription feature list** in `Profile.tsx` and `ProGate.tsx` must stay in sync when adding new Pro features.
- **Storage key** `app-auth-storage` is referenced in both `useAuth.ts` (persist name) and `useSessionGuard.ts` — update both if renaming.
- `StaticPage.tsx` serves static legal/docs pages from an in-file `PAGE_CONTENT` map (no API call). Add new static pages there.

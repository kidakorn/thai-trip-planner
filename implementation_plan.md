# Fix: CSS & Layout Architecture Reset

## What's Broken Right Now

The app has accumulated several structural issues from incremental edits that are compounding each other:

1. **Tailwind v4 not processing CSS** — `postcss.config.mjs` was just added but Turbopack in dev mode has been confused by the missing file. A clean restart is needed.
2. **`next-intl` locale is `undefined`** — The `request.ts` was using the old `{ locale }` API instead of `{ requestLocale }` (fixed already, but needs a clean dev server restart).
3. **Layout tree fragmentation** — We have 3 nested layouts (`app/layout.tsx` → `app/[locale]/layout.tsx` → `app/admin/layout.tsx`), each previously trying to render its own `<html><body>`. This is now fixed structurally, but dev cache is stale.
4. **No `app/page.tsx` redirect** — The root `/` path has no handler; it should immediately redirect to `/en`.

---

## Proposed Fix Plan (5 steps)

### Step 1 — Clear `.next` cache
Delete the `.next` folder entirely so Turbopack picks up all config changes cleanly.

### Step 2 — Add root redirect (`app/page.tsx`)
Create a simple server component at `src/app/page.tsx` that redirects `/` → `/en`.

### Step 3 — Verify `postcss.config.mjs`
Already created. Confirm it's correct format for Tailwind v4.

### Step 4 — Fix `proxy.ts` middleware matcher
The current matcher `['/', '/(th|en)/:path*']` only matches `/en/something` but **not `/en` itself** (without trailing slash). Update it to also match `/en` and `/th` directly.

### Step 5 — Clean dev restart
Run `npm run dev` fresh and verify `/en` loads with full CSS styling.

---

## Files to Change

| File | Action | Reason |
|---|---|---|
| `.next/` | Delete cache | Turbopack picks up stale config |
| `src/app/page.tsx` | CREATE | Redirect `/` → `/en` |
| `src/proxy.ts` | MODIFY | Fix matcher to include `/en` and `/th` directly |
| `src/app/layout.tsx` | VERIFY | Root shell (already fixed) |
| `src/app/[locale]/layout.tsx` | VERIFY | Nested providers only (already fixed) |

---

## Open Questions

> [!IMPORTANT]
> Do you want to keep the `next-intl` i18n system (URLs like `/en/plan`, `/th/plan`) or would you prefer to **remove it** and go back to a single-language English-only app with a simple language toggle in state?
>
> - **Keep next-intl** → URLs are `/en`, `/th`, middleware handles redirects
> - **Remove next-intl** → Single route `/`, language toggle is just a React state (simpler, less breakage)


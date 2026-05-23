## Goal

Replace the current empty bootstrap with the uploaded RENTED build, then do **one focused pass**: clean architecture, fix navigation, and properly separate the Buyer vs Vendor experiences with a single-account toggle (Uber-style). Visual polish, full end-to-end flow wiring, and dashboard redesigns are explicitly **out of scope for this pass** — they're queued for follow-up passes so each gets real depth instead of a shallow sweep.

## Phase 1 — Import the baseline

1. Copy the contents of `rented-your-trusted-rentals-main/` into the project, overwriting the bootstrap (`src/routes/`, `src/components/`, `src/lib/`, `src/styles.css`, `src/assets/`, plus any config the zip adds that we don't already have).
2. Keep the existing TanStack Start shell files (`router.tsx`, `start.ts`, `server.ts`, `routeTree.gen.ts` will regenerate).
3. Run a build check, fix any import/route errors introduced by the merge.
4. Quick audit pass: list every route, every `<Link>` and `navigate()` target, flag dead ends and orphans.

## Phase 2 — Information architecture

Reorganize routes around the role toggle. Target structure:

```text
/                       → redirect based on auth + onboarding state
/welcome /signin /signup /role          (public onboarding)
/verify/*               (shared KYC, gates both roles)

_app/                   (authenticated shell, holds role context)
  buyer/
    home                 marketplace discovery
    search               filters, categories, nearby
    saved
    rentals              active + history
    rental/$id           tracking + contract + payment hub
    messages
    profile
  vendor/
    dashboard            overview (renamed from vendor.index)
    listings
    listing/new
    requests             offers + negotiations
    rentals              active deliveries
    earnings
    insurance            recording workflow entry
    profile
  shared/
    item/$id             listing detail (both roles can view)
    thread/$id           negotiation chat
    contract/$id
    payment/$id
    delivery/$id
    notifications
```

Move the existing flat `_app.*.tsx` files into this hierarchy. Delete or merge:
- `_app.new.tsx` (38 lines, stub) → fold into `vendor/listing/new`
- `_app.vendor.index.tsx` (7 lines) → real `vendor/dashboard`
- `_app.impact.tsx` → move under profile or remove if dead
- `_app.success.tsx` → make it a reusable result screen, not a route

## Phase 3 — Role separation & toggle

1. **One account, two modes.** Extend the Zustand store with `activeMode: "buyer" | "vendor"` (separate from `role`, which becomes "capabilities the account has unlocked"). Persist.
2. **Mode toggle** in the profile header + a quick-switch in the bottom-nav overflow. Switching swaps the bottom nav and lands the user on that mode's home (buyer → `/buyer/home`, vendor → `/vendor/dashboard`).
3. **Two bottom navs** (replace single `BottomNav.tsx`):
   - Buyer: Home · Search · Rentals · Messages · Profile
   - Vendor: Dashboard · Listings · Requests · Earnings · Profile
   `_app.tsx` picks which nav to render from `activeMode`.
4. **First-vendor-listing onboarding stays** as the unlock path, but once unlocked the toggle is always available.
5. **VerificationGate** keeps working as-is but is shared across both modes.

## Phase 4 — Navigation hygiene

- Every CTA gets a real target. Replace `console.log`/no-op handlers with `navigate()` or toast + clear next step.
- Standardize back-button behavior in `MobileShell` (history-aware, falls back to mode home).
- Fix every `<Link to="...">` that points to a route we renamed in Phase 2.
- Add a `<NotFound>` that respects active mode (sends buyer back to `/buyer/home`, vendor to `/vendor/dashboard`).
- Empty/loading state components added to the routes that currently render blank when mock data is empty.

## Phase 5 — Sanity pass

Walk every route in the preview at mobile viewport, confirm:
- correct bottom nav for the active mode
- back button works
- every visible button leads somewhere
- no orphan routes, no broken links in `routeTree.gen.ts`

## Technical details

- Stack: TanStack Start (already in project), Zustand (already in zip), shadcn/ui (already in zip), Tailwind v4 with the zip's design tokens (deep green + lime — already configured in `src/styles.css`).
- Routing: rename files using TanStack Start's flat dot convention; let the plugin regenerate `routeTree.gen.ts`.
- Store changes: additive — add `activeMode`, keep `role` for backward compat, migrate persisted state with a version bump.
- No backend, no real APIs — `src/lib/mock-data.ts` + Zustand only, as the user requested.

## Out of scope (queued for next passes)

- Visual polish / design-system sweep across all screens
- Buyer + Vendor dashboard redesigns
- End-to-end flow content (richer mock data, analytics charts, insurance AI simulation, etc.)
- Trust/security UX layer
- Marketplace search/filter depth

Each of these is large enough to deserve its own focused pass after the architecture is solid.

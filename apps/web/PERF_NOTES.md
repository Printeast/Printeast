# Perf Notes (apps/web)

## Baseline (before changes)
Date: 2026-02-09

### Dev server start
- Observed `Ready in ~0.85s` from dev log (Next.js 16.1.4).

### First load (server render)
- `/en/seller/storefront`: ~4724 ms total (PowerShell Measure-Command).
- `/en/seller/templates`: returns 500 due to `@repo/database` module not found (compile error), so timing invalid.

### Subsequent refresh
- Not measured yet (blocked by templates compile error).

### HMR update
- Not measured yet (no safe no-UI-change edit performed).

### Client navigation
- Not measured yet.

### Slowness classification
- Symptoms show long **server render** time on seller routes when backend calls are slow.
- A build/compile error exists on `/en/seller/templates` due to missing `@repo/database`.

---

## Findings (initial)
- Next config transpiles heavy packages (`three`, `@react-three/fiber`, `@react-three/drei`).
- `/en/seller/templates` currently fails to compile because `@repo/database` is not resolved in web.

## Tracing / Analyze
- Turbopack tracing: attempted with `NEXT_TURBOPACK_TRACING=1`, but no trace file emitted (dev server already running).
- Bundle analyzer: `npx next experimental-analyze` completed; report served at http://localhost:4000 (manual inspection pending).

---

## After changes
### Changes applied
- Reduced `transpilePackages` in `apps/web/next.config.js` to only `@repo/types` and `@repo/database` (removed unused `three`, `@react-three/*`).

### Timings (after)
- Requires dev server restart to apply config change.
- Storefront re-measure (server running): ~55,041 ms (likely skewed by backend/API latency).

### Notes
- Large server render times persist when backend/API/Supabase are slow.

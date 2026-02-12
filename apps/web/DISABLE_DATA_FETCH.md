## Data fetch bypass (local toggle)

Status: Currently disabled in code (guards removed). To re-enable the bypass locally for testing:

1) Add the guard back (temporary change):
   - In `apps/web/src/app/[locale]/seller/_data.ts`, wrap `getSellerDashboardData` and `getSellerInventoryData` with:
     ```ts
     const dataFetchDisabled = process.env.DISABLE_DATA_FETCH === "1";
     if (dataFetchDisabled) return emptyState();
     // and return { tenantId: null, inventory: [] } for inventory
     ```
   - In `apps/web/src/app/[locale]/seller/templates/page.tsx`, short-circuit when the flag is set and return `templates = []` without Supabase/Prisma.

2) Toggle via env (no code once guards are present):
   - PowerShell session: `$env:DISABLE_DATA_FETCH="1"; pnpm --filter web dev`
   - Persist locally: add `DISABLE_DATA_FETCH=1` to `apps/web/.env.local` and restart dev.

3) Restore normal fetching: unset the env or remove the guards.

Use this only for perf A/B to confirm backend calls are the bottleneck.

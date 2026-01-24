## Dashboard Integration Notes

This is a front-end shell with mock data. Backend can wire real data into the clearly separated sections below. All pages live under `apps/web/src/app/**` and use the shared `DashboardLayout` + `Sidebar` in `apps/web/src/components/dashboard/`.

### Auth & Routing
- Mock auth is ON by default via `NEXT_PUBLIC_MOCK_AUTH=true`. Onboarding lets you pick Creator/Seller; dashboard routes use role-based redirects (see `dashboard/page.tsx` and `lib/mock-auth.ts`).
- To hook real auth, disable mock (`NEXT_PUBLIC_MOCK_AUTH=false`) and return the user with a role from `/auth/me`. The role maps to path: Creator → `/creator`, Seller → `/seller`, Tenant Admin → `/tenant-admin`.

### Shared Layout
- `DashboardLayout` (topbar/search/profile) and `Sidebar` (role-aware nav with icons) are in `apps/web/src/components/dashboard/`.
- Add or adjust links in `Sidebar` for new routes per role.

### Creator Pages
- `app/creator/page.tsx`: Studio overview cards, pipeline, earnings snapshot, recent creations. Replace static arrays with API data for highlights/pipeline/recent.
- `app/creator/portfolio/page.tsx`: Collections grid + assets table. Wire collections and assets to backend feeds; statuses can drive badges.
- `app/creator/earnings/page.tsx`: Payout schedule, revenue breakdown, royalties list. Connect to payouts/royalties endpoints; export button ready for CSV hook.

### Seller Pages
- `app/seller/page.tsx`: Commerce overview cards (orders/inventory/storefront health), live orders list, inventory snapshot. Supply orders feed + stats.
- `app/seller/orders/page.tsx`: Orders queue table with status/SLA. Backend should provide order list, status enums, label generation actions.
- `app/seller/inventory/page.tsx`: Stock table with thresholds. Feed stock counts, reorder points, low-stock alerts; vendor sync button can call integrations.
- `app/seller/storefront/page.tsx`: Theme presets, hero layout preview, domain/SEO cards. Hook domain verification, OG uploads, and publish actions.

### Tenant Admin (Admin) Pages
- `app/tenant-admin/page.tsx`: System signals, RBAC pillars, platform pulse. Connect to service status/metrics.
- `app/tenant-admin/teams/page.tsx`: Roster + invites. Wire to seat/invite endpoints and role assignments.
- `app/tenant-admin/settings/page.tsx`: Vendors, webhooks, billing, connections. Replace placeholders with real forms/endpoints.

### Mock Utilities
- `apps/web/src/lib/mock-auth.ts`: localStorage-based mock user, role → path map, test users for onboarding. Disable with `NEXT_PUBLIC_MOCK_AUTH=false`.

### Styling/UX
- Modern glass/gradient UI with lucide icons. All data sections are simple arrays—easy to swap with fetched data. Cards/tables are isolated so backend can drop in SWR/React Query/fetches without refactors.

### Quick Integration Checklist
1) Turn off mock auth when backend is ready: `NEXT_PUBLIC_MOCK_AUTH=false` and ensure `/auth/me` returns `{ user: { roles: [{ role: { name: <ROLE> }}] } }`.
2) Replace static arrays in each page with real data loaders; wire status badges to backend enums.
3) Connect actions: label printing, exports, invites, sync vendors, domain publish, payout requests.
4) Update `Sidebar` nav if you add/remove sections.

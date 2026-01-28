## Dashboard → DB Integration (Seller + Creator)

This document maps each dashboard section to the exact database tables/fields it reads or writes. All dashboard data is live from Supabase; no mock data is used. The UI shows empty states when no rows are returned.

### Environment (frontend)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
Add these to `apps/web/.env.local` (not committed).

### Tenant & User Resolution
Used in both Seller and Creator flows.
- Primary: `auth.user_metadata.tenant_id` or `auth.app_metadata.tenant_id`.
- Fallback: `public.users` → `tenant_id` by `users.id = auth.user.id`.

---

## Seller Dashboard
**Routes:** `/seller`, `/seller/inventory` (live)
**Additional seller pages (live, frontend-only UI over Supabase):** `/seller/templates`, `/seller/design`, `/seller/analytics`, `/seller/branding`, `/seller/resources`, `/seller/support`
**Data loader:** `apps/web/src/app/seller/_data.ts` (shared tenant resolver) + page-level fetches

### `/seller` (Main)
**Cards – metrics**
1) **Open orders**
   - Source: `public.orders`
   - Columns: `id`, `status`, `created_at`
   - Filter: `orders.tenant_id = tenantId`
   - Logic: count where `status != "SHIPPED"` (client-side)

2) **Paid**
   - Source: `public.payments`
   - Columns: `id`, `amount`, `status`, `created_at`
   - Logic: sum `amount` where `status = "PAID"` (client-side)

3) **Pending payouts**
   - Source: `public.payments`
   - Columns: `amount`, `status`
   - Logic: sum `amount` where `status != "PAID"` (client-side)

4) **Low stock**
   - Source: `public.products` + `public.inventory`
   - Columns: `products.id`, `products.name`, `products.sku`, `inventory.quantity`
   - Filter: `products.tenant_id = tenantId`
   - Logic: count where `inventory.quantity < 20`

**Orders table**
- Source: `public.orders` + `public.order_items`
- Columns (orders): `id`, `status`, `total_amount`, `tracking_number`, `created_at`
- Columns (order_items): `count(*)` grouped by `order_id`
- Filter: `orders.tenant_id = tenantId`
- Output fields: order id (first 8 chars), status, items count, total, created_at

**Orders trend chart**
- Source: `public.orders`
- Columns: `created_at`
- Filter: `tenant_id = tenantId`
- Logic: count orders per day for last 7 days (client-side aggregation)

**Payments list**
- Source: `public.payments`
- Columns: `id`, `amount`, `status`, `created_at`
- Logic: display latest 20 with status badge

**Inventory summary**
- Source: `public.products` + `public.inventory`
- Columns: `products.id`, `products.name`, `products.sku`, `inventory.quantity`
- Filter: `products.tenant_id = tenantId`

**Low stock list**
- Source: same as inventory summary
- Logic: list items with `inventory.quantity < 20`

**Top products**
- Source: `public.order_items` joined to `public.products`
- Columns: `order_items.product_id`, `products.name`, `products.sku`
- Filter: `products.tenant_id = tenantId`
- Logic: aggregate by `product_id`, sort by order count (client-side)

### `/seller/inventory`
**Inventory table**
- Source: `public.products` + `public.inventory`
- Columns: `products.id`, `products.name`, `products.sku`, `products.base_price`, `inventory.quantity`
- Filter: `products.tenant_id = tenantId`

**Add SKU (write path)**
1) Insert into `public.products`:
   - Columns: `tenant_id`, `name`, `sku`, `base_price`
2) Insert into `public.inventory`:
   - Columns: `product_id`, `quantity`

**Export CSV**
- Source: client-side export from current inventory list
- Columns in CSV: `name, sku, quantity, base_price`

### `/seller/templates`
- Source: `public.designs`
- Columns: `id`, `prompt_text`, `status`, `created_at`, `preview_url`, `image_url`
- Filter: `tenant_id = tenantId`, status != `DRAFT`
- Output: grid of published templates; empty state if none

### `/seller/design` (AI & Design Studio)
- Source: `public.designs`
- Columns: `id`, `prompt_text`, `status`, `created_at`, `image_url`, `preview_url`
- Filter: `tenant_id = tenantId`
- Logic: draft vs live counts; grid of latest designs; CTA buttons are frontend-only placeholders

### `/seller/analytics`
- Sources:
  - `public.orders` → `id`, `total_amount`, `created_at`, filter `tenant_id = tenantId`
  - `public.payments` → `amount`, `status`, `created_at`
- Metrics: GMV = sum orders.total_amount; Orders = count; Paid/Pending = sum payments by status; AOV = GMV / Orders
- Chart: last 7 days sum of `orders.total_amount` by day
- (Optional extension) top products: join `order_items` → `products` by `product_id`, filter `products.tenant_id = tenantId`

### `/seller/branding`
- Sources:
  - `public.tenants` → `name`, `slug`, `metadata` (for colors)
  - `public.categories` → `id`, `name`, `parent_id`, filter `tenant_id = tenantId`
  - `public.products` → `id`, `name`, `sku`, `mockup_template_url`, `metadata`, filter `tenant_id = tenantId`
- Outputs: brand kit (tenant), categories list, product branding (SKU + mockup_template_url)

### `/seller/resources`
- Sources:
  - `public.suppliers` → `name`, `location`, `contact_email` (global)
  - `public.vendors` → `name`, `location`, `api_endpoint`, filter `tenant_id = tenantId`
- Outputs: supplier list, vendor list, static helpful links (frontend-only)

### `/seller/support` (24/7 Support)
- Sources:
  - `public.notifications` → `type`, `content`, `is_read`, `created_at`, filter `user_id = auth.user.id`
  - `public.audit_logs` → `action`, `resource`, `created_at`, filter `tenant_id = tenantId`
- Outputs: notifications list, audit activity list; ticket CTA is frontend-only

---

## Creator Dashboard
**Routes:** `/creator`, `/creator/portfolio`, `/creator/earnings` (live)
**Data loader:** `apps/web/src/app/creator/_data.ts`

### `/creator` (Main)
**Cards – metrics**
1) **Live designs**
   - Source: `public.designs`
   - Columns: `id`, `status`
   - Filter: `designs.userId = auth.user.id` and (if available) `designs.tenant_id = tenantId`
   - Logic: count where `status != "DRAFT"`

2) **Drafts**
   - Source: `public.designs`
   - Logic: count where `status = "DRAFT"`

3) **Orders**
   - Source: `public.order_items` joined to `public.designs`
   - Columns: `order_items.order_id`, `designs.userId`
   - Filter: `designs.userId = auth.user.id`
   - Logic: unique order_ids count

4) **Paid**
   - Source: `public.payments`
   - Columns: `amount`, `status`, `order_id`
   - Filter: `order_id IN (creator order_ids)`
   - Logic: sum where `status = "PAID"`

**Earnings trend chart**
- Source: `public.payments`
- Columns: `amount`, `created_at`, `order_id`
- Filter: `order_id IN (creator order_ids)`
- Logic: sum `amount` per day for last 7 days (client-side aggregation)

**Recent designs**
- Source: `public.designs`
- Columns: `id`, `status`, `prompt_text`, `image_url`, `created_at`
- Filter: `designs.userId = auth.user.id` and (if available) `tenant_id`
- Output: list of latest 6

**Recent payments**
- Source: `public.payments`
- Columns: `id`, `amount`, `status`, `created_at`, `order_id`
- Filter: `order_id IN (creator order_ids)`

### `/creator/portfolio`
**Design grid**
- Source: `public.designs`
- Columns: `id`, `status`, `prompt_text`, `image_url`, `created_at`
- Filter: `designs.userId = auth.user.id` (+ tenant_id if available)

### `/creator/earnings`
**Metric cards**
- Paid: `public.payments.amount` where `status = "PAID"` and `order_id IN (creator order_ids)`
- Pending: `public.payments.amount` where `status != "PAID"` and `order_id IN (creator order_ids)`
- Orders: count of unique `order_items.order_id` for creator designs

**Payments table**
- Source: `public.payments`
- Columns: `id`, `amount`, `status`, `created_at`, `order_id`
- Filter: `order_id IN (creator order_ids)`

---

## RLS / Backend Checklist
- Allow SELECT on: `orders`, `order_items`, `payments`, `products`, `inventory`, `designs` for the user’s tenant.
- Allow INSERT on: `products`, `inventory` for seller user with matching `tenant_id`.
- Allow SELECT on `users.tenant_id` for the signed-in user (tenant fallback).
- Ensure `payments.status` uses "PAID" for paid totals; other statuses treated as pending.
- Low stock threshold is 20 (can be adjusted in UI).

---

## Files to Review
- Seller main: `apps/web/src/app/seller/page.tsx` → `_data.ts` (reads) + `_client.tsx` (UI)
- Seller inventory: `apps/web/src/app/seller/inventory/page.tsx` → `_data.ts` (reads) + `inventory/_client.tsx` (reads/writes)
- Creator: `apps/web/src/app/creator/*` → `_data.ts` loaders
- Shared UI: `apps/web/src/components/ui/*` and `apps/web/src/components/dashboard/*`

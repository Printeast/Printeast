## Local auth bypass (how to enable/disable)

This is **not active**. Add the flag and short-circuits below when you want to skip Supabase auth locally, then remove them to restore real auth.

1) Env toggle (dev only)
- Add to `apps/web/.env.local`:
  - `LOCAL_AUTH_BYPASS=1`

2) Client-side short-circuit (AuthService)
- In `apps/web/src/services/auth.service.ts`, early-return when the flag is set (use `process.env.NEXT_PUBLIC_LOCAL_AUTH_BYPASS ?? process.env.LOCAL_AUTH_BYPASS`).
- For `signIn`, `signUp`, `getUser`, `getSession`, return a mock user/session, e.g. `{ email: "dev@local", role: "SELLER", id: "local-user" }` without calling Supabase.

3) Server-side loaders/pages that call Supabase
- Anywhere using `createClient()` and `supabase.auth.getUser()` (e.g., seller inventory/templates pages), guard with the same flag and inject a mock user/tenant (e.g., `tenantId: "local-tenant"`, `email: "dev@local"`).

4) Disable bypass
- Remove the flag from `.env.local` (or set to `0`) and delete the short-circuit blocks to restore normal auth.

Notes
- Keep the bypass code local-only and avoid committing it; the flag should be ignored in prod.
- Use distinct mock IDs/emails so you can spot bypassed sessions in logs.

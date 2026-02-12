# PRINTEAST GUARD

## What This Is

A zero-tolerance, zero-mock, brutally honest investigation suite for the entire Printeast stack.
No fake data. No simulated results. Every single test hits real infrastructure.
If something is broken, slow, or insecure -- this will find it and tell you exactly what to fix.

This is not a unit test suite. This is a full-stack audit tool.

---

## Philosophy

1. ZERO MOCKS. Every test hits real endpoints, real databases, real cache layers.
2. ZERO MERCY. If response time is 201ms and the threshold is 200ms, it fails.
3. ZERO EXCUSES. The report tells you what is wrong AND what to do about it.
4. SEQUENTIAL EXECUTION. Tests run Normal -> Performance -> Stress -> Security -> Frontend -> Database, in order.
5. ONE COMMAND. That is all it takes.

---

## Prerequisites

Before running the Guard, ensure the following are running:

| Service        | URL                          | Required |
|----------------|------------------------------|----------|
| Backend API    | http://localhost:4000        | YES      |
| Frontend       | http://localhost:3000        | YES      |
| Redis          | redis://127.0.0.1:6379      | YES      |
| PostgreSQL     | Via DATABASE_URL in .env     | YES      |

### Start Services

```bash
# Terminal 1: Backend
cd apps/backend
pnpm dev

# Terminal 2: Frontend
cd apps/web
pnpm dev

# Terminal 3: Redis (if not running as service)
redis-server
```

---

## Installation

```bash
cd apps/guard
npm install
```

---

## Run The Guard

```bash
# One command. Everything.
npm start
```

This will execute all phases sequentially:

```
PHASE 0:  INTERNAL LOGIC VERIFICATION ...... [Jest]
PHASE 1:  BACKEND API HEALTH ............... [Normal]
PHASE 2:  ENDPOINT FUNCTIONALITY ........... [Normal]
PHASE 3:  RESPONSE TIME AUDIT .............. [Performance]
PHASE 4:  CONCURRENT LOAD TEST ............. [Stress]
PHASE 5:  SECURITY HEADERS CHECK ........... [Security]
PHASE 6:  FRONTEND PAGE AUDIT .............. [Frontend]
PHASE 7:  DATABASE CONNECTION AUDIT ........ [Database]
PHASE 8:  REDIS CONNECTION AUDIT ........... [Cache]
PHASE 9:  PERFORMANCE ...................... [Performance]
PHASE 10: BRUTAL LOAD TEST ................. [Brutal]
```

---

## Output

The Guard prints a structured report to the terminal.
Every failed check includes a RECOMMENDATION line explaining what to fix.

Example:

```
[FAIL] GET /health response time: 312ms (threshold: 200ms)
  RECOMMENDATION: Server cold start detected. Check if compression middleware
  is adding latency. Consider connection pooling for DB.
```

At the end, a full VERDICT is printed:

```
============================================================
PRINTEAST GUARD -- FINAL VERDICT
============================================================
Total Checks:    47
Passed:          41
Failed:          6
Pass Rate:       87.2%

CRITICAL ISSUES:
  1. /api/v1/analytics/stats returns 500 without auth token
  2. Redis PING latency 45ms (threshold: 5ms)
  3. Frontend /seller page loads in 4200ms (threshold: 3000ms)

RECOMMENDATIONS:
  1. Add proper error response for unauthenticated analytics requests
  2. Check Redis connection -- possible network hop or overloaded instance
  3. Audit seller page bundle size. Consider code splitting.
============================================================
```

---

## Architecture

```
apps/guard/
  package.json          -- Dependencies (only: node-fetch, pg, ioredis)
  tsconfig.json         -- TypeScript config
  README.md             -- This file
  src/
    index.ts            -- Entry point. Runs all phases sequentially.
    reporter.ts         -- Formats and prints the final verdict.
    phases/
      00-internal.ts    -- Wrapper for backend internal Jest tests
      01-health.ts      -- Backend health check
      02-endpoints.ts   -- Endpoint functionality (real HTTP calls)
      03-latency.ts     -- Response time benchmarks
      04-stress.ts      -- Concurrent request load test
      05-security.ts    -- Security header audit
      06-frontend.ts    -- Frontend page load audit
      07-database.ts    -- Direct DB connection audit
      08-redis.ts       -- Redis connection and latency audit
      09-performance.ts -- Per-endpoint profiling under moderate load
      10-brutal.ts      -- Maximum load, break-the-system test
```

---

## Thresholds

| Metric                     | Normal    | Brutal    |
|----------------------------|-----------|-----------|
| Health endpoint            | < 200ms   | < 100ms   |
| API endpoint (authed)      | < 500ms   | < 200ms   |
| API endpoint (public)      | < 300ms   | < 100ms   |
| Frontend page load         | < 3000ms  | < 1500ms  |
| Redis PING                 | < 5ms     | < 2ms     |
| DB query (simple)          | < 100ms   | < 50ms    |
| Concurrent (10 requests)   | < 2000ms  | < 1000ms  |
| Concurrent (50 requests)   | < 5000ms  | < 2000ms  |
| Concurrent (100 requests)  | N/A       | < 5000ms  |

---

## No Emojis. No Decoration. Just Facts.

This tool exists to protect the codebase. It does not celebrate passing tests.
It reports failures and tells you how to fix them.

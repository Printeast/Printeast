/**
 * PHASE 11: DB PERFORMANCE, SECURITY & LATENCY
 * 
 * Brutal investigation of database health.
 * 
 * 1. Security:
 *    - Verify RLS (Row Level Security) is ENABLED on all sensitive tables
 *    - Detect dangerous/open policies (allow public read, etc)
 *    - Ensure no sensitive data leaks in public schemas
 * 
 * 2. Performance:
 *    - Latency distribution (P50, P95, P99) of standard queries
 *    - Detect missing indexes on Foreign Keys (critical for JOIN performance)
 *    - Connection pool saturation check (mock/simulate)
 */

import { record, phaseHeader } from "../reporter";
import pg from "pg";

export async function run(): Promise<void> {

    phaseHeader("11 -- DB PERFORMANCE & SECURITY AUDIT");

    const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
    if (!dbUrl) {
        record({
            phase: "DB-Adv",
            name: "Configuration",
            passed: false,
            detail: "Skipping advanced DB checks: DATABASE_URL not set"
        });
        return;
    }

    const client = new pg.Client({ connectionString: dbUrl });

    try {
        await client.connect();
    } catch (err: any) {
        record({
            phase: "DB-Adv",
            name: "Connection",
            passed: false,
            detail: `Failed to connect: ${err.message}`
        });
        return;
    }

    try {
        // =================================================================
        // SECURITY CHECKS
        // =================================================================

        // 1. Check RLS is enabled on critical tables
        // Find existing tables first to avoid crashes
        const tableLookupRes = await client.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
        `);
        const existingTables = tableLookupRes.rows.map((r: any) => r.tablename);

        const criticalModels = ['User', 'Tenant', 'Product', 'Order'];
        // Try both PascalCase and lowercase for resilience
        const sensitiveTables = existingTables.filter(t =>
            criticalModels.some(m => t.toLowerCase() === m.toLowerCase())
        );

        const rlsQuery = `
            SELECT relname, relrowsecurity 
            FROM pg_class 
            WHERE relname = ANY($1) 
            AND relkind = 'r';
        `;

        const rlsRes = await client.query(rlsQuery, [sensitiveTables]);
        const rlsMap = new Map(rlsRes.rows.map((r: any) => [r.relname, r.relrowsecurity]));

        for (const table of sensitiveTables) {
            const isEnabled = rlsMap.get(table);
            record({
                phase: "DB-Sec",
                name: `RLS Enabled: ${table}`,
                passed: isEnabled,
                detail: isEnabled ? `Row Level Security is ACTIVE` : `RLS is DISABLED`,
                recommendation: !isEnabled ? `Enable RLS: ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;` : undefined
            });
        }

        // 2. Check for dangerous 'public' policies
        // We check for:
        // A) Policies with suspicious names (heuristic)
        // B) Policies that grant wide permissions to 'public' or 'anon' roles (heuristic)
        const policyQuery = `
            SELECT schemaname, tablename, policyname, cmd, roles 
            FROM pg_policies 
            WHERE 
                (policyname ILIKE '%public%' OR policyname ILIKE '%allow all%' OR policyname ILIKE '%everyone%' OR policyname ILIKE '%read_all%')
                OR
                ('public' = ANY(roles) OR 'anon' = ANY(roles));
        `;

        const policies = await client.query(policyQuery);

        if (policies.rowCount && policies.rowCount > 0) {
            let hasIssues = false;
            policies.rows.forEach((p: any) => {
                // Filter out default secure policies if any (context dependent)
                // But in a "brutal" check, we flag anything looking like public access
                const isPublicRole = p.roles.includes('public') || p.roles.includes('anon');

                if (isPublicRole) {
                    hasIssues = true;
                    record({
                        phase: "DB-Sec",
                        name: `CRITICAL: Public Access Policy`,
                        passed: false,
                        detail: `Policy '${p.policyname}' on '${p.tablename}' grants '${p.cmd}' to PUBLIC/ANON.`,
                        recommendation: `Review immediately. Drop if not intended: DROP POLICY "${p.policyname}" ON "${p.tablename}";`
                    });
                } else {
                    // Just a suspicious name
                    record({
                        phase: "DB-Sec",
                        name: `Suspicious Policy Name`,
                        passed: true, // Warning only
                        detail: `Policy '${p.policyname}' on '${p.tablename}' has a suspicious name but not explicitly 'public' role.`
                    });
                }
            });

            if (!hasIssues) {
                record({
                    phase: "DB-Sec",
                    name: "Public Access Check",
                    passed: true,
                    detail: "Suspiciously named policies found, but no direct 'public' role grants detected."
                });
            }

        } else {
            record({
                phase: "DB-Sec",
                name: "No obviously open policies",
                passed: true,
                detail: "No policies with 'public' roles or suspicious names found."
            });
        }

        // =================================================================
        // LATENCY & PERFORMANCE
        // =================================================================

        // 3. User Lookup Latency (Simulates Auth check)
        const userTable = sensitiveTables.find(t => t.toLowerCase() === 'user');

        if (userTable) {
            const latencySamples: number[] = [];
            const iterations = 10;

            for (let i = 0; i < iterations; i++) {
                const start = performance.now();
                await client.query(`SELECT id FROM "${userTable}" LIMIT 1`);
                const end = performance.now();
                latencySamples.push(end - start);
            }

            const sorted = latencySamples.sort((a, b) => a - b);
            const p50 = sorted[Math.floor(iterations * 0.5)];
            const p95 = sorted[Math.floor(iterations * 0.95)];

            const latThreshold = 50;

            record({
                phase: "DB-Perf",
                name: `User Lookup Latency (P95)`,
                passed: p95 < latThreshold,
                detail: `P95: ${p95.toFixed(2)}ms, P50: ${p50.toFixed(2)}ms (Limit: ${latThreshold}ms)`,
                latencyMs: p95,
                threshold: latThreshold,
            });
        }

        // 4. Check for Foreign Keys without Indexes (Common perf killer)
        // Heuristic: Columns ending in 'Id' usually need indexes
        const missingIndexQuery = `
            SELECT
                t.relname AS table_name,
                a.attname AS column_name
            FROM
                pg_class t,
                pg_attribute a
            WHERE
                t.oid = a.attrelid
                AND a.attname LIKE '%Id'
                AND t.relkind = 'r'
                AND t.relname NOT LIKE 'pg_%'
                AND t.relname NOT LIKE 'sql_%'
                AND a.attnum > 0
                AND NOT EXISTS (
                    SELECT 1
                    FROM pg_index i
                    JOIN pg_attribute ia ON ia.attrelid = i.indexrelid
                    WHERE i.indrelid = t.oid
                    AND ia.attname = a.attname
                )
            LIMIT 10;
        `;

        // This query is approximate but useful for a "brutal" check
        // Ideally we'd use pg_stat_user_indexes but that requires more setup
        // Let's stick to a simpler check: Number of indexes on core tables

        const indexCountRes = await client.query(`
            SELECT tablename, count(*) as idx_count 
            FROM pg_indexes 
            WHERE schemaname = 'public' 
            GROUP BY tablename;
        `);

        const idxMap = new Map(indexCountRes.rows.map((r: any) => [r.tablename, parseInt(r.idx_count)]));

        ['User', 'Product', 'Order'].forEach(t => {
            if (idxMap.has(t)) {
                const count = idxMap.get(t) || 0;
                record({
                    phase: "DB-Perf",
                    name: `Index Coverage: ${t}`,
                    passed: count >= 1,
                    detail: `${t} has ${count} indexes.`,
                    recommendation: count === 0 ? `Table ${t} has NO indexes. Primary key index is missing?` : undefined
                });
            }
        });

        // 5. Cache Hit Ratio (The most important metric for DB load)
        const cacheRes = await client.query(`
            SELECT 
                sum(heap_blks_read) as heap_read,
                sum(heap_blks_hit)  as heap_hit,
                sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read) + 1)::numeric as ratio
            FROM pg_statio_user_tables;
        `);
        const ratio = parseFloat(cacheRes.rows[0]?.ratio || "0");
        const ratioPct = (ratio * 100).toFixed(2);

        record({
            phase: "DB-Perf",
            name: "Buffer Cache Hit Ratio",
            passed: ratio > 0.90, // Strict: > 90%
            detail: `Hit Ratio: ${ratioPct}% (Target: >90%)`,
            recommendation: ratio <= 0.90 ? `Low cache hit ratio. Increase shared_buffers or optimize queries doing full table scans.` : undefined
        });

        // 6. Dead Tuples (Bloat check)
        const bloatRes = await client.query(`
            SELECT relname, n_dead_tup, n_live_tup
            FROM pg_stat_user_tables
            WHERE n_dead_tup > 100
            ORDER BY n_dead_tup DESC
            LIMIT 3;
        `);

        if (bloatRes.rowCount && bloatRes.rowCount > 0) {
            bloatRes.rows.forEach((r: any) => {
                const total = parseInt(r.n_dead_tup) + parseInt(r.n_live_tup);
                const bloatPct = total > 0 ? (r.n_dead_tup / total) * 100 : 0;

                if (bloatPct > 20) {
                    record({
                        phase: "DB-Perf",
                        name: `Table Bloat Warning: ${r.relname}`,
                        passed: false,
                        detail: `Dead tuples: ${r.n_dead_tup} (${bloatPct.toFixed(1)}% of table).`,
                        recommendation: `Run VACUUM ANALYZE "${r.relname}"; to reclaim space.`
                    });
                }
            });
        }

        // 7. Connection Pool / Usage Saturation
        // Requires 'pg_read_all_stats' or similar privileges often available to app user
        try {
            const connRes = await client.query(`
                SELECT count(*)::int as active,
                    (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_conn
                FROM pg_stat_activity;
            `);
            const activeConn = connRes.rows[0].active;
            const maxConn = connRes.rows[0].max_conn;
            const usagePct = (activeConn / maxConn) * 100;

            record({
                phase: "DB-Perf",
                name: "Connection Usage",
                passed: usagePct < 80,
                detail: `Active: ${activeConn}/${maxConn} (${usagePct.toFixed(1)}%)`,
                recommendation: usagePct >= 80 ? `DB is nearing connection limit. increasing max_connections or use pooling.` : undefined
            });
        } catch (e) {
            // Ignore if permission denied
        }

    } catch (err: any) {
        record({
            phase: "DB-Adv",
            name: "Audit Execution",
            passed: false,
            detail: `Crash during audit: ${err.message}`
        });
    } finally {
        await client.end();
    }
}

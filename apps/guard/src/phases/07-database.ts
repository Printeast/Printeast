/**
 * PHASE 7: DATABASE CONNECTION AUDIT
 * 
 * Direct PostgreSQL connection test.
 * Measures connection time, simple query time, and checks for common issues.
 * Uses raw pg driver -- no ORM overhead.
 */

import { record, phaseHeader } from "../reporter";
import pg from "pg";

export async function run(): Promise<void> {
    phaseHeader("7 -- DATABASE CONNECTION AUDIT [Database]");

    // Read DATABASE_URL from environment or try common locations
    const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

    if (!dbUrl) {
        record({
            phase: "Database",
            name: "DATABASE_URL configured",
            passed: false,
            detail: "DATABASE_URL and DIRECT_URL are both empty. Cannot test database.",
            recommendation: "Set DATABASE_URL in apps/guard/.env or pass it as environment variable.",
        });
        return;
    }

    record({
        phase: "Database",
        name: "DATABASE_URL configured",
        passed: true,
        detail: `URL present (host: ${new URL(dbUrl).hostname})`,
    });

    // Connection test
    const client = new pg.Client({ connectionString: dbUrl });
    const connStart = performance.now();
    try {
        await client.connect();
        const connMs = performance.now() - connStart;
        const connThreshold = 3000;

        record({
            phase: "Database",
            name: "DB connection established",
            passed: connMs < connThreshold,
            detail: `Connected in ${connMs.toFixed(0)}ms (threshold: ${connThreshold}ms)`,
            latencyMs: connMs,
            threshold: connThreshold,
            recommendation: connMs >= connThreshold
                ? `DB connection took ${connMs.toFixed(0)}ms. For remote DBs (Supabase), this is expected on first connect. Use connection pooling (PgBouncer) to avoid repeated handshakes.`
                : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Database",
            name: "DB connection established",
            passed: false,
            detail: `Connection failed: ${err.message}`,
            recommendation: "Check DATABASE_URL credentials. Verify the database server is running and accessible from this network.",
        });
        return;
    }

    // Simple query test
    try {
        const queryStart = performance.now();
        const result = await client.query("SELECT 1 AS alive");
        const queryMs = performance.now() - queryStart;
        const queryThreshold = 100;

        record({
            phase: "Database",
            name: "Simple query (SELECT 1)",
            passed: queryMs < queryThreshold && result.rows[0]?.alive === 1,
            detail: `Completed in ${queryMs.toFixed(1)}ms (threshold: ${queryThreshold}ms)`,
            latencyMs: queryMs,
            threshold: queryThreshold,
            recommendation: queryMs >= queryThreshold
                ? `Simple query took ${queryMs.toFixed(1)}ms. This indicates network latency to the DB. Consider deploying the API in the same region as your database.`
                : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Database",
            name: "Simple query (SELECT 1)",
            passed: false,
            detail: `Query failed: ${err.message}`,
        });
    }

    // Check if core tables exist
    try {
        const tableResult = await client.query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);
        const tables = tableResult.rows.map((r: any) => r.table_name);
        const requiredTables = ["User", "Tenant", "Vendor", "Role", "UserRole"];
        const missing = requiredTables.filter(t => !tables.includes(t));

        record({
            phase: "Database",
            name: "Core tables exist",
            passed: missing.length === 0,
            detail: missing.length === 0
                ? `All ${requiredTables.length} required tables found. Total tables: ${tables.length}`
                : `Missing tables: ${missing.join(", ")}. Found: ${tables.join(", ")}`,
            recommendation: missing.length > 0
                ? `Run prisma migrate: cd packages/database && npx prisma migrate deploy`
                : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Database",
            name: "Core tables exist",
            passed: false,
            detail: `Schema query failed: ${err.message}`,
        });
    }

    // Row count check (is the DB empty?)
    try {
        const userCount = await client.query('SELECT COUNT(*)::int AS count FROM "User"');
        const tenantCount = await client.query('SELECT COUNT(*)::int AS count FROM "Tenant"');
        const uCount = userCount.rows[0]?.count ?? 0;
        const tCount = tenantCount.rows[0]?.count ?? 0;

        record({
            phase: "Database",
            name: "Database has data",
            passed: uCount > 0,
            detail: `Users: ${uCount}, Tenants: ${tCount}`,
            recommendation: uCount === 0
                ? "Database is empty. No users registered. Seed data or register at least one user through the app."
                : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Database",
            name: "Database has data",
            passed: false,
            detail: `Count query failed: ${err.message}`,
            recommendation: "Tables may not exist or have different names. Run migrations.",
        });
    }

    await client.end();
}

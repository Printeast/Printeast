/**
 * PHASE 8: REDIS CONNECTION AUDIT
 * 
 * Direct Redis connection test.
 * Measures PING latency, SET/GET round-trip, and key count.
 */

import { record, phaseHeader } from "../reporter";
import Redis from "ioredis";

export async function run(): Promise<void> {
    phaseHeader("8 -- REDIS CONNECTION AUDIT [Cache]");

    const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

    let client: Redis;
    try {
        client = new Redis(redisUrl, {
            maxRetriesPerRequest: 1,
            connectTimeout: 5000,
            lazyConnect: true,
        });

        const connStart = performance.now();
        await client.connect();
        const connMs = performance.now() - connStart;

        record({
            phase: "Redis",
            name: "Redis connection",
            passed: true,
            detail: `Connected in ${connMs.toFixed(0)}ms`,
            latencyMs: connMs,
        });
    } catch (err: any) {
        record({
            phase: "Redis",
            name: "Redis connection",
            passed: false,
            detail: `Connection failed: ${err.message}`,
            recommendation: `Redis is not running at ${redisUrl}. Install Redis and start it, or use a cloud provider. On Windows: use WSL or Memurai.`,
        });
        return;
    }

    // PING latency
    try {
        const iterations = 20;
        const times: number[] = [];
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await client.ping();
            times.push(performance.now() - start);
        }
        const avg = times.reduce((a, b) => a + b, 0) / iterations;
        const threshold = 5;

        record({
            phase: "Redis",
            name: `PING latency (avg of ${iterations})`,
            passed: avg < threshold,
            detail: `avg=${avg.toFixed(2)}ms (threshold: ${threshold}ms)`,
            latencyMs: avg,
            threshold,
            recommendation: avg >= threshold
                ? `Redis PING is ${avg.toFixed(2)}ms. For local Redis this should be <1ms. Check: 1) Is Redis on the same machine? 2) Is it overloaded? 3) Network latency if remote.`
                : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Redis",
            name: "PING latency",
            passed: false,
            detail: `PING failed: ${err.message}`,
        });
    }

    // SET/GET round-trip
    try {
        const testKey = "__guard_test_" + Date.now();
        const testValue = "guard_probe_" + Math.random().toString(36).slice(2);

        const setStart = performance.now();
        await client.set(testKey, testValue, "EX", 10);
        const setMs = performance.now() - setStart;

        const getStart = performance.now();
        const retrieved = await client.get(testKey);
        const getMs = performance.now() - getStart;

        await client.del(testKey);

        const correct = retrieved === testValue;
        const totalMs = setMs + getMs;
        const threshold = 10;

        record({
            phase: "Redis",
            name: "SET/GET round-trip",
            passed: correct && totalMs < threshold,
            detail: `SET=${setMs.toFixed(2)}ms GET=${getMs.toFixed(2)}ms total=${totalMs.toFixed(2)}ms correct=${correct} (threshold: ${threshold}ms)`,
            latencyMs: totalMs,
            threshold,
            recommendation: !correct
                ? "Redis SET/GET returned wrong value. Data corruption or connection issue."
                : totalMs >= threshold
                    ? "Redis SET/GET is slow. Check memory usage and eviction policy."
                    : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Redis",
            name: "SET/GET round-trip",
            passed: false,
            detail: `Failed: ${err.message}`,
        });
    }

    // Key count (informational)
    try {
        const info = await client.info("keyspace");
        const dbLine = info.split("\n").find(l => l.startsWith("db0:"));
        const keyCount = dbLine ? dbLine.match(/keys=(\d+)/)?.[1] ?? "0" : "0";

        record({
            phase: "Redis",
            name: "Redis key count (informational)",
            passed: true,
            detail: `Keys in db0: ${keyCount}`,
        });
    } catch {
        // Non-critical
    }

    try {
        await client.quit();
    } catch {
        // Ignore cleanup errors
    }
}

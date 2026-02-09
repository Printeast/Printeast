/**
 * PHASE 4: CONCURRENT LOAD TEST
 * 
 * Fires N simultaneous requests and measures:
 * - Total time for all to complete
 * - Individual response times
 * - Error rate under load
 */

import { record, phaseHeader } from "../reporter";

const API = process.env.API_URL || "http://localhost:4000";

async function fireParallel(url: string, count: number): Promise<{
    totalMs: number;
    times: number[];
    errors: number;
    statusCodes: number[];
}> {
    const start = performance.now();
    const promises = Array(count).fill(null).map(async () => {
        const reqStart = performance.now();
        try {
            const res = await fetch(url);
            return { latency: performance.now() - reqStart, status: res.status, error: false };
        } catch {
            return { latency: performance.now() - reqStart, status: 0, error: true };
        }
    });

    const results = await Promise.all(promises);
    const totalMs = performance.now() - start;

    return {
        totalMs,
        times: results.map(r => r.latency),
        errors: results.filter(r => r.error).length,
        statusCodes: results.map(r => r.status),
    };
}

export async function run(): Promise<void> {
    phaseHeader("4 -- CONCURRENT LOAD TEST [Stress]");

    const healthUrl = `${API}/health`;

    // Level 1: 10 concurrent
    {
        const { totalMs, times, errors } = await fireParallel(healthUrl, 10);
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const threshold = 2000;
        record({
            phase: "Stress",
            name: "10 concurrent requests to /health",
            passed: totalMs < threshold && errors === 0,
            detail: `total=${totalMs.toFixed(0)}ms avg=${avg.toFixed(0)}ms errors=${errors} (threshold: ${threshold}ms)`,
            latencyMs: totalMs,
            threshold,
            recommendation: totalMs >= threshold || errors > 0
                ? `Server struggles with 10 concurrent requests. Total=${totalMs.toFixed(0)}ms, errors=${errors}. Check if the event loop is blocked by synchronous operations. Profile with --inspect.`
                : undefined,
        });
    }

    // Level 2: 25 concurrent
    {
        const { totalMs, times, errors } = await fireParallel(healthUrl, 25);
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const threshold = 3000;
        record({
            phase: "Stress",
            name: "25 concurrent requests to /health",
            passed: totalMs < threshold && errors === 0,
            detail: `total=${totalMs.toFixed(0)}ms avg=${avg.toFixed(0)}ms errors=${errors} (threshold: ${threshold}ms)`,
            latencyMs: totalMs,
            threshold,
            recommendation: totalMs >= threshold || errors > 0
                ? `Server degrades at 25 concurrent. Consider clustering with PM2 or using worker threads.`
                : undefined,
        });
    }

    // Level 3: 50 concurrent
    {
        const { totalMs, times, errors } = await fireParallel(healthUrl, 50);
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        const threshold = 5000;
        record({
            phase: "Stress",
            name: "50 concurrent requests to /health",
            passed: totalMs < threshold && errors === 0,
            detail: `total=${totalMs.toFixed(0)}ms avg=${avg.toFixed(0)}ms errors=${errors} (threshold: ${threshold}ms)`,
            latencyMs: totalMs,
            threshold,
            recommendation: totalMs >= threshold || errors > 0
                ? `Server cannot handle 50 concurrent requests within 5s. This is a scaling problem. Consider: 1) Node.js cluster mode 2) Load balancer 3) Reduce per-request overhead.`
                : undefined,
        });
    }

    // Protected endpoint under load (should reject fast)
    {
        const protectedUrl = `${API}/api/v1/orders`;
        const { totalMs, errors, statusCodes } = await fireParallel(protectedUrl, 20);
        const all401 = statusCodes.every(s => s === 401 || s === 403);
        record({
            phase: "Stress",
            name: "20 concurrent unauthenticated to /orders",
            passed: all401 && errors === 0,
            detail: all401
                ? `All 20 correctly rejected in ${totalMs.toFixed(0)}ms`
                : `Not all returned 401/403. Codes: ${[...new Set(statusCodes)].join(",")}`,
            latencyMs: totalMs,
            recommendation: !all401
                ? "Protected routes leak data under concurrent load. Auth middleware may have race conditions."
                : undefined,
        });
    }
}

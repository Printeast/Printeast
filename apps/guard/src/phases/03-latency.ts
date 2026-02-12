/**
 * PHASE 3: RESPONSE TIME AUDIT
 * 
 * Measures real latency of key endpoints over multiple iterations.
 * Reports avg, p95, p99, max. Compares against thresholds.
 */

import { record, phaseHeader } from "../reporter";

const API = process.env.API_URL || "http://localhost:4000";

async function measureLatency(url: string, iterations: number): Promise<number[]> {
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        try {
            await fetch(url);
        } catch {
            // Connection failure counted as max
            times.push(10000);
            continue;
        }
        times.push(performance.now() - start);
    }
    return times;
}

function stats(times: number[]): { avg: number; p95: number; p99: number; max: number } {
    const sorted = [...times].sort((a, b) => a - b);
    const len = sorted.length;
    return {
        avg: sorted.reduce((a, b) => a + b, 0) / len,
        p95: sorted[Math.floor(len * 0.95)] ?? sorted[len - 1] ?? 0,
        p99: sorted[Math.floor(len * 0.99)] ?? sorted[len - 1] ?? 0,
        max: sorted[len - 1] ?? 0,
    };
}

export async function run(): Promise<void> {
    phaseHeader("3 -- RESPONSE TIME AUDIT [Performance]");

    const endpoints = [
        { url: `${API}/health`, name: "GET /health", threshold: 200, iterations: 20 },
        { url: `${API}/api/v1/auth/me`, name: "GET /auth/me (unauthed)", threshold: 300, iterations: 20 },
        { url: `${API}/api/v1/orders`, name: "GET /orders (unauthed)", threshold: 300, iterations: 15 },
        { url: `${API}/api/v1/designs`, name: "GET /designs (unauthed)", threshold: 300, iterations: 15 },
        { url: `${API}/api/v1/analytics/stats`, name: "GET /analytics/stats (unauthed)", threshold: 300, iterations: 15 },
    ];

    for (const ep of endpoints) {
        const times = await measureLatency(ep.url, ep.iterations);
        const s = stats(times);

        record({
            phase: "Latency",
            name: `${ep.name} avg latency`,
            passed: s.avg < ep.threshold,
            detail: `avg=${s.avg.toFixed(1)}ms p95=${s.p95.toFixed(1)}ms p99=${s.p99.toFixed(1)}ms max=${s.max.toFixed(1)}ms (threshold: ${ep.threshold}ms)`,
            latencyMs: s.avg,
            threshold: ep.threshold,
            recommendation: s.avg >= ep.threshold
                ? `${ep.name} is slow. avg=${s.avg.toFixed(1)}ms exceeds ${ep.threshold}ms. Profile the route handler. Check DB queries, middleware overhead, and serialization cost.`
                : undefined,
        });

        // P99 check (brutal threshold: 2x normal)
        const p99Threshold = ep.threshold * 2;
        record({
            phase: "Latency",
            name: `${ep.name} p99 latency`,
            passed: s.p99 < p99Threshold,
            detail: `p99=${s.p99.toFixed(1)}ms (threshold: ${p99Threshold}ms)`,
            latencyMs: s.p99,
            threshold: p99Threshold,
            recommendation: s.p99 >= p99Threshold
                ? `${ep.name} has inconsistent tail latency. p99=${s.p99.toFixed(1)}ms. Investigate garbage collection pauses, connection pool exhaustion, or cold DB cache.`
                : undefined,
        });
    }
}

/**
 * PHASE 9: PERFORMANCE
 * 
 * The bridge between normal benchmarks and full brutal mode.
 * Moderate concurrency (15-30) with TIGHT thresholds.
 * Tests every endpoint individually under pressure, not just /health.
 * 
 * Purpose: Find which specific endpoint degrades FIRST under load.
 * This is the phase that catches problems before they become outages.
 */

import { record, phaseHeader } from "../reporter";

const API = process.env.API_URL || "http://localhost:4000";
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

interface EndpointProfile {
    name: string;
    url: string;
    method: string;
    concurrency: number;
    thresholdAvgMs: number;
    thresholdMaxMs: number;
    body?: any;
}

async function profileEndpoint(ep: EndpointProfile): Promise<{
    avgMs: number;
    maxMs: number;
    minMs: number;
    p95Ms: number;
    errorRate: number;
    statusCodes: Record<number, number>;
    totalMs: number;
}> {
    const times: number[] = [];
    const statuses: number[] = [];
    let errors = 0;

    const start = performance.now();
    const promises = Array(ep.concurrency).fill(null).map(async () => {
        const reqStart = performance.now();
        try {
            const res = await fetch(ep.url, {
                method: ep.method,
                headers: ep.body ? { "Content-Type": "application/json" } : undefined,
                body: ep.body ? JSON.stringify(ep.body) : undefined,
            });
            times.push(performance.now() - reqStart);
            statuses.push(res.status);
        } catch {
            times.push(performance.now() - reqStart);
            errors++;
            statuses.push(0);
        }
    });

    await Promise.all(promises);
    const totalMs = performance.now() - start;

    const sorted = [...times].sort((a, b) => a - b);
    const statusCodes: Record<number, number> = {};
    for (const s of statuses) {
        statusCodes[s] = (statusCodes[s] || 0) + 1;
    }

    return {
        avgMs: sorted.reduce((a, b) => a + b, 0) / sorted.length,
        maxMs: sorted[sorted.length - 1] ?? 0,
        minMs: sorted[0] ?? 0,
        p95Ms: sorted[Math.floor(sorted.length * 0.95)] ?? sorted[sorted.length - 1] ?? 0,
        errorRate: errors / ep.concurrency,
        statusCodes,
        totalMs,
    };
}

export async function run(): Promise<void> {
    phaseHeader("9 -- PERFORMANCE");

    // Profile each backend endpoint individually under moderate load
    const endpoints: EndpointProfile[] = [
        {
            name: "GET /health (15 concurrent)",
            url: `${API}/health`,
            method: "GET",
            concurrency: 15,
            thresholdAvgMs: 150,
            thresholdMaxMs: 500,
        },
        {
            name: "GET /health (30 concurrent)",
            url: `${API}/health`,
            method: "GET",
            concurrency: 30,
            thresholdAvgMs: 300,
            thresholdMaxMs: 1000,
        },
        {
            name: "GET /auth/me unauthed (20 concurrent)",
            url: `${API}/api/v1/auth/me`,
            method: "GET",
            concurrency: 20,
            thresholdAvgMs: 200,
            thresholdMaxMs: 800,
        },
        {
            name: "GET /orders unauthed (20 concurrent)",
            url: `${API}/api/v1/orders`,
            method: "GET",
            concurrency: 20,
            thresholdAvgMs: 200,
            thresholdMaxMs: 800,
        },
        {
            name: "GET /designs unauthed (20 concurrent)",
            url: `${API}/api/v1/designs`,
            method: "GET",
            concurrency: 20,
            thresholdAvgMs: 200,
            thresholdMaxMs: 800,
        },
        {
            name: "GET /analytics/stats unauthed (20 concurrent)",
            url: `${API}/api/v1/analytics/stats`,
            method: "GET",
            concurrency: 20,
            thresholdAvgMs: 200,
            thresholdMaxMs: 800,
        },
        {
            name: "POST /auth/magic-link (15 concurrent)",
            url: `${API}/api/v1/auth/magic-link`,
            method: "POST",
            concurrency: 15,
            thresholdAvgMs: 300,
            thresholdMaxMs: 1000,
            body: { email: "guard-perf-test@printeast.com" },
        },
    ];

    // Track which endpoint degrades worst
    let worstEndpoint = "";
    let worstDegradation = 0;

    for (const ep of endpoints) {
        const result = await profileEndpoint(ep);

        const avgPassed = result.avgMs < ep.thresholdAvgMs;
        const maxPassed = result.maxMs < ep.thresholdMaxMs;
        const noErrors = result.errorRate === 0;

        const statusSummary = Object.entries(result.statusCodes)
            .map(([code, count]) => `${code}:${count}`)
            .join(" ");

        record({
            phase: "Performance",
            name: `${ep.name} avg`,
            passed: avgPassed && noErrors,
            detail: `avg=${result.avgMs.toFixed(0)}ms min=${result.minMs.toFixed(0)}ms p95=${result.p95Ms.toFixed(0)}ms max=${result.maxMs.toFixed(0)}ms errors=${(result.errorRate * 100).toFixed(0)}% [${statusSummary}]`,
            latencyMs: result.avgMs,
            threshold: ep.thresholdAvgMs,
            recommendation: !avgPassed
                ? `${ep.name} avg=${result.avgMs.toFixed(0)}ms exceeds threshold ${ep.thresholdAvgMs}ms under moderate load. This endpoint will be the first to fail in production. Profile the handler and reduce middleware overhead.`
                : !noErrors
                    ? `${ep.name} has ${(result.errorRate * 100).toFixed(0)}% error rate under moderate load. Fix connection handling.`
                    : undefined,
        });

        record({
            phase: "Performance",
            name: `${ep.name} max`,
            passed: maxPassed,
            detail: `max=${result.maxMs.toFixed(0)}ms (threshold: ${ep.thresholdMaxMs}ms)`,
            latencyMs: result.maxMs,
            threshold: ep.thresholdMaxMs,
            recommendation: !maxPassed
                ? `${ep.name} worst-case latency is ${result.maxMs.toFixed(0)}ms. Tail latency this high means some users experience multi-second delays. Investigate: GC pauses, DB pool exhaustion, or blocking operations.`
                : undefined,
        });

        // Track degradation
        const degradation = result.avgMs / ep.thresholdAvgMs;
        if (degradation > worstDegradation) {
            worstDegradation = degradation;
            worstEndpoint = ep.name;
        }
    }

    // Frontend Performance: 10 concurrent page loads
    const frontendPages = [
        { name: "Landing Page", url: `${FRONTEND}/`, thresholdMs: 2000 },
        { name: "Login Page", url: `${FRONTEND}/en/login`, thresholdMs: 2500 },
        { name: "Seller Dashboard", url: `${FRONTEND}/en/seller`, thresholdMs: 3000 },
    ];

    for (const page of frontendPages) {
        const times: number[] = [];
        let errors = 0;
        const concurrency = 10;

        const promises = Array(concurrency).fill(null).map(async () => {
            const start = performance.now();
            try {
                await fetch(page.url, { headers: { Accept: "text/html" } });
                times.push(performance.now() - start);
            } catch {
                times.push(performance.now() - start);
                errors++;
            }
        });

        await Promise.all(promises);
        const sorted = [...times].sort((a, b) => a - b);
        const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;

        record({
            phase: "Performance",
            name: `${page.name} (${concurrency} concurrent SSR)`,
            passed: avg < page.thresholdMs && errors === 0,
            detail: `avg=${avg.toFixed(0)}ms min=${sorted[0]?.toFixed(0)}ms max=${sorted[sorted.length - 1]?.toFixed(0)}ms errors=${errors}`,
            latencyMs: avg,
            threshold: page.thresholdMs,
            recommendation: avg >= page.thresholdMs
                ? `${page.name} avg SSR time ${avg.toFixed(0)}ms under 10 concurrent requests. Next.js SSR is single-threaded per request. Solutions: 1) Use generateStaticParams for static paths 2) Add ISR with revalidate 3) Use React Server Components with streaming.`
                : errors > 0
                    ? `${page.name} had ${errors} connection failures under moderate load. Check Next.js server stability.`
                    : undefined,
        });
    }

    // Summary: which endpoint is the weakest link?
    record({
        phase: "Performance",
        name: "Weakest endpoint identification",
        passed: worstDegradation < 1.0,
        detail: worstDegradation < 1.0
            ? `All endpoints within thresholds. Closest to limit: ${worstEndpoint} (${(worstDegradation * 100).toFixed(0)}% of threshold)`
            : `WEAKEST LINK: ${worstEndpoint} (${(worstDegradation * 100).toFixed(0)}% of threshold capacity)`,
        recommendation: worstDegradation >= 1.0
            ? `${worstEndpoint} is the first endpoint that will fail under production load. Prioritize optimizing this route above all others.`
            : undefined,
    });
}

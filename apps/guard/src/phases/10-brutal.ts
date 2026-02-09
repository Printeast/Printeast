/**
 * PHASE 9: BRUTAL LOAD TEST
 * 
 * The final phase. Maximum pressure. 100 concurrent requests.
 * Mixed endpoints. Sustained load. No mercy.
 * 
 * This phase is designed to find the breaking point.
 */

import { record, phaseHeader } from "../reporter";

const API = process.env.API_URL || "http://localhost:4000";
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

async function brutalBatch(urls: string[], concurrency: number): Promise<{
    totalMs: number;
    successCount: number;
    failCount: number;
    avgMs: number;
    maxMs: number;
}> {
    const start = performance.now();
    const results: { latency: number; ok: boolean }[] = [];

    // Create work items
    const work = urls.flatMap(url =>
        Array(Math.ceil(concurrency / urls.length)).fill(null).map(async () => {
            const reqStart = performance.now();
            try {
                const res = await fetch(url);
                return { latency: performance.now() - reqStart, ok: res.status < 500 };
            } catch {
                return { latency: performance.now() - reqStart, ok: false };
            }
        })
    );

    const batchResults = await Promise.all(work);
    results.push(...batchResults);

    const totalMs = performance.now() - start;
    const times = results.map(r => r.latency);
    const sorted = [...times].sort((a, b) => a - b);

    return {
        totalMs,
        successCount: results.filter(r => r.ok).length,
        failCount: results.filter(r => !r.ok).length,
        avgMs: times.reduce((a, b) => a + b, 0) / times.length,
        maxMs: sorted[sorted.length - 1] ?? 0,
    };
}

export async function run(): Promise<void> {
    phaseHeader("10 -- BRUTAL LOAD TEST [Brutal]");

    const backendUrls = [
        `${API}/health`,
        `${API}/api/v1/auth/me`,
        `${API}/api/v1/orders`,
        `${API}/api/v1/designs`,
    ];

    // Brutal backend: 100 concurrent mixed requests
    {
        const result = await brutalBatch(backendUrls, 100);
        const threshold = 5000;
        const errorThreshold = 5; // Allow max 5 failures

        record({
            phase: "Brutal",
            name: "100 concurrent mixed backend requests",
            passed: result.totalMs < threshold && result.failCount <= errorThreshold,
            detail: `total=${result.totalMs.toFixed(0)}ms avg=${result.avgMs.toFixed(0)}ms max=${result.maxMs.toFixed(0)}ms success=${result.successCount} fail=${result.failCount}`,
            latencyMs: result.totalMs,
            threshold,
            recommendation: result.totalMs >= threshold || result.failCount > errorThreshold
                ? `Backend breaks under 100 concurrent requests. total=${result.totalMs.toFixed(0)}ms, failures=${result.failCount}. Action items: 1) Enable Node.js cluster mode (PM2 or native cluster) 2) Add connection pooling for DB 3) Profile with clinic.js or 0x 4) Consider horizontal scaling.`
                : undefined,
        });
    }

    // Brutal backend: sustained load (3 waves of 50)
    {
        const waves = 3;
        let totalFails = 0;
        let totalTime = 0;

        for (let wave = 0; wave < waves; wave++) {
            const result = await brutalBatch(backendUrls, 50);
            totalFails += result.failCount;
            totalTime += result.totalMs;
        }

        const avgWaveMs = totalTime / waves;
        record({
            phase: "Brutal",
            name: `Sustained load: ${waves} waves of 50 concurrent`,
            passed: totalFails === 0 && avgWaveMs < 3000,
            detail: `total_time=${totalTime.toFixed(0)}ms avg_wave=${avgWaveMs.toFixed(0)}ms total_failures=${totalFails}`,
            latencyMs: avgWaveMs,
            recommendation: totalFails > 0 || avgWaveMs >= 3000
                ? `Server degrades under sustained load. Failures=${totalFails}. Avg wave time=${avgWaveMs.toFixed(0)}ms. This indicates: 1) Memory leaks (check heap snapshots) 2) Connection pool exhaustion 3) Event loop saturation. Use --max-old-space-size and monitor with process.memoryUsage().`
                : undefined,
        });
    }

    // Brutal frontend: 20 concurrent page loads
    {
        const frontendUrls = [
            `${FRONTEND}/`,
            `${FRONTEND}/en/login`,
            `${FRONTEND}/en/seller`,
        ];

        const result = await brutalBatch(frontendUrls, 20);
        const threshold = 10000;

        record({
            phase: "Brutal",
            name: "20 concurrent frontend page loads",
            passed: result.totalMs < threshold && result.failCount === 0,
            detail: `total=${result.totalMs.toFixed(0)}ms avg=${result.avgMs.toFixed(0)}ms fail=${result.failCount}`,
            latencyMs: result.totalMs,
            threshold,
            recommendation: result.totalMs >= threshold || result.failCount > 0
                ? `Frontend cannot handle 20 concurrent SSR requests. total=${result.totalMs.toFixed(0)}ms. Consider: 1) Static generation for landing/login pages 2) Edge caching with CDN 3) ISR for dashboard pages.`
                : undefined,
        });
    }

    // Memory snapshot (informational)
    const mem = process.memoryUsage();
    record({
        phase: "Brutal",
        name: "Guard process memory after all tests",
        passed: mem.heapUsed < 200 * 1024 * 1024, // 200MB
        detail: `heap=${(mem.heapUsed / 1024 / 1024).toFixed(1)}MB rss=${(mem.rss / 1024 / 1024).toFixed(1)}MB`,
        recommendation: mem.heapUsed >= 200 * 1024 * 1024
            ? "The test process itself is using excessive memory. This could indicate leaked references in fetch or unclosed connections."
            : undefined,
    });
}

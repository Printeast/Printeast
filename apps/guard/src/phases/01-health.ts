/**
 * PHASE 1: BACKEND API HEALTH
 * 
 * Hits GET /health on the real backend.
 * Verifies the server is alive, responding with correct shape, and fast enough.
 */

import { record, phaseHeader } from "../reporter";

const API = process.env.API_URL || "http://localhost:4000";

async function httpGet(url: string): Promise<{ status: number; body: any; latencyMs: number }> {
    const start = performance.now();
    const res = await fetch(url);
    const latencyMs = performance.now() - start;
    let body: any = null;
    try { body = await res.json(); } catch { body = null; }
    return { status: res.status, body, latencyMs };
}

export async function run(): Promise<void> {
    phaseHeader("1 -- BACKEND API HEALTH [Normal]");

    // 1.1 Health endpoint reachable
    try {
        const { status, body, latencyMs } = await httpGet(`${API}/health`);

        record({
            phase: "Health",
            name: "GET /health reachable",
            passed: status === 200,
            detail: status === 200
                ? `Status 200, uptime: ${body?.uptime?.toFixed(0)}s`
                : `Expected 200, got ${status}`,
            latencyMs,
            recommendation: status !== 200
                ? "Backend is not running. Start it with: cd apps/backend && pnpm dev"
                : undefined,
        });

        // 1.2 Response shape
        const hasStatus = body && typeof body.status === "string";
        const hasUptime = body && typeof body.uptime === "number";
        record({
            phase: "Health",
            name: "GET /health response shape",
            passed: hasStatus && hasUptime,
            detail: hasStatus && hasUptime
                ? "Response has { status, uptime } as expected"
                : `Missing fields. Got: ${JSON.stringify(body)}`,
            recommendation: "Health endpoint should return { status: 'ok', uptime: number }",
        });

        // 1.3 Latency
        const threshold = 200;
        record({
            phase: "Health",
            name: "GET /health latency",
            passed: latencyMs < threshold,
            detail: `${latencyMs.toFixed(1)}ms (threshold: ${threshold}ms)`,
            latencyMs,
            threshold,
            recommendation: latencyMs >= threshold
                ? "Health endpoint is slow. Check if middleware chain (helmet, cors, compression) adds overhead. Health should bypass heavy middleware."
                : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Health",
            name: "GET /health reachable",
            passed: false,
            detail: `Connection failed: ${err.message}`,
            recommendation: "Backend is not running or not reachable at " + API + ". Start with: cd apps/backend && pnpm dev",
        });
    }

    // 1.4 Unknown route returns 404
    try {
        const { status, latencyMs } = await httpGet(`${API}/api/v1/nonexistent-route-xyz`);
        record({
            phase: "Health",
            name: "Unknown route returns 404",
            passed: status === 404,
            detail: status === 404
                ? "Correctly returns 404 for unknown routes"
                : `Expected 404, got ${status}. Possible catch-all misconfiguration.`,
            latencyMs,
            recommendation: status !== 404
                ? "The catch-all route handler in app.ts is not working. Check the app.all('*') middleware."
                : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Health",
            name: "Unknown route returns 404",
            passed: false,
            detail: `Request failed: ${err.message}`,
        });
    }
}

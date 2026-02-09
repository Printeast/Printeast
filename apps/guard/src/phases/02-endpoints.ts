/**
 * PHASE 2: ENDPOINT FUNCTIONALITY
 * 
 * Hits every known API route WITHOUT auth to verify:
 * - Protected routes correctly return 401/403
 * - Public routes respond with correct status codes
 * - Response bodies have expected shapes
 */

import { record, phaseHeader } from "../reporter";

const API = process.env.API_URL || "http://localhost:4000";

async function httpRequest(
    method: string,
    url: string,
    body?: any,
    headers?: Record<string, string>
): Promise<{ status: number; body: any; latencyMs: number }> {
    const start = performance.now();
    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: body ? JSON.stringify(body) : undefined,
    });
    const latencyMs = performance.now() - start;
    let resBody: any = null;
    try { resBody = await res.json(); } catch { resBody = null; }
    return { status: res.status, body: resBody, latencyMs };
}

export async function run(): Promise<void> {
    phaseHeader("2 -- ENDPOINT FUNCTIONALITY [Normal]");

    // Protected endpoints should reject unauthenticated requests
    const protectedRoutes = [
        { method: "GET", path: "/api/v1/auth/me", name: "GET /auth/me" },
        { method: "GET", path: "/api/v1/auth/onboard-status", name: "GET /auth/onboard-status" },
        { method: "POST", path: "/api/v1/auth/onboard", name: "POST /auth/onboard" },
        { method: "GET", path: "/api/v1/orders", name: "GET /orders" },
        { method: "GET", path: "/api/v1/designs", name: "GET /designs" },
        { method: "GET", path: "/api/v1/analytics/stats", name: "GET /analytics/stats" },
        { method: "GET", path: "/api/v1/storage", name: "GET /storage" },
    ];

    for (const route of protectedRoutes) {
        try {
            const { status, body, latencyMs } = await httpRequest(route.method, `${API}${route.path}`);
            const isProtected = status === 401 || status === 403;
            // Check for JSON response on error (security best practice) (simulates 'All error responses are JSON')
            const isJson = body !== null;

            record({
                phase: "Endpoints",
                name: `${route.name} rejects unauthenticated`,
                passed: isProtected && isJson,
                detail: isProtected
                    ? `Status ${status} + JSON body`
                    : `Expected 401/403 JSON, got ${status}`,
                latencyMs,
                recommendation: !isProtected
                    ? `${route.name} is accessible without authentication. Add 'protect' middleware.`
                    : !isJson
                        ? `${route.name} error response is not JSON. It might be HTML (server error default). Ensure error handler returns JSON.`
                        : undefined,
            });
        } catch (err: any) {
            record({
                phase: "Endpoints",
                name: `${route.name} rejects unauthenticated`,
                passed: false,
                detail: `Request failed: ${err.message}`,
                recommendation: "Backend may be down or route is misconfigured.",
            });
        }
    }

    // Public endpoints should be accessible
    const publicRoutes = [
        { method: "POST", path: "/api/v1/auth/logout", name: "POST /auth/logout" },
    ];

    for (const route of publicRoutes) {
        try {
            const { status, latencyMs } = await httpRequest(route.method, `${API}${route.path}`);
            // Logout without session should return 200 or 204 (graceful)
            const isOk = status < 500;
            record({
                phase: "Endpoints",
                name: `${route.name} accessible`,
                passed: isOk,
                detail: isOk
                    ? `Returns ${status} (acceptable)`
                    : `Returns ${status}. Server error on a public endpoint.`,
                latencyMs,
                recommendation: !isOk
                    ? `${route.name} returns 500. Check error handling in the controller.`
                    : undefined,
            });
        } catch (err: any) {
            record({
                phase: "Endpoints",
                name: `${route.name} accessible`,
                passed: false,
                detail: `Request failed: ${err.message}`,
            });
        }
    }

    // Rate limiter should exist on login
    try {
        const promises = Array(15).fill(null).map(() =>
            httpRequest("POST", `${API}/api/v1/auth/magic-link`, { email: "ratelimit-test@fake.com" })
        );
        const results = await Promise.all(promises);
        const rateLimited = results.some(r => r.status === 429);
        record({
            phase: "Endpoints",
            name: "Rate limiter active on /auth/magic-link",
            passed: rateLimited,
            detail: rateLimited
                ? "Rate limiter correctly triggered after rapid requests"
                : `Sent 15 rapid requests, none returned 429. Rate limiter may not be working.`,
            recommendation: !rateLimited
                ? "loginLimiter middleware may be misconfigured. Check rate-limit.middleware.ts thresholds."
                : undefined,
        });
    } catch (err: any) {
        record({
            phase: "Endpoints",
            name: "Rate limiter active on /auth/magic-link",
            passed: false,
            detail: `Request failed: ${err.message}`,
        });
    }
}

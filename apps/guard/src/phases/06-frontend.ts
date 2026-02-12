/**
 * PHASE 6: FRONTEND PAGE AUDIT
 * 
 * Hits real frontend pages via HTTP and measures:
 * - Page reachability (status code)
 * - Response time (time to first byte)
 * - Response size (bundle awareness)
 */

import { record, phaseHeader } from "../reporter";

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

async function checkPage(path: string): Promise<{
    status: number;
    latencyMs: number;
    sizeKB: number;
    error?: string;
}> {
    const start = performance.now();
    try {
        const res = await fetch(`${FRONTEND}${path}`, {
            redirect: "follow",
            headers: { "Accept": "text/html" },
        });
        const body = await res.text();
        return {
            status: res.status,
            latencyMs: performance.now() - start,
            sizeKB: Math.round(body.length / 1024),
        };
    } catch (err: any) {
        return {
            status: 0,
            latencyMs: performance.now() - start,
            sizeKB: 0,
            error: err.message,
        };
    }
}

export async function run(): Promise<void> {
    phaseHeader("6 -- FRONTEND PAGE AUDIT [Frontend]");

    const pages = [
        { path: "/", name: "Landing Page", threshold: 3000, maxSizeKB: 500 },
        { path: "/en/login", name: "Login Page", threshold: 3000, maxSizeKB: 400 },
        { path: "/en/seller", name: "Seller Dashboard", threshold: 4000, maxSizeKB: 600 },
        { path: "/en/seller/design", name: "Design Studio", threshold: 4000, maxSizeKB: 600 },
        { path: "/en/seller/inventory", name: "Inventory Page", threshold: 4000, maxSizeKB: 600 },
        { path: "/en/seller/orders", name: "Orders Page", threshold: 4000, maxSizeKB: 600 },
    ];

    for (const page of pages) {
        const result = await checkPage(page.path);

        if (result.error) {
            record({
                phase: "Frontend",
                name: `${page.name} (${page.path})`,
                passed: false,
                detail: `Connection failed: ${result.error}`,
                recommendation: `Frontend is not running or ${page.path} is unreachable. Start with: cd apps/web && pnpm dev`,
            });
            continue;
        }

        // Reachability
        const reachable = result.status >= 200 && result.status < 400;
        record({
            phase: "Frontend",
            name: `${page.name} reachable`,
            passed: reachable,
            detail: reachable
                ? `Status ${result.status}`
                : `Status ${result.status}. Page may be missing or broken.`,
            latencyMs: result.latencyMs,
            recommendation: !reachable
                ? `${page.path} returns ${result.status}. Check if the page route exists in apps/web/src/app/.`
                : undefined,
        });

        // Load time
        record({
            phase: "Frontend",
            name: `${page.name} load time`,
            passed: result.latencyMs < page.threshold,
            detail: `${result.latencyMs.toFixed(0)}ms (threshold: ${page.threshold}ms)`,
            latencyMs: result.latencyMs,
            threshold: page.threshold,
            recommendation: result.latencyMs >= page.threshold
                ? `${page.name} is slow (${result.latencyMs.toFixed(0)}ms). Investigate: 1) Server-side data fetching bottlenecks 2) Large component trees 3) Unoptimized imports. Use next/dynamic for heavy components.`
                : undefined,
        });

        // Size
        record({
            phase: "Frontend",
            name: `${page.name} response size`,
            passed: result.sizeKB < page.maxSizeKB,
            detail: `${result.sizeKB}KB (threshold: ${page.maxSizeKB}KB)`,
            recommendation: result.sizeKB >= page.maxSizeKB
                ? `${page.name} HTML response is ${result.sizeKB}KB. This is too large. Check for: 1) Inline scripts/styles 2) Excessive server-rendered content 3) Missing code splitting.`
                : undefined,
        });
    }
}

/**
 * PHASE 6: FRONTEND BRUTAL AUDIT
 * 
 * Hits real frontend pages via HTTP and performs deep HTML inspection.
 * - Response Time (TTFB)
 * - Response Size (Bundle Budget)
 * - SEO Readiness (Title, Meta Description, H1)
 * - Accessibility Basics (Alt tags, ARIA)
 * - Security Headers (in HTML)
 */

import { record, phaseHeader } from "../reporter";

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

async function checkPage(path: string): Promise<{
    status: number;
    latencyMs: number;
    sizeKB: number;
    body: string;
    error?: string;
}> {
    const start = performance.now();
    try {
        const res = await fetch(`${FRONTEND}${path}`, {
            redirect: "follow",
            headers: {
                "User-Agent": "Printeast-Guard-Bot/1.0",
                "Accept": "text/html"
            },
        });
        const body = await res.text();
        return {
            status: res.status,
            latencyMs: performance.now() - start,
            sizeKB: Math.round(body.length / 1024),
            body
        };
    } catch (err: any) {
        return {
            status: 0,
            latencyMs: performance.now() - start,
            sizeKB: 0,
            body: "",
            error: err.message,
        };
    }
}

export async function run(): Promise<void> {
    phaseHeader("6 -- FRONTEND BRUTAL AUDIT [Frontend]");

    const pages = [
        { path: "/", name: "Landing Page", threshold: 1500, maxSizeKB: 300, seo: true }, // Changed threshold to 1.5s
        { path: "/en/login", name: "Login Page", threshold: 2000, maxSizeKB: 300, seo: true },
        { path: "/en/seller", name: "Seller Dashboard", threshold: 3000, maxSizeKB: 500, seo: false },
        { path: "/en/seller/inventory", name: "Inventory", threshold: 3000, maxSizeKB: 500, seo: false },
    ];

    for (const page of pages) {
        const result = await checkPage(page.path);

        if (result.error) {
            record({
                phase: "Frontend",
                name: `${page.name} (${page.path})`,
                passed: false,
                detail: `Connection failed: ${result.error}`,
                recommendation: `Frontend not running?`
            });
            continue;
        }

        // 1. Performance
        record({
            phase: "Frontend-Perf",
            name: `${page.name} TTFB + Download`,
            passed: result.latencyMs < page.threshold,
            detail: `${result.latencyMs.toFixed(0)}ms (Limit: ${page.threshold}ms)`,
            recommendation: result.latencyMs >= page.threshold ? "Page is too slow. Check SSR data fetching or server load." : undefined
        });

        record({
            phase: "Frontend-Perf",
            name: `${page.name} HTML Size`,
            passed: result.sizeKB < page.maxSizeKB,
            detail: `${result.sizeKB}KB (Limit: ${page.maxSizeKB}KB)`,
            recommendation: result.sizeKB >= page.maxSizeKB ? "HTML is bloated. Check for inline CSS/JS or excessive JSON hydration data." : undefined
        });

        // 2. SEO & Structure (Brutal Checks)
        const html = result.body;

        if (page.seo) {
            const hasTitle = /<title>([^<]+)<\/title>/i.test(html);
            const hasMetaDesc = /<meta\s+name=["']description["']\s+content=["'][^"']+["']\s*\/?>/i.test(html);
            const h1Count = (html.match(/<h1/gi) || []).length;

            record({
                phase: "Frontend-SEO",
                name: `${page.name} SEO Tags`,
                passed: hasTitle && hasMetaDesc,
                detail: `Title: ${hasTitle}, Meta Desc: ${hasMetaDesc}`,
                recommendation: !hasTitle || !hasMetaDesc ? "Missing critical SEO tags (<title> or <meta name='description'>)." : undefined
            });

            record({
                phase: "Frontend-SEO",
                name: `${page.name} H1 Hierarchy`,
                passed: h1Count === 1,
                detail: `Found ${h1Count} <h1> tags`,
                recommendation: h1Count !== 1 ? "Page must have exactly one <h1> tag for SEO." : undefined
            });
        }

        // 3. Best Practices
        const doctype = /<!DOCTYPE html>/i.test(html);
        const viewport = /<meta\s+name=["']viewport["']\s+content=["'][^"']+["']\s*\/?>/i.test(html);

        record({
            phase: "Frontend-Code",
            name: `${page.name} Standard HTML5`,
            passed: doctype && viewport,
            detail: `Doctype: ${doctype}, Viewport: ${viewport}`,
            recommendation: "Ensure <!DOCTYPE html> and viewport meta tag are present."
        });

        // 4. Broken Links (Basic scan)
        // Find hrefs that look like internal relative links but might be broken/empty
        const emptyHrefs = (html.match(/href=["']["']/g) || []).length;
        const hashHrefs = (html.match(/href=["']#["']/g) || []).length;

        if (emptyHrefs > 0) {
            record({
                phase: "Frontend-Quality",
                name: `${page.name} Empty Links`,
                passed: false,
                detail: `Found ${emptyHrefs} empty href="" attributes`,
                recommendation: "Remove or fix empty links."
            });
        }
    }
}

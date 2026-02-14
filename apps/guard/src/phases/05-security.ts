/**
 * PHASE 5: SECURITY & ACCESS CONTROL
 * 
 * Inspects HTTP headers and attempts active exploits/bypasses.
 * 
 * 1. Passive: Security Headers (Helmet, CORS)
 * 2. Active: Broken Access Control (BAC) on protected routes
 * 3. Active: Input Validation (Malformed JSON, Injection)
 * 4. Active: Method Hardening (POST to GET routes)
 */

import { record, phaseHeader } from "../reporter";

const API = process.env.API_URL || "http://localhost:4000";
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

export async function run(): Promise<void> {
    phaseHeader("5 -- SECURITY & ACCESS CONTROL [Security]");

    try {
        // =================================================================
        // 1. HEADERS & CONFIGURATION
        // =================================================================
        const res = await fetch(`${API}/health`);
        const headers = Object.fromEntries(res.headers.entries());

        // X-Powered-By check
        record({
            phase: "Security",
            name: "X-Powered-By hidden",
            passed: !headers["x-powered-by"],
            detail: headers["x-powered-by"] ? `EXPOSED: ${headers["x-powered-by"]}` : "Hidden",
            recommendation: headers["x-powered-by"] ? "Use Helmet to hide X-Powered-By." : undefined
        });

        // CORS check
        const corsRes = await fetch(`${API}/health`, { headers: { "Origin": "https://evil.com" } });
        const allowOrigin = corsRes.headers.get("access-control-allow-origin");
        record({
            phase: "Security",
            name: "CORS blocks external origins",
            passed: !allowOrigin || allowOrigin !== "https://evil.com",
            detail: allowOrigin === "https://evil.com" ? "FAILED: Allowed evil.com" : "Blocked",
            recommendation: "Configure CORS to only allow specific origins."
        });

        // Stack Trace Leak
        const errRes = await fetch(`${API}/api/v1/force-error-check-stack`);
        const errText = await errRes.text();
        const leaksStack = errText.includes("node_modules") || errText.includes("at ");
        record({
            phase: "Security",
            name: "No Stack Traces in Errors",
            passed: !leaksStack,
            detail: leaksStack ? "Stack trace detected in response" : "Clean error response",
            recommendation: "Ensure NODE_ENV=production or custom error handler strips stacks."
        });

        // =================================================================
        // 2. BROKEN ACCESS CONTROL (BAC)
        // =================================================================

        // API Level: Protected routes should return 401/403 without token
        const protectedApiRoutes = [
            "/api/v1/auth/me",
            "/api/v1/orders",
            "/api/v1/designs/my-designs", // Assuming this exists
            "/api/v1/creator/stats"
        ];

        for (const route of protectedApiRoutes) {
            const r = await fetch(`${API}${route}`);
            record({
                phase: "Security-BAC",
                name: `API Protects ${route}`,
                passed: r.status === 401 || r.status === 403,
                detail: `Got ${r.status} (Expected 401/403)`,
                recommendation: r.status === 200 ? `CRITICAL: ${route} is accessible without authentication!` : undefined
            });
        }

        // Frontend Level: Protected pages should redirect
        // Note: fetch follows redirects by default. We want to see if it redirects to login.
        const protectedPages = ["/dashboard", "/seller", "/creator", "/settings"];
        for (const page of protectedPages) {
            const r = await fetch(`${FRONTEND}${page}`, { redirect: 'manual' });
            const loc = r.headers.get("location") || "";
            const isRedirect = r.status >= 300 && r.status < 400;
            const toLogin = loc.includes("login") || loc.includes("signin") || loc.includes("auth");

            // If manual redirect returns 307/308/302 to a login page
            // Or if it just loads the login page content (200 but path is different - hard to detect with fetch without browser)
            // We rely on status code for redirects here. Next.js usually redirects.

            record({
                phase: "Security-BAC",
                name: `Frontend Protects ${page}`,
                passed: isRedirect && toLogin,
                detail: `Status ${r.status}, Location: ${loc || "none"}`,
                recommendation: !isRedirect ? `Page ${page} does not redirect unauthenticated users.` : undefined
            });
        }

        // =================================================================
        // 3. INPUT VALIDATION & DOO (Denial of Service)
        // =================================================================

        // Malformed JSON Body
        const malformedRes = await fetch(`${API}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{ bad json: " // Syntax error
        });
        record({
            phase: "Security-Input",
            name: "Reject Malformed JSON",
            passed: malformedRes.status === 400 || malformedRes.status === 500, // 400 is ideal, 500 is common but okay-ish if it doesn't crash
            detail: `Got ${malformedRes.status}`,
            recommendation: "Ensure body-parser handles JSON syntax errors gracefully (400)."
        });

        // Massive Payload (1MB+) - DoS check
        const bigPayload = "a".repeat(1024 * 1024); // 1MB string
        const dosRes = await fetch(`${API}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: bigPayload, password: "test" })
        });

        record({
            phase: "Security-Input",
            name: "Reject Massive Payloads (DoS)",
            passed: dosRes.status === 413 || dosRes.status === 400, // 413 Payload Too Large
            detail: `Got ${dosRes.status}`,
            recommendation: dosRes.status === 200 ? "Server accepted 1MB payload. Configure body-parser limit (e.g. '100kb')." : undefined
        });

        // Method Not Allowed
        const methodRes = await fetch(`${API}/health`, { method: "POST" }); // Health is usually GET
        record({
            phase: "Security-Method",
            name: "Reject Invalid Methods",
            passed: methodRes.status === 404 || methodRes.status === 405,
            detail: `POST to GET route returned ${methodRes.status}`,
            recommendation: "Ensure routes are strict about methods (devs often use app.use or app.all by mistake)."
        });

    } catch (err: any) {
        record({
            phase: "Security",
            name: "Security Audit",
            passed: false,
            detail: `Audit failed: ${err.message}`,
            recommendation: "Backend must be running."
        });
    }
}

/**
 * PHASE 5: SECURITY HEADERS CHECK
 * 
 * Inspects HTTP response headers for security best practices.
 * Checks for: Helmet headers, CORS policy, content-type, X-Powered-By removal.
 */

import { record, phaseHeader } from "../reporter";

const API = process.env.API_URL || "http://localhost:4000";

export async function run(): Promise<void> {
    phaseHeader("5 -- SECURITY HEADERS CHECK [Security]");

    try {
        const res = await fetch(`${API}/health`);
        const headers = Object.fromEntries(res.headers.entries());

        // X-Powered-By should NOT be present (Helmet removes it)
        record({
            phase: "Security",
            name: "X-Powered-By header removed",
            passed: !headers["x-powered-by"],
            detail: headers["x-powered-by"]
                ? `EXPOSED: x-powered-by: ${headers["x-powered-by"]}`
                : "Header correctly removed by Helmet",
            recommendation: headers["x-powered-by"]
                ? "Helmet is not removing x-powered-by. Verify app.use(helmet()) is called before routes."
                : undefined,
        });

        // Content-Security-Policy should exist
        record({
            phase: "Security",
            name: "Content-Security-Policy present",
            passed: !!headers["content-security-policy"],
            detail: headers["content-security-policy"]
                ? "CSP header is set"
                : "CSP header missing",
            recommendation: !headers["content-security-policy"]
                ? "Add Content-Security-Policy via Helmet config. This prevents XSS and data injection attacks."
                : undefined,
        });

        // X-Content-Type-Options
        record({
            phase: "Security",
            name: "X-Content-Type-Options: nosniff",
            passed: headers["x-content-type-options"] === "nosniff",
            detail: headers["x-content-type-options"]
                ? `Value: ${headers["x-content-type-options"]}`
                : "Header missing",
            recommendation: headers["x-content-type-options"] !== "nosniff"
                ? "Add X-Content-Type-Options: nosniff via Helmet. Prevents MIME type sniffing attacks."
                : undefined,
        });

        // Strict-Transport-Security (for production awareness)
        record({
            phase: "Security",
            name: "Strict-Transport-Security awareness",
            passed: true, // informational in dev
            detail: headers["strict-transport-security"]
                ? `HSTS is set: ${headers["strict-transport-security"]}`
                : "HSTS not set (acceptable in development, REQUIRED in production)",
        });

        // CORS check -- send request with foreign origin
        const corsRes = await fetch(`${API}/health`, {
            headers: { "Origin": "https://malicious-site.com" },
        });
        const corsHeader = corsRes.headers.get("access-control-allow-origin");
        const corsBlocked = !corsHeader || corsHeader !== "https://malicious-site.com";

        record({
            phase: "Security",
            name: "CORS rejects unknown origins",
            passed: corsBlocked,
            detail: corsBlocked
                ? "CORS correctly blocks requests from unknown origins"
                : `DANGER: CORS allows origin 'https://malicious-site.com'. access-control-allow-origin: ${corsHeader}`,
            recommendation: !corsBlocked
                ? "CORS is configured with wildcard or too permissive. Set ALLOWED_ORIGINS to only your frontend domains."
                : undefined,
        });

        // Check if error responses leak stack traces
        const errRes = await fetch(`${API}/api/v1/nonexistent-check-leak`);
        let errBody: any = null;
        try { errBody = await errRes.json(); } catch { }
        const leaksStack = errBody && (
            (typeof errBody.stack === "string") ||
            (typeof errBody.error === "string" && errBody.error.includes("at ")) ||
            (typeof errBody.message === "string" && errBody.message.includes("node_modules"))
        );

        record({
            phase: "Security",
            name: "Error responses do not leak stack traces",
            passed: !leaksStack,
            detail: leaksStack
                ? "DANGER: Error response contains stack trace or internal paths"
                : "Error responses are clean",
            recommendation: leaksStack
                ? "The global error handler exposes internal details. In production, strip stack traces from error responses."
                : undefined,
        });

    } catch (err: any) {
        record({
            phase: "Security",
            name: "Security headers check",
            passed: false,
            detail: `Cannot reach server: ${err.message}`,
            recommendation: "Backend must be running to audit security headers.",
        });
    }
}

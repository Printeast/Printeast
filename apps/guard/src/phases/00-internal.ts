/**
 * PHASE 0: INTERNAL UNIT & INTEGRATION TESTS
 * 
 * Runs the backend's internal Jest test suite (unit + integration).
 * Captures the output, analyzes failures, and provides recommendations.
 * 
 * This treats the internal tests as a fundamental health check.
 * If logic is broken, no point testing performance.
 */

import { record, phaseHeader } from "../reporter";
import { exec } from "child_process";
import { resolve } from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function run(): Promise<void> {
    phaseHeader("0 -- INTERNAL LOGIC VERIFICATION [Jest]");

    const backendPath = resolve(__dirname, "../../../backend");
    const webPath = resolve(__dirname, "../../../web");

    // 1. BACKEND TESTS
    console.log("  > Running Backend Jest Suite (this may take a minute)...");
    try {
        const { stdout, stderr } = await execAsync("pnpm test:unified", {
            cwd: backendPath,
            env: { ...process.env, CI: "true" }
        });
        record({
            phase: "Internal",
            name: "Backend Logic (Jest)",
            passed: true,
            detail: "All backend logic tests passed.",
        });
    } catch (err: any) {
        let output = (err.stdout || "") + "\n" + (err.stderr || "");
        output = output.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
        const failedSuites = output.match(/FAIL.*src\/.*ts/g) || [];
        const details = failedSuites.map((s: string) => s.trim()).join(", ") || "Tests failed";
        record({
            phase: "Internal",
            name: "Backend Logic (Jest)",
            passed: false,
            detail: `FAILED. ${failedSuites.length} suites failed.`,
            recommendation: `Fix backend logic:\n      ${details}\n      Run 'cd apps/backend && pnpm test:unified' to debug.`,
        });
    }

    // 2. FRONTEND TESTS
    console.log("  > Running Frontend Jest Suite...");
    try {
        await execAsync("pnpm test", {
            cwd: webPath,
            env: { ...process.env, CI: "true" }
        });
        record({
            phase: "Internal",
            name: "Frontend Logic (Jest)",
            passed: true,
            detail: "All frontend component tests passed.",
        });
    } catch (err: any) {
        let output = (err.stdout || "") + "\n" + (err.stderr || "");
        output = output.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "");
        const failedSuites = output.match(/FAIL.*src\/.*ts[x]?/g) || [];
        const details = failedSuites.map((s: string) => s.trim()).join(", ") || "Tests failed";
        record({
            phase: "Internal",
            name: "Frontend Logic (Jest)",
            passed: false,
            detail: `FAILED. ${failedSuites.length} suites failed.`,
            recommendation: `Fix frontend logic:\n      ${details}\n      Run 'cd apps/web && pnpm test' to debug.`,
        });
    }
}

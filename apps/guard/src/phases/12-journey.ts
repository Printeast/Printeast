/**
 * PHASE 12: REAL USER JOURNEY (PLAYWRIGHT)
 * 
 * Replaces simple fetch-based journey with FULL BROWSER AUTOMATION.
 * Mirroring 'brutal_journey.spec.ts' logic.
 * 
 * 1. Register new user (via browser)
 * 2. Complete Onboarding UI
 * 3. Land on Dashboard
 * 4. Verify LCP and Console Errors
 */

import { record, phaseHeader } from "../reporter";
import { exec } from "child_process";
import { promisify } from "util";
import { resolve } from "path";

const execAsync = promisify(exec);

export async function run(): Promise<void> {
    phaseHeader("12 -- REAL USER JOURNEY [Playwright]");

    // We will run the actual Playwright spec from the backend folder
    // This ensures we are testing EXACTLY the same logic as the ruthless spec
    const backendTestPath = resolve(__dirname, "../../../backend");
    const specPath = "src/__tests__/e2e/brutal_journey.spec.ts";

    record({
        phase: "Journey",
        name: "Test Environment Prep",
        passed: true,
        detail: `Running external Playwright suite: ${specPath}`
    });

    try {
        const cmd = `npx playwright test src/__tests__/e2e/brutal_journey.spec.ts --reporter=line`;

        // Use exec with promise to wait for completion
        const { stdout, stderr } = await promisify(exec)(cmd, {
            cwd: resolve(__dirname, "../../../backend"),
            env: { ...process.env, CI: "true" } // Force headless
        });

        record({
            phase: "Journey",
            name: "End-to-End User Flow (Playwright)",
            passed: true,
            detail: "All brutal journey steps passed.",
        });

    } catch (err: any) {
        // Playwright throws on test failure (non-zero exit code)
        const output = (err.stdout || "") + "\n" + (err.stderr || "");

        // Try to extract useful error message
        const failLines = output.split('\n')
            .filter(l => l.includes('Error:') || l.includes('failed:') || l.includes('1)'))
            .slice(0, 3)
            .map(l => l.trim());

        record({
            phase: "Journey",
            name: "End-to-End User Flow (Playwright)",
            passed: false,
            detail: `FAILED. Exit Code: ${err.code}`,
            recommendation: `UI/UX Flow Broken:\n      ${failLines.join('\n      ')}\n      Run 'cd apps/backend && npx playwright show-report' to debug.`
        });
    }
}

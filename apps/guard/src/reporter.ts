/**
 * PRINTEAST GUARD -- REPORTER
 * 
 * Collects results from all phases and prints the final verdict.
 * No decoration. No emojis. Plain facts.
 */

export interface CheckResult {
    phase: string;
    name: string;
    passed: boolean;
    detail: string;
    latencyMs?: number;
    threshold?: number;
    recommendation?: string;
}

const results: CheckResult[] = [];

export function record(result: CheckResult): void {
    results.push(result);
    const tag = result.passed ? "[PASS]" : "[FAIL]";
    const latency = result.latencyMs !== undefined ? ` (${result.latencyMs.toFixed(1)}ms)` : "";
    console.log(`  ${tag} ${result.name}${latency} -- ${result.detail}`);
    if (!result.passed && result.recommendation) {
        console.log(`    RECOMMENDATION: ${result.recommendation}`);
    }
}

export function phaseHeader(name: string): void {
    console.log("");
    console.log("------------------------------------------------------------");
    console.log(`  PHASE: ${name}`);
    console.log("------------------------------------------------------------");
}

export function printVerdict(): void {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";

    const failures = results.filter(r => !r.passed);

    console.log("");
    console.log("============================================================");
    console.log("  PRINTEAST GUARD -- FINAL VERDICT");
    console.log("============================================================");
    console.log(`  Total Checks:    ${total}`);
    console.log(`  Passed:          ${passed}`);
    console.log(`  Failed:          ${failed}`);
    console.log(`  Pass Rate:       ${rate}%`);
    console.log("");

    if (failures.length > 0) {
        console.log("  CRITICAL ISSUES:");
        failures.forEach((f, i) => {
            const latency = f.latencyMs !== undefined ? ` [${f.latencyMs.toFixed(1)}ms]` : "";
            console.log(`    ${i + 1}. [${f.phase}] ${f.name}${latency}`);
            console.log(`       ${f.detail}`);
        });
        console.log("");
        console.log("  RECOMMENDATIONS:");
        failures.forEach((f, i) => {
            if (f.recommendation) {
                console.log(`    ${i + 1}. ${f.recommendation}`);
            }
        });
    } else {
        console.log("  STATUS: ALL CLEAR. No issues found.");
    }

    console.log("============================================================");
    console.log("");

    // Exit with failure code if anything failed
    if (failed > 0) {
        process.exitCode = 1;
    }
}

export function getResults(): CheckResult[] {
    return [...results];
}

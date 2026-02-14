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

// Use require for fs/path to avoid module resolution issues if not top-level
const fs = require('fs');
const path = require('path');

export function printVerdict(): void {
    const total = results.length;
    const passed = results.filter(r => r.passed).length;
    const failed = total - passed;
    const rate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";

    const failures = results.filter(r => !r.passed);

    // CONSOLE OUTPUT
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

    // GENERATE REPORT FILE
    generateReportFile(total, passed, failed, rate, results);

    // Exit with failure code if anything failed
    if (failed > 0) {
        process.exitCode = 1;
    }
}

function generateReportFile(total: number, passed: number, failed: number, rate: string, results: CheckResult[]) {
    const resultsDir = path.resolve(process.cwd(), 'results');

    // Ensure results directory exists
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const displayTime = now.toLocaleString();

    // File-safe timestamp for filename: YYYY-MM-DD_HH-mm-ss
    const fileTimestamp = now.toISOString().replace(/T/, '_').replace(/:/g, '-').split('.')[0];
    const fileName = `INVESTIGATION_REPORT_${fileTimestamp}.md`;
    const reportPath = path.resolve(resultsDir, fileName);

    // Also maintain a symlink or copy of 'LATEST_REPORT.md' for easy access
    const latestPath = path.resolve(resultsDir, 'LATEST.md');

    let md = `# 🛡️ Printeast Guard Investigation Report - ${displayTime}
**Generated:** ${timestamp}
**Verdict:** ${failed === 0 ? '🟢 ALL CLEAR' : '🔴 ISSUES FOUND'}
**File:** ${fileName}

## 📊 Summary
| Metric | Count |
| :--- | :--- |
| **Total Checks** | ${total} |
| **Passed** | ${passed} |
| **Failed** | ${failed} |
| **Pass Rate** | ${rate}% |

## 🚨 Critical Issues
`;

    const failures = results.filter(r => !r.passed);
    if (failures.length === 0) {
        md += `\n*No critical issues found. System is healthy.*\n`;
    } else {
        failures.forEach((f, i) => {
            const latency = f.latencyMs !== undefined ? ` (${f.latencyMs.toFixed(1)}ms)` : "";
            md += `
### ${i + 1}. ${f.phase}: ${f.name}
- **Status**: ❌ FAILED
- **Detail**: ${f.detail}
- **Latency**: ${latency || 'N/A'}
- **Recommendation**: ${f.recommendation || 'None'}
`;
        });
    }

    md += `\n## 📝 Full Audit Log\n`;

    // Group by phase
    const byPhase: Record<string, CheckResult[]> = {};
    results.forEach(r => {
        if (!byPhase[r.phase]) byPhase[r.phase] = [];
        byPhase[r.phase].push(r);
    });

    Object.keys(byPhase).forEach(phase => {
        md += `\n### Phase: ${phase}\n`;
        md += `| Check | Status | Details | Latency |\n`;
        md += `| :--- | :--- | :--- | :--- |\n`;
        byPhase[phase].forEach(r => {
            const status = r.passed ? '✅ PASS' : '❌ FAIL';
            const lat = r.latencyMs !== undefined ? `${r.latencyMs.toFixed(1)}ms` : '-';
            md += `| ${r.name} | ${status} | ${r.detail} | ${lat} |\n`;
        });
    });

    try {
        fs.writeFileSync(reportPath, md);
        fs.writeFileSync(latestPath, md); // Always update LATEST.md
        console.log(`  📄 Report generated: ${reportPath}`);
        console.log(`  📄 Also updated: ${latestPath}`);
    } catch (e) {
        console.error(`  ⚠️ Failed to write report file: ${e}`);
    }
}

export function getResults(): CheckResult[] {
    return [...results];
}

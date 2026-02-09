/**
 * PRINTEAST GUARD
 * 
 * Zero-mock, brutally honest, full-stack investigation suite.
 * One command. Every layer. No mercy.
 * 
 * Usage: npm start (from apps/guard)
 */

import { printVerdict } from "./reporter";

// Load environment from backend .env if available
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv(): void {
    const envPath = resolve(__dirname, "../../backend/.env");
    try {
        const content = readFileSync(envPath, "utf-8");
        for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx === -1) continue;
            const key = trimmed.slice(0, eqIdx).trim();
            const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    } catch {
        console.log("[GUARD] No backend .env found. Using environment variables.");
    }
}

async function main(): Promise<void> {
    loadEnv();

    const startTime = performance.now();

    console.log("");
    console.log("============================================================");
    console.log("  PRINTEAST GUARD -- FULL STACK INVESTIGATION");
    console.log("  Started: " + new Date().toISOString());
    console.log("  Backend: " + (process.env.API_URL || "http://localhost:4000"));
    console.log("  Frontend: " + (process.env.FRONTEND_URL || "http://localhost:3000"));
    console.log("  Redis: " + (process.env.REDIS_URL || "redis://127.0.0.1:6379"));
    console.log("  DB: " + (process.env.DATABASE_URL ? "configured" : "NOT CONFIGURED"));
    console.log("============================================================");

    // Run all phases sequentially -- order matters
    const phases = [
        { name: "00-internal", mod: () => import("./phases/00-internal") },
        { name: "01-health", mod: () => import("./phases/01-health") },
        { name: "02-endpoints", mod: () => import("./phases/02-endpoints") },
        { name: "03-latency", mod: () => import("./phases/03-latency") },
        { name: "04-stress", mod: () => import("./phases/04-stress") },
        { name: "05-security", mod: () => import("./phases/05-security") },
        { name: "06-frontend", mod: () => import("./phases/06-frontend") },
        { name: "07-database", mod: () => import("./phases/07-database") },
        { name: "08-redis", mod: () => import("./phases/08-redis") },
        { name: "09-performance", mod: () => import("./phases/09-performance") },
        { name: "10-brutal", mod: () => import("./phases/10-brutal") },
    ];

    for (const phase of phases) {
        try {
            const m = await phase.mod();
            await m.run();
        } catch (err: any) {
            console.log(`\n  [PHASE CRASH] ${phase.name}: ${err.message}`);
            console.log(`  Continuing to next phase...\n`);
        }
    }

    const totalTime = performance.now() - startTime;
    console.log("");
    console.log(`  Total investigation time: ${(totalTime / 1000).toFixed(1)}s`);

    printVerdict();
}

main().catch((err) => {
    console.error("GUARD FATAL ERROR:", err);
    process.exit(2);
});

"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api.service";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Smart retry with exponential backoff
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 100
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (attempt < maxRetries - 1) {
                await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)));
            }
        }
    }

    throw lastError;
}

interface OnboardResponse {
    user: any;
    redirectTo?: string;
    alreadyOnboarded?: boolean;
    cached?: boolean;
}

export function ProcessingStep() {
    const { answers, computedPath, reset } = useOnboardingStore();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success">("loading");
    const [stage, setStage] = useState<"syncing" | "workspace" | "ready">("syncing");
    const submitted = useRef(false);
    const redirecting = useRef(false);

    // Optimistic redirect - start navigation immediately
    const doRedirect = useCallback((path: string) => {
        if (redirecting.current) return;
        redirecting.current = true;

        reset();
        router.replace(path);
    }, [reset, router]);

    useEffect(() => {
        const submitProfile = async () => {
            if (submitted.current) return;
            submitted.current = true;

            // Determine role and path
            let role = "CUSTOMER";
            let targetPath = "/dashboard";

            if (computedPath === "INDIVIDUAL") {
                role = "CUSTOMER";
                targetPath = "/customer";
            } else if (computedPath === "ARTIST") {
                role = "CREATOR";
                targetPath = "/creator";
            } else if (["SELLER_STARTER", "SELLER_EXPANDING", "NON_PROFIT"].includes(computedPath || "")) {
                role = "SELLER";
                targetPath = "/seller";
            }

            try {
                setStage("syncing");

                // Use retry logic for resilience
                const res = await retryWithBackoff(() =>
                    api.post<OnboardResponse>("/auth/onboard", {
                        role,
                        onboardingData: answers
                    }),
                    3, // max retries
                    150 // base delay
                );

                if (res.success) {
                    const finalPath = res.data?.redirectTo || targetPath;

                    // If cached/already onboarded, instant redirect
                    if (res.data?.alreadyOnboarded || res.data?.cached) {
                        setStatus("success");
                        doRedirect(finalPath);
                        return;
                    }

                    // New onboarding - quick visual feedback
                    setStage("workspace");

                    // Minimal transition time
                    requestAnimationFrame(() => {
                        setStage("ready");
                        setStatus("success");

                        // Immediate redirect
                        doRedirect(finalPath);
                    });
                } else {
                    // Handle all errors gracefully - extract role and redirect
                    const errorMsg = res.error || res.message || "";

                    if (errorMsg.includes("already onboarded")) {
                        const match = errorMsg.match(/already onboarded as (\w+)/i);
                        const existingRole = match?.[1]?.toUpperCase();

                        let redirectPath = "/dashboard";
                        if (existingRole === "SELLER") redirectPath = "/seller";
                        else if (existingRole === "CREATOR") redirectPath = "/creator";
                        else if (existingRole === "CUSTOMER") redirectPath = "/customer";

                        setStatus("success");
                        doRedirect(redirectPath);
                    } else {
                        // Any other error - still redirect forward
                        console.warn("Onboarding issue:", res);
                        setStatus("success");
                        doRedirect(targetPath);
                    }
                }
            } catch (err: any) {
                console.error("Network error after retries:", err);

                // Handle "already onboarded" from catch
                const errorStr = err?.message || err?.toString() || "";
                if (errorStr.includes("already onboarded")) {
                    const match = errorStr.match(/already onboarded as (\w+)/i);
                    const existingRole = match?.[1]?.toUpperCase();

                    let redirectPath = "/dashboard";
                    if (existingRole === "SELLER") redirectPath = "/seller";
                    else if (existingRole === "CREATOR") redirectPath = "/creator";
                    else if (existingRole === "CUSTOMER") redirectPath = "/customer";

                    setStatus("success");
                    doRedirect(redirectPath);
                    return;
                }

                // Always move forward - never block user
                setStatus("success");
                doRedirect(targetPath);
            }
        };

        submitProfile();
    }, [answers, computedPath, doRedirect]);

    // Success state
    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold font-poppins text-neutral-900">Ready!</h2>
                <p className="text-slate-500 mt-2">Opening your workspace...</p>
            </div>
        );
    }

    // Loading state
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative" />
            </div>

            <h2 className="text-2xl font-bold font-poppins text-neutral-900 mb-2 transition-all duration-200">
                {stage === "syncing" && "Setting up..."}
                {stage === "workspace" && "Almost there..."}
                {stage === "ready" && "Opening workspace..."}
            </h2>
            <p className="text-slate-500 max-w-[280px] mx-auto text-sm">
                {stage === "syncing" && "Syncing your preferences."}
                {stage === "workspace" && "Preparing your dashboard."}
                {stage === "ready" && "Redirecting now..."}
            </p>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mt-10">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-200 ease-out",
                            (i === 1 && stage === "syncing") ||
                                (i === 2 && stage === "workspace") ||
                                (i === 3 && stage === "ready")
                                ? "w-10 bg-blue-600"
                                : "w-2 bg-neutral-200"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}

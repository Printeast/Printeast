"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api.service";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProcessingStep() {
    const { answers, computedPath, reset } = useOnboardingStore();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [stage, setStage] = useState<"onboarding" | "workspace" | "finalizing">("onboarding");
    const [errorMessage, setErrorMessage] = useState("");
    const submitted = useRef(false);

    useEffect(() => {
        const submitProfile = async () => {
            if (submitted.current) return;
            submitted.current = true;

            // 1. Map Path to Role
            let role = "CUSTOMER";
            let targetPath = "/dashboard";

            if (computedPath === "INDIVIDUAL") {
                role = "CUSTOMER";
                targetPath = "/customer";
            }
            else if (computedPath === "ARTIST") {
                role = "CREATOR";
                targetPath = "/creator";
            }
            else if (["SELLER_STARTER", "SELLER_EXPANDING", "NON_PROFIT"].includes(computedPath || "")) {
                role = "SELLER";
                targetPath = "/seller";
            }

            // 2. Prepare Payload
            try {
                setStage("onboarding");

                const payload = {
                    role,
                    onboardingData: answers
                };

                const res = await api.post("/auth/onboard", payload);

                if (res.success) {
                    setStage("workspace");

                    // Artificial delay to show "Workspace Assigning"
                    await new Promise(resolve => setTimeout(resolve, 600));

                    setStage("finalizing");
                    await new Promise(resolve => setTimeout(resolve, 300));

                    setStatus("success");

                    setTimeout(() => {
                        router.push(targetPath);
                    }, 300);
                } else {
                    console.error("Onboarding error:", res);
                    if (res.error?.includes("already onboarded")) {
                        setStatus("success");
                        setTimeout(() => router.push(targetPath), 1000);
                    } else {
                        setStatus("error");
                        setErrorMessage(res.error || "Failed to save profile.");
                    }
                }
            } catch (err: any) {
                console.error("Network error:", err);

                if (err.message?.includes("already onboarded") || err.toString().includes("already onboarded")) {
                    setStatus("success");
                    setTimeout(() => {
                        reset();
                        router.push(targetPath);
                    }, 1000);
                    return;
                }

                setStatus("error");
                setErrorMessage(err.message || "Network error occurred.");
            }
        };

        submitProfile();
    }, [answers, computedPath, router, reset]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-10">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative" />
                </div>

                <h2 className="text-2xl font-bold font-poppins text-neutral-900 mb-2 transition-all duration-300">
                    {stage === "onboarding" && "Personalizing your experience..."}
                    {stage === "workspace" && "Assigning your workspace..."}
                    {stage === "finalizing" && "Finishing touches..."}
                </h2>
                <p className="text-slate-500 max-w-[280px] mx-auto text-sm">
                    {stage === "onboarding" && "We're tailoring the dashboard to your goals."}
                    {stage === "workspace" && "Setting up your secure seller environment."}
                    {stage === "finalizing" && "Hang tight, we're almost there!"}
                </p>

                {/* Micro-progress indicator */}
                <div className="flex items-center gap-2 mt-10">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-700 ease-in-out",
                                (i === 1 && stage === "onboarding") || (i === 2 && stage === "workspace") || (i === 3 && stage === "finalizing")
                                    ? "w-10 bg-blue-600 shadow-sm"
                                    : "w-2 bg-neutral-200"
                            )}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold font-poppins text-slate-900 mb-2">Something went wrong</h2>
                <p className="text-slate-500 mb-8 max-w-md">{errorMessage}</p>
                <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
        );
    }

    return ( // Success
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in spin-in-12 duration-500">
                <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold font-poppins text-neutral-900">All set!</h2>
            <p className="text-slate-500 mt-2">Redirecting you to your dashboard...</p>
        </div>
    );
}

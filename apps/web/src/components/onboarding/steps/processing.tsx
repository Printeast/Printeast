"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api.service";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProcessingStep() {
    const { answers, computedPath, reset } = useOnboardingStore();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
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
                const payload = {
                    role,
                    onboardingData: answers
                };

                const res = await api.post("/auth/onboard", payload);

                if (res.success) {
                    setStatus("success");
                    // Redirect logic
                    setTimeout(() => {
                        // Clear store to prevent 'ghost' data for future sessions/logins
                        router.push(targetPath);
                    }, 1500);
                } else {
                    console.error("Onboarding error:", res);
                    // Handle "User already onboarded" gracefully
                    if (res.error?.includes("already onboarded")) {
                        setStatus("success"); // Treat as success to move them forward
                        setTimeout(() => router.push(targetPath), 1000);
                    } else {
                        setStatus("error");
                        setErrorMessage(res.error || "Failed to save profile.");
                    }
                }
            } catch (err: any) {
                console.error("Network error:", err);

                // Handle "User already onboarded" gracefully if API throws for 403
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
    }, [answers, computedPath, router]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-black animate-spin mb-6" />
                <h2 className="text-2xl font-bold font-poppins">Setting up your dashboard...</h2>
                <p className="text-slate-500 mt-2">Personalizing your experience.</p>
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
            <h2 className="text-2xl font-bold font-poppins">All set!</h2>
            <p className="text-slate-500 mt-2">Redirecting you now...</p>
        </div>
    );
}

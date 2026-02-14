"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api.service";

// Steps
import { GoalSelectionStep } from "./steps/goal-selection";
import { ProductInterestStep } from "./steps/product-interest";
import { DiscoveryChannelStep } from "./steps/discovery-channel";
import { LocationStep } from "./steps/location";
import { SalesVolumeStep } from "./steps/sales-volume";
import { PodJourneyStep } from "./steps/pod-journey";
import { UseCaseStep } from "./steps/use-case";
import { AiToolsStep } from "./steps/ai-tools";
import { ProcessingStep } from "./steps/processing";

import { NonProfitIntentionStep } from "./steps/non-profit-intention";

export function OnboardingWizard() {
    const { currentStep, prevStep } = useOnboardingStore();
    const [hydrated, setHydrated] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            useOnboardingStore.persist.rehydrate();

            const state = useOnboardingStore.getState();

            // If stuck on PROCESSING, reset
            if (state.currentStep === "PROCESSING") {
                state.reset();
            }

            // FAST PATH: Use cached onboard status check (< 5ms if cached)
            const res = await api.get<{ onboarded: boolean; redirectTo?: string; cached?: boolean }>("/auth/onboard-status");

            if (res.success) {
                if (res.data?.onboarded && res.data?.redirectTo) {
                    // Already onboarded - clear store and instant redirect
                    state.reset();
                    router.replace(res.data.redirectTo);
                    return;
                }
            } else {
                // Fallback to /me endpoint if new endpoint not deployed yet or call failed
                const fallback = await api.get<{ user: { roles: Array<{ role: { name: string } }>; onboardingData?: Record<string, any> } }>("/auth/me");

                if (fallback.success && fallback.data?.user) {
                    const role = fallback.data.user.roles?.[0]?.role?.name;
                    const hasData = fallback.data.user.onboardingData && Object.keys(fallback.data.user.onboardingData).length > 0;

                    if (role === "SELLER") {
                        router.replace("/seller");
                        return;
                    } else if (role === "CREATOR") {
                        router.replace("/creator");
                        return;
                    } else if (hasData) {
                        // Onboarded (even as CUSTOMER)
                        if (role === "CUSTOMER") router.replace("/customer");
                        else router.replace("/dashboard");
                        return;
                    } else if (role && role !== "CUSTOMER" && role !== "PENDING") {
                        router.replace("/dashboard");
                        return;
                    }
                }
            }

            setCheckingRole(false);
            setHydrated(true);
        };

        init();
    }, [router]);

    // Show loading while checking role
    if (checkingRole || !hydrated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
                <p className="text-sm text-neutral-500 mt-4">Loading...</p>
            </div>
        );
    }

    const renderStep = () => {
        switch (currentStep) {
            case "GOAL":
                return <GoalSelectionStep />;
            case "PRODUCT_INTEREST":
                return <ProductInterestStep />;
            case "DISCOVERY_CHANNEL":
                return <DiscoveryChannelStep />;
            case "LOCATION":
                return <LocationStep />;
            case "SALES_VOLUME":
                return <SalesVolumeStep />;
            case "POD_JOURNEY":
                return <PodJourneyStep />;
            case "NON_PROFIT_INTENTION":
                return <NonProfitIntentionStep />;
            case "USE_CASE":
                return <UseCaseStep />;
            case "AI_TOOLS":
                return <AiToolsStep />;
            case "PROCESSING":
                return <ProcessingStep />;
            default:
                return <div>Unknown Step: {currentStep}</div>;
        }
    };

    const steps = ["GOAL", "LOCATION", "POD_JOURNEY", "NON_PROFIT_INTENTION", "PRODUCT_INTEREST", "SALES_VOLUME", "USE_CASE", "DISCOVERY_CHANNEL", "PROCESSING"];
    const index = steps.indexOf(currentStep);
    const displayIndex = index === -1 ? 0 : index;
    const progress = Math.round(((displayIndex + 1) / steps.length) * 100);

    const isFirstStep = currentStep === "GOAL";
    const isProcessing = currentStep === "PROCESSING";

    return (
        <main className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-100 flex flex-col items-center pt-20 pb-16 px-6">

            <div className="w-full max-w-[520px] mx-auto">
                {/* Navigation Header */}
                <div className="mb-10 flex items-center justify-between">
                    {!isFirstStep && !isProcessing && (
                        <button
                            onClick={prevStep}
                            className="p-2 -ml-2 text-neutral-400 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-50"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="flex-1" /> {/* Spacer */}
                </div>

                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex items-end justify-between mb-3">
                        <h1 className="text-sm font-bold tracking-widest uppercase text-neutral-400">Step {displayIndex + 1} of {steps.length}</h1>
                        <span className="text-sm font-bold text-neutral-900">{progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0 }}
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-100"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>


        </main>
    );
}


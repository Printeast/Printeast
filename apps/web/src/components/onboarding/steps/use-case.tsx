"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { ChevronRight, Globe, Truck, Star, DollarSign, PlusCircle, Bot, Link, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// Updated from flowchart
const ALL_USE_CASES = [
    { id: "global-reach", label: "Expand my reach to global customers", type: ["SELLER", "SELLER_EXPANDING"], icon: Globe },
    { id: "fulfillment", label: "Faster, reliable fulfillment & shipping", type: ["SELLER", "SELLER_EXPANDING"], icon: Truck },
    { id: "quality", label: "Improve product quality and consistency", type: ["SELLER", "SELLER_EXPANDING", "ARTIST"], icon: Star },
    { id: "profit", label: "Get better profit margins and pricing", type: ["SELLER", "SELLER_STARTER", "SELLER_EXPANDING", "ARTIST"], icon: DollarSign },
    { id: "new-products", label: "Add new product categories to my shop", type: ["SELLER_EXPANDING", "ARTIST"], icon: PlusCircle },
    { id: "ai-tools", label: "Use AI-powered design tools and mockups", type: ["INDIVIDUAL", "SELLER", "ARTIST", "NON_PROFIT"], icon: Bot },
    { id: "integration", label: "Integrate seamlessly with my existing store", type: ["SELLER", "SELLER_EXPANDING"], icon: Link },
    { id: "other", label: "Something else", type: ["INDIVIDUAL", "SELLER", "SELLER_STARTER", "SELLER_EXPANDING", "ARTIST", "NON_PROFIT"], icon: MoreHorizontal },
];

export function UseCaseStep() {
    const { nextStep, setAnswer, answers } = useOnboardingStore();

    const visibleOptions = useMemo(() => {
        // Individual users have different goals, but for business/sellers (which is where this step appears in the flow),
        // we should show the full suite of business benefits as per the flowchart.
        // The flowchart lists 8 specific options.
        if (answers.goal === "Shopping for myself") {
            return ALL_USE_CASES.filter(opt => opt.id === 'ai-tools' || opt.id === 'other');
        }

        return ALL_USE_CASES;
    }, [answers.goal]);

    const handleSelect = (id: string) => {
        setAnswer("useCase", [id]); // Store as array for backward compat, but logic is single select
        nextStep();
    };

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    What are your main goals with PRINTEAST?
                </h2>
                <p className="text-sm text-neutral-500">
                    Select your primary objective.
                </p>
            </motion.div>

            <div className={cn(
                visibleOptions.length > 7
                    ? "grid grid-cols-2 md:grid-cols-4 gap-3"
                    : "flex flex-col gap-3"
            )}>
                {visibleOptions.map((opt, index) => (
                    <motion.button
                        key={opt.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(opt.id)}
                        className={cn(
                            "group bg-white border border-neutral-200 rounded-xl hover:border-black hover:shadow-md transition-all duration-200",
                            visibleOptions.length > 7
                                ? "flex flex-col items-center justify-center p-4 h-40 text-center gap-3"
                                : "w-full p-4 md:p-5 flex items-center justify-between text-left"
                        )}
                    >
                        {visibleOptions.length > 7 ? (
                            // Grid Content (Vertical)
                            <>
                                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-black group-hover:text-white transition-colors duration-200">
                                    <opt.icon className="w-6 h-6" strokeWidth={1.5} />
                                </div>
                                <span className="font-bold text-neutral-800 text-sm leading-snug group-hover:text-black">
                                    {opt.label}
                                </span>
                            </>
                        ) : (
                            // List Content (Horizontal)
                            <>
                                <div className="flex items-center gap-4 text-left">
                                    <div className="min-w-10 h-10 md:min-w-12 md:h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-black group-hover:text-white transition-colors duration-200">
                                        <opt.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                                    </div>
                                    <span className="font-bold text-neutral-800 text-base md:text-lg group-hover:text-black leading-tight">
                                        {opt.label}
                                    </span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0 ml-4" />
                            </>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

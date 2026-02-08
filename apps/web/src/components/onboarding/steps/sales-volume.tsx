"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
    "$0-500/month",
    "$500-2,000/month",
    "$2,000-5,000/month",
    "$5,000-10,000/month",
    "$10,000-25,000/month",
    "$25,000-50,000/month",
    "Over $50,000/month",
    "Custom"
];

export function SalesVolumeStep() {
    const { nextStep, setAnswer } = useOnboardingStore();
    const [selected, setSelected] = useState<string | null>(null);
    const [customValue, setCustomValue] = useState("");

    const handleSelect = (value: string) => {
        if (value === "Custom") {
            setSelected("Custom");
        } else {
            setAnswer("salesVolume", value);
            nextStep();
        }
    };

    const handleCustomSubmit = () => {
        if (customValue.trim()) {
            setAnswer("salesVolume", customValue);
            nextStep();
        }
    };

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    What&apos;s your current monthly sales volume?
                </h2>
                <p className="text-sm text-neutral-500">
                    This helps us recommend the best pricing tier for you.
                </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {OPTIONS.map((opt, index) => (
                    <motion.button
                        key={opt}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(opt)}
                        className={cn(
                            "group flex items-center justify-center p-3 h-24 rounded-xl border transition-all duration-200 text-center",
                            selected === "Custom" && opt === "Custom"
                                ? "border-black bg-neutral-50 ring-1 ring-black/5 shadow-md"
                                : "border-neutral-200 bg-white hover:border-black hover:shadow-md"
                        )}
                    >
                        <span className={cn(
                            "font-bold text-sm leading-snug transition-colors",
                            selected === "Custom" && opt === "Custom" ? "text-black" : "text-neutral-800 group-hover:text-black"
                        )}>
                            {opt}
                        </span>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {selected === "Custom" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 max-w-[480px] mx-auto w-full"
                    >
                        <div className="flex flex-col gap-4">
                            <label className="text-sm font-bold text-neutral-900 px-1">
                                Enter your custom volume:
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    autoFocus
                                    value={customValue}
                                    onChange={(e) => setCustomValue(e.target.value)}
                                    placeholder="Enter monthly volume..."
                                    className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && customValue.trim()) handleCustomSubmit();
                                    }}
                                />
                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={!customValue.trim()}
                                    className="h-12 px-6 bg-black text-white rounded-lg font-medium text-sm hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                                >
                                    Next <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

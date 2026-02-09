"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Palette, Rocket, Building2, Heart, MoreHorizontal, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const JOURNEY_OPTIONS = [
    { id: "artist", label: "I want to build a brand around my personal art and designs", icon: Palette },
    { id: "side-hustle", label: "I want to start a side-hustle with zero upfront inventory", icon: Rocket },
    { id: "scale", label: "I want to scale my existing business with better fulfillment", icon: Building2 },
    { id: "community", label: "I want to support my community or cause through merchandise", icon: Heart },
    { id: "other", label: "I want to explore other custom printing solutions", icon: MoreHorizontal, hasInput: true }
];

export function PodJourneyStep() {
    const { nextStep, setAnswer } = useOnboardingStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [customJourney, setCustomJourney] = useState("");

    const handleSelect = (opt: typeof JOURNEY_OPTIONS[0]) => {
        if (!opt.hasInput) {
            setAnswer("podJourney", opt.label);
            nextStep();
        } else {
            setSelectedId(opt.id);
        }
    };

    const handleCustomSubmit = () => {
        if (customJourney.trim()) {
            setAnswer("podJourney", customJourney);
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
                    Which best describes your print-on-demand journey?
                </h2>
                <p className="text-sm text-neutral-500">
                    We'll tailor your experience based on your answer.
                </p>
            </motion.div>

            <div data-lenis-prevent className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {JOURNEY_OPTIONS.map((opt, index) => {
                    const isSelected = selectedId === opt.id;

                    return (
                        <motion.button
                            key={opt.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelect(opt)}
                            className={cn(
                                "group w-full p-4 md:p-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200",
                                isSelected && "border-black shadow-md ring-1 ring-black/5"
                            )}
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className={cn(
                                    "min-w-10 h-10 md:min-w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                                    isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white"
                                )}>
                                    <opt.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                <span className={cn(
                                    "font-bold text-neutral-800 text-base md:text-lg transition-colors leading-tight",
                                    isSelected ? "text-black" : "group-hover:text-black"
                                )}>
                                    {opt.label}
                                </span>
                            </div>
                            {isSelected ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-black flex-shrink-0" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0 ml-4" />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedId === "other" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 max-w-[480px] mx-auto w-full"
                    >
                        <div className="flex flex-col gap-4">
                            <label className="text-sm font-bold text-neutral-900 px-1">
                                Tell us more about your custom journey:
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    autoFocus
                                    value={customJourney}
                                    onChange={(e) => setCustomJourney(e.target.value)}
                                    placeholder="Tell us about your printing needs..."
                                    className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && customJourney.trim()) handleCustomSubmit();
                                    }}
                                />
                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={!customJourney.trim()}
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

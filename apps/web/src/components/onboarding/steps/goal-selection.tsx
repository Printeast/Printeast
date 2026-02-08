"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Rocket, TrendingUp, Palette, ChevronRight, MoreHorizontal, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const GOALS = [
    {
        id: "shopping-for-myself",
        label: "I want to shop for myself",
        description: "Buy unique products for yourself or as gifts",
        icon: ShoppingBag,
    },
    {
        id: "launch-business",
        label: "I want to launch an online business",
        description: "Start selling custom products today",
        icon: Rocket,
    },
    {
        id: "grow-business",
        label: "I want to grow my business",
        description: "Scale your existing store with us",
        icon: TrendingUp,
    },
    {
        id: "artist",
        label: "I want to sell my artwork as an Artist",
        description: "Monetize your creative designs",
        icon: Palette,
    },
    {
        id: "other",
        label: "I want to achieve something else",
        description: "Tell us about your custom goal",
        icon: MoreHorizontal,
        hasInput: true
    },
];

export function GoalSelectionStep() {
    const { setAnswer, nextStep } = useOnboardingStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [customGoal, setCustomGoal] = useState("");

    const handleSelect = (goal: typeof GOALS[0]) => {
        if (!goal.hasInput) {
            setAnswer("goal", goal.label);
            nextStep();
        } else {
            setSelectedId(goal.id);
        }
    };

    const handleCustomSubmit = () => {
        if (customGoal.trim()) {
            setAnswer("goal", customGoal);
            nextStep();
        }
    };

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center md:text-left"
            >
                <h2 className="text-2xl font-bold text-neutral-900 mb-2 font-poppins tracking-tight">
                    What&apos;s your main goal?
                </h2>
                <p className="text-neutral-500 font-medium text-sm">
                    Select the option that describes you best.
                </p>
            </motion.div>

            <div className="flex flex-col gap-3">
                {GOALS.map((goal, index) => {
                    const isSelected = selectedId === goal.id;

                    return (
                        <motion.button
                            key={goal.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                            onClick={() => handleSelect(goal)}
                            className={cn(
                                "group w-full p-4 md:p-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200",
                                isSelected && "border-black shadow-md ring-1 ring-black/5"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                                    isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white"
                                )}>
                                    <goal.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                <span className={cn(
                                    "font-bold text-neutral-800 text-base md:text-lg text-left transition-colors",
                                    isSelected ? "text-black" : "group-hover:text-black"
                                )}>
                                    {goal.label}
                                </span>
                            </div>

                            {isSelected ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-black" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
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
                                Tell us more about your custom goal:
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    autoFocus
                                    value={customGoal}
                                    onChange={(e) => setCustomGoal(e.target.value)}
                                    placeholder="Tell us what you want to achieve..."
                                    className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && customGoal.trim()) handleCustomSubmit();
                                    }}
                                />
                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={!customGoal.trim()}
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

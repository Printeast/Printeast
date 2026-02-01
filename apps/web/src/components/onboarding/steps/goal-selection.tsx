"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion } from "framer-motion";
import { ShoppingBag, Rocket, TrendingUp, Palette, ChevronRight } from "lucide-react";

const GOALS = [
    {
        id: "shopping-for-myself",
        label: "Shopping for myself",
        description: "Buy unique products for yourself or as gifts",
        icon: ShoppingBag,
    },
    {
        id: "launch-business",
        label: "Launch an online business",
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
        label: "Designer/Artist looking to sell my artwork",
        description: "Monetize your creative designs",
        icon: Palette,
    },
];

export function GoalSelectionStep() {
    const { setAnswer, nextStep } = useOnboardingStore();

    const handleSelect = (value: string) => {
        setAnswer("goal", value);
        nextStep();
    };

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center md:text-left"
            >
                <h2 className="text-2xl font-bold text-neutral-900 mb-2 font-poppins tracking-tight">
                    What's your main goal?
                </h2>
                <p className="text-neutral-500 font-medium text-sm">
                    Select the option that describes you best.
                </p>
            </motion.div>

            <div className="flex flex-col gap-3">
                {GOALS.map((goal, index) => (
                    <motion.button
                        key={goal.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        onClick={() => handleSelect(goal.label)}
                        className="group w-full p-4 md:p-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-black group-hover:text-white transition-colors duration-200">
                                <goal.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                            </div>
                            <span className="font-bold text-neutral-800 text-base md:text-lg text-left group-hover:text-black">
                                {goal.label}
                            </span>
                        </div>

                        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

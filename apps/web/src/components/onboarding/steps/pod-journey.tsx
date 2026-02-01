"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion } from "framer-motion";
import { ChevronRight, Palette, Rocket, Building2, Heart, MoreHorizontal } from "lucide-react";

const JOURNEY_OPTIONS = [
    { label: "Designer/Artist looking to sell my artwork", icon: Palette },
    { label: "I want to start a side business with minimal upfront investment", icon: Rocket },
    { label: "I'm an established business expanding into custom products", icon: Building2 },
    { label: "I run a non-profit or community organization", icon: Heart },
    { label: "Other", icon: MoreHorizontal }
];

export function PodJourneyStep() {
    const { nextStep, setAnswer } = useOnboardingStore();

    const handleSelect = (value: string) => {
        setAnswer("podJourney", value);
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
                    Which best describes your print-on-demand journey?
                </h2>
                <p className="text-sm text-neutral-500">
                    We'll tailor your experience based on your answer.
                </p>
            </motion.div>

            <div className="flex flex-col gap-3">
                {JOURNEY_OPTIONS.map((opt, index) => (
                    <motion.button
                        key={opt.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(opt.label)}
                        className="group w-full p-4 md:p-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center gap-4 text-left">
                            <div className="min-w-10 h-10 md:min-w-12 md:h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-black group-hover:text-white transition-colors duration-200">
                                <opt.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                            </div>
                            <span className="font-bold text-neutral-800 text-base md:text-lg group-hover:text-black leading-tight">
                                {opt.label}
                            </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0 ml-4" />
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

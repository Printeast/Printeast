"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Sparkles, PenTool } from "lucide-react";
import { motion } from "framer-motion";

export function AiToolsStep() {
    const { nextStep, setAnswer } = useOnboardingStore();

    const handleSelect = (useAi: boolean) => {
        setAnswer("useAi", useAi);
        setAnswer("aiTools", []); // Reset tools as we are simplifying
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
                    Enhance your workflow with AI?
                </h2>
                <p className="text-sm text-neutral-500">
                    Printeast offers powerful AI design tools.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(true)}
                    className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all duration-200 group"
                >
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
                        <Sparkles className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-neutral-900 text-lg mb-1">Yes, definitely</span>
                    <span className="text-sm text-neutral-500">I want to use AI tools</span>
                </motion.button>

                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(false)}
                    className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-neutral-200 bg-white hover:border-black hover:shadow-md transition-all duration-200 group"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-black transition-colors">
                        <PenTool className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="font-bold text-neutral-900 text-lg mb-1">Not right now</span>
                    <span className="text-sm text-neutral-500">I prefer traditional tools</span>
                </motion.button>
            </div>
        </div>
    );
}

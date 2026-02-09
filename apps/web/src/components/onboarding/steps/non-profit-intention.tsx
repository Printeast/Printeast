"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, GraduationCap, Trophy, HeartHandshake, Briefcase, ShoppingCart, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NON_PROFIT_OPTIONS = [
    { id: "school", label: "I want to create merchandise for my school", icon: GraduationCap, hasInput: false },
    { id: "sports", label: "I want to produce gear for my sports team", icon: Trophy, hasInput: false },
    { id: "charity", label: "I want to support my charity organization", icon: HeartHandshake, hasInput: false },
    { id: "corporate", label: "I want to design corporate gifts for employees", icon: Briefcase, hasInput: false },
    { id: "ecommerce", label: "I want to sell through my ecommerce store", icon: ShoppingCart, hasInput: false },
    { id: "other", label: "I want to do something else", icon: MoreHorizontal, hasInput: true, placeholder: "Please describe..." },
];

export function NonProfitIntentionStep() {
    const { nextStep, setAnswer } = useOnboardingStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState("");

    const handleSelect = (option: typeof NON_PROFIT_OPTIONS[0]) => {
        if (!option.hasInput) {
            setAnswer("nonProfitIntention", option.label);
            setAnswer("nonProfitDetail", "");
            nextStep();
        } else {
            setSelectedId(option.id);
            setDetail("");
        }
    };

    const handleFinish = () => {
        if (!selectedId) return;
        const option = NON_PROFIT_OPTIONS.find(o => o.id === selectedId);
        if (option) {
            setAnswer("nonProfitIntention", option.label);
            setAnswer("nonProfitDetail", detail);
            nextStep();
        }
    };

    const selectedOption = NON_PROFIT_OPTIONS.find(o => o.id === selectedId);

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    How do you plan to use your custom products?
                </h2>
                <p className="text-sm text-neutral-500">
                    Tell us more about your organization&apos;s needs.
                </p>
            </motion.div>

            <div className="flex flex-col gap-3">
                {NON_PROFIT_OPTIONS.map((opt, index) => {
                    const isSelected = selectedId === opt.id;

                    return (
                        <motion.button
                            key={opt.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelect(opt)}
                            className={cn(
                                "group w-full p-4 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200",
                                isSelected && "border-black shadow-md ring-1 ring-black/5"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "min-w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200",
                                    isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white"
                                )}>
                                    <opt.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                                <span className={cn(
                                    "font-bold text-left text-base transition-colors leading-tight",
                                    isSelected ? "text-black" : "text-neutral-800 group-hover:text-black"
                                )}>
                                    {opt.label}
                                </span>
                            </div>

                            {isSelected ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-black flex-shrink-0" />
                            ) : (
                                <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors flex-shrink-0" />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedOption?.hasInput && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 max-w-[480px] mx-auto w-full"
                    >
                        <div className="flex flex-col gap-4">
                            <label className="text-sm font-bold text-neutral-900 px-1">
                                Please describe:
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    autoFocus
                                    value={detail}
                                    onChange={(e) => setDetail(e.target.value)}
                                    placeholder={selectedOption.placeholder}
                                    className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && detail.trim()) handleFinish();
                                    }}
                                />
                                <button
                                    onClick={handleFinish}
                                    disabled={!detail.trim()}
                                    className="h-12 px-6 bg-black text-white rounded-lg font-medium text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
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

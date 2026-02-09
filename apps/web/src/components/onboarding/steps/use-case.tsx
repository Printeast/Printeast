"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { ChevronRight, Globe, Truck, Star, DollarSign, PlusCircle, Bot, Link, MoreHorizontal, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

// Updated from flowchart
const ALL_USE_CASES = [
    { id: "global-reach", label: "I want to expand my reach to global customers", type: ["SELLER", "SELLER_EXPANDING"], icon: Globe },
    { id: "fulfillment", label: "I want faster, reliable fulfillment & shipping", type: ["SELLER", "SELLER_EXPANDING"], icon: Truck },
    { id: "quality", label: "I want to improve product quality and consistency", type: ["SELLER", "SELLER_EXPANDING", "ARTIST"], icon: Star },
    { id: "profit", label: "I want to get better profit margins and pricing", type: ["SELLER", "SELLER_STARTER", "SELLER_EXPANDING", "ARTIST"], icon: DollarSign },
    { id: "new-products", label: "I want to add new product categories to my shop", type: ["SELLER_EXPANDING", "ARTIST"], icon: PlusCircle },
    { id: "ai-tools", label: "I want to use AI-powered design tools and mockups", type: ["INDIVIDUAL", "SELLER", "ARTIST", "NON_PROFIT"], icon: Bot },
    { id: "integration", label: "I want to integrate seamlessly with my store", type: ["SELLER", "SELLER_EXPANDING"], icon: Link },
    { id: "other", label: "I want to do something else", type: ["INDIVIDUAL", "SELLER", "SELLER_STARTER", "SELLER_EXPANDING", "ARTIST", "NON_PROFIT"], icon: MoreHorizontal, hasInput: true },
];

export function UseCaseStep() {
    const { nextStep, setAnswer, answers } = useOnboardingStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [customUseCase, setCustomUseCase] = useState("");

    const visibleOptions = useMemo(() => {
        if (answers.goal === "I want to shop for myself") {
            return ALL_USE_CASES.filter(opt => opt.id === 'ai-tools' || opt.id === 'other');
        }
        return ALL_USE_CASES;
    }, [answers.goal]);

    const isGrid = visibleOptions.length > 7;

    const handleSelect = (opt: typeof ALL_USE_CASES[0]) => {
        if (!opt.hasInput) {
            setAnswer("useCase", [opt.label]);
            nextStep();
        } else {
            setSelectedId(opt.id);
        }
    };

    const handleCustomSubmit = () => {
        if (customUseCase.trim()) {
            setAnswer("useCase", [customUseCase]);
            nextStep();
        }
    };

    const selectedOption = ALL_USE_CASES.find(o => o.id === selectedId);

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    What is your primary focus right now?
                </h2>
                <p className="text-sm text-neutral-500">
                    Select the objective that matters most to you.
                </p>
            </motion.div>

            <div className={cn(
                isGrid
                    ? "grid grid-cols-2 md:grid-cols-4 gap-3"
                    : "flex flex-col gap-3"
            )}>
                {visibleOptions.map((opt, index) => {
                    const isSelected = selectedId === opt.id;

                    return (
                        <div key={opt.id} className={cn(!isGrid && "w-full")}>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleSelect(opt)}
                                className={cn(
                                    "group bg-white border border-neutral-200 rounded-xl hover:border-black hover:shadow-md transition-all duration-200 w-full",
                                    isSelected && "border-black shadow-md ring-1 ring-black/5",
                                    isGrid
                                        ? "flex flex-col items-center justify-center p-4 h-40 text-center gap-3"
                                        : "p-4 md:p-5 flex items-center justify-between text-left"
                                )}
                            >
                                {isGrid ? (
                                    <>
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                                            isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white"
                                        )}>
                                            <opt.icon className="w-6 h-6" strokeWidth={1.5} />
                                        </div>
                                        <span className={cn(
                                            "font-bold text-neutral-800 text-sm leading-snug transition-colors",
                                            isSelected ? "text-black" : "group-hover:text-black"
                                        )}>
                                            {opt.label}
                                        </span>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </motion.button>

                            {/* Inline input for List mode only */}
                            {!isGrid && isSelected && opt.hasInput && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                                    className="overflow-hidden bg-neutral-50 p-4 rounded-xl border border-neutral-100"
                                >
                                    <div className="flex gap-2">
                                        <Input
                                            autoFocus
                                            value={customUseCase}
                                            onChange={(e) => setCustomUseCase(e.target.value)}
                                            placeholder="Specify your goals..."
                                            className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && customUseCase.trim()) handleCustomSubmit();
                                            }}
                                        />
                                        <button
                                            onClick={handleCustomSubmit}
                                            disabled={!customUseCase.trim()}
                                            className="h-12 px-6 bg-black text-white rounded-lg font-medium text-sm hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                                        >
                                            Next <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Centered input for Grid mode */}
            <AnimatePresence>
                {isGrid && selectedOption?.hasInput && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-8 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 max-w-[480px] mx-auto"
                    >
                        <div className="flex flex-col gap-4">
                            <label className="text-sm font-bold text-neutral-900 px-1">
                                Tell us more about your custom goal:
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    autoFocus
                                    value={customUseCase}
                                    onChange={(e) => setCustomUseCase(e.target.value)}
                                    placeholder="Type your objective here..."
                                    className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && customUseCase.trim()) handleCustomSubmit();
                                    }}
                                />
                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={!customUseCase.trim()}
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

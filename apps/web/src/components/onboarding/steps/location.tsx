"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useState } from "react";
import { ChevronRight, Search, Globe, MapPin, MoreHorizontal, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const POPULAR_REGIONS = [
    "Worldwide",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Europe",
    "Germany",
    "France",
    "India",
    "Brazil",
    "Spain",
    "Italy",
    "Japan",
    "China",
    "Mexico",
    "Netherlands",
    "Sweden",
    "Poland",
    "New Zealand",
    "Singapore",
    "United Arab Emirates",
    "Other"
];

export function LocationStep() {
    const { nextStep, setAnswer } = useOnboardingStore();
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [customLocation, setCustomLocation] = useState("");

    const handleSelect = (region: string) => {
        if (region !== "Other") {
            setAnswer("location", region);
            nextStep();
        } else {
            setSelectedId("other");
        }
    };

    const handleCustomSubmit = () => {
        if (customLocation.trim()) {
            setAnswer("location", customLocation);
            nextStep();
        }
    };

    const filteredRegions = POPULAR_REGIONS.filter(r =>
        r.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    Where are your customers located?
                </h2>
                <p className="text-sm text-neutral-500">
                    Choose your primary target audience.
                </p>
            </motion.div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country or region..."
                    className="pl-10 h-12 bg-white border-neutral-300 focus:border-black text-base rounded-xl"
                />
            </div>

            <div
                data-lenis-prevent
                className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth"
            >
                {filteredRegions.map((region, index) => {
                    const isWorldwide = region === "Worldwide";
                    const isOther = region === "Other";
                    const isSelected = selectedId === "other" && isOther;
                    const Icon = isWorldwide ? Globe : (isOther ? MoreHorizontal : MapPin);

                    return (
                        <motion.button
                            key={region}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelect(region)}
                            className={cn(
                                "group w-full p-4 md:p-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200",
                                isWorldwide && "border-blue-200 bg-blue-50/30 hover:border-blue-500",
                                isSelected && "border-black shadow-md ring-1 ring-black/5"
                            )}
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className={cn(
                                    "min-w-10 h-10 md:min-w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                                    isWorldwide
                                        ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                                        : (isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white")
                                )}>
                                    <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                <span className={cn(
                                    "font-bold text-base md:text-lg leading-tight transition-colors",
                                    isWorldwide ? "text-blue-700 group-hover:text-blue-900" : (isSelected ? "text-black" : "text-neutral-800 group-hover:text-black")
                                )}>
                                    {region}
                                </span>
                            </div>
                            {isSelected ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-black flex-shrink-0" />
                            ) : (
                                <ChevronRight className={cn(
                                    "w-5 h-5 transition-colors flex-shrink-0 ml-4",
                                    isWorldwide ? "text-blue-300 group-hover:text-blue-600" : "text-neutral-300 group-hover:text-black"
                                )} />
                            )}
                        </motion.button>
                    );
                })}

                {filteredRegions.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                        No regions found. Try a different search.
                    </div>
                )}
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
                                Enter your target location:
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    autoFocus
                                    value={customLocation}
                                    onChange={(e) => setCustomLocation(e.target.value)}
                                    placeholder="Enter your target location..."
                                    className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && customLocation.trim()) handleCustomSubmit();
                                    }}
                                />
                                <button
                                    onClick={handleCustomSubmit}
                                    disabled={!customLocation.trim()}
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

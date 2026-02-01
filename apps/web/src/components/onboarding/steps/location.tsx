"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Search, Globe, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

    const handleSelect = (region: string) => {
        setAnswer("location", region);
        nextStep();
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

            <div className="flex flex-col gap-3 h-[400px] overflow-y-auto pr-2">
                {filteredRegions.map((region, index) => {
                    const isWorldwide = region === "Worldwide";
                    const Icon = isWorldwide ? Globe : MapPin;

                    return (
                        <motion.button
                            key={region}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelect(region)}
                            className={cn(
                                "group w-full p-4 md:p-5 bg-white border border-neutral-200 rounded-xl flex items-center justify-between hover:border-black hover:shadow-md transition-all duration-200",
                                isWorldwide && "border-blue-200 bg-blue-50/30 hover:border-blue-500"
                            )}
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className={cn(
                                    "min-w-10 h-10 md:min-w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                                    isWorldwide
                                        ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
                                        : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white"
                                )}>
                                    <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                <span className={cn(
                                    "font-bold text-base md:text-lg leading-tight",
                                    isWorldwide ? "text-blue-700 group-hover:text-blue-900" : "text-neutral-800 group-hover:text-black"
                                )}>
                                    {region}
                                </span>
                            </div>
                            <ChevronRight className={cn(
                                "w-5 h-5 transition-colors flex-shrink-0 ml-4",
                                isWorldwide ? "text-blue-300 group-hover:text-blue-600" : "text-neutral-300 group-hover:text-black"
                            )} />
                        </motion.button>
                    );
                })}

                {filteredRegions.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                        No regions found. Try a different search.
                    </div>
                )}
            </div>
        </div>
    );
}

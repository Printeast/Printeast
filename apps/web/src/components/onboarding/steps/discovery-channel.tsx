"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, MessageSquareHeart, FileText, Headphones, Star, Share2, UserCheck, Bot, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Options from flowchart
const DISCOVERY_OPTIONS = [
    { id: "word-of-mouth", label: "Word of mouth", icon: MessageSquareHeart, hasInput: false },
    { id: "blog-post", label: "Blog post or article", icon: FileText, hasInput: false },
    { id: "podcast", label: "Podcast mention", icon: Headphones, hasInput: true, placeholder: "Which podcast?" },
    { id: "review-site", label: "Review site", icon: Star, hasInput: true, placeholder: "Which review site? (e.g. Trustpilot, Reddit)" },
    { id: "social-media", label: "Social media/Online community", icon: Share2, hasInput: true, placeholder: "Which platform? (YouTube, Instagram, etc.)" },
    { id: "influencer", label: "Influencer or content creator", icon: UserCheck, hasInput: true, placeholder: "Which creator/influencer?" },
    { id: "ai", label: "AI Responses", icon: Bot, hasInput: true, placeholder: "Which AI tool?" },
    { id: "other", label: "Other", icon: MoreHorizontal, hasInput: true, placeholder: "Where did you hear about us?" },
];

const POPULAR_SOCIALS = [
    { id: "youtube", label: "YouTube" },
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "facebook", label: "Facebook" },
    { id: "twitter", label: "Twitter / X" },
    { id: "reddit", label: "Reddit" },
    { id: "pinterest", label: "Pinterest" },
];

const POPULAR_AI = [
    { id: "chatgpt", label: "ChatGPT" },
    { id: "perplexity", label: "Perplexity" },
    { id: "claude", label: "Claude" },
    { id: "gemini", label: "Google Gemini" },
    { id: "midjourney", label: "Midjourney" },
    { id: "bing", label: "Bing AI" },
];

const POPULAR_REVIEWS = [
    { id: "trustpilot", label: "Trustpilot" },
    { id: "capterra", label: "Capterra" },
    { id: "g2", label: "G2" },
    { id: "reddit", label: "Reddit Reviews" },
    { id: "producthunt", label: "ProductHunt" },
];

export function DiscoveryChannelStep() {
    const { nextStep, setAnswer } = useOnboardingStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState("");
    const [selectedSubOption, setSelectedSubOption] = useState<string | null>(null);

    const handleSelect = (option: typeof DISCOVERY_OPTIONS[0]) => {
        if (!option.hasInput) {
            setAnswer("discoveryChannel", option.label);
            setAnswer("discoveryDetail", "");
            nextStep();
        } else {
            setSelectedId(option.id);
            setDetail("");
            setSelectedSubOption(null);
        }
    };

    const handleSubSelect = (label: string) => {
        setSelectedSubOption(label);
        setDetail(label);
    };

    const handleFinish = () => {
        if (!selectedId) return;
        const option = DISCOVERY_OPTIONS.find(o => o.id === selectedId);
        if (option) {
            setAnswer("discoveryChannel", option.label);
            setAnswer("discoveryDetail", detail || selectedSubOption || "");
            nextStep();
        }
    };

    const selectedOption = DISCOVERY_OPTIONS.find(o => o.id === selectedId);
    const isGrid = DISCOVERY_OPTIONS.length > 7;

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
            >
                <h2 className="text-xl font-bold text-neutral-900 mb-2">
                    How did you discover Printeast?
                </h2>
                <p className="text-sm text-neutral-500">
                    We'd love to know where you found us.
                </p>
            </motion.div>

            <div className="flex flex-col gap-6">
                <div
                    data-lenis-prevent
                    className={cn(
                        "max-h-[500px] overflow-y-auto pr-1 custom-scrollbar",
                        isGrid
                            ? "grid grid-cols-2 md:grid-cols-4 gap-3"
                            : "flex flex-col gap-3"
                    )}
                >
                    <AnimatePresence mode="popLayout">
                        {DISCOVERY_OPTIONS.map((opt, index) => {
                            const isSelected = selectedId === opt.id;

                            return (
                                <motion.div
                                    key={opt.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(!isGrid && "w-full")}
                                >
                                    <button
                                        onClick={() => handleSelect(opt)}
                                        className={cn(
                                            "group w-full bg-white border border-neutral-200 rounded-xl hover:border-black hover:shadow-md transition-all duration-200",
                                            isSelected && "border-black shadow-md ring-1 ring-black/5",
                                            isGrid
                                                ? "flex flex-col items-center justify-center p-4 h-32 md:h-40 text-center gap-3"
                                                : "p-4 md:p-5 flex items-center justify-between text-left"
                                        )}
                                    >
                                        {isGrid ? (
                                            <>
                                                <div className={cn(
                                                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors duration-200",
                                                    isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white"
                                                )}>
                                                    <opt.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                                                </div>
                                                <span className={cn(
                                                    "font-bold text-xs md:text-sm leading-snug transition-colors",
                                                    isSelected ? "text-black" : "text-neutral-800 group-hover:text-black"
                                                )}>
                                                    {opt.label}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200",
                                                        isSelected ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-black group-hover:text-white"
                                                    )}>
                                                        <opt.icon className="w-5 h-5" strokeWidth={1.5} />
                                                    </div>
                                                    <span className={cn(
                                                        "font-bold text-left text-base transition-colors",
                                                        isSelected ? "text-black" : "text-neutral-800 group-hover:text-black"
                                                    )}>
                                                        {opt.label}
                                                    </span>
                                                </div>

                                                {isSelected ? (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-black transition-colors" />
                                                )}
                                            </>
                                        )}
                                    </button>

                                    {/* List Mode Sub-options (Inline) */}
                                    {!isGrid && isSelected && (opt.id === "social-media" || opt.id === "ai" || opt.id === "review-site") && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-4 px-2"
                                        >
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {(opt.id === "social-media" ? POPULAR_SOCIALS : opt.id === "ai" ? POPULAR_AI : POPULAR_REVIEWS).map(sub => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => handleSubSelect(sub.label)}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                                                            selectedSubOption === sub.label
                                                                ? "bg-black text-white border-black"
                                                                : "bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black"
                                                        )}
                                                    >
                                                        {sub.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* List Mode Input (Inline) */}
                                    {!isGrid && isSelected && opt.hasInput && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                            className="overflow-hidden bg-neutral-50 p-4 rounded-xl border border-neutral-100"
                                        >
                                            <div className="flex gap-2">
                                                <Input
                                                    autoFocus
                                                    value={detail}
                                                    onChange={(e) => {
                                                        setDetail(e.target.value);
                                                        setSelectedSubOption(null);
                                                    }}
                                                    placeholder={opt.placeholder}
                                                    className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && detail.trim()) handleFinish();
                                                    }}
                                                />
                                                <button
                                                    onClick={handleFinish}
                                                    disabled={!detail.trim() && !selectedSubOption}
                                                    className="h-12 px-6 bg-black text-white rounded-lg font-medium text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
                                                >
                                                    Next <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Grid Mode Selection/Input (Centered Box Style) */}
                <AnimatePresence>
                    {isGrid && selectedOption?.hasInput && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-4 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 max-w-[480px] mx-auto w-full"
                        >
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-bold text-neutral-900 px-1">
                                    {(selectedOption.id === "social-media") && "Which platform?"}
                                    {(selectedOption.id === "ai") && "Which AI tool?"}
                                    {(selectedOption.id === "review-site") && "Which review site?"}
                                    {(selectedOption.id !== "social-media" && selectedOption.id !== "ai" && selectedOption.id !== "review-site") && selectedOption.label}
                                </label>

                                {(selectedOption.id === "social-media" || selectedOption.id === "ai" || selectedOption.id === "review-site") && (
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {(selectedOption.id === "social-media" ? POPULAR_SOCIALS : selectedOption.id === "ai" ? POPULAR_AI : POPULAR_REVIEWS).map(sub => (
                                            <button
                                                key={sub.id}
                                                onClick={() => handleSubSelect(sub.label)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                                                    selectedSubOption === sub.label
                                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                                                )}
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Input
                                        autoFocus
                                        value={detail}
                                        onChange={(e) => {
                                            setDetail(e.target.value);
                                            setSelectedSubOption(null);
                                        }}
                                        placeholder="Type here..."
                                        className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && (detail.trim() || selectedSubOption)) handleFinish();
                                        }}
                                    />
                                    <button
                                        onClick={handleFinish}
                                        disabled={!detail.trim() && !selectedSubOption}
                                        className="h-12 px-6 bg-neutral-900 text-white rounded-lg font-medium text-sm hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-neutral-900/20 active:scale-95"
                                    >
                                        Next <ArrowRight className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}


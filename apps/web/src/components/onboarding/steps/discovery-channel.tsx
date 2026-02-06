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

export function DiscoveryChannelStep() {
    const { nextStep, setAnswer } = useOnboardingStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState("");
    const [selectedSocial, setSelectedSocial] = useState<string | null>(null);

    const handleSelect = (option: typeof DISCOVERY_OPTIONS[0]) => {
        if (!option.hasInput) {
            setAnswer("discoveryChannel", option.label);
            setAnswer("discoveryDetail", "");
            nextStep();
        } else {
            setSelectedId(option.id);
            setDetail("");
            setSelectedSocial(null);
        }
    };

    const handleSocialSelect = (label: string) => {
        setSelectedSocial(label);
        setDetail(label);
    };

    const handleFinish = () => {
        if (!selectedId) return;
        const option = DISCOVERY_OPTIONS.find(o => o.id === selectedId);
        if (option) {
            setAnswer("discoveryChannel", option.label);
            setAnswer("discoveryDetail", detail || selectedSocial || "");
            nextStep();
        }
    };

    const selectedOption = DISCOVERY_OPTIONS.find(o => o.id === selectedId);

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
                <div className={cn(
                    DISCOVERY_OPTIONS.length > 7
                        ? "grid grid-cols-2 md:grid-cols-4 gap-3"
                        : "flex flex-col gap-3"
                )}>
                    <AnimatePresence mode="popLayout">
                        {DISCOVERY_OPTIONS.map((opt, index) => {
                            const isSelected = selectedId === opt.id;

                            return (
                                <motion.div
                                    key={opt.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(DISCOVERY_OPTIONS.length <= 7 && "w-full")}
                                >
                                    <button
                                        onClick={() => handleSelect(opt)}
                                        className={cn(
                                            "group w-full bg-white border border-neutral-200 rounded-xl hover:border-black hover:shadow-md transition-all duration-200",
                                            isSelected && "border-black shadow-md ring-1 ring-black/5",
                                            DISCOVERY_OPTIONS.length > 7
                                                ? "flex flex-col items-center justify-center p-4 h-32 md:h-40 text-center gap-3"
                                                : "p-4 md:p-5 flex items-center justify-between text-left"
                                        )}
                                    >
                                        {DISCOVERY_OPTIONS.length > 7 ? (
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

                                    {/* List Mode Social Sub-options */}
                                    {DISCOVERY_OPTIONS.length <= 7 && isSelected && opt.id === "social-media" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-4 px-2"
                                        >
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {POPULAR_SOCIALS.map(social => (
                                                    <button
                                                        key={social.id}
                                                        onClick={() => handleSocialSelect(social.label)}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                                                            selectedSocial === social.label
                                                                ? "bg-black text-white border-black"
                                                                : "bg-white text-neutral-600 border-neutral-200 hover:border-black hover:text-black"
                                                        )}
                                                    >
                                                        {social.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* List Mode Input (Inline) */}
                                    {DISCOVERY_OPTIONS.length <= 7 && isSelected && opt.hasInput && (
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
                                                        setSelectedSocial(null);
                                                    }}
                                                    placeholder={opt.placeholder}
                                                    className="h-12 bg-white border-neutral-300 focus:border-black text-base shadow-sm"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && detail.trim()) handleFinish();
                                                    }}
                                                />
                                                <button
                                                    onClick={handleFinish}
                                                    disabled={!detail.trim() && !selectedSocial}
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

                {/* Grid Mode Selection/Input (Floating Popout) */}
                <AnimatePresence>
                    {DISCOVERY_OPTIONS.length > 7 && selectedOption && selectedOption.hasInput && (
                        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                                className="w-full max-w-[420px] bg-white/80 backdrop-blur-2xl p-5 rounded-3xl border border-white/50 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] pointer-events-auto"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-50 rounded-full text-blue-600">
                                            <selectedOption.icon className="w-3.5 h-3.5" />
                                        </div>
                                        {selectedOption.id === "social-media"
                                            ? "Which platform?"
                                            : selectedOption.label}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedId(null)}
                                        className="text-neutral-400 hover:text-neutral-900 transition-colors"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 1L1 13M1 1l12 12" /></svg>
                                    </button>
                                </div>

                                {selectedOption.id === "social-media" && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {POPULAR_SOCIALS.map(social => (
                                            <button
                                                key={social.id}
                                                onClick={() => handleSocialSelect(social.label)}
                                                className={cn(
                                                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                                                    selectedSocial === social.label
                                                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                                                )}
                                            >
                                                {social.label}
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
                                            setSelectedSocial(null);
                                        }}
                                        placeholder="Type here..."
                                        className="h-11 bg-white/50 border-neutral-200 focus:border-neutral-900 focus:bg-white text-sm rounded-xl shadow-sm transition-all"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && (detail.trim() || selectedSocial)) handleFinish();
                                        }}
                                    />
                                    <button
                                        onClick={handleFinish}
                                        disabled={!detail.trim() && !selectedSocial}
                                        className="h-11 px-5 bg-neutral-900 text-white rounded-xl font-semibold text-sm hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-neutral-900/20 active:scale-95"
                                    >
                                        <ArrowRight className="w-4 h-4 ml-0.5" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}


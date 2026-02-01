"use client"

import { useState } from "react"
import { Search, Globe, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { m, useScroll, useMotionValueEvent } from "framer-motion"

interface LandingNavbarProps {
    ctaText?: string;
}

export function LandingNavbar({
    ctaText = "Dashboard",
}: LandingNavbarProps) {
    const [activeTab, setActiveTab] = useState("Seller hub")
    const TABS = ["Seller hub", "Personal Orders", "Artist Hub"]

    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const { scrollY } = useScroll()

    // Performance Optimization: 
    // Isolate scroll updates to this component only.
    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0
        const diff = latest - previous

        // Only update state if values actually change to avoid thrashing
        const newIsScrolled = latest > 20
        if (newIsScrolled !== isScrolled) setIsScrolled(newIsScrolled)

        // Sub-nav visibility logic
        // Hide when scrolling down (>150px), show when scrolling up
        if (latest > 150 && diff > 0) {
            if (isVisible) setIsVisible(false)
        } else {
            if (!isVisible) setIsVisible(true)
        }
    })

    const navVariants = {
        top: {
            backgroundColor: "rgba(255, 255, 255, 0)",
            backdropFilter: "blur(0px)",
            borderBottomColor: "rgba(0,0,0,0)",
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
            paddingTop: "24px",
            paddingBottom: "24px"
        },
        scrolled: {
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(16px) saturate(180%)",
            borderBottomColor: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
            paddingTop: "12px",
            paddingBottom: "12px"
        }
    }

    return (
        <m.nav
            initial="top"
            animate={isScrolled ? "scrolled" : "top"}
            variants={navVariants}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={cn(
                "fixed z-50 left-0 right-0 flex items-center justify-between px-6 border-b border-transparent overflow-visible will-change-transform",
            )}
        >
            <div className="flex items-center gap-12 flex-shrink-0">
                <Link href="/" className="text-2xl font-black tracking-tighter text-[#111827]">PRINTEAST</Link>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600 flex-1 justify-center px-8">
                {[
                    { label: "How it works", href: "#how-it-works" },
                    { label: "Inspiration", href: "#marketplace" },
                    { label: "Products", href: "#products" },
                    { label: "Profit", href: "#pricing" },
                    { label: "AI Studio", href: "#ai-studio" },
                    { label: "Global", href: "#solutions" },
                    { label: "Stories", href: "#testimonials" }
                ].map((link) => (
                    <Link key={link.label} href={link.href} className="px-4 py-2 rounded-xl hover:bg-black/5 hover:text-black transition-all duration-300">
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
                <button aria-label="Search" className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-black/5 transition-colors">
                    <Search className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-800 hover:bg-black/5 transition-colors" aria-label="Change Language">
                    <Globe className="w-4 h-4" />
                    <span>EN/INR</span>
                </button>
                <button aria-label="Account" className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-black/5 transition-colors">
                    <User className="w-5 h-5" />
                </button>
                <Link href="/dashboard" className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-blue-600 hover:shadow-lg transition-all text-sm shadow-md active:scale-95">
                    {ctaText}
                </Link>
            </div>

            {/* Sleek Hanging Sub-Nav Extension */}
            <m.div
                initial={{ y: 0, opacity: 1, x: "-50%", scale: 1 }}
                animate={{
                    y: isVisible ? 0 : -40,
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.9,
                    x: "-50%"
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    mass: 0.5
                }}
                className="absolute top-full left-1/2 mt-4 pointer-events-auto"
            >
                <div className="relative flex items-center p-1.5 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.1)] ring-1 ring-black/5 transform transition-all hover:scale-[1.02] hover:bg-white/80">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "relative px-5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 z-10",
                                activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-900",
                            )}
                        >
                            {activeTab === tab && (
                                <m.div
                                    layoutId="sub-pill-bg"
                                    className="absolute inset-0 bg-[#0f172a] rounded-xl shadow-md"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    style={{ zIndex: -1 }}
                                />
                            )}
                            {tab}
                        </button>
                    ))}
                </div>
            </m.div>
        </m.nav>
    )
}

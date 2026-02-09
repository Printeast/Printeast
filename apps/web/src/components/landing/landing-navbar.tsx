"use client"

import { useState, useTransition, useMemo, useRef } from "react"
import { Search, Globe, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import NextImage from "next/image"
import { m, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { LOCALE_DETAILS, locales, Locale } from '@/i18n/config';

import { useTranslations } from 'next-intl';

interface LandingNavbarProps {
    // ctaText removed as it is now hardcoded
}

export function LandingNavbar({ }: LandingNavbarProps) {
    const t = useTranslations('Navbar');
    const [activeTab, setActiveTab] = useState("Seller hub")
    const TABS = useMemo(() => [t('tabs.seller'), t('tabs.personal'), t('tabs.artist')], [t])

    const [isScrolled, setIsScrolled] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const { scrollY } = useScroll()

    // Language Menu State
    const [showLangMenu, setShowLangMenu] = useState(false)
    const [isPending, startTransition] = useTransition();
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();

    const currentLang = LOCALE_DETAILS[locale];

    const onSelectChange = (nextLocale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
        setShowLangMenu(false);
    };

    // Performance Optimization: 
    // Isolate scroll updates to this component only.
    const lastScrollY = useRef(0)
    useMotionValueEvent(scrollY, "change", (latest) => {
        const diff = latest - lastScrollY.current

        // Update scrolled state for main nav visual transition
        // Using a safe threshold to avoid state thrashing
        const newIsScrolled = latest > 20
        if (newIsScrolled !== isScrolled) setIsScrolled(newIsScrolled)

        // Sub-nav visibility logic: Direction-based tracking with threshold (10px)
        if (latest < 150) {
            if (!isVisible) setIsVisible(true)
        } else if (Math.abs(diff) > 10) {
            const scrollingUp = diff < 0
            if (isVisible !== scrollingUp) setIsVisible(scrollingUp)
        }

        lastScrollY.current = latest
    })

    const navVariants = {
        top: {
            backgroundColor: "rgba(255, 255, 255, 0)",
            backdropFilter: "blur(0px)",
            borderBottomColor: "rgba(0,0,0,0)",
            boxShadow: "none",
            paddingTop: "28px",
            paddingBottom: "28px"
        },
        scrolled: {
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(24px) saturate(200%)",
            borderBottomColor: "rgba(0, 0, 0, 0.04)",
            boxShadow: "none",
            paddingTop: "14px",
            paddingBottom: "14px"
        }
    }

    return (
        <>
            <m.nav
                initial="top"
                animate={isScrolled ? "scrolled" : "top"}
                variants={navVariants}
                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={cn(
                    "fixed z-50 left-0 right-0 flex items-center justify-between px-4 md:px-6 border-b border-transparent overflow-visible will-change-transform",
                )}
            >
                <div className="flex items-center gap-12 flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 shadow-sm p-1 leading-none">
                            <NextImage
                                src="/assets/printeast_logo.png"
                                alt="Printeast"
                                width={20}
                                height={20}
                                priority
                                className="h-auto w-auto object-contain"
                            />
                        </div>
                        <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#111827]">PRINTEAST</span>
                    </Link>
                </div>

                <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600 flex-1 justify-center px-8">
                    {[
                        { label: t('links.products'), href: "#products" },
                        { label: t('links.marketplace'), href: "#marketplace" },
                        { label: t('links.aiStudio'), href: "#ai-studio" },
                        { label: t('links.pricing'), href: "#pricing" },
                        { label: t('links.howItWorks'), href: "#how-it-works" },
                        { label: t('links.learn'), href: "#" },
                        { label: t('links.solutions'), href: "#solutions" },
                        { label: t('links.support'), href: "#" },
                        { label: t('links.stories'), href: "#testimonials" }
                    ].map((link) => (
                        <Link key={link.label} href={link.href} className="px-3 py-2 rounded-md hover:bg-black/5 hover:text-black transition-all duration-300">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <button aria-label="Search" className="hidden sm:flex w-10 h-10 rounded-md items-center justify-center text-slate-600 hover:bg-black/5 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Functional Language/Currency Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            disabled={isPending}
                            onBlur={() => setTimeout(() => setShowLangMenu(false), 200)} // Delay toggle to allow interactions
                            className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-md border border-slate-200 bg-slate-50/50 hover:bg-white text-xs font-bold text-slate-700 transition-all hover:shadow-sm active:scale-95 disabled:opacity-50"
                            aria-label="Change Language"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{locale.toUpperCase()}/{currentLang.currency}</span>
                        </button>

                        <AnimatePresence>
                            {showLangMenu && (
                                <m.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 overflow-hidden z-50 origin-top-right ring-1 ring-black/5"
                                >
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">{t('selectRegion')}</div>
                                    <div className="flex flex-col gap-1">
                                        {locales.map((l) => {
                                            const details = LOCALE_DETAILS[l as Locale];
                                            return (
                                                <button
                                                    key={l}
                                                    onClick={() => onSelectChange(l)}
                                                    className={cn(
                                                        "flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                                        locale === l ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-base leading-none translate-y-[1px]">{details.flag}</span>
                                                        <span>{details.label}</span>
                                                    </div>
                                                    {locale === l && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User icon removed as requested */}
                    <Link
                        href="/dashboard"
                        prefetch={true}
                        className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-md bg-slate-900 text-white font-bold hover:bg-blue-600 hover:shadow-lg transition-all text-xs sm:text-sm shadow-md active:scale-95 whitespace-nowrap"
                    >
                        <span className="sm:hidden">Start</span>
                        <span className="hidden sm:inline">{t('startNow')}</span>
                    </Link>
                </div>
            </m.nav>

            {/* Decoupled Sub-Nav Container - PERSISTENT GLOBAL UI */}
            <AnimatePresence>
                {isVisible && (
                    <m.div
                        initial={{ y: -20, opacity: 0, x: "-50%", scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, x: "-50%", scale: 1 }}
                        exit={{ y: -20, opacity: 0, x: "-50%", scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                            mass: 0.8
                        }}
                        className="fixed z-[100] left-1/2 top-[80px] sm:top-[88px] pointer-events-auto w-full max-w-[95vw] sm:max-w-fit flex justify-center"
                    >
                        <div className="relative flex items-center p-1 sm:p-1.5 bg-white/95 backdrop-blur-2xl rounded-md border border-slate-200 ring-1 ring-black/[0.01] transform transition-all active:scale-[0.98] overflow-x-auto no-scrollbar max-w-full">
                            {TABS.map((tab: string) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "relative px-3 py-1.5 sm:px-5 sm:py-2 rounded-md text-[10px] sm:text-xs font-bold tracking-wide transition-all duration-300 z-10 whitespace-nowrap",
                                        activeTab === tab ? "text-white" : "text-slate-500 hover:text-slate-900",
                                    )}
                                >
                                    {activeTab === tab && (
                                        <m.div
                                            layoutId="sub-pill-bg"
                                            className="absolute inset-0 bg-[#0f172a] rounded-md"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                            style={{ zIndex: -1 }}
                                        />
                                    )}
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    )
}

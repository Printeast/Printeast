"use client"

import { useState, useEffect, useRef, memo } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

const ProcessShowcase = dynamic(() => import("./process-showcase").then((mod) => mod.ProcessShowcase), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-50/50 animate-pulse rounded-md" />
})


import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// Verified Unsplash Images 
const AI_DEMOS = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=600",
        prompt: "cyberpunk cat in neon ...",
        style: "NEON"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
        prompt: "liquid chrome flow 3d ...",
        style: "3D"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=600",
        prompt: "anime style girl lo-fi ...",
        style: "ANIME"
    }
]

// Animated Typing Text Component - Optimized with memo and fewer updates
const TypingText = memo(({ text }: { text: string }) => {
    const [display, setDisplay] = useState("")

    useEffect(() => {
        setDisplay("")
        let i = 0
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplay(text.slice(0, i + 1))
                i++
            } else {
                clearInterval(interval)
            }
        }, 60)
        return () => clearInterval(interval)
    }, [text])

    return (
        <span className="inline-flex items-center">
            {display}
            <span className="w-[1.5px] h-3 bg-white/80 ml-0.5 animate-pulse" />
        </span>
    )
})

const AiProductWidget = memo(({ t }: { t: any }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { margin: "0px 0px -50px 0px", once: false })

    useEffect(() => {
        if (!isInView) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % AI_DEMOS.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [isInView])

    const currentDemo = AI_DEMOS[currentIndex] || AI_DEMOS[0]!

    return (
        <div ref={containerRef} className="relative z-30 w-full max-w-[340px] mx-auto lg:mx-0 group/widget transform-gpu">
            {/* Background Green Spot & Glow - Positioned Behind */}
            <div className="absolute top-1/2 -left-16 -translate-y-1/2 z-40 pointer-events-none">
                <div className="w-32 h-64 bg-green-400 rounded-full blur-[50px] opacity-40" />
            </div>

            <div className="bg-white rounded-md p-4 h-auto min-h-[440px] flex flex-col relative z-20 border border-white/60 ring-1 ring-black/5">
                <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-md overflow-hidden mb-5 group border border-gray-100 transform-gpu">
                    <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-wider text-black border border-black/5">
                        {t('studio')}
                    </div>

                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentDemo.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full transform-gpu"
                        >
                            <Image
                                src={currentDemo.image}
                                alt={`AI generated image`}
                                fill
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out will-change-transform"
                                loading={currentIndex === 0 ? "eager" : "lazy"}
                                priority={currentIndex === 0}
                                sizes="340px"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Glass Overlay UI */}
                    <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-center z-20">
                        <motion.div
                            initial={{ y: 0, opacity: 1 }}
                            key={currentDemo.id}
                            className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center w-auto max-w-full"
                        >
                            <span className="text-[11px] text-white font-medium tracking-wide truncate flex items-center">
                                <TypingText text={currentDemo.prompt} />
                            </span>
                        </motion.div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center text-center px-2">
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 tracking-tight">
                        {t.rich('createCustom', {
                            br: () => <br />
                        })}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-5">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-medium">{t('startsFrom')}</span>
                            <span className="text-xs font-bold text-gray-900">$12.99</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-5">
                        {["NEON", "3D", "ANIME", "RETRO"].map((style) => (
                            <div
                                key={style}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[10px] font-extrabold border transition-all cursor-pointer tracking-wide",
                                    style === currentDemo.style
                                        ? "bg-black text-white border-black scale-105"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                                )}
                            >
                                {style}
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-3 bg-black text-white rounded-md text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]">
                        {t('startDesigning')} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
})

// --- CREATIVE MOCKUP VISUAL (Split Layout) ---
const MockupVisual = memo(() => {
    return (
        <div className="w-full h-full flex bg-[#f0f4ff] transform-gpu">
            {/* Left Image Side - Creative Fashion Model */}
            <div className="w-[45%] h-full relative overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1000"
                    alt="Creative Model"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700 transform-gpu"
                    sizes="200px"
                    loading="lazy"
                />

                {/* Clean Artistic Element - Smooth White Wave */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.1] mix-blend-overlay pointer-events-none" />
            </div>
            {/* Right Content Side */}
            <div className="flex-1 flex flex-col justify-end p-5 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-md text-[10px] font-bold text-violet-900 tracking-widest">
                    20% OFF
                </div>
                {/* Decorative Lines */}
                <div className="space-y-2 mb-3 mt-auto w-full max-w-[120px]">
                    <div className="h-1.5 w-full bg-violet-200 rounded-full opacity-60" />
                    <div className="h-1.5 w-2/3 bg-violet-200 rounded-full opacity-60" />
                </div>
                <div className="h-6 w-12 bg-white rounded-md" />
            </div>
        </div>
    )
})

// --- CREATIVE CUSTOM VISUAL (Lime Drop) ---
const CustomVisual = memo(() => {
    const t = useTranslations('FeaturesGrid');
    return (
        <div className="w-full h-full bg-[#d9f99d] flex relative overflow-hidden transform-gpu">
            {/* Left Content */}
            <div className="w-[50%] h-full p-6 flex flex-col justify-start pt-8">
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black tracking-widest text-[#4d7c0f]">{t('newDrop')}</span>
                    <span className="text-[#4d7c0f] font-bold text-xs">+</span>
                </div>
            </div>

            {/* Right Image (Split) */}
            <div className="absolute right-0 top-0 w-[55%] h-full bg-gray-100 transform-gpu">
                <Image
                    src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
                    alt="Product"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500 transform-gpu"
                    sizes="200px"
                    loading="lazy"
                />
                {/* Three bars icon */}
                <div className="absolute top-4 right-4 space-y-1 opacity-40">
                    <div className="w-4 h-0.5 bg-black" />
                    <div className="w-4 h-0.5 bg-black" />
                    <div className="w-2 h-0.5 bg-black ml-auto" />
                </div>
            </div>
        </div>
    )
})

// --- CREATIVE HUB VISUAL (Teal/Green) ---
const HubVisual = memo(() => {
    const t = useTranslations('FeaturesGrid');
    return (
        <div className="w-full h-full bg-[#7dd3fc] relative overflow-hidden flex flex-col items-center pt-8 transform-gpu">
            <h3 className="text-2xl font-black text-[#0c4a6e] tracking-tight">{t('artistHub')}</h3>
            <div className="w-[80%] h-[2px] bg-[#0c4a6e]/10 my-3" />
            <p className="text-[10px] font-bold text-[#0c4a6e]/70 tracking-widest">{t('monetize')}</p>

            {/* Bottom UI Widget */}
            <div className="absolute bottom-0 w-[50%] h-[70px] bg-white/20 backdrop-blur-md rounded-t-sm p-3 pb-0 flex gap-2 justify-center transform-gpu">
                <div className="w-16 h-12 bg-white/40 rounded-md" />
                <div className="w-16 h-12 bg-white/40 rounded-md" />
                <div className="absolute bottom-3 left-3 right-3 h-2.5 bg-[#0369a1]/20 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[#0369a1]/40"
                        initial={{ width: "0%" }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                    />
                </div>
            </div>
        </div>
    )
})

const FeatureCard = memo(({
    title,
    description,
    visual,
    variant,
    className
}: {
    title: React.ReactNode,
    description: string,
    visual: React.ReactNode,
    variant: "blue" | "cyan" | "green",
    className?: string
}) => {
    const theme = {
        blue: { title: "text-slate-900", desc: "text-slate-600" },
        cyan: { title: "text-slate-900", desc: "text-slate-600" },
        green: { title: "text-emerald-900", desc: "text-emerald-700" }
    }[variant]

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={cn(
                "group relative overflow-hidden rounded-md h-[180px] flex flex-col transition-all duration-500 ring-1 ring-black/5 bg-white transform-gpu",
                className
            )}
        >
            {/* Visual Container (Full Bleed) */}
            <div className="absolute inset-0 w-full h-full z-0 transform-gpu">
                {visual}
            </div>

            {/* Content Overlay (Optional, if not handled by visual) */}
            <div className="relative z-20 pointer-events-none p-6 h-full flex flex-col">
                <h3 className={cn("text-2xl font-black mb-1 tracking-tighter leading-none", theme.title)}>
                    {title}
                </h3>
                <p className={cn("text-xs font-bold tracking-wide opacity-70 mix-blend-multiply max-w-[150px]", theme.desc)}>
                    {description}
                </p>
            </div>
        </motion.div>
    )
})

export const FeaturesGrid = memo(function FeaturesGrid() {
    const t = useTranslations('FeaturesGrid');
    return (
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-0 transform-gpu">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 auto-rows-[auto] items-center">

                {/* LEFT: Product Widget */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-3 lg:col-start-1 lg:row-start-1 relative z-30 lg:-mr-16 flex justify-center transform-gpu"
                >
                    <AiProductWidget t={t} />
                </motion.div>


                {/* CENTER: Process Animation */}
                <div className="lg:col-span-6 lg:col-start-4 lg:row-start-1 relative z-10 min-h-[500px] lg:h-[600px] transform lg:scale-100 flex items-center justify-center transform-gpu">
                    <ProcessShowcase />
                </div>


                {/* RIGHT: Stacked Features (White Abstract) */}
                <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 relative z-20 flex flex-col gap-6 h-auto py-4 lg:pl-6 justify-center text-left transform-gpu">

                    <FeatureCard
                        variant="blue"
                        title={<span className="absolute right-6 bottom-20 text-violet-900 max-w-[50%] text-right leading-tight">{t('smartMockup')}</span>}
                        description=""
                        visual={<MockupVisual />}
                    />

                    <FeatureCard
                        variant="cyan"
                        title={<span className="hidden">Personalisation</span>}
                        description=""
                        visual={<CustomVisual />}
                    />

                    <FeatureCard
                        variant="green"
                        title={null}
                        description=""
                        visual={<HubVisual />}
                    />

                </div>
            </div>
        </div>
    )
})

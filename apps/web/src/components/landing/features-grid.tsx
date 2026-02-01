"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"

const ProcessShowcase = dynamic(() => import("./process-showcase").then((mod) => mod.ProcessShowcase), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-50/50 animate-pulse rounded-2xl" />
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

// Animated Typing Text Component
function TypingText({ text }: { text: string }) {
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
        }, 50)
        return () => clearInterval(interval)
    }, [text])

    return (
        <span className="inline-flex items-center">
            {display}
            <span className="w-[1.5px] h-3 bg-white/80 ml-0.5 animate-pulse" />
        </span>
    )
}

function AiProductWidget() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % AI_DEMOS.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    const currentDemo = AI_DEMOS[currentIndex] || AI_DEMOS[0]!

    return (
        <div className="relative z-30 w-full max-w-[340px] mx-auto lg:mx-0 group/widget">
            {/* Background Green Spot & Glow - Positioned Behind */}
            <div className="absolute top-1/2 -left-16 -translate-y-1/2 z-40 pointer-events-none">
                <div className="w-32 h-64 bg-green-400 rounded-full blur-[50px] opacity-40" />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] h-auto min-h-[440px] flex flex-col relative z-20 border border-white/60 ring-1 ring-black/5">
                <div className="relative w-full aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden mb-5 group shadow-inner border border-gray-100">
                    <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black shadow-sm border border-black/5">
                        AI Studio
                    </div>

                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={currentDemo.id}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <Image
                                src={currentDemo.image}
                                alt={`AI generated image in ${currentDemo.style} style with prompt: ${currentDemo.prompt}`}
                                fill
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out will-change-transform"
                                loading={currentIndex === 0 ? "eager" : "lazy"}
                                priority={currentIndex === 0}
                                sizes="(max-width: 768px) 100vw, 400px"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Glass Overlay UI */}
                    <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-center z-20">
                        <motion.div
                            initial={{ y: 0, opacity: 1 }}
                            key={currentDemo.id}
                            className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center shadow-lg w-auto max-w-full"
                        >
                            <span className="text-[11px] text-white font-medium tracking-wide truncate flex items-center shadow-black/50 drop-shadow-md">
                                <TypingText text={currentDemo.prompt} />
                            </span>
                        </motion.div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center text-center px-2">
                    <h3 className="text-base font-bold text-gray-900 leading-tight mb-1 tracking-tight">
                        Create Your <br /> Custom T-Shirt
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-5">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-gray-500 font-medium">Starts from</span>
                            <span className="text-xs font-bold text-gray-900">$12.99</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-5">
                        {["NEON", "3D", "ANIME", "RETRO"].map((style) => (
                            <div
                                key={style}
                                className={cn(
                                    "px-3 py-1 rounded-xl text-[10px] font-extrabold border transition-all cursor-pointer tracking-wide",
                                    style === currentDemo.style
                                        ? "bg-black text-white border-black shadow-md scale-105"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700"
                                )}
                            >
                                {style}
                            </div>
                        ))}
                    </div>

                    <button className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]">
                        Start Designing <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- LIGHT MODE ABSTRACT VISUALS ---

// --- CREATIVE MOCKUP VISUAL (Split Layout) ---
function MockupVisual() {
    return (
        <div className="w-full h-full flex bg-[#f0f4ff]">
            {/* Left Image Side - Creative Fashion Model */}
            <div className="w-[45%] h-full relative overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1000"
                    alt="Creative Model"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Clean Artistic Element - Smooth White Wave */}
                <div className="absolute inset-x-0 bottom-0 h-16 text-white/90 z-10 pointer-events-none mix-blend-overlay opacity-80">
                    <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
                        <path fill="currentColor" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"></path>
                    </svg>
                </div>
            </div>
            {/* Right Content Side */}
            <div className="flex-1 flex flex-col justify-end p-5 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-xl text-[10px] font-bold text-violet-900 uppercase tracking-widest shadow-sm">
                    20% OFF
                </div>
                {/* Decorative Lines */}
                <div className="space-y-2 mb-3 mt-auto w-full max-w-[120px]">
                    <div className="h-1.5 w-full bg-violet-200 rounded-full opacity-60" />
                    <div className="h-1.5 w-2/3 bg-violet-200 rounded-full opacity-60" />
                </div>
                <div className="h-6 w-12 bg-white rounded-xl shadow-sm" />
            </div>
        </div>
    )
}

// --- CREATIVE CUSTOM VISUAL (Lime Drop) ---
function CustomVisual() {
    return (
        <div className="w-full h-full bg-[#d9f99d] flex relative overflow-hidden">
            {/* Left Content */}
            <div className="w-[50%] h-full p-6 flex flex-col justify-start pt-8">
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#4d7c0f]">New Drop</span>
                    <span className="text-[#4d7c0f] font-bold text-xs">+</span>
                </div>
            </div>

            {/* Right Image (Split) */}
            <div className="absolute right-0 top-0 w-[55%] h-full bg-gray-100">
                <Image
                    src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
                    alt="Product"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
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
}

// --- CREATIVE HUB VISUAL (Teal/Green) ---
function HubVisual() {
    return (
        <div className="w-full h-full bg-[#7dd3fc] relative overflow-hidden flex flex-col items-center pt-8">
            <h3 className="text-2xl font-black text-[#0c4a6e] tracking-tight">Artist Hub</h3>
            <div className="w-[80%] h-[2px] bg-[#0c4a6e]/10 my-3" />
            <p className="text-[10px] font-bold text-[#0c4a6e]/70 uppercase tracking-widest">Monetize Your Assets.</p>

            {/* Bottom UI Widget */}
            <div className="absolute bottom-0 w-[50%] h-[70px] bg-white/20 backdrop-blur-md rounded-t-2xl p-3 pb-0 flex gap-2 justify-center shadow-sm">
                <div className="w-16 h-12 bg-white/40 rounded-xl shadow-inner" />
                <div className="w-16 h-12 bg-white/40 rounded-xl shadow-inner" />
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
}

function FeatureCard({
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
}) {
    const theme = {
        blue: { title: "text-slate-900", desc: "text-slate-600" },
        cyan: { title: "text-slate-900", desc: "text-slate-600" },
        green: { title: "text-emerald-900", desc: "text-emerald-700" }
    }[variant]

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={cn(
                "group relative overflow-hidden rounded-xl h-[180px] flex flex-col transition-all duration-500 shadow-lg ring-1 ring-black/5 bg-white",
                className
            )}
        >
            {/* Visual Container (Full Bleed) */}
            <div className="absolute inset-0 w-full h-full z-0">
                {visual}
            </div>

            {/* Content Overlay (Optional, if not handled by visual) */}
            <div className="relative z-20 pointer-events-none p-6 h-full flex flex-col">
                <h3 className={cn("text-2xl font-black mb-1 tracking-tighter leading-none drop-shadow-sm", theme.title)}>
                    {title}
                </h3>
                <p className={cn("text-xs font-bold tracking-wide uppercase opacity-70 mix-blend-multiply max-w-[150px]", theme.desc)}>
                    {description}
                </p>
            </div>
        </motion.div>
    )
}

export function FeaturesGrid() {
    return (
        <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 auto-rows-[auto] items-center">

                {/* LEFT: Product Widget */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 lg:col-start-1 lg:row-start-1 relative z-30 lg:-mr-16 flex justify-center"
                >
                    <AiProductWidget />
                </motion.div>


                {/* CENTER: Process Animation */}
                <div className="lg:col-span-6 lg:col-start-4 lg:row-start-1 relative z-10 min-h-[500px] lg:h-[600px] transform lg:scale-100 flex items-center justify-center">
                    <ProcessShowcase />
                </div>


                {/* RIGHT: Stacked Features (White Abstract) */}
                <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 relative z-20 flex flex-col gap-6 h-auto min-h-[600px] py-4 lg:pl-6 justify-center text-left">

                    <FeatureCard
                        variant="blue"
                        title={<span className="absolute right-6 bottom-20 text-violet-900">Smart mockup.</span>}
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
}

"use client"

import { useState, useEffect, useRef, memo, useMemo } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { MousePointer2, Check, DollarSign, Activity, ChevronRight, Wand2 } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

// --- ASSETS ---
const ASSETS = {
    plain: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/before.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9iZWZvcmUuYXZpZiIsImlhdCI6MTc2OTk2ODU0MywiZXhwIjoxNzcyNTYwNTQzfQ.2wGnelbIYHgox3rCL_0XCxk_5CHF_zcFBtqAraBv7Dg",
    designed: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/after.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9hZnRlci5hdmlmIiwiaWF0IjoxNzY5OTY4NTE4LCJleHAiOjE3NzI1NjA1MTh9.P4gPpHsApaex6Ku3g5-jtz4CeX317Gop67dojKILCw0"
}

const CATALOG_PRODUCTS = [
    { id: 1, name: "Premium T-Shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop", category: "Apparel" },
    { id: 2, name: "Heavy Hoodie", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=400&auto=format&fit=crop", category: "Apparel" },
    { id: 3, name: "Ceramic Mug", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=400&auto=format&fit=crop", category: "Drinkware" },
    { id: 4, name: "Steel Tumbler", image: "https://images.unsplash.com/photo-1618354691229-88d47f285158?q=80&w=400&auto=format&fit=crop", category: "Drinkware" },
    { id: 5, name: "Canvas Print", image: "https://plus.unsplash.com/premium_photo-1706152482956-ab99f887763f?q=80&w=400&auto=format&fit=crop", category: "Home" },
    { id: 6, name: "Eco Tote", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=400&auto=format&fit=crop", category: "Accessories" }
]

const PHASES_CONFIG = [
    { id: "catalog", gradient: "from-blue-500 via-indigo-500 to-indigo-600", duration: 5000 },
    { id: "design", gradient: "from-violet-500 via-purple-500 to-fuchsia-600", duration: 8500 },
    { id: "sync", gradient: "from-emerald-400 via-teal-500 to-emerald-600", duration: 5000 },
    { id: "profit", gradient: "from-amber-400 via-orange-500 to-rose-500", duration: 5000 }
] as const

// --- MAIN COMPONENT ---
function ProcessShowcaseComponent() {
    const t = useTranslations('ProcessShowcase');
    const [phase, setPhase] = useState(0)
    const [cursor, setCursor] = useState({ x: 50, y: 50, clicking: false, label: "" })
    const [showCursor, setShowCursor] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { margin: "0px 0px -20% 0px", once: false })

    // Build the phases array with translated labels and descriptions
    const PHASES = useMemo(() => PHASES_CONFIG.map(config => ({
        ...config,
        label: t(`phases.${config.id}.label`),
        description: t(`phases.${config.id}.description`)
    })), [t]);

    // Build the cursor script with translated labels
    const CURSOR_SCRIPT = useMemo(() => [
        {
            phase: 0, // Catalog
            start: { x: 80, y: 40, label: "" },
            actions: [
                { x: 30, y: 28, label: t('cursor.selectTemplate'), delay: 850 },
                { clicking: true, delay: 2050 },
                { clicking: false, delay: 2250 }
            ]
        },
        {
            phase: 1, // Design
            start: { x: 10, y: 60, label: "" },
            actions: [
                { x: 28, y: 68, label: t('cursor.triggerAi'), delay: 800 },
                { clicking: true, delay: 2200 },
                { clicking: false, delay: 2500 },
                { x: 85, y: 70, label: "", delay: 3500 } // Move away to observe
            ]
        },
        {
            phase: 2, // Sync
            start: { x: 45, y: 30, label: "" },
            actions: [
                { x: 74, y: 35, label: t('cursor.marketplaceSync'), delay: 700 },
                { y: 58, delay: 2800 }
            ]
        },
        {
            phase: 3, // Profit
            start: { x: 80, y: 30, label: "" },
            actions: [
                { x: 58, y: 62, label: t('cursor.claimRevenue'), delay: 800 },
                { clicking: true, delay: 1950 },
                { clicking: false, delay: 2250 }
            ]
        }
    ], [t]);

    useEffect(() => {
        if (!isInView) return

        const script = CURSOR_SCRIPT.find(s => s.phase === phase)
        if (!script) return

        let mouseTimers: NodeJS.Timeout[] = []

        // Cursor Enter Animation
        setShowCursor(true)

        // 1. Set Initial Position
        setCursor(c => ({ ...c, ...script.start, clicking: false }))

        // 2. Run Programmed Actions
        script.actions.forEach(action => {
            const timer = setTimeout(() => {
                setCursor(c => ({ ...c, ...action }))
            }, action.delay)
            mouseTimers.push(timer)
        })

        // 3. Cursor Exit Animation (before phase change to create pop-up/pop-down effect)
        const currentDuration = PHASES[phase]?.duration ?? 5000
        const exitTimer = setTimeout(() => {
            setShowCursor(false)
        }, currentDuration - 600) // Pop down 600ms before phase switch

        const phaseTimer = setTimeout(() => {
            setPhase((prev) => (prev + 1) % PHASES.length)
        }, currentDuration)

        return () => {
            clearTimeout(phaseTimer)
            clearTimeout(exitTimer)
            mouseTimers.forEach(t => clearTimeout(t))
        }
    }, [phase, isInView, t]); // Added t to dependencies

    const currentPhase = PHASES[phase] ?? PHASES[0]!

    return (
        <div
            ref={containerRef}
            className="w-full h-[600px] bg-white/40 backdrop-blur-3xl rounded-md overflow-hidden relative border border-white/40 group ring-1 ring-white/60"
        >
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPhase.id + "-glow"}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        exit={{ opacity: 0, scale: 1.4 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className={cn(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.2]",
                            "bg-gradient-to-br", currentPhase.gradient
                        )}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.1] mix-blend-overlay pointer-events-none" />
            </div>

            {/* Content Stage */}
            <div className="absolute inset-x-0 top-0 bottom-44 flex flex-col items-center justify-center z-10 px-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.1, y: -30, filter: "blur(20px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full flex flex-col items-center justify-center perspective-1000"
                    >
                        {phase === 0 && <CatalogScene />}
                        {phase === 1 && <DesignScene />}
                        {phase === 2 && <SyncScene />}
                        {phase === 3 && <EarnScene />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Cinematic Overlay UI */}
            <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-white via-white/95 to-transparent p-10 flex flex-col justify-end z-20">
                <div className="flex items-end justify-between max-w-6xl mx-auto w-full">
                    <div className="space-y-4">
                        <div className="overflow-hidden">
                            <motion.h3
                                key={currentPhase.label}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="text-5xl font-black text-slate-900 tracking-tighter"
                            >
                                {currentPhase.label}
                            </motion.h3>
                        </div>
                        <motion.p
                            key={currentPhase.description}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 text-base max-w-sm font-medium leading-relaxed"
                        >
                            {currentPhase.description}
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Global Unified Cursor with Pop Up/Down Logic */}
            <motion.div
                className="absolute z-[100] pointer-events-none hidden md:block"
                animate={{
                    left: `${cursor.x}%`,
                    top: `${cursor.y}%`,
                    scale: showCursor ? 1 : 0,
                    opacity: showCursor ? 1 : 0
                }}
                transition={{
                    left: { type: "spring", damping: 30, stiffness: 150, mass: 0.8 },
                    top: { type: "spring", damping: 30, stiffness: 150, mass: 0.8 },
                    scale: { duration: 0.4, ease: "backOut" },
                    opacity: { duration: 0.2 }
                }}
            >
                <div className="relative">
                    <motion.div
                        animate={{
                            scale: cursor.clicking ? 0.85 : 1,
                            rotate: cursor.clicking ? -15 : 0
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 25, mass: 0.5 }}
                        className="relative"
                    >
                        <MousePointer2 className="w-5 h-5 text-white fill-indigo-600" strokeWidth={1.5} />
                    </motion.div>

                    {/* Tooltip Label */}

                </div>

                <AnimatePresence>
                    {cursor.clicking && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0, opacity: 0.8 }}
                                animate={{ scale: 2, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="absolute w-8 h-8 bg-indigo-500/30 rounded-full border border-indigo-500/50"
                            />
                            <motion.div
                                initial={{ scale: 0, opacity: 0.4 }}
                                animate={{ scale: 4, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
                                className="absolute w-8 h-8 bg-indigo-500/10 rounded-full border border-indigo-500/20"
                            />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="w-2 h-2 bg-indigo-600 rounded-full"
                            />
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

export const ProcessShowcase = memo(ProcessShowcaseComponent);

// --- CATALOG SCENE ---
const CatalogScene = memo(function CatalogSceneComponent() {
    const t = useTranslations('ProcessShowcase.scenes.catalog');
    const [selectedIdx, setSelectedIdx] = useState(-1)

    useEffect(() => {
        const timer = setTimeout(() => {
            setSelectedIdx(0)
        }, 900)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <div className="grid grid-cols-3 gap-6 relative p-8">
                {CATALOG_PRODUCTS.map((product, idx) => {
                    const isSelected = selectedIdx === idx
                    return (
                        <motion.div
                            key={product.id}
                            animate={{
                                opacity: selectedIdx === -1 || isSelected ? 1 : 0.4,
                                scale: isSelected ? 1.05 : 1,
                                y: isSelected ? -8 : 0,
                                zIndex: isSelected ? 30 : 1,
                                filter: selectedIdx !== -1 && !isSelected ? "grayscale(100%) blur(1px)" : "none"
                            }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                                "relative w-40 h-48 bg-white/80 backdrop-blur-xl rounded-md overflow-hidden p-2 flex flex-col transition-all duration-500",
                                isSelected
                                    ? "ring-2 ring-indigo-500/20 scale-105 z-20"
                                    : "border border-white/60 hover:border-indigo-200"
                            )}
                        >
                            <div className="relative w-full aspect-square rounded-md overflow-hidden bg-slate-50 mb-3 group-hover:bg-slate-100 transition-colors">
                                <Image
                                    src={product.image}
                                    className="object-cover opacity-90 transition-transform duration-700"
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 20vw"
                                />
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center backdrop-blur-[1px]"
                                    >
                                        <div className="bg-white p-2 rounded-full">
                                            <Check className="w-5 h-5 text-indigo-600" strokeWidth={3} />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            <div className="px-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{product.category}</p>
                                <p className="text-slate-900 text-xs font-bold truncate">{product.name}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-12 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-1.5 rounded-full"
            >
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('liveSync')}</span>
                </div>
            </motion.div>
        </div>
    )
});

// --- DESIGN SCENE ---
const DesignScene = memo(function DesignSceneComponent() {
    const t = useTranslations('ProcessShowcase.scenes.design');
    const [progress, setProgress] = useState(0)
    const [displayText] = useState("Purple and orange t-shirt with abstract geometric shapes all over it kind of bold and patterned....")

    useEffect(() => {
        const startDelay = setTimeout(() => {
            let p = 0
            const interval = setInterval(() => {
                let increment = 0
                if (p < 30) increment = 4.0
                else if (p < 80) increment = 1.5
                else increment = 5.0
                increment += (Math.random() - 0.5) * 1.5
                p = Math.min(p + increment, 100)
                setProgress(p)
                if (p >= 100) clearInterval(interval)
            }, 40)
            return () => clearInterval(interval)
        }, 2200)
        return () => clearTimeout(startDelay)
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center">
            <motion.div
                className="relative w-[380px] h-[400px] bg-[#050506] rounded-md border border-white/10 p-0 overflow-hidden flex flex-col group ring-1 ring-white/10"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 24, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                <div className="mx-0 h-[280px] bg-[#010101] border-b border-white/5 overflow-hidden relative flex items-center justify-center">
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        <span className="text-[9px] font-medium text-white/60 uppercase tracking-widest">{t('studio')}</span>
                    </div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 w-full h-full overflow-hidden rounded-md transform-gpu"
                            animate={{ opacity: progress < 50 ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image src={ASSETS.plain} alt="Plain T-Shirt" className="absolute inset-0 w-full h-full object-cover transform-gpu" fill sizes="380px" unoptimized />
                        </motion.div>
                        <motion.div
                            className="absolute inset-0 w-full h-full overflow-hidden rounded-md transform-gpu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: progress >= 50 ? 1 : 0, scale: progress >= 50 && progress < 80 ? 1.05 : 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image src={ASSETS.designed} alt="Designed T-Shirt" className="absolute inset-0 w-full h-full object-cover transform-gpu" fill sizes="380px" unoptimized />
                        </motion.div>
                        <AnimatePresence>
                            {progress > 5 && progress < 95 && (
                                <>
                                    <motion.div
                                        className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-violet-400 to-transparent z-20"
                                        initial={{ top: "0%" }}
                                        animate={{ top: "100%" }}
                                        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                                        style={{ boxShadow: "0 0 40px 6px rgba(139, 92, 246, 0.8)" }}
                                    />
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-violet-500/10 backdrop-blur-[1px] z-15" />
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                    <div className="bg-white/[0.03] rounded-md p-3 px-5 border border-white/5 flex items-center gap-4">
                        <div className="text-violet-500/40 font-mono text-[9px] font-black uppercase tracking-widest">{t('prompt')}</div>
                        <p className="text-[11px] text-white/80 font-medium font-mono leading-relaxed truncate flex-1 tracking-tight italic">
                            "{displayText.slice(0, 52)}..."
                        </p>
                        <motion.div animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-3 bg-violet-500/40 rounded-md" />
                    </div>
                    <div className="flex items-center justify-between gap-4 px-1">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                                <Wand2 className="w-4 h-4 text-violet-300" />
                            </div>
                            <span className={cn("text-[9px] font-bold uppercase tracking-widest transition-colors duration-300", progress === 100 ? "text-emerald-400" : "text-white/40")}>
                                {progress === 100 ? t('renderingComplete') : t('processing')}
                            </span>
                        </div>
                        <div className="flex-1 flex flex-col items-end gap-1.5">
                            <span className={cn("text-[10px] font-bold tabular-nums transition-colors duration-300 leading-none", progress === 100 ? "text-emerald-400" : "text-violet-300")}>{Math.round(progress)}%</span>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden max-w-[130px]">
                                <motion.div className={cn("h-full transition-colors duration-300", progress === 100 ? "bg-emerald-500" : "bg-violet-500")} initial={{ width: "0%" }} animate={{ width: `${progress}%` }} transition={{ type: "tween", ease: "linear", duration: 0.1 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
});

// --- SYNC SCENE ---
const SyncScene = memo(function SyncSceneComponent() {
    const t = useTranslations('ProcessShowcase.scenes.sync');
    const [started, setStarted] = useState(false)
    const STORES = [
        { name: 'Shopify', logo: 'https://cdn.simpleicons.org/shopify/96bf48', color: '#96bf48' },
        { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', color: '#FF9900' },
        { name: 'Etsy', logo: 'https://www.vectorlogo.zone/logos/etsy/etsy-icon.svg', color: '#F1641E' },
        { name: 'eBay', logo: 'https://www.vectorlogo.zone/logos/ebay/ebay-icon.svg', color: '#424242' }
    ]

    useEffect(() => {
        const timer = setTimeout(() => setStarted(true), 1200)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full h-full flex items-center justify-center overflow-visible">
            <div className="relative flex items-center justify-center gap-24">
                <motion.div className="relative w-[340px] h-[380px] bg-white/90 backdrop-blur-xl rounded-md overflow-hidden p-[3px] z-20 border border-white/60 ring-1 ring-white/80 transform-gpu" initial={{ scale: 0.8, opacity: 0, x: 10 }} animate={{ scale: 1, opacity: 1, x: 40 }} transition={{ duration: 0.8, ease: "circOut" }}>
                    <div className="w-full h-full rounded-md overflow-hidden bg-slate-50 relative">
                        <Image src={ASSETS.designed} className="absolute inset-0 w-full h-full object-cover transform-gpu" alt="Designed Product" fill sizes="340px" unoptimized />
                    </div>
                </motion.div>
                <div className="flex flex-col gap-3 z-20">
                    {STORES.map((shop, i) => (
                        <motion.div key={shop.name} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 + i * 0.15, duration: 0.5, ease: "backOut" }} className="bg-white/80 backdrop-blur-md rounded-md p-2.5 px-5 flex items-center gap-3 w-[170px] border border-white/60 group cursor-default transition-all duration-500 transform hover:scale-105">
                            <div className="relative w-10 h-10 rounded-md bg-slate-50 flex items-center justify-center p-2 transition-transform group-hover:scale-105 duration-300">
                                <Image src={shop.logo} alt={shop.name} fill className="object-contain p-2" sizes="40px" unoptimized />
                                <div className="absolute inset-0 rounded-md ring-1 ring-black/5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-slate-900 font-bold text-xs leading-none mb-1">{shop.name}</h4>
                                <div className="flex items-center gap-1.5 opacity-90 transition-opacity">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[8px] font-black text-emerald-600/80 tracking-[0.1em] uppercase group-hover:text-emerald-600 transition-colors">{t('connected')}</span>
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                                <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                            </div>
                        </motion.div>
                    ))}
                </div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10" viewBox="0 0 1000 600">
                    <defs>
                        <linearGradient id="energy-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                            <stop offset="50%" stopColor="#34d399" stopOpacity="1" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow-beam" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    {[0, 1, 2, 3].map((i) => (
                        <motion.path key={i} d={`M 480 300 C 530 300, 520 ${188 + i * 75}, 570 ${188 + i * 75}`} stroke="url(#energy-beam)" strokeWidth="3" fill="none" filter="url(#glow-beam)" initial={{ pathLength: 0, opacity: 0 }} animate={started ? { pathLength: 1, opacity: 1 } : {}} transition={{ duration: 1.2, delay: i * 0.15, ease: "easeInOut" }} />
                    ))}
                    {[0, 1, 2, 3].map((i) => (
                        <motion.circle key={`p-${i}`} r="4" fill="#ecfdf5" filter="url(#glow-beam)" initial={{ offsetDistance: "0%" }} animate={started ? { offsetDistance: "100%" } : {}} transition={{ duration: 2, delay: 1.2 + i * 0.2, repeat: Infinity, ease: "linear" }} style={{ offsetPath: `path("M 480 300 C 530 300, 520 ${188 + i * 75}, 570 ${188 + i * 75}")` }} />
                    ))}
                </svg>
            </div>
        </div>
    )
});

// --- EARN SCENE ---
const EarnScene = memo(function EarnSceneComponent() {
    const t = useTranslations('ProcessShowcase.scenes.earn');
    const [count, setCount] = useState(0)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const t1 = setTimeout(() => setStarted(true), 1950)
        return () => clearTimeout(t1)
    }, [])

    useEffect(() => {
        if (!started) return
        const interval = setInterval(() => {
            setCount(prev => (prev >= 42850 ? 42850 : prev + 857))
        }, 30)
        return () => clearInterval(interval)
    }, [started])

    return (
        <div className="w-full h-full flex flex-col items-center justify-center pt-2">
            <div className="w-full max-w-4xl flex items-stretch gap-6 h-[85%]">
                <motion.div className="flex-1 bg-slate-100/60 backdrop-blur-3xl rounded-md border border-white/60 p-8 overflow-hidden relative group ring-1 ring-white/80" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                                <DollarSign className="w-7 h-7 text-amber-500" />
                            </div>
                            <div>
                                <h4 className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] mb-1">{t('netWorth')}</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-900 text-5xl font-black tabular-nums tracking-tighter">${count.toLocaleString()}</span>
                                    <span className="text-amber-500 font-black text-sm tabular-nums">.00</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-end gap-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{t('velocity')}</span>
                                    <span className="text-emerald-500 font-bold text-xs">{started ? "+14.2%" : "+0.0%"}</span>
                                </div>
                                <div className="h-24 w-full flex items-end gap-1.5 px-1">
                                    {[40, 60, 45, 80, 55, 90, 70, 100, 85, 95].map((h, i) => (
                                        <motion.div key={i} initial={{ height: "4px" }} animate={started ? { height: `${h}%` } : { height: "4px" }} transition={{ delay: i * 0.05, duration: 0.6, ease: "backOut" }} className="flex-1 bg-amber-400 rounded-full opacity-90" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <div className="w-72 flex flex-col gap-6">
                    <motion.div className="flex-1 bg-slate-100/40 backdrop-blur-2xl rounded-md border border-slate-900/5 p-8 flex flex-col justify-center gap-4" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">{t('weeklySales')}</p>
                            <p className="text-slate-900 text-3xl font-black">1,248</p>
                            <p className="text-blue-500 text-[9px] font-bold mt-1 tracking-tight">{t('fulfilled')}</p>
                        </div>
                    </motion.div>
                    <motion.div className="h-1/2 bg-gradient-to-br from-white to-gray-200 rounded-md p-8 flex flex-col justify-between group cursor-pointer overflow-hidden relative" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 space-y-2">
                            <h4 className="text-black group-hover:text-white text-2xl font-black tracking-tight leading-tight transition-colors">{t('empire')}</h4>
                        </div>
                        <div className="relative z-10 flex items-center justify-between">
                            <span className="text-black/60 group-hover:text-white/60 text-[10px] font-bold transition-colors underline underline-offset-4">{t('getStarted')}</span>
                            <ChevronRight className="w-5 h-5 text-black group-hover:text-white transition-colors" />
                        </div>
                    </motion.div>
                </div>
            </div >
        </div >
    )
});

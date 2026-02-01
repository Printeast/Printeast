"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Sparkles, Wand2, Zap, MousePointer2, Type, Image as ImageIcon, Box, Download, Share2, ZoomIn, Undo, Redo, LayoutTemplate } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// --- ASSETS ---
const ASSETS = {
    // Clean white t-shirt mockup
    plain: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/before.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9iZWZvcmUuYXZpZiIsImlhdCI6MTc2OTk2ODU0MywiZXhwIjoxNzcyNTYwNTQzfQ.2wGnelbIYHgox3rCL_0XCxk_5CHF_zcFBtqAraBv7Dg",
    // Result image (Using a visually distinct one to show 'generation')
    result: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/after.avif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9hZnRlci5hdmlmIiwiaWF0IjoxNzY5OTY4NTE4LCJleHAiOjE3NzI1NjA1MTh9.P4gPpHsApaex6Ku3g5-jtz4CeX317Gop67dojKILCw0"
}

export function AiStudioSection() {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.2 })

    return (
        <section ref={containerRef} className="py-24 bg-[#fafafa] text-slate-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16 max-w-5xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black tracking-tighter uppercase leading-[0.95] text-slate-900 mb-6 lg:whitespace-nowrap"
                    >
                        DESIGN LIKE A PRO. <span className="text-blue-600">POWERED BY AI.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-500 text-lg leading-relaxed"
                    >
                        The world's most advanced design editor, built directly into Printeast.
                        Experience fluid, cinematic creation with smart mockups.
                    </motion.p>
                </div>

                {/* THE STUDIO SIMULATION */}
                <div className="w-full max-w-6xl mx-auto">
                    <StudioSimulation isInView={isInView} />
                </div>

            </div>
        </section>
    )
}

function StudioSimulation({ isInView }: { isInView: boolean }) {
    // Animation Phases:
    // 0: Idle
    // 1: Cursor enters -> Moves to AI Tab
    // 2: AI Panel Opens -> Cursor moves to Input
    // 3: Typing -> Camera Zooms In
    // 4: Generating -> Scanning Effect
    // 5: Reveal -> Camera Zooms Out -> Cursor moves away
    const [phase, setPhase] = useState(0)

    useEffect(() => {
        if (!isInView) return

        let isRunning = true

        const runSequence = async () => {
            while (isRunning) {
                setPhase(0)
                await wait(500)
                setPhase(1) // Cursor Enter

                await wait(1500)
                setPhase(2) // Open Panel

                await wait(1000)
                setPhase(3) // Typing & Zoom

                await wait(9000) // Increased to allow typing ( ~5.5s) to finish fully + pause
                setPhase(4) // Move Cursor to Button

                await wait(1700) // Increased travel time for a more natural move
                setPhase(5) // Click & Generate

                await wait(3000) // Generating...
                setPhase(6) // Result & Zoom Out

                await wait(4000) // Hold result
            }
        }

        runSequence()
        return () => { isRunning = false }
    }, [isInView])

    return (
        <div className="relative w-full aspect-[16/9] bg-[#0f0f11] rounded-2xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex flex-col font-sans select-none">
            {/* --- TOP BAR --- */}
            <div className="h-14 bg-[#1a1a1c]/95 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-40">
                <div className="flex items-center gap-5">
                    <div className="flex gap-2 group">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500 border border-red-500/30 transition-all" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 border border-yellow-500/30 transition-all" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 group-hover:bg-green-500 border border-green-500/30 transition-all" />
                    </div>
                    <div className="h-5 w-[1px] bg-white/5" />
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="flex gap-1">
                            <button className="p-1.5 hover:bg-white/5 rounded-xl transition-colors hover:text-gray-300">
                                <Undo className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-white/5 rounded-xl transition-colors hover:text-gray-300">
                                <Redo className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="text-xs font-medium text-gray-500/50 select-none">|</span>
                        <div className="text-xs font-medium text-gray-400">Untitled Project</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-black/20 border border-white/5 px-3 py-1.5 rounded-full text-[10px] font-medium text-gray-400">
                        <ZoomIn className="w-3 h-3" /> 100%
                    </div>
                    <button className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                        <Download className="w-3 h-3" /> Export
                    </button>
                    <button className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all hover:text-white">
                        <Share2 className="w-3 h-3" /> Share
                    </button>
                </div>
            </div>

            {/* --- MAIN WORKSPACE --- */}
            <div className="flex-1 flex relative overflow-hidden">

                {/* LEFT SIDEBAR */}
                <div className="w-[72px] bg-[#1a1a1c] border-r border-white/5 flex flex-col items-center py-6 gap-6 z-40">
                    <SidebarIcon icon={LayoutTemplate} label="Templates" />
                    <SidebarIcon icon={Type} label="Text" />
                    <SidebarIcon icon={ImageIcon} label="Uploads" />
                    <SidebarIcon icon={Box} label="Elements" />
                    <div className="relative w-full flex justify-center">
                        <SidebarIcon
                            icon={Sparkles}
                            label="AI Gen"
                            active={phase >= 2}
                            className={phase >= 2 ? "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}
                        />
                        {/* AI Active Indicator */}
                        {phase >= 2 && (
                            <motion.div layoutId="active-bar" className="absolute left-0 top-2 bottom-2 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        )}
                    </div>
                </div>

                {/* EXTENDED PANEL (POPS OUT) */}
                <AnimatePresence>
                    {(phase >= 2) && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 300, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-[#141415]/95 backdrop-blur-xl border-r border-white/5 h-full z-30 overflow-hidden flex flex-col"
                        >
                            <div className="p-5 border-b border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                    <h3 className="text-white font-semibold text-sm tracking-wide">AI Generator</h3>
                                </div>
                                <p className="text-gray-500 text-[11px]">Turn your imagination into reality.</p>
                            </div>
                            <div className="p-5 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Prompt</label>
                                    <div className="w-full h-36 bg-black/40 rounded-xl border border-white/10 p-4 text-sm text-gray-300 font-medium leading-relaxed focus-within:border-blue-500/50 transition-colors shadow-inner">
                                        {phase >= 3 && <TypingText text="Purple and orange t-shirt with abstract geometric shapes all over it kind of bold and patterned...." startDelay={480} />}
                                        <motion.span
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                            className="inline-block w-0.5 h-4 bg-blue-500 align-middle ml-0.5 rounded-full"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Style</label>
                                        <span className="text-[10px] text-blue-500 font-bold cursor-pointer hover:text-blue-400 transition-colors">View All</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {[
                                            { name: "Geometric", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=200&h=120&auto=format&fit=crop" },
                                            { name: "3D Render", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&h=120&auto=format&fit=crop" },
                                            { name: "Anime", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&h=120&auto=format&fit=crop" },
                                            { name: "Digital Art", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=200&h=120&auto=format&fit=crop" }
                                        ].map((style, i) => (
                                            <div
                                                key={style.name}
                                                className={cn(
                                                    "group relative aspect-[3/2] rounded-xl overflow-hidden border border-white/10 cursor-pointer transition-all hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                                                    i === 0 ? "ring-1 ring-blue-500 ring-offset-1 ring-offset-[#141415]" : ""
                                                )}
                                            >
                                                <Image
                                                    src={style.image}
                                                    alt={style.name}
                                                    fill
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                                <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white tracking-wide z-10">{style.name}</span>

                                                {/* Selected indicator (simulated) */}
                                                {i === 0 && (
                                                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)] z-10" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all mt-6 shadow-lg",
                                        phase >= 5
                                            ? "bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-blue-200/50 cursor-not-allowed border border-blue-500/20"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40"
                                    )}
                                >
                                    {phase >= 5 ? (
                                        <><Zap className="w-4 h-4 animate-pulse" /> Generating...</>
                                    ) : (
                                        <><Wand2 className="w-4 h-4" /> Generate Image</>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CANVAS AREA */}
                <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden flex items-center justify-center p-10">

                    {/* Generation Background Effect */}
                    <AnimatePresence>
                        {phase === 5 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-0 flex items-center justify-center"
                            >
                                <div className="w-[150%] h-[150%] bg-gradient-to-conic from-blue-500 via-indigo-500 to-purple-500 animate-spin-slow opacity-20 blur-[100px]" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(#4a4a4a 1px, transparent 1px)", backgroundSize: "20px 20px" }}
                    />

                    {/* ZOOM CONTAINER */}
                    <motion.div
                        className="relative w-full max-w-[500px] aspect-square flex items-center justify-center"
                        animate={{
                            scale: phase >= 3 && phase <= 5 ? 1.3 : 1, // Zoom in during typing/generation
                            y: phase >= 3 && phase <= 5 ? 40 : 0
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        {/* SHIRT MOCKUP */}
                        <motion.div
                            className="relative w-full h-full"
                            animate={{
                                filter: phase === 5 ? "blur(12px)" : "blur(0px)"
                            }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src={ASSETS.plain}
                                className="w-full h-full object-contain filter drop-shadow-2xl"
                                alt="Shirt Mockup"
                                loading="eager"
                            />

                            {/* RESULT OVERLAY */}
                            <motion.div
                                className="absolute inset-0 w-full h-full z-10 will-change-transform"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: phase >= 6 ? 1 : 0 }}
                                transition={{ duration: 0.5 }} // Quicker fade in after blur
                            >
                                <img
                                    src={ASSETS.result}
                                    className="w-full h-full object-contain filter drop-shadow-2xl will-change-transform"
                                    alt="Design"
                                    loading="lazy"
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* CURSOR SIMULATION */}
                <Cursor phase={phase} />

            </div>
        </div>
    )
}

function Cursor({ phase }: { phase: number }) {
    // Cursor Positions (%)
    // Start: Bottom Right
    // 1: Move to sidebar "AI"
    // 2: Move to Input Box
    // 3: Stay at input (typing)
    // 4: Move to Generate Button
    // 5: Click Generate (Stay)
    // 6: Move away / Disappear

    // We'll use absolute positioning based on container % to keep it responsive-ish
    const variants = {
        0: { left: "90%", top: "90%", opacity: 0 },
        1: { left: "4%", top: "65%", opacity: 1 }, // Sidebar AI Icon position (approx)
        2: { left: "20%", top: "35%", opacity: 1 }, // Input box position
        3: { left: "20%", top: "35%", opacity: 1 }, // Typing...
        4: { left: "20%", top: "90%", opacity: 1 }, // Move to Generate Button
        5: { left: "20%", top: "90%", opacity: 1 }, // Stay at Button (Clicking)
        6: { left: "90%", top: "90%", opacity: 0 }  // Exit
    }

    // Cursor Click Animation - Delayed for Phase 2, Immediate for Phase 5
    const [isClicking, setIsClicking] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timeout

        if (phase === 2) {
            // Delayed click (wait for movement)
            setIsClicking(false)
            timer = setTimeout(() => setIsClicking(true), 1200)
        } else if (phase === 5) {
            // Immediate click (already moved in phase 4)
            setIsClicking(true)
        } else {
            setIsClicking(false)
        }

        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [phase])


    return (
        <motion.div
            className="absolute z-50 pointer-events-none will-change-transform"
            initial="0"
            animate={phase.toString()}
            variants={variants} // @ts-ignore
            transition={{ duration: 1.2, ease: "easeInOut" }}
        >
            <div className="relative">
                <MousePointer2
                    className={cn(
                        "w-6 h-6 text-white fill-black stroke-[1.5px] drop-shadow-xl transition-transform duration-150",
                        isClicking ? "scale-90" : "scale-100"
                    )}
                />
                {/* Click Ripple */}
                {isClicking && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        className="absolute -top-2 -left-2 w-10 h-10 bg-white/50 rounded-full"
                    />
                )}
                <div className="absolute left-6 top-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                    You
                </div>
            </div>
        </motion.div>
    )
}

function SidebarIcon({ icon: Icon, label, active, className }: { icon: any, label: string, active?: boolean, className?: string }) {
    return (
        <div className={cn("flex flex-col items-center gap-1 group cursor-pointer w-full p-2 py-3 transition-colors relative", active ? "text-blue-500" : "text-[#8b8b8b] hover:text-white")}>
            <Icon className={cn("w-5 h-5 transition-colors", className)} />
            <span className="text-[9px] font-medium">{label}</span>
        </div>
    )
}

function TypingText({ text, startDelay = 0 }: { text: string, startDelay?: number }) {
    const [display, setDisplay] = useState("")

    useEffect(() => {
        const timeout = setTimeout(() => {
            let i = 0
            const interval = setInterval(() => {
                if (i < text.length) {
                    setDisplay(text.slice(0, i + 1))
                    i++
                } else {
                    clearInterval(interval)
                }
            }, 50) // Typing speed
            return () => clearInterval(interval)
        }, startDelay)

        return () => clearTimeout(timeout)
    }, [text, startDelay])

    return <span>{display}</span>
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

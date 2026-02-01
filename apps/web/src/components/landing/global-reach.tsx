"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import RotatingEarth from "@/components/ui/wireframe-dotted-globe"
import { Globe2, Crosshair } from "lucide-react"
import { StarsBackground } from "@/components/ui/stars"

export function GlobalReach() {
    const [hotspots, setHotspots] = useState<{ id: string; x: number; y: number; visible: boolean; name: string }[]>([])

    return (
        <section className="relative w-full min-h-screen bg-white overflow-hidden py-24 flex flex-col items-center justify-center">
            {/* Subtle Light Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.08)_0%,transparent_50%)]" />

            {/* Content Container */}
            <div className="container relative z-10 px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: Text Content */}
                <div className="order-2 lg:order-1 flex flex-col justify-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >


                        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-slate-900">
                            WE WORK ROUND THE CLOCK.
                            <br />
                            <span className="text-blue-600">WE DELIVER ROUND THE GLOBE.</span>
                        </h2>

                        <p className="text-sm md:text-base text-slate-500 max-w-xl font-medium leading-relaxed mt-4">
                            Printeast operates on a truly borderless infrastructure. Our 24/7 autonomous fulfillment centers ensure your products move faster than the competition, reaching customers in over 180 countries.
                        </p>
                    </motion.div>


                </div>

                {/* Right: Globe Visualization with Enhanced Card - Premium Dark Theme */}
                <div className="order-1 lg:order-2 relative h-[450px] lg:h-[600px] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative h-full aspect-square flex items-center justify-center w-full max-w-[600px]"
                    >
                        {/* Premium Dark Surface with Massive Shadow */}
                        <div className="absolute inset-0 rounded-2xl bg-[#020308] border border-white/10 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8),0_20px_40px_-20px_rgba(0,0,0,0.4)] overflow-hidden">

                            {/* Inner Decorative Rings */}
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 z-20 pointer-events-none" />
                            <div className="absolute inset-1 rounded-2xl border border-white/5 z-10 pointer-events-none" />

                            {/* Background Atmosphere - Enhanced for Blue Theme */}
                            <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-br from-blue-500/10 via-transparent to-transparent blur-[120px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-cyan-500/5 via-transparent to-transparent blur-[100px] pointer-events-none" />

                            <StarsBackground
                                starColor="#ffffff"
                                factor={0.01}
                                speed={100}
                                className="pointer-events-auto z-0 bg-[#020617]" // Ensure background captures mouse for parallax
                            >
                                {/* Globe Container centered */}
                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10 pointer-events-none"> {/* Globe is visual, canvas handles its own interaciton if pointer-events-auto */}
                                    <div className="w-full h-full flex items-center justify-center scale-115 translate-y-5 pointer-events-auto">
                                        <RotatingEarth
                                            className="w-full h-full"
                                            onHotspotsUpdate={setHotspots}
                                        />
                                    </div>
                                </div>

                                {/* Hint Removed as per request */}

                                {/* Bottom Fade */}
                                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-20" />
                            </StarsBackground>
                        </div>

                        {/* Floating Stat Cards - Tracking Multiple Hotspots */}
                        <AnimatePresence>
                            {hotspots.map((hotspot) => (
                                hotspot.visible && (
                                    <motion.div
                                        key={hotspot.id}
                                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            x: hotspot.id === 'india' ? hotspot.x - 110 : hotspot.x - 40, // Different offsets to avoid overlap if close, though they are geographically far
                                            y: hotspot.y - 140
                                        }}
                                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                        className="absolute left-0 top-0 z-20 pointer-events-none will-change-transform"
                                        transition={{ type: "spring", damping: 20, stiffness: 120, mass: 0.5 }}
                                    >
                                        <div className="relative bg-gradient-to-br from-[#0F172A]/90 to-black/90 backdrop-blur-xl rounded-xl p-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-teal-500/30 min-w-[180px] group overflow-hidden">
                                            {/* Glow Effect only - Stars removed */}
                                            <div className="absolute inset-0 rounded-xl bg-teal-500/5 group-hover:bg-teal-500/10 transition-colors duration-500" />

                                            {hotspot.id === 'india' ? (
                                                /* India Hub Card - High Tech Style */
                                                <div className="relative flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <Crosshair className="w-3.5 h-3.5 text-teal-400 animate-[spin_3s_linear_infinite]" />
                                                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">300 POPs</span>
                                                    </div>

                                                    <div className="text-xs font-medium text-teal-50 leading-tight">
                                                        <span className="text-teal-400 block font-bold">24/7 SUPPORT</span>
                                                        Instant Global Loading.
                                                    </div>
                                                </div>
                                            ) : (
                                                /* USA Hub Card - High Tech Style */
                                                <div className="relative flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <Globe2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                                                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Global infra</span>
                                                    </div>

                                                    <div className="text-xs font-medium text-cyan-50 leading-tight">
                                                        <span className="text-cyan-400 block font-bold">GLOBAL PRODUCTS</span>
                                                        Infinite Scalability.
                                                    </div>
                                                </div>
                                            )}

                                            {/* Connector */}
                                            <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 flex flex-col items-center">
                                                <div className="w-[1px] h-6 bg-gradient-to-b from-teal-500/50 to-transparent" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>

                        {/* Ambient Glow Behind Globe - Cyan/Blue */}
                        <div className="absolute inset-20 -z-10 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent blur-3xl rounded-full scale-125 opacity-40" />
                    </motion.div>
                </div>

            </div>
        </section>
    )
}

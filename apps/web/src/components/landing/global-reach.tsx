"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import RotatingEarth from "@/components/ui/wireframe-dotted-globe"
import { Globe2, Crosshair } from "lucide-react"
import { StarsBackground } from "@/components/ui/stars"
import { useTranslations } from "next-intl"

export function GlobalReach() {
    const t = useTranslations('GlobalReach');
    const [hotspots, setHotspots] = useState<{ id: string; x: number; y: number; visible: boolean; name: string }[]>([])

    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { margin: "0px 0px -20% 0px", once: false })

    return (
        <section ref={containerRef} className="relative w-full bg-transparent py-32 flex flex-col items-center justify-center overflow-hidden">

            {/* CARD CONTAINER for Cosmic Theme - Truly Full Width but with Curved Visuals */}
            <div className="relative w-full mx-0 rounded-[48px] sm:rounded-[64px] overflow-hidden border-t border-b border-white/5 shadow-2xl">

                {/* StarsWrapper: Wraps content to capture mouse movement for parallax effect */}
                <StarsBackground
                    starColor="rgba(226, 232, 240, 0.5)" // 50% opacity to match previous style
                    factor={0.5}
                    speed={150}
                    className="size-full bg-[#020617]" // Dark cosmic background
                >

                    {/* Nebula-like Glows */}
                    <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-blue-900/20 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '10s' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[140px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vw] bg-blue-600/10 rounded-full blur-[180px] rotate-12" />

                    {/* Deep Dark Globe Arena Glow */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] max-w-[1200px] max-h-[1200px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.9)_0%,rgba(2,6,23,0)_70%)] pointer-events-none z-0" />

                    <div className="container relative z-10 px-6 py-24 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Text Content - Updated for Dark Theme */}
                        <div className="order-2 lg:order-1 flex flex-col justify-center space-y-8 lg:-ml-8">
                            <motion.div
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white">
                                    <span className="whitespace-nowrap">{t('title.line1')}</span> <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 whitespace-nowrap">{t('title.line1Blue')}</span>
                                    <br />
                                    <br />
                                    <span className="text-white whitespace-nowrap">{t('title.line2')}</span> <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 whitespace-nowrap">{t('title.line2Blue')}</span>
                                </h2>

                                <p className="text-lg md:text-xl text-slate-400 max-w-xl font-medium leading-relaxed mt-4">
                                    {t.rich('description', {
                                        secondary: (chunks) => <span className="block">{chunks}</span>
                                    })}
                                </p>

                                <div className="flex flex-wrap gap-12 pt-4">
                                    {[
                                        { label: t('stats.activeHubs'), value: '45+' },
                                        { label: t('stats.countries'), value: '180+' },
                                        { label: t('stats.uptime'), value: '99.9%' }
                                    ].map((stat) => (
                                        <div key={stat.label} className="flex flex-col">
                                            <span className="text-3xl font-black text-white tracking-tight">{stat.value}</span>
                                            <span className="text-xs tracking-widest text-slate-500 font-bold">{stat.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Globe Visualization - Cosmic Style */}
                        <div className="order-1 lg:order-2 relative h-[500px] lg:h-[700px] flex items-center justify-center">
                            <motion.div
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                className="relative h-full aspect-square flex items-center justify-center w-full max-w-[650px]"
                            >


                                {/* Globe Container */}
                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-10">
                                    <div className="w-full h-full flex items-center justify-center scale-125 translate-y-8 will-change-transform">
                                        <RotatingEarth
                                            className="w-full h-full"
                                            onHotspotsUpdate={setHotspots}
                                            isInView={isInView}
                                        />
                                    </div>
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
                                                    x: hotspot.id === 'india' ? hotspot.x - 110 : hotspot.x - 40,
                                                    y: hotspot.y - 140
                                                }}
                                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                                className="absolute left-0 top-0 z-20 pointer-events-none will-change-transform"
                                                transition={{ type: "spring", damping: 20, stiffness: 120, mass: 0.5 }}
                                            >
                                                <div className="relative bg-[#0F172A]/80 backdrop-blur-2xl rounded-lg p-4 border border-blue-500/30 min-w-[200px] group overflow-hidden">
                                                    {/* Interior Nebula Glow */}
                                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-50" />

                                                    {hotspot.id === 'india' ? (
                                                        <div className="relative flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <Crosshair className="w-4 h-4 text-cyan-400 animate-[spin_4s_linear_infinite]" />
                                                                <span className="text-[10px] font-mono text-slate-400 tracking-[0.2em]">{t('hotspots.regionalHub')}</span>
                                                            </div>
                                                            <div className="text-sm font-medium text-white leading-tight">
                                                                <span className="text-cyan-400 block font-black text-base">{t('hotspots.asiaPacific')}</span>
                                                                {t('hotspots.autonomousRouting')}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative flex flex-col gap-2">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <Globe2 className="w-4 h-4 text-blue-400 animate-pulse" />
                                                                <span className="text-[10px] font-mono text-slate-400 tracking-[0.2em]">{t('hotspots.hqNode')}</span>
                                                            </div>
                                                            <div className="text-sm font-medium text-white leading-tight">
                                                                <span className="text-blue-400 block font-black text-base">{t('hotspots.globalControl')}</span>
                                                                {t('hotspots.infrastructureScaling')}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 flex flex-col items-center">
                                                        <div className="w-[1px] h-8 bg-gradient-to-b from-blue-500/50 to-transparent" />
                                                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>

                </StarsBackground>

            </div>
        </section>
    )
}

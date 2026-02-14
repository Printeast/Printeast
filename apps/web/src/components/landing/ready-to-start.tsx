"use client"

import { motion } from "framer-motion"
import { ArrowRight, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"

export function ReadyToStart() {
    const t = useTranslations('ReadyToStart');

    return (
        <section className="relative w-full py-32 bg-transparent overflow-hidden">
            {/* Background Atmosphere - Connecting from previous section */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-50" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full max-w-6xl mx-auto"
                >
                    {/* The Massive Card */}
                    <div className="relative overflow-hidden rounded-md bg-[#020617]">

                        {/* 1. Dynamic Background Texture (Blexd Texture) */}
                        <div className="absolute inset-0 z-0">
                            {/* Base deep gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1121] via-[#020617] to-black" />

                            {/* Vibrant Blue/Purple Nebula Blends (The 'Design') */}
                            <motion.div
                                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-[-50%] left-[-20%] w-[80%] h-[150%] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen will-change-transform translate-z-0"
                            />
                            <motion.div
                                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[150%] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen will-change-transform translate-z-0"
                            />

                            {/* Noise Texture Overlay */}
                            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.07] mix-blend-overlay" />

                            {/* Inner Shine/Gloss */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                        </div>

                        {/* 2. Content Container */}
                        <div className="relative z-10 px-6 py-12 lg:py-16 flex flex-col items-center text-center">

                            {/* Main Heading - "100% Free..." but making it sleek as requested */}
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-white">
                                {t.rich('title', {
                                    blue: (chunks) => <span className="text-blue-400">{chunks}</span>
                                })}
                            </h2>

                            {/* Subtext */}
                            <div className="mt-6 text-sm md:text-base text-blue-100/60 max-w-2xl font-light leading-relaxed">
                                <p>{t('subtitle')}</p>
                                <strong className="text-white block mt-1 font-medium">{t('handledByUs')}</strong>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
                                <Link href="/dashboard" prefetch={true}>
                                    <Button
                                        className="h-14 px-8 rounded-md bg-white text-black font-bold text-base hover:bg-blue-50 transition-all hover:scale-105 group"
                                    >
                                        {t('buttons.initialize')}
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>

                                <Button
                                    variant="outline"
                                    className="h-14 px-8 rounded-md border-white/10 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/20 font-medium text-base transition-all"
                                >
                                    <Building2 className="w-5 h-5 mr-2 opacity-70" />
                                    {t('buttons.contactEnterprise')}
                                </Button>
                            </div>

                        </div>

                        {/* 3. Bottom Fade / "Fade with off white" Effect */}
                        {/* Reduced height to match shorter card request */}
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />

                    </div>

                    {/* Background Glow behind the card */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-20 blur-3xl rounded-md -z-10" />

                </motion.div>
            </div>
        </section>
    )
}

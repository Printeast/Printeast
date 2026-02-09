"use client"

import { useRef, memo, useMemo } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

import { useTranslations } from "next-intl"

export function FeatureShowcase() {
    const t = useTranslations('FeatureShowcase');
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Horizontal scroll logic matching request
    // Increased distance to -60% to ensure all 5 cards (including "Earn Profits") are fully visible
    const x = useTransform(scrollYProgress, [0.2, 1], ["0%", "-55%"])

    const items = useMemo(() => [
        {
            id: "1",
            title: t('items.1.title'),
            description: t('items.1.description'),
            src: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "2",
            title: t('items.2.title'),
            description: t('items.2.description'),
            src: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "3",
            title: t('items.3.title'),
            description: t('items.3.description'),
            src: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "4",
            title: t('items.4.title'),
            description: t('items.4.description'),
            src: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: "5",
            title: t('items.5.title'),
            description: t('items.5.description'),
            src: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop",
        },
    ], [t])

    return (
        <section
            ref={containerRef}
            className="relative bg-transparent"
            style={{ height: "300vh" }} // Reduced to 300vh for snappier acceleration
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
                <div className="relative z-10 px-6 lg:px-16 container mx-auto mb-12">
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-slate-900">
                            {t.rich('title', {
                                blue: (chunks) => <span className="text-blue-600">{chunks}</span>
                            })}
                        </h2>
                        <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed mt-4 max-w-none">
                            You are few steps away from creating your profitable brand. <br className="hidden md:block" />
                            Production, Logistics, and Support — handled by us.
                        </p>
                    </motion.div>
                </div>

                {/* Horizontal Scrolling Track */}
                <div className="relative w-full pl-6 lg:pl-16">
                    <motion.div
                        style={{ x }}
                        className="flex gap-8 lg:gap-12 w-max px-4 will-change-transform"
                    >
                        {items.map((item, index) => (
                            <FeatureCard key={item.id} item={item} index={index} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

const FeatureCard = memo(({ item, index }: { item: any, index: number }) => {
    return (
        <div
            className="relative group w-[500px] h-[340px] sm:w-[600px] sm:h-[400px] flex-shrink-0"
            style={{ perspective: "1000px" }}
        >
            <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{
                    scale: 1.02,
                    // Removed 3D rotation to prevent aliased edges
                    transition: { duration: 0.4, ease: "easeOut" }
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.1
                }}
                className={cn(
                    "w-full h-full relative overflow-hidden transform-gpu will-change-transform",
                    "rounded-md", // Sharpened for consistency
                    "bg-gray-900 border border-white/10"
                )}
            >
                {/* 1. Full Bleed Image */}
                <div className="absolute inset-0">
                    <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 500px, 600px"
                    />
                </div>

                {/* 2. Dark Fade Overlay (The 'shadow dark fade') */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* 3. Number Badge */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-lg z-20">
                    {index + 1}
                </div>

                {/* 4. Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                        <h3 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">
                            {item.title}
                        </h3>

                        <div className="h-1.5 bg-white/20 rounded-full mb-4 w-12 group-hover:w-24 group-hover:bg-[linear-gradient(90deg,#3b82f6_0%,#3b82f6_80%,#f8fafc_100%)] transition-all duration-500" />

                        <p className="text-white/80 font-medium text-xl leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
})

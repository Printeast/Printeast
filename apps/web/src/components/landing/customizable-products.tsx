"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

const PRODUCT_ITEMS = [
    {
        id: "1",
        title: "Apparel",
        description: "Premium cotton & blends.",
        src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        className: "bg-[#F3F4F6] text-gray-900", // Soft Grey
    },
    {
        id: "2",
        title: "Drinkware",
        description: "Ceramics & travel mugs.",
        src: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop",
        className: "bg-[#0B3B44] text-white", // Deep Teal (Reference Style)
    },
    {
        id: "3",
        title: "Tech Gear",
        description: "Cases & sleeves.",
        src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
        className: "bg-[#E0CCF7] text-gray-900", // Soft Lavender (Reference Style)
    },
    {
        id: "4",
        title: "Wall Art",
        description: "Posters & canvases.",
        src: "https://plus.unsplash.com/premium_photo-1706152482956-ab99f887763f?q=80&w=687&auto=format&fit=crop",
        className: "bg-[#291C16] text-white", // Dark Espresso
    },
    {
        id: "5",
        title: "Accessories",
        description: "Totes & lifestyle.",
        src: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop",
        className: "bg-[#D4E5D4] text-gray-900", // Sage Green (Reference Style)
    },
    {
        id: "6",
        title: "Stationery",
        description: "Stickers & notebooks.",
        src: "https://images.unsplash.com/photo-1587937533554-8b9078d6e8c0?q=80&w=1170&auto=format&fit=crop",
        className: "bg-[#FFDBC8] text-gray-900", // Soft Peach
    },
]

export function CustomizableProducts() {
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Horizontal scroll logic matching request
    // Added 0.2 delay (gap) before the horizontal movement starts
    const x = useTransform(scrollYProgress, [0.2, 1], ["0%", "-50%"])

    return (
        <section
            ref={containerRef}
            className="relative bg-transparent"
            style={{ height: "400vh" }}
        >
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center py-10">
                <div className="relative z-10 px-6 lg:px-16 container mx-auto mb-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-slate-900">
                            CUSTOMIZABLE <span className="text-blue-600">PRODUCTS</span>
                        </h2>
                        <p className="text-sm md:text-base text-slate-500 max-w-2xl font-medium leading-relaxed mt-4">
                            Handpick best-sellers across apparel, lifestyle, and accessories. Mix, match, and publish in minutes with on-brand mockups.
                        </p>
                    </motion.div>
                </div>

                {/* Horizontal Scrolling Track */}
                <div className="relative w-full pl-6 lg:pl-16 py-4" ref={scrollContainerRef}>
                    <motion.div
                        style={{ x }}
                        className="flex gap-8 w-max px-4 will-change-transform"
                    >
                        {PRODUCT_ITEMS.map((item, index) => (
                            <ProductCard key={item.id} item={item} index={index} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function ProductCard({ item, index }: { item: typeof PRODUCT_ITEMS[0], index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={cn(
                "group relative w-[400px] h-[380px] lg:w-[450px] lg:h-[440px] flex-shrink-0 rounded-2xl p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500",
                item.className
            )}
        >
            {/* Header Content */}
            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">{item.title}</h3>
                    <span className="text-sm font-bold opacity-50 border border-current px-3 py-1 rounded-full whitespace-nowrap">
                        0{index + 1}
                    </span>
                </div>
                <p className="text-xl font-bold opacity-70 leading-relaxed max-w-[90%] uppercase tracking-tight">
                    {item.description}
                </p>
            </div>

            {/* Floating Image Widget - Restored Style */}
            <div className="relative w-full h-[62%] mt-auto group-hover:scale-[1.02] transition-transform duration-700 cubic-bezier(0.25, 1, 0.5, 1)">
                <div className="absolute inset-0 rounded-xl overflow-hidden shadow-inner bg-black/5">
                    <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        sizes="(max-width: 768px) 400px, 450px"
                    />

                    <div className="absolute inset-0 ring-1 ring-black/5 rounded-xl" />
                </div>

                <div className="absolute bottom-5 right-5 bg-white/30 backdrop-blur-md text-current px-5 py-2.5 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 uppercase">
                    Explore
                </div>
            </div>
        </motion.div>
    )
}

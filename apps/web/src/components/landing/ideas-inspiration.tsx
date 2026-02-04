"use client"

import { useRef, useState, memo, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useTranslations } from "next-intl"

// Types
interface HotspotItem {
    x: number;
    y: number;
    label: string;
    image?: string;
    price?: string;
    category?: string;
}

interface InspirationItem {
    id: string;
    title: string;
    category: string;
    image: string;
    colSpan: string;
    rowSpan: string;
    hotspots: HotspotItem[];
}

export function IdeasInspiration() {
    const t = useTranslations('IdeasInspiration');
    const containerRef = useRef(null)

    // Data for the grid constructed with translations
    const INSPIRATION_ITEMS: InspirationItem[] = useMemo(() => [
        {
            id: "phone-cases",
            title: t('items.phoneCases.title'),
            category: t('items.phoneCases.category'),
            image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/phone-case.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9waG9uZS1jYXNlLnBuZyIsImlhdCI6MTc3MDIxMjIyMywiZXhwIjoxNzcyODA0MjIzfQ.-Guwqq590D3o2lSN2Wo-3j2Fy1Fc7WsHM7R2l1tHBTM",
            colSpan: "col-span-12 md:col-span-4",
            rowSpan: "row-span-1 md:row-span-2",
            hotspots: [
                { x: 78, y: 48, label: t('items.phoneCases.hotspots.toughCase'), image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/phone-case-product.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9waG9uZS1jYXNlLXByb2R1Y3QucG5nIiwiaWF0IjoxNzY5Mjg2MzI5LCJleHAiOjE3NzE4NzgzMjl9.BsKLnwU5RDNk_ewNL6WbsbSupFRtKIhz18W0irWkvD8", price: "$18.99", category: t('items.phoneCases.hotspotCategories.mobile') },
                { x: 35, y: 75, label: t('items.phoneCases.hotspots.cozySweater'), image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/sweater-product.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9zd2VhdGVyLXByb2R1Y3QucG5nIiwiaWF0IjoxNzY5Mjg4NzQ0LCJleHAiOjE3NzE4ODA3NDR9.t_11XIQxk2uHDLCiRIzWX5gDKl69f-UbN6JiuNB5Byg", price: "$49.99", category: t('items.phoneCases.hotspotCategories.apparel') }
            ],
        },
        {
            id: "family-group",
            title: t('items.familyGroup.title'),
            category: t('items.familyGroup.category'),
            image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/family-group.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9mYW1pbHktZ3JvdXAucG5nIiwiaWF0IjoxNzY5NDU0Mjg5LCJleHAiOjE3NzIwNDYyODl9.RhNAVdti9oFz9KupozhvYSyuZTJQFT7uzWUEmh_b4_M",
            colSpan: "col-span-12 md:col-span-8",
            rowSpan: "row-span-1",
            hotspots: [
                {
                    x: 44, y: 45, label: t('items.familyGroup.hotspots.cap'),
                    image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/family-group-product-cap.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9mYW1pbHktZ3JvdXAtcHJvZHVjdC1jYXAucG5nIiwiaWF0IjoxNzY5NDUzMDMzLCJleHAiOjE3NzIwNDUwMzN9.ZiryL7LSyfST0Q5Q3AeAtKIv0MGF_KmiCMGlqE2D6fM",
                    price: "$14.99", category: t('items.familyGroup.hotspotCategories.apparel')
                },
                {
                    x: 54, y: 55, label: t('items.familyGroup.hotspots.apron'),
                    image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/family-group-product-apron.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9mYW1pbHktZ3JvdXAtcHJvZHVjdC1hcHJvbi5wbmciLCJpYXQiOjE3Njk0NTMzNjgsImV4cCI6MTc3MjA0NTM2OH0.wQa3puYWkLre2z9zjEE0xm5b3jSMFlXeh0IHxURBECg",
                    price: "$28.00", category: t('items.familyGroup.hotspotCategories.home')
                },
                {
                    x: 64, y: 38, label: t('items.familyGroup.hotspots.mug'),
                    image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/family-group-product-mug.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9mYW1pbHktZ3JvdXAtcHJvZHVjdC1tdWcucG5nIiwiaWF0IjoxNzY5NDUzMDUxLCJleHAiOjE3NzIwNDUwNTF9.CWf3LjJsUwoH-ACjOhKnYuuPgXm5eZeCS0CAa0RRVgQ",
                    price: "$12.99", category: t('items.familyGroup.hotspotCategories.drinkware')
                },
                {
                    x: 63, y: 80, label: t('items.familyGroup.hotspots.jumpsuit'),
                    image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/family-group-product-todler.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9mYW1pbHktZ3JvdXAtcHJvZHVjdC10b2RsZXIucG5nIiwiaWF0IjoxNzY5NDUzMzk3LCJleHAiOjE3NzIwNDUzOTd9.xBOlSbRRLYtTk7u6Kxg-MKm387CUEzRQPxjJlmgKX9Y",
                    price: "$22.50", category: t('items.familyGroup.hotspotCategories.kids')
                },
            ],
        },
        {
            id: "pet-accessories",
            title: t('items.petAccessories.title'),
            category: t('items.petAccessories.category'),
            image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/dog-jacket.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9kb2ctamFja2V0LnBuZyIsImlhdCI6MTc2OTI4OTQ2NywiZXhwIjoxNzcxODgxNDY3fQ.-IikRkpu6bwNpD051j-n92Mf2Di0H5NvKeP9sPUD5LI",
            colSpan: "col-span-12 md:col-span-4",
            rowSpan: "row-span-1",
            hotspots: [{
                x: 40,
                y: 55,
                label: t('items.petAccessories.hotspots.jacket'),
                image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/dog-jacket-product.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9kb2ctamFja2V0LXByb2R1Y3QucG5nIiwiaWF0IjoxNzY5Mjg5NDQ0LCJleHAiOjE3NzE4ODE0NDR9.bOqszu92gND-Qh-_0SKnWqNgsTO4YEDLhZ3tRwOS0gM",
                price: "$32.99",
                category: t('items.petAccessories.hotspotCategories.wear')
            }],
        },
        {
            id: "shopping-bag",
            title: t('items.ecoBags.title'),
            category: t('items.ecoBags.category'),
            image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/shoping-bag.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9zaG9waW5nLWJhZy5wbmciLCJpYXQiOjE3Njk0MjE2OTUsImV4cCI6MTc3MjAxMzY5NX0.--4TI03sWNGC5Q2qxQRLo5n6Nvin70v_JSk04H5FLFI",
            colSpan: "col-span-12 md:col-span-4",
            rowSpan: "row-span-1",
            hotspots: [{
                x: 45,
                y: 25,
                label: t('items.ecoBags.hotspots.bag'),
                image: "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/shoping-bag-product.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9zaG9waW5nLWJhZy1wcm9kdWN0LnBuZyIsImlhdCI6MTc2OTQyMTM2MiwiZXhwIjoxNzcyMDEzMzYyfQ.2DJOKoK1DKD8PtyBIp-sHPZxyxkL0ya-hzy6wG1dIEw",
                price: "$14.99",
                category: t('items.ecoBags.hotspotCategories.bags')
            }],
        },
    ], [t])

    return (
        <section ref={containerRef} className="relative py-32 bg-transparent overflow-hidden transform-gpu">
            <div className="container relative z-10 mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-slate-900 mb-6 transform-gpu">
                            {t.rich('title', {
                                blue: (chunks) => <span className="text-blue-600">{chunks}</span>
                            })}
                        </h2>
                        <p className="text-sm md:text-base text-slate-500 max-w-2xl font-medium leading-relaxed mx-auto mt-4">
                            {t('subtitle')}
                        </p>
                    </motion.div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px] max-w-6xl mx-auto">
                    {INSPIRATION_ITEMS.map((item, index) => (
                        <BentoCard key={item.id} item={item} index={index} t={t} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const BentoCard = memo(({ item, index, t }: { item: InspirationItem; index: number; t: any }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "relative group rounded-md bg-base-card transition-all duration-500 ease-out border border-white/20 hover:z-50 transform-gpu",
                item.colSpan,
                item.rowSpan
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Clipping Container for Image and Content */}
            <div className="absolute inset-0 rounded-md overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute inset-0 w-full h-full transform-gpu"
                        style={{ scale: isHovered ? 1.05 : 1 }}
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out will-change-transform"
                            loading={index === 0 ? "eager" : "lazy"}
                            priority={index === 0}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            unoptimized
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 transform-gpu">
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-medium text-white/90 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                            {item.category}
                        </span>
                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">{item.title}</h4>

                        <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-500">
                            <button className="mt-4 flex items-center gap-2 text-sm font-medium text-white hover:text-primary-pink transition-colors group/btn">
                                {t('startDesigning')} <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hotspots */}
            <AnimatePresence>
                {item.hotspots.map((hotspot: HotspotItem, idx: number) => (
                    <Hotspot
                        key={idx}
                        x={hotspot.x}
                        y={hotspot.y}
                        label={hotspot.label}
                        image={hotspot.image || ""}
                        price={hotspot.price || ""}
                        category={hotspot.category || ""}
                        isParentHovered={isHovered}
                        t={t}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    )
})

const Hotspot = memo(({ x, y, label, image, price, category, t }: { x: number; y: number; label: string; image?: string; price?: string; category?: string; isParentHovered: boolean; t: any }) => {

    return (
        <div
            className="absolute z-20"
            style={{ left: `${x}%`, top: `${y}%` }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
                className="relative transform-gpu"
            >
                <div className="relative group/hotspot">
                    {/* Pulsing ring */}
                    <div className="absolute -inset-2 rounded-full bg-white/30 animate-ping opacity-60" />

                    {/* Hotspot Icon */}
                    <div className="relative w-3 h-3 flex items-center justify-center transform transition-transform duration-300 group-hover/hotspot:scale-125 cursor-pointer transform-gpu">
                        <Image
                            src="/assets/rec.png"
                            alt="Hotspot"
                            fill
                            className="object-contain brightness-0 invert"
                            sizes="12px"
                        />
                    </div>

                    {/* Creative Preview Card */}
                    <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-[200px] opacity-0 group-hover/hotspot:opacity-100 translate-y-4 group-hover/hotspot:-translate-y-2 pointer-events-none transition-all duration-500 ease-out z-50">
                        <div className="relative bg-white/95 backdrop-blur-xl rounded-md border border-white/20 overflow-hidden transform group-hover/hotspot:scale-100 scale-95 origin-bottom transition-transform duration-300 transform-gpu">

                            {/* Product Image Section */}
                            {image && (
                                <div className="relative w-full h-[120px] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-3">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
                                    <Image
                                        src={image}
                                        alt={label}
                                        fill
                                        className="object-contain transform group-hover/hotspot:scale-110 transition-transform duration-700 p-3"
                                        loading="lazy"
                                        sizes="180px"
                                        unoptimized
                                    />
                                </div>
                            )}

                            {/* Product Details Section */}
                            <div className="p-4 text-left">
                                {category && (
                                    <p className="text-[9px] font-bold tracking-widest text-primary-pink uppercase mb-1">{category}</p>
                                )}
                                <h4 className="text-sm font-bold text-gray-900 leading-tight mb-2">{label}</h4>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-1">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-gray-500 font-medium">{t('startsFrom')}</span>
                                        <span className="text-xs font-bold text-gray-900">{price || "$0.00"}</span>
                                    </div>
                                    <button
                                        className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:bg-primary-pink transition-colors"
                                        aria-label="View product details"
                                    >
                                        <ArrowRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* Triangle Indicator */}
                            <div className="absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 backdrop-blur-xl border border-white/20 transform rotate-45 border-t-0 border-l-0" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
})

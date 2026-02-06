"use client";

import { ShieldCheck, Sparkles } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const FeaturesGrid = dynamic(() => import("./features-grid").then(mod => mod.FeaturesGrid), {
    loading: () => <div className="w-full h-[600px] bg-slate-50/50 rounded-xl" />
})
import { useTranslations } from 'next-intl';

interface ImageCarouselHeroProps {
    // ctaText removed
}

export function ImageCarouselHero({ }: ImageCarouselHeroProps) {
    const t = useTranslations('Hero');

    return (
        <div className="relative w-full min-h-screen bg-transparent flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 pb-32">

            {/* Main Content Area - Centered Layout */}
            <div className="flex-1 relative z-10 flex flex-col items-center text-center px-4 lg:px-8 pt-48 pb-12 max-w-[1600px] mx-auto w-full will-change-transform">

                <div className="flex flex-col items-center w-full">
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-[#111827] leading-none tracking-tight mb-6 whitespace-nowrap transform-gpu">
                        {t.rich('title', {
                            blue: (chunks) => <span className="text-blue-600">{chunks}</span>
                        })}
                    </h1>

                    <p className="text-sm sm:text-base text-slate-500 mb-8 font-medium leading-relaxed md:whitespace-nowrap">
                        {t('subtitle')}
                    </p>

                    <div className="flex flex-col items-center mb-16">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link
                                href="/dashboard"
                                prefetch={true}
                                className="px-8 py-3 rounded-md bg-gray-900 text-white font-bold text-base transition-all duration-300 hover:bg-blue-600 hover:scale-105 flex items-center justify-center"
                            >
                                {t('buttons.createFree')}
                            </Link>

                            <Link
                                href="/custom-dashboard"
                                className="px-8 py-3 rounded-md bg-white text-gray-900 border border-gray-300 font-bold text-base transition-all duration-300 hover:border-blue-600 hover:text-blue-600 hover:bg-white hover:scale-105 flex items-center justify-center"
                            >
                                {t('buttons.startSelling')}
                            </Link>
                        </div>

                        <div className="flex flex-row gap-6 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-widest justify-center">
                            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-500" /> {t('badges.noCreditCard')}</span>
                            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-green-500" /> {t('badges.freeForever')}</span>
                        </div>
                    </div>

                    {/* Features Bento Grid */}
                    <div className="w-full">
                        <FeaturesGrid />
                    </div>
                </div>

            </div>
        </div>
    )
}

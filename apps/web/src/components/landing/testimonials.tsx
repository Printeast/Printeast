"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote, Star, StarHalf } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// --- Mock Data ---

const REVIEWS = [
    {
        id: 1,
        name: "Marcus Chen",
        role: "Digital Artist & Seller",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&h=800",
        quote: "Honestly, I was skeptical about another POD site. But the print quality on the heavy cotton tees? Actually insane. My returns dropped to basically zero.",
        stats: { label: "Rating", value: "4.9" },
        rating: 4.9,
        tags: ["Print Quality", "Art"]
    },
    {
        id: 2,
        name: "Sarah Jenkins",
        role: "Eco-Brand Founder",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800&h=800",
        quote: "The sustainability claims are actually legit. I ordered samples first—the organic texture is perfect. Shipping to Europe took a day longer than expected, but the quality made it worth it.",
        stats: { label: "Rating", value: "4.7" },
        rating: 4.7,
        tags: ["Legit Eco", "Quality"]
    },
    {
        id: 3,
        name: "David Miller",
        role: "Content Creator",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800&h=800",
        quote: "I'm not a tech guy, so the dashboard saved my life. Set up my entire merch line in an afternoon. Had one issue with a graphic, but support fixed it in like 10 mins.",
        stats: { label: "Rating", value: "4.9" },
        rating: 4.9,
        tags: ["Easy Setup", "Support"]
    },
    {
        id: 4,
        name: "Elena Rodriguez",
        role: "Dropshipper",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800&h=800",
        quote: "The profit margins here are just better. I've tried four other platforms, but Printeast is the only one where I'm not eating costs on 'surprise' shipping fees. It's stable.",
        stats: { label: "Rating", value: "4.8" },
        rating: 4.8,
        tags: ["Profits", "Reliable"]
    }
]

export function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    // Auto-advance logic
    useEffect(() => {
        if (!isAutoPlaying) return

        const timer = setInterval(() => {
            handleNext()
        }, 6000)

        return () => clearInterval(timer)
    }, [currentIndex, isAutoPlaying])

    const handleNext = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % REVIEWS.length)
    }

    const handlePrev = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length)
    }

    const currentReview = REVIEWS[currentIndex]!

    // Animation Variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeInOut" as const
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -50 : 50,
            opacity: 0,
            scale: 1.05,
            transition: {
                duration: 0.4,
                ease: "easeInOut" as const
            }
        })
    }

    const textVariants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 0.2 } },
        exit: { y: -20, opacity: 0, transition: { duration: 0.3 } }
    }

    // Helper to render stars based on rating
    const renderStars = (rating: number) => {
        const stars = []
        // Logic: Ratings >= 4.8 get full 5 stars. Ratings between 4.3 and 4.7 get 4.5 stars.
        const effectiveRating = rating >= 4.8 ? 5 : (rating >= 4.3 ? 4.5 : 4)

        const fullStars = Math.floor(effectiveRating)
        const hasHalfStar = effectiveRating % 1 !== 0

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
        }
        if (hasHalfStar) {
            stars.push(<div key="half" className="relative w-4 h-4 text-yellow-400">
                <Star className="w-4 h-4 absolute inset-0 text-yellow-400 opacity-30" />
                <StarHalf className="w-4 h-4 absolute inset-0 fill-yellow-400 text-yellow-400" />
            </div>)
        }
        return stars
    }


    return (
        <section className="relative w-full py-32 bg-slate-50 overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[1200px] h-[1200px] bg-blue-100/40 rounded-full blur-[150px] mix-blend-multiply opacity-70" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-cyan-100/30 rounded-full blur-[120px] mix-blend-multiply opacity-60" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">

                {/* Section Header */}
                <div className="mb-20 text-center">
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-[0.95] text-slate-900">
                        REAL TALK FROM
                        <span className="text-blue-600"> REAL CREATORS</span>
                    </h2>
                </div>

                {/* Main Slider Container - Increased Width */}
                <div
                    className="max-w-6xl mx-auto hidden md:block" // Desktop View
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="relative bg-white rounded-2xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden group/card hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] transition-shadow duration-500">

                        <div className="grid lg:grid-cols-2 min-h-[550px]">

                            {/* Left: Image Side - Cinematic & Interactive */}
                            <div className="relative h-full overflow-hidden bg-zinc-950">
                                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                                    <motion.div
                                        key={currentReview.id}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0 w-full h-full will-change-transform"
                                    >
                                        <Image
                                            src={currentReview.image}
                                            alt={currentReview.name}
                                            fill
                                            className="object-cover opacity-90 transition-transform duration-[2s] hover:scale-105 will-change-transform"
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                        />

                                        {/* Bottom Fade Gradient */}
                                        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/70 to-transparent" />
                                        {/* Cinematic Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent mix-blend-multiply" />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Floating Stats Badge - CHANGED TO STARS */}
                                <div className="absolute bottom-8 left-8 z-20">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentReview.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ delay: 0.3 }}
                                            className="bg-black/60 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Rating</span>
                                                <div className="flex gap-1 items-center h-4">
                                                    {renderStars(currentReview.rating)}
                                                </div>
                                            </div>
                                            <div className="h-8 w-[1px] bg-white/10" />
                                            <span className="text-xl font-bold text-white">{currentReview.stats.value}</span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Right: Content Side - Spacious & Elegant */}
                            <div className="relative p-12 lg:p-16 flex flex-col justify-center bg-white">
                                {/* Large Decorative Quote - MOVED TO RIGHT & DARKER */}
                                <div className="absolute top-8 right-8 text-black opacity-[0.08] pointer-events-none select-none">
                                    <Quote size={180} />
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentReview.id}
                                        variants={textVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        className="relative z-10"
                                    >
                                        {/* Tags */}
                                        <div className="flex gap-2 mb-8">
                                            {currentReview.tags.map((tag, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-widest border border-slate-100 shadow-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Main Quote */}
                                        <blockquote className="text-xl md:text-2xl font-bold text-slate-800 leading-[1.3] tracking-tight mb-10">
                                            "{currentReview.quote}"
                                        </blockquote>

                                        {/* Author Info */}
                                        <div className="flex items-center justify-between border-t border-slate-100 pt-8">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-slate-100 shadow-sm">
                                                    <Image src={currentReview.image} alt={currentReview.name} fill className="object-cover grayscale opacity-80" sizes="50px" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 leading-tight">{currentReview.name}</h4>
                                                    <p className="text-sm text-slate-500 font-medium">{currentReview.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation - Floating Bottom Right */}
                                <div className="absolute bottom-12 right-12 flex gap-3 z-20">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-xl w-12 h-12 border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-white text-slate-400 hover:text-slate-900 transition-all hover:scale-105"
                                        onClick={handlePrev}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="rounded-xl w-12 h-12 bg-slate-900 hover:bg-black text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
                                        onClick={handleNext}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Mobile View Placeholder for simplicity, using same logic but stacked */}
                <div className="md:hidden">
                    <div className="relative bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                        <div className="relative h-[300px] overflow-hidden">
                            <Image src={currentReview.image} alt={currentReview.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <p className="font-bold text-lg">{currentReview.name}</p>
                                <p className="text-sm opacity-80">{currentReview.role}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-lg font-bold text-slate-800 mb-4">"{currentReview.quote}"</p>
                            <div className="flex justify-between items-center">
                                <Button onClick={handlePrev} size="sm" variant="ghost"><ChevronLeft /></Button>
                                <Button onClick={handleNext} size="sm" variant="default" className="rounded-xl"><ChevronRight /></Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

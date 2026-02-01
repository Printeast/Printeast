"use client";

import { motion } from "framer-motion";
import { ImageSlider } from "@/components/ui/image-slider";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    images?: string[];
}

export function AuthLayout({ children, subtitle, images = [] }: AuthLayoutProps) {
    const defaultImages = [
        "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/auth-bg-1.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9hdXRoLWJnLTEud2VicCIsImlhdCI6MTc2OTE3ODc1MSwiZXhwIjoxNzcxNzcwNzUxfQ.4nTQoltqnDD6Jszo75geUgsKrFMDk5d2Jzi76lPkgQc",
        "https://gkscoxpxoiggeeoegyac.supabase.co/storage/v1/object/sign/creator-assets/auth-bg-2.webp.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV84ZGZhMmNiMC0xZDY5LTQyNmItYTdjZi1kNjZhZGE0MGY0MDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjcmVhdG9yLWFzc2V0cy9hdXRoLWJnLTIud2VicC5wbmciLCJpYXQiOjE3NjkxNzkxNTEsImV4cCI6MTc3MTc3MTE1MX0.mInXZTaNMKTRWn2qbaus6g2x1Mvc0Ilu_t69GACIm2Y",
    ];

    const displayImages = images.length > 0 ? images : defaultImages;

    return (
        <div className="min-h-screen w-full flex bg-base-bg font-inter text-text-main selection:bg-primary-pink selection:text-white">
            {/* Left Side: Marketing Canvas */}
            <div className="hidden lg:flex w-1/2 relative bg-[#050505] items-center justify-center p-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.4, 1],
                            rotate: [0, 45, 0],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[20%] -right-[20%] w-[1000px] h-[1000px] bg-gradient-to-br from-blue-600/20 via-blue-400/10 to-transparent blur-[120px] rounded-full"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-[92%] max-w-[95%] shadow-2xl perspective-1000"
                >
                    <div className="relative w-full h-full rounded-[2.5rem] bg-[#111] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border border-white/10 ring-1 ring-white/5 backdrop-blur-sm overflow-hidden transform-gpu">
                        <div className="absolute inset-0 rounded-[2rem] bg-black overflow-hidden z-10 w-full h-full">
                            <ImageSlider images={displayImages} interval={5000} />
                            <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/95 via-black/40 to-transparent/0" />
                            <div className="absolute bottom-16 left-12 z-40 max-w-xl">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                >
                                    <h2 className="text-6xl font-extrabold mb-6 font-poppins text-white tracking-tight leading-tight">
                                        Create without <br />
                                        limits <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-100">journey.</span>
                                    </h2>
                                    {subtitle && (
                                        <p className="text-white/60 text-xl max-w-md font-light leading-relaxed mb-8">
                                            {subtitle}
                                        </p>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Action Zone */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-6 bg-white lg:bg-[#F9F8F6] overflow-hidden">
                <div className="w-full max-w-[480px] bg-white lg:bg-transparent p-6 lg:p-4 rounded-3xl lg:rounded-none flex flex-col justify-center min-h-0">
                    {children}
                </div>
            </div>
        </div>
    );
}

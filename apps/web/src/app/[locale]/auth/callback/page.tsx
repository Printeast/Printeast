"use client";

import { useEffect, Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/browser";
import { api } from "@/services/api.service";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Zap, Box, Star } from "lucide-react";

/**
 * Clean & Engaging Auth Callback
 * Handles: PKCE Exchange -> Role Sync -> Dashboard Dispatch
 */
function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const processStarted = useRef(false);
    const [status, setStatus] = useState("Securing access");

    useEffect(() => {
        const handleAuthFlow = async () => {
            if (processStarted.current) return;
            processStarted.current = true;

            const supabase = createClient();
            const code = searchParams.get("code");

            try {
                // 1. Exchange PKCE code if present
                if (code) {
                    setStatus("Verifying identity");
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;
                }

                // 2. Wait for session to persist
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    setStatus("Identity Confirmed");
                    // Sync with backend and decide destination
                    await determineDestination();
                } else {
                    router.push("/login?error=no_session");
                }
            } catch (err) {
                console.error("[Auth Callback Error]:", err);
                router.push("/login?error=auth_failed");
            }
        };

        const determineDestination = async () => {
            setStatus("Preparing workspace");
            try {
                const res = await api.get("/auth/me");
                if (res.success && res.data) {
                    setStatus("Personalizing experience");
                    const user = (res.data as any).user || res.data;
                    const roleName = user?.roles?.[0]?.role?.name || "CUSTOMER";

                    // Simple dispatch logic
                    const rolePathMap: Record<string, string> = {
                        "ADMIN": "tenant-admin",
                        "TENANT_ADMIN": "tenant-admin",
                        "SELLER": "seller",
                        "CREATOR": "creator",
                        "CUSTOMER": "customer"
                    };

                    const path = rolePathMap[roleName] || "onboarding";


                    // If they are a basic customer, we show onboarding first
                    // unless they've "Skipped" it before (Phase 0 logic)
                    const finalPath = (roleName === "CUSTOMER") ? "onboarding" : path;

                    router.push(`/${finalPath}`);
                } else {
                    router.push("/onboarding");
                }
            } catch (e) {
                router.push("/onboarding");
            }
        };

        handleAuthFlow();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 text-center select-none cursor-wait overflow-hidden relative">
            {/* Background Decorative Doodles */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[15%] left-[10%] text-blue-500"
                >
                    <Palette size={48} strokeWidth={1} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[20%] left-[15%] text-pink-500"
                >
                    <Box size={40} strokeWidth={1} />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[12%] text-orange-400"
                >
                    <Zap size={36} strokeWidth={1} />
                </motion.div>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[15%] right-[10%] text-indigo-400"
                >
                    <Star size={44} strokeWidth={1} />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                {/* Brand Logo Loader */}
                <div className="relative w-24 h-24 mb-10 mx-auto">
                    <div className="absolute inset-0 bg-white rounded-[2rem] border border-neutral-100 shadow-xl flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-neutral-900 w-12 h-12 rounded-2xl flex items-center justify-center"
                        >
                            <span className="text-white font-black text-2xl font-poppins">P</span>
                        </motion.div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-neutral-900 text-3xl font-bold tracking-tight font-poppins">
                        Printeast
                    </h2>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={status}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 0.5, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-neutral-900 font-mono text-[9px] uppercase tracking-[0.5em] font-medium"
                        >
                            {status}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Micro Progress Bar */}
            <div className="mt-16 w-40 h-1 bg-neutral-100 rounded-full relative overflow-hidden">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-neutral-900"
                />
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={null}>
            <CallbackHandler />
        </Suspense>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api.service";
import { createClient } from "@/utils/supabase/browser";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Zap, Box, Star } from "lucide-react";

/**
 * Simple Dashboard Dispatcher
 * Redircts users based on their role:
 * - ADMIN/TENANT_ADMIN -> /tenant-admin
 * - SELLER -> /seller
 * - CREATOR -> /creator
 * - New/CUSTOMER -> /onboarding
 */
export default function DashboardPage() {
    const router = useRouter();
    const [statusText, setStatusText] = useState("Authenticating");

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            try {
                setStatusText("Preparing your workspace");
                const res = await api.get("/auth/me");

                if (res.success && res.data) {
                    const user = (res.data as any).user || res.data;
                    const roleName = user?.roles?.[0]?.role?.name || "CUSTOMER";

                    const rolePathMap: Record<string, string> = {
                        "ADMIN": "tenant-admin",
                        "TENANT_ADMIN": "tenant-admin",
                        "SELLER": "seller",
                        "CREATOR": "creator",
                        "CUSTOMER": "customer"
                    };

                    const target = rolePathMap[roleName] || "onboarding";

                    // Simple rule: Basic customers go to onboarding first.
                    const finalPath = (roleName === "CUSTOMER") ? "onboarding" : target;

                    setTimeout(() => router.push(`/${finalPath}`), 800);
                } else {
                    router.push("/onboarding");
                }
            } catch (e) {
                console.error("[Dashboard] Initial fetch failed:", e);
                router.push("/onboarding");
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 text-center select-none cursor-wait overflow-hidden relative font-inter">
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10"
            >
                <h2 className="text-neutral-900 text-3xl font-bold tracking-tight mb-8 font-poppins">
                    Printeast
                </h2>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={statusText}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 0.4, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-neutral-900 font-mono text-[10px] uppercase tracking-[0.5em] font-medium"
                    >
                        {statusText}
                    </motion.p>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

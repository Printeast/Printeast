"use client";

import { motion } from "framer-motion";

export default function CreatorDashboard() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center p-6 text-center select-none font-inter">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-2"
            >
                <h1 className="text-neutral-900 text-4xl font-black tracking-tight font-poppins uppercase">
                    Creator Dashboard
                </h1>
                <p className="text-neutral-400 font-mono text-[10px] uppercase tracking-[0.4em]">
                    Work in progress
                </p>
            </motion.div>
        </div>
    );
}

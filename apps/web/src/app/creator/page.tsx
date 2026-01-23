"use client";

import { motion } from "framer-motion";

export default function CreatorDashboard() {
    return (
        <div className="min-h-screen bg-[#0a0a10] text-white p-8">
            <header className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-rose-400">
                        Creator Studio
                    </h1>
                    <p className="text-white/40">Welcome back, Artist.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all">
                        My Gallery
                    </button>
                    <button className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-rose-600 text-sm font-black shadow-lg shadow-purple-500/20">
                        New Design +
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stat Cards */}
                {[
                    { label: "Total Earnings", value: "$1,240.00", icon: "💰" },
                    { label: "Live Designs", value: "24", icon: "🎨" },
                    { label: "Monthly Sales", value: "158", icon: "📈" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-3xl bg-white/5 border border-white/10"
                    >
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <div className="text-white/40 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-3xl font-black">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <section className="mt-12">
                <h2 className="text-xl font-bold mb-6">Recent Creations</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <motion.div
                            key={item}
                            whileHover={{ scale: 1.05 }}
                            className="aspect-square rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <p className="text-xs font-bold text-white">Cyberpunk Tee v{item}</p>
                            </div>
                            <div className="w-full h-full flex items-center justify-center text-white/10 text-4xl font-black italic">
                                PRINTEAST
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}

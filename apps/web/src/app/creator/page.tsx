"use client";

import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";

const mockUser = getMockUser() || { email: "creator@printeast.test", role: "CREATOR" as const };

export default function CreatorDashboard() {
    const highlights = [
        { label: "Studio", value: "8 live", accent: "from-cyan-400 to-blue-500", desc: "Drafts + published designs" },
        { label: "Portfolio", value: "24 items", accent: "from-purple-400 to-rose-500", desc: "Curated works across drops" },
        { label: "Earnings", value: "$4,280", accent: "from-amber-400 to-orange-500", desc: "Last 30 days" },
    ];

    const pipeline = [
        { title: "Neon Bloom Hoodie", stage: "Ready to ship", progress: 92 },
        { title: "Solarpunk Poster", stage: "In review", progress: 68 },
        { title: "Chromatic Tee", stage: "Generating variants", progress: 44 },
    ];

    const earnings = [
        { label: "Today", value: "$180" },
        { label: "This week", value: "$1,140" },
        { label: "This month", value: "$4,280" },
    ];

    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Creator</p>
                        <h1 className="text-3xl font-black text-white">Studio Control</h1>
                        <p className="text-slate-400 mt-1">Design, launch, and track performance in one place.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition">Import from Figma</button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30">New Design</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {highlights.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="rounded-2xl border border-white/5 bg-white/5 p-4"
                        >
                            <div className={`inline-flex rounded-full bg-gradient-to-r ${item.accent} px-3 py-1 text-xs font-bold text-white`}>{item.label}</div>
                            <div className="mt-4 text-3xl font-black">{item.value}</div>
                            <p className="text-slate-300 text-sm mt-2">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pipeline</p>
                                <h3 className="text-xl font-bold">Production flow</h3>
                            </div>
                            <button className="text-xs font-semibold text-primary-pink">View all</button>
                        </div>
                        <div className="space-y-4">
                            {pipeline.map((item) => (
                                <div key={item.title} className="rounded-xl border border-white/5 bg-black/20 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-semibold">{item.title}</p>
                                            <p className="text-xs text-slate-400">{item.stage}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-primary-orange">{item.progress}%</span>
                                    </div>
                                    <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                                        <div className="h-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink" style={{ width: `${item.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="mb-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Earnings</p>
                            <h3 className="text-xl font-bold">Creator revenue</h3>
                        </div>
                        <div className="space-y-3">
                            {earnings.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-3 border border-white/5">
                                    <div className="text-slate-300">{item.label}</div>
                                    <div className="text-lg font-semibold text-white">{item.value}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-xs text-slate-400">Payouts every Friday · Taxes auto-handled</div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Recent creations</h3>
                        <button className="text-xs font-semibold text-primary-pink">Open studio</button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Neon Bloom", "Glass Wave", "Midnight Grid", "Solar Flare"].map((item, idx) => (
                            <motion.div
                                key={item}
                                whileHover={{ y: -4 }}
                                className="aspect-square rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-semibold text-sm">{item}</p>
                                        <p className="text-[11px] text-slate-300">Edition {idx + 1}</p>
                                    </div>
                                    <div className="text-[11px] px-2 py-1 rounded-full bg-white/10 border border-white/15">AI-ready</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

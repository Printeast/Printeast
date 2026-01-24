"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { motion } from "framer-motion";
import { LayoutGrid, FolderPlus, Filter } from "lucide-react";

const mockUser = getMockUser() || { email: "creator@printeast.test", role: "CREATOR" as const };

const collections = [
    { name: "Neon Bloom", items: 12, status: "Live", accent: "from-primary-orange to-primary-pink" },
    { name: "Glassworks", items: 8, status: "Draft", accent: "from-cyan-400 to-blue-500" },
    { name: "Monochrome", items: 16, status: "Live", accent: "from-slate-300 to-slate-500" },
];

const assets = [
    { title: "Chromatic Tee", type: "Apparel", updated: "2h ago", status: "Published" },
    { title: "Glass Wave Poster", type: "Wall Art", updated: "6h ago", status: "Pending" },
    { title: "Horizon Hoodie", type: "Apparel", updated: "1d ago", status: "Published" },
    { title: "Solar Gradient", type: "Print", updated: "2d ago", status: "Draft" },
];

export default function CreatorPortfolioPage() {
    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Portfolio</p>
                        <h1 className="text-3xl font-black text-white">Collections</h1>
                        <p className="text-slate-400 mt-1">Organize, version, and ship designs to storefronts.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30 flex items-center gap-2">
                            <FolderPlus className="h-4 w-4" /> New collection
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {collections.map((col, i) => (
                        <motion.div
                            key={col.name}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="rounded-2xl border border-white/5 bg-white/5 p-4"
                        >
                            <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${col.accent} text-white flex items-center justify-center mb-3`}>
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-semibold text-lg">{col.name}</p>
                                    <p className="text-sm text-slate-300">{col.items} assets</p>
                                </div>
                                <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs text-slate-200">{col.status}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Assets</p>
                            <h3 className="text-xl font-bold">All designs</h3>
                        </div>
                        <button className="text-xs font-semibold text-primary-pink">Export list</button>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-white/10">
                        <div className="grid grid-cols-4 bg-black/30 px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">
                            <span>Title</span>
                            <span>Type</span>
                            <span>Status</span>
                            <span className="text-right">Updated</span>
                        </div>
                        <div className="divide-y divide-white/10 bg-black/10">
                            {assets.map((asset) => (
                                <div key={asset.title} className="grid grid-cols-4 px-4 py-3 text-sm text-slate-100">
                                    <span className="font-semibold">{asset.title}</span>
                                    <span className="text-slate-300">{asset.type}</span>
                                    <span>
                                        <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold">{asset.status}</span>
                                    </span>
                                    <span className="text-right text-slate-300">{asset.updated}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Hook up backend to supply assets and statuses; actions can be wired to publish/duplicate/delete.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}

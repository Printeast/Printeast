"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { motion } from "framer-motion";
import { Palette, Layout, Globe2 } from "lucide-react";

const mockUser = getMockUser() || { email: "seller@printeast.test", role: "SELLER" as const };

const presets = [
    { name: "Neon", accent: "from-primary-orange to-primary-pink", desc: "Bold gradient CTA, glass cards" },
    { name: "Mono", accent: "from-slate-200 to-slate-500", desc: "Minimal, grayscale, editorial" },
    { name: "Aurora", accent: "from-cyan-400 to-blue-600", desc: "Calm, airy gradients" },
];

export default function SellerStorefrontPage() {
    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Storefront</p>
                        <h1 className="text-3xl font-black text-white">Brand & Experience</h1>
                        <p className="text-slate-400 mt-1">Theme presets, hero layouts, and domain controls.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2">
                            <Globe2 className="h-4 w-4" /> Connect domain
                        </button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30 flex items-center gap-2">
                            <Layout className="h-4 w-4" /> Publish theme
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {presets.map((preset, i) => (
                        <motion.div
                            key={preset.name}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="rounded-2xl border border-white/5 bg-white/5 p-4"
                        >
                            <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${preset.accent} text-white flex items-center justify-center mb-3`}>
                                <Palette className="h-5 w-5" />
                            </div>
                            <p className="text-lg font-semibold text-white">{preset.name}</p>
                            <p className="text-sm text-slate-300">{preset.desc}</p>
                            <button className="mt-3 text-xs font-semibold text-primary-pink">Preview</button>
                        </motion.div>
                    ))}
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Hero layout</h3>
                        <button className="text-xs font-semibold text-primary-pink">Customize</button>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="h-32 rounded-lg bg-white/10 border border-white/15" />
                            <div className="mt-3 h-3 w-24 rounded-full bg-white/20" />
                            <div className="mt-2 h-3 w-48 rounded-full bg-white/20" />
                        </div>
                        <div className="space-y-2 text-sm text-slate-200">
                            <p>Set hero headline, CTA, and background treatment. Backend can wire asset uploads and A/B variants.</p>
                            <p className="text-xs text-slate-400">Supports: Video, Gradient, Image.</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold">Domain & SEO</h3>
                        <button className="text-xs font-semibold text-primary-pink">Edit</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-200">
                        <div className="rounded-xl bg-black/20 border border-white/5 p-3">
                            <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Domain</p>
                            <p className="font-semibold">store.printeast.test</p>
                        </div>
                        <div className="rounded-xl bg-black/20 border border-white/5 p-3">
                            <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">SEO</p>
                            <p className="font-semibold">Meta title & description set</p>
                        </div>
                        <div className="rounded-xl bg-black/20 border border-white/5 p-3">
                            <p className="text-slate-400 text-xs uppercase tracking-[0.2em]">Social</p>
                            <p className="font-semibold">Open Graph image ready</p>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Backend can provide domain verification, OG upload, and sitemap endpoints.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}

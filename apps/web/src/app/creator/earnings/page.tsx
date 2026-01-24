"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { motion } from "framer-motion";
import { Wallet2, TrendingUp, Download } from "lucide-react";

const mockUser = getMockUser() || { email: "creator@printeast.test", role: "CREATOR" as const };

const payouts = [
    { period: "This week", amount: "$1,140", date: "Next Payout: Fri" },
    { period: "Last week", amount: "$980", date: "Paid: Fri" },
];

const breakdown = [
    { label: "Prints", value: "$1,820" },
    { label: "Apparel", value: "$1,420" },
    { label: "Collabs", value: "$1,040" },
];

const royalties = [
    { title: "Neon Bloom Hoodie", amount: "$240", status: "Clearing" },
    { title: "Solarpunk Poster", amount: "$180", status: "Paid" },
    { title: "Glass Wave Tee", amount: "$140", status: "Pending" },
];

export default function CreatorEarningsPage() {
    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Earnings</p>
                        <h1 className="text-3xl font-black text-white">Revenue & Royalties</h1>
                        <p className="text-slate-400 mt-1">Payout cadence, streams, and royalty pipeline.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2">
                            <Download className="h-4 w-4" /> Export CSV
                        </button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30 flex items-center gap-2">
                            <Wallet2 className="h-4 w-4" /> Request payout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Overview</p>
                                <h3 className="text-xl font-bold">Payout schedule</h3>
                            </div>
                            <TrendingUp className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {payouts.map((payout, i) => (
                                <motion.div
                                    key={payout.period}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    className="rounded-xl bg-black/20 border border-white/5 p-4"
                                >
                                    <div className="text-slate-300 text-xs uppercase tracking-[0.2em]">{payout.period}</div>
                                    <div className="text-3xl font-black mt-2">{payout.amount}</div>
                                    <div className="text-sm text-slate-300 mt-1">{payout.date}</div>
                                </motion.div>
                            ))}
                        </div>
                        <p className="mt-3 text-xs text-slate-400">Backend can plug payout frequency and transfer status here.</p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Streams</p>
                                <h3 className="text-xl font-bold">Breakdown</h3>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {breakdown.map((row) => (
                                <div key={row.label} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-3 border border-white/5">
                                    <div className="text-slate-300">{row.label}</div>
                                    <div className="text-lg font-semibold text-white">{row.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Royalties pipeline</h3>
                        <button className="text-xs font-semibold text-primary-pink">View history</button>
                    </div>
                    <div className="divide-y divide-white/10">
                        {royalties.map((r) => (
                            <div key={r.title} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-white font-semibold">{r.title}</p>
                                    <p className="text-xs text-slate-400">Royalty split configured</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-white">{r.amount}</span>
                                    <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-slate-200">{r.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Plug orders/royalties feed here; status badges are ready for backend-driven states.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}

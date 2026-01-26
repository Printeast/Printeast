"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { CreatorDashboardData } from "./_data";
import { Palette, Wallet2, TrendingUp, FolderOpen, ImageIcon } from "lucide-react";

interface Props {
    userEmail: string;
    data: CreatorDashboardData;
}

export function CreatorDashboardClient({ userEmail, data }: Props) {
    const { designs, ordersCount, payments, paymentsTotals, liveDesigns, draftDesigns } = data;

    const metrics = [
        { label: "Live designs", value: liveDesigns, icon: Palette },
        { label: "Drafts", value: draftDesigns, icon: FolderOpen },
        { label: "Orders", value: ordersCount, icon: TrendingUp },
        { label: "Paid", value: currency(paymentsTotals.paid), icon: Wallet2 },
    ];

    const recentDesigns = designs.slice(0, 6);
    const recentPayments = payments.slice(0, 6);

    return (
        <DashboardLayout user={{ email: userEmail || "creator", role: "CREATOR" }}>
            <div className="flex flex-col gap-8 text-white">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Creator</p>
                        <h1 className="text-3xl font-black text-white">Studio Control</h1>
                        <p className="text-slate-400 mt-1">Live signals from designs, orders, and payouts.</p>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {metrics.map((m, i) => {
                        const Icon = m.icon;
                        return (
                            <motion.div
                                key={m.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * i }}
                                className="rounded-2xl border border-white/5 bg-white/5 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{m.label}</div>
                                    <Icon className="h-4 w-4 text-slate-200" />
                                </div>
                                <div className="mt-3 text-2xl font-black">{m.value}</div>
                            </motion.div>
                        );
                    })}
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Recent designs</h2>
                            <span className="text-xs text-slate-400">Latest 6</span>
                        </div>
                        {recentDesigns.length === 0 ? (
                            <EmptyState title="No designs yet" subtitle="Create a design to see it here." />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentDesigns.map((d) => (
                            <motion.div
                                key={d.id}
                                whileHover={{ y: -3 }}
                                className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-4 flex flex-col gap-2"
                            >
                                        <div className="flex items-center justify-between text-xs text-slate-300">
                                            <span>{formatDate(d.created_at)}</span>
                                            <Badge text={d.status || "-"} tone={d.status?.toUpperCase() === "DRAFT" ? "warning" : "neutral"} />
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-white font-semibold">
                                            <ImageIcon className="h-4 w-4 text-slate-200" />
                                            {d.prompt_text ? truncate(d.prompt_text, 60) : "Untitled"}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Payments</h3>
                            <Badge text={`${recentPayments.length}`} tone="neutral" />
                        </div>
                        {recentPayments.length === 0 ? (
                            <EmptyState title="No payouts yet" subtitle="Payments will appear once orders are paid." compact />
                        ) : (
                            <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                                {recentPayments.map((p) => (
                                    <div key={p.id} className="rounded-xl bg-black/20 border border-white/5 p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-semibold text-sm">{currency(p.amount)}</p>
                                            <p className="text-[11px] text-slate-400">{formatDate(p.created_at)}</p>
                                        </div>
                                        <Badge text={p.status || "PENDING"} tone={p.status?.toUpperCase() === "PAID" ? "positive" : "warning"} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

type BadgeTone = "neutral" | "warning" | "positive";

function Badge({ text, tone = "neutral" }: { text: string; tone?: BadgeTone }) {
    const toneClass =
        tone === "warning"
            ? "bg-amber-500/20 border-amber-500/40 text-amber-100"
            : tone === "positive"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-100"
                : "bg-white/10 border-white/15 text-slate-100";
    return <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${toneClass}`}>{text}</span>;
}

function EmptyState({ title, subtitle, compact }: { title: string; subtitle: string; compact?: boolean }) {
    return (
        <div className={`rounded-2xl border border-dashed border-white/10 bg-black/10 text-slate-200 ${compact ? "p-4" : "p-6"}`}>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
    );
}

function currency(amount: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount || 0);
}

function formatDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncate(value: string, len: number) {
    return value.length > len ? `${value.slice(0, len)}…` : value;
}

"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { motion } from "framer-motion";
import { CreatorDashboardData } from "./_data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "@/components/ui/line-chart";
import { IconBrush, IconChart, IconDashboard, IconImage, IconWallet } from "@/components/ui/icons";

interface Props {
    userEmail: string;
    data: CreatorDashboardData;
}

export function CreatorDashboardClient({ userEmail, data }: Props) {
    const { designs, ordersCount, payments, paymentsTotals, liveDesigns, draftDesigns } = data;

    const metrics = [
        { label: "Live designs", value: liveDesigns, icon: IconBrush },
        { label: "Drafts", value: draftDesigns, icon: IconDashboard },
        { label: "Orders", value: ordersCount, icon: IconChart },
        { label: "Paid", value: currency(paymentsTotals.paid), icon: IconWallet },
    ];

    const recentDesigns = designs.slice(0, 6);
    const recentPayments = payments.slice(0, 6);
    const earningsSeries = buildDailySeries(payments.map((p) => ({ created_at: p.created_at, value: p.amount })), 7);
    const earningsSeriesTotal = earningsSeries.reduce((sum, s) => sum + s.value, 0);

    return (
        <DashboardLayout user={{ email: userEmail || "creator", role: "CREATOR" }}>
            <div className="flex flex-col gap-8 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Creator</p>
                        <h1 className="text-3xl font-black dash-text">Studio Control</h1>
                        <p className="dash-muted mt-1">Live signals from designs, orders, and payouts.</p>
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
                            >
                                <Card className="dash-panel-strong">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-[11px] uppercase tracking-[0.25em] dash-muted">{m.label}</div>
                                            <div className="h-9 w-9 rounded-full border dash-border dash-panel-strong flex items-center justify-center">
                                                <Icon className="h-4 w-4 dash-muted-strong" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-black tracking-tight">{m.value}</div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </section>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Earnings trend</CardTitle>
                                <p className="text-xs dash-muted">Last 7 days</p>
                            </div>
                            <Badge tone="info">{currency(earningsSeriesTotal)}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {earningsSeriesTotal === 0 ? (
                            <EmptyState title="No earnings yet" subtitle="Earnings chart appears once payments are received." />
                        ) : (
                            <LineChart data={earningsSeries} ariaLabel="Earnings over last 7 days" />
                        )}
                    </CardContent>
                </Card>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent designs</CardTitle>
                                    <p className="text-xs dash-muted">Latest 6</p>
                                </div>
                                <Badge tone="info">Live</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentDesigns.length === 0 ? (
                                <EmptyState title="No designs yet" subtitle="Create a design to see it here." />
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {recentDesigns.map((d) => (
                                        <motion.div
                                            key={d.id}
                                            whileHover={{ y: -3 }}
                                            className="rounded-2xl border dash-border dash-panel p-4 flex flex-col gap-2"
                                        >
                                            <div className="flex items-center justify-between text-xs dash-muted">
                                                <span>{formatDate(d.created_at)}</span>
                                                <Badge tone={d.status?.toUpperCase() === "DRAFT" ? "warning" : "neutral"}>{d.status || "-"}</Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm dash-text font-semibold">
                                                <IconImage className="h-4 w-4 dash-muted-strong" />
                                                {d.prompt_text ? truncate(d.prompt_text, 60) : "Untitled"}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Payments</CardTitle>
                                <Badge>{`${recentPayments.length}`}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentPayments.length === 0 ? (
                                <EmptyState title="No payouts yet" subtitle="Payments will appear once orders are paid." compact />
                            ) : (
                                <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                                    {recentPayments.map((p) => (
                                        <div key={p.id} className="rounded-xl border dash-border dash-panel p-3 flex items-center justify-between">
                                            <div>
                                                <p className="dash-text font-semibold text-sm">{currency(p.amount)}</p>
                                                <p className="text-[11px] dash-muted">{formatDate(p.created_at)}</p>
                                            </div>
                                            <Badge tone={p.status?.toUpperCase() === "PAID" ? "positive" : "warning"}>{p.status || "PENDING"}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </DashboardLayout>
    );
}

function EmptyState({ title, subtitle, compact }: { title: string; subtitle: string; compact?: boolean }) {
    return (
        <div className={`rounded-2xl border border-dashed dash-border dash-panel ${compact ? "p-4" : "p-6"}`}>
            <p className="font-semibold dash-text">{title}</p>
            <p className="text-sm dash-muted">{subtitle}</p>
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

function buildDailySeries(items: Array<{ created_at: string; value: number }>, days: number) {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const series: Array<{ label: string; value: number }> = [];
    const map = new Map<string, number>();

    items.forEach((item) => {
        const d = new Date(item.created_at);
        if (Number.isNaN(d.getTime())) return;
        const key = d.toISOString().slice(0, 10);
        map.set(key, (map.get(key) || 0) + item.value);
    });

    for (let i = days - 1; i >= 0; i -= 1) {
        const d = new Date(start);
        d.setDate(start.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        series.push({
            label: d.toLocaleDateString("en-US", { weekday: "short" }),
            value: map.get(key) || 0,
        });
    }
    return series;
}

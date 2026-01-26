"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SellerDashboardData } from "./_data";
import { motion } from "framer-motion";
import { BadgeCheck, Box, Boxes, DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

interface Props {
    userEmail: string;
    data: SellerDashboardData;
}

export function SellerDashboardClient({ userEmail, data }: Props) {
    const { orders, inventory, topProducts, payments, paymentsTotals, lowStockCount } = data;

    const metrics = [
        {
            label: "Open orders",
            value: orders.length ? orders.filter((o) => (o.status || "").toUpperCase() !== "SHIPPED").length : 0,
            icon: ShoppingBag,
        },
        {
            label: "Paid",
            value: currency(paymentsTotals.paid),
            icon: DollarSign,
        },
        {
            label: "Pending payouts",
            value: currency(paymentsTotals.pending),
            icon: TrendingUp,
        },
        {
            label: "Low stock",
            value: lowStockCount,
            icon: Boxes,
        },
    ];

    const lowStockItems = inventory.filter((i) => i.quantity < 20).slice(0, 5);

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }}>
            <div className="flex flex-col gap-8 text-white">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Seller</p>
                        <h1 className="text-3xl font-black text-white">Commerce Command</h1>
                        <p className="text-slate-400 mt-1">Live signals from orders, inventory, and payouts.</p>
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
                            <h2 className="text-xl font-bold">Recent orders</h2>
                            <span className="text-xs text-slate-400">Latest 10</span>
                        </div>
                        {orders.length === 0 ? (
                            <EmptyState icon={ShoppingBag} title="No orders yet" subtitle="Orders will appear here once customers buy." />
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-white/10">
                                <div className="grid grid-cols-5 bg-black/30 px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">
                                    <span>Order</span>
                                    <span>Status</span>
                                    <span>Items</span>
                                    <span>Total</span>
                                    <span className="text-right">Created</span>
                                </div>
                                <div className="divide-y divide-white/10 bg-black/10">
                                    {orders.map((order) => (
                                        <div key={order.id} className="grid grid-cols-5 px-4 py-3 text-sm text-slate-100">
                                            <span className="font-semibold">{order.id.slice(0, 8)}</span>
                                            <span>
                                                <Badge text={order.status || "-"} tone="neutral" />
                                            </span>
                                            <span>{order.items_count}</span>
                                            <span>{currency(order.total_amount)}</span>
                                            <span className="text-right text-slate-300">{formatDate(order.created_at)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Payments</h3>
                            <Badge text={`${payments.length || 0} rows`} tone="neutral" />
                        </div>
                        {payments.length === 0 ? (
                            <EmptyState icon={DollarSign} title="No payments" subtitle="Payouts will show once orders are paid." compact />
                        ) : (
                            <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                                {payments.map((p) => (
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

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Inventory</h3>
                            <Badge text={`${inventory.length || 0} SKUs`} tone="neutral" />
                        </div>
                        {inventory.length === 0 ? (
                            <EmptyState icon={Boxes} title="No products" subtitle="Add products to track inventory." compact />
                        ) : (
                            <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                                {inventory.slice(0, 10).map((item) => (
                                    <div key={item.id} className="rounded-xl bg-black/20 border border-white/5 p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-semibold text-sm">{item.name}</p>
                                            <p className="text-[11px] text-slate-400">{item.sku}</p>
                                        </div>
                                        <Badge text={`${item.quantity} in stock`} tone={item.quantity < 20 ? "warning" : "neutral"} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Low stock</h3>
                            <Badge text={lowStockItems.length ? `${lowStockItems.length}` : "0"} tone={lowStockItems.length ? "warning" : "neutral"} />
                        </div>
                        {lowStockItems.length === 0 ? (
                            <EmptyState icon={Box} title="All good" subtitle="No SKUs below threshold." compact />
                        ) : (
                            <div className="space-y-3">
                                {lowStockItems.map((item) => (
                                    <div key={item.id} className="rounded-xl bg-black/20 border border-white/5 p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-semibold text-sm">{item.name}</p>
                                            <p className="text-[11px] text-slate-400">{item.sku}</p>
                                        </div>
                                        <Badge text={`${item.quantity} left`} tone="warning" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold">Top products</h3>
                            <Badge text={`${topProducts.length || 0}`} tone="neutral" />
                        </div>
                        {topProducts.length === 0 ? (
                            <EmptyState icon={BadgeCheck} title="No sales yet" subtitle="Top products will appear after orders." compact />
                        ) : (
                            <div className="space-y-3">
                                {topProducts.map((p) => (
                                    <div key={p.product_id} className="rounded-xl bg-black/20 border border-white/5 p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-semibold text-sm">{p.name || "Product"}</p>
                                            <p className="text-[11px] text-slate-400">{p.sku}</p>
                                        </div>
                                        <Badge text={`${p.orders} orders`} tone="positive" />
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

function currency(amount: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount || 0);
}

function formatDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

function EmptyState({ icon: Icon, title, subtitle, compact }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; compact?: boolean }) {
    return (
        <div className={`rounded-2xl border border-dashed border-white/10 bg-black/10 text-slate-200 ${compact ? "p-4" : "p-6"}`}>
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-slate-300" />
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-slate-400">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

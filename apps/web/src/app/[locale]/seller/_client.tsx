"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SellerDashboardData } from "./_data";
import Link from "next/link";
import { Calendar, CreditCard, BarChart3, Settings } from "lucide-react";

interface Props {
    userEmail: string;
    data: SellerDashboardData;
}

export function SellerDashboardClient({ userEmail, data }: Props) {
    const { orders, topProducts, paymentsTotals, lowStockCount } = data;

    const openOrdersCount = orders.length ? orders.filter((o) => (o.status || "").toUpperCase() !== "SHIPPED").length : 0;

    const resources = [
        { title: "My Templates", href: "/seller/templates" },
        { title: "AI & Design Studio", href: "/seller/design" },
        { title: "Analytics & Insights", href: "/seller/analytics" },
        { title: "Branding", href: "/seller/branding" },
        { title: "Resources", href: "/seller/resources" },
        { title: "24/7 Support", href: "/seller/support" },
    ];

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }} fullBleed>
            {/* Full page with gradient background */}
            <div className="min-h-full w-full relative transition-colors duration-300" style={{
                background: 'linear-gradient(145deg, var(--background) 0%, var(--card) 60%, var(--accent) 100%)'
            }}>
                {/* Gradient mesh overlays */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-[0.15]"
                        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
                    <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-10 dark:opacity-[0.10]"
                        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
                </div>

                <div className="relative z-10 px-10 py-8">
                    {/* Page Header */}
                    <header className="mb-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400 mb-1">Seller</p>
                        <h1 className="text-[28px] font-bold text-foreground leading-tight">Commerce Command</h1>
                        <p className="text-sm text-muted-foreground mt-1">Live signals from orders, inventory, and payouts.</p>
                    </header>

                    {/* Workspace Shortcuts */}
                    <div className="bg-card border border-border rounded-xl shadow-sm p-6 mb-6">
                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-foreground">Workspace shortcuts</h2>
                            <p className="text-sm text-muted-foreground mt-0.5">Quick links into your seller toolkit (LinkedIn backend-ready).</p>
                        </div>
                        <ul className="space-y-1">
                            {resources.map((item) => (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Open Orders */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Open Orders</span>
                                <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">{openOrdersCount}</div>
                        </div>

                        {/* Paid */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Paid</span>
                                <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">{currency(paymentsTotals.paid)}</div>
                        </div>

                        {/* Pending Payouts */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Pending Payouts</span>
                                <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">{currency(paymentsTotals.pending)}</div>
                        </div>

                        {/* Low Stock */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Low Stock</span>
                                <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center">
                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">{lowStockCount}</div>
                        </div>
                    </div>

                    {/* Two column grid for Top Products & Recent Orders */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Top Products */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-foreground">Top Products</h3>
                                <Link href="/seller/inventory" className="text-xs font-medium text-blue-500 hover:text-blue-600">
                                    View All →
                                </Link>
                            </div>
                            {topProducts.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-8 text-center">No products yet</p>
                            ) : (
                                <ul className="space-y-3">
                                    {topProducts.map((product) => (
                                        <li key={product.product_id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                                            <div className="w-10 h-10 rounded bg-muted border border-border flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-muted-foreground">IMG</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">{product.orders} orders</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-foreground">Recent Orders</h3>
                                <Link href="/seller/orders" className="text-xs font-medium text-blue-500 hover:text-blue-600">
                                    View All →
                                </Link>
                            </div>
                            {orders.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-8 text-center">No orders yet</p>
                            ) : (
                                <ul className="space-y-3">
                                    {orders.map((order) => (
                                        <li key={order.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground">Order #{order.id.slice(0, 8)}</p>
                                                <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-foreground">{currency(order.total_amount)}</p>
                                                <p className="text-xs text-muted-foreground">{formatStatus(order.status)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                        <h3 className="text-base font-semibold text-foreground mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Link
                                href="/seller/inventory"
                                className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-accent border border-border transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <span className="text-lg">📦</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Add Product</p>
                                    <p className="text-xs text-muted-foreground">Create new listing</p>
                                </div>
                            </Link>
                            <Link
                                href="/seller/orders"
                                className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-accent border border-border transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <span className="text-lg">📋</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">View Orders</p>
                                    <p className="text-xs text-foreground">Manage fulfillment</p>
                                </div>
                            </Link>
                            <Link
                                href="/seller/analytics"
                                className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-accent border border-border transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <span className="text-lg">📊</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Analytics</p>
                                    <p className="text-xs text-muted-foreground">Track performance</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function formatDate(value: string | null | undefined) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

function formatStatus(value: string | null | undefined) {
    if (!value) return "Unknown";
    if (value === "CREATED") return "Draft";
    return value.toLowerCase().split("_").map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1)).join(" ");
}

function currency(amount: number | null | undefined) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount || 0));
}

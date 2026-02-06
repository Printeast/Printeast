import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { ArrowUpRight, BarChart3, CheckCircle2, Clock, CreditCard, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { api } from "@/services/api.service";

export default async function SellerAnalyticsPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || session?.user?.email || "seller";

    // Fetch from high-performance backend
    const res = await api.get<any>("/analytics/stats", session?.access_token);
    const stats = res.data || { summary: {}, recentOrders: [], recentPayments: [] };

    const gmv = stats.summary.revenue || 0;
    const orderCount = stats.summary.orders || 0;
    const paid = stats.summary.paidAmount || 0;
    const pending = stats.summary.pendingAmount || 0;
    const aov = stats.summary.aov || 0;

    const recentOrders = stats.recentOrders || [];
    const recentPayments = stats.recentPayments || [];
    const totalPayments = paid + pending;
    const paidPct = totalPayments ? Math.round((paid / totalPayments) * 100) : 0;

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Analytics</h1>
                            <p className="text-sm text-slate-500 mt-1">Signals from orders, payments, and fulfillment velocity.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/seller/analytics"
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-700 transition-all shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </Link>
                            <button className="h-9 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 shadow-sm transition-all">
                                Export
                            </button>
                            <button className="h-9 px-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg text-sm font-medium shadow-sm transition-all">
                                Generate report
                            </button>
                        </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <MetricCard label="GMV" value={formatCurrency(gmv)} helper="Gross merchandise volume" icon={TrendingUp} />
                        <MetricCard label="Orders" value={orderCount.toString()} helper="Total orders" icon={BarChart3} />
                        <MetricCard label="Paid" value={formatCurrency(paid)} helper="Captured payments" icon={CheckCircle2} />
                        <MetricCard label="Pending" value={formatCurrency(pending)} helper="Awaiting capture" icon={Clock} />
                    </div>

                    {/* Two column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mb-6">
                        {/* AOV Card */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-900">Orders (7d)</h2>
                                    </div>
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                                        AOV {formatCurrency(aov)}
                                    </span>
                                </div>
                            </div>
                            <div className="px-6 py-10">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                                        <BarChart3 className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-800 mb-1">No orders in the last 7 days</h3>
                                    <p className="text-xs text-slate-500">Recent activity will appear here.</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Mix Card */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Payment mix</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Paid vs pending capture.</p>
                            </div>
                            <div className="px-6 py-5 space-y-5">
                                {/* Progress bar */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-700">Paid</span>
                                        <span className="text-slate-500">{paidPct}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100">
                                        <div className="h-2 rounded-full bg-[#3B82F6]" style={{ width: `${paidPct}%` }} />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>{formatCurrency(paid)} paid</span>
                                        <span>{formatCurrency(pending)} pending</span>
                                    </div>
                                </div>

                                {/* Signal rows */}
                                <div className="space-y-2">
                                    <SignalRow icon={<CheckCircle2 className="w-4 h-4" />} label="Paid payments" value={formatCurrency(paid)} tone="positive" />
                                    <SignalRow icon={<Clock className="w-4 h-4" />} label="Pending capture" value={formatCurrency(pending)} tone="warning" />
                                    <SignalRow icon={<Sparkles className="w-4 h-4" />} label="Weekly GMV" value={formatCurrency(gmv)} tone="info" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders & Payments */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                        {/* Recent Orders */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-base font-semibold text-slate-900">Recent orders</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">Latest activity from orders + buyers.</p>
                                    </div>
                                    <Link href="/seller/orders" className="text-xs font-semibold text-[#3B82F6] hover:text-[#2563EB] flex items-center gap-1">
                                        View all <ArrowUpRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                            <div className="px-6 py-4">
                                {recentOrders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                                            <CreditCard className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-800 mb-1">No orders yet</h3>
                                        <p className="text-xs text-slate-500">Orders will populate once created.</p>
                                    </div>
                                ) : (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="pb-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                                                <th className="pb-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                                <th className="pb-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                                <th className="pb-3 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentOrders.map((order: any) => (
                                                <tr key={order.id} className="border-b border-slate-50 last:border-0">
                                                    <td className="py-3 text-sm font-medium text-slate-800">#{order.id.slice(0, 8)}</td>
                                                    <td className="py-3 text-sm text-slate-600">{order.buyerEmail || "Unknown"}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyle(order.status)}`}>
                                                            {formatStatus(order.status)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-sm font-semibold text-slate-800 text-right">{formatCurrency(order.totalAmount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Payment Activity */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Payment activity</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Latest payment events.</p>
                            </div>
                            <div className="px-6 py-4 space-y-2">
                                {recentPayments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                                            <CreditCard className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-800 mb-1">No payments yet</h3>
                                        <p className="text-xs text-slate-500">Payments will surface here when available.</p>
                                    </div>
                                ) : (
                                    recentPayments.map((payment: any) => (
                                        <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">#{(payment.orderId || "").slice(0, 8)}</p>
                                                <p className="text-xs text-slate-500">{formatDate(payment.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${paymentStyle(payment.status)}`}>
                                                    {formatPayment(payment.status)}
                                                </span>
                                                <p className="text-sm font-semibold text-slate-800 mt-1">{formatCurrency(payment.amount || 0)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function MetricCard({ label, value, helper, icon: Icon }: { label: string; value: string; helper: string; icon: React.ElementType }) {
    return (
        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{label}</span>
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-400" />
                </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
            <p className="text-xs text-slate-500">{helper}</p>
        </div>
    );
}

function SignalRow({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "positive" | "warning" | "info" }) {
    const styles = {
        positive: "bg-green-50 text-green-700",
        warning: "bg-amber-50 text-amber-700",
        info: "bg-blue-50 text-blue-700",
    };
    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-slate-400">{icon}</span>
                <span>{label}</span>
            </div>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[tone]}`}>{value}</span>
        </div>
    );
}

function formatCurrency(amount: number | null | undefined) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(amount || 0));
}

function formatDate(value: string | null | undefined) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

function formatStatus(value: string | null | undefined) {
    if (!value) return "Unknown";
    return value.toLowerCase().split("_").map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1)).join(" ");
}

function statusStyle(status: string | null | undefined) {
    const normalized = (status || "").toUpperCase();
    if (["SHIPPED", "DELIVERED"].includes(normalized)) return "bg-green-50 text-green-700";
    if (["CANCELLED"].includes(normalized)) return "bg-red-50 text-red-700";
    if (["READY_TO_SHIP", "IN_PRODUCTION"].includes(normalized)) return "bg-blue-50 text-blue-700";
    return "bg-slate-100 text-slate-600";
}

function formatPayment(value: string | null | undefined) {
    return value ? value.toLowerCase().replace(/^[a-z]/, (c) => c.toUpperCase()) : "Pending";
}

function paymentStyle(status: string | null | undefined) {
    const normalized = (status || "").toUpperCase();
    if (normalized === "PAID") return "bg-green-50 text-green-700";
    if (normalized === "FAILED") return "bg-red-50 text-red-700";
    return "bg-amber-50 text-amber-700";
}

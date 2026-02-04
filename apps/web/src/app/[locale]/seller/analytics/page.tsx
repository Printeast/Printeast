import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { ArrowUpRight, BarChart3, CheckCircle2, Clock, CreditCard, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";

type OrderRow = {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    buyer?: Array<{ email: string | null }> | null;
};

type PaymentRow = {
    amount: number | null;
    status: string | null;
    created_at: string | null;
    order_id: string | null;
};

export default async function SellerAnalyticsPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: ordersData = [] } = tenantId
        ? await supabase
            .from("orders")
            .select("id,status,total_amount,created_at,buyer:users!orders_buyer_id_fkey(email)")
            .eq("tenant_id", tenantId)
            .order("created_at", { ascending: false })
            .limit(200)
        : { data: [] };

    const { data: paymentsData = [] } = tenantId
        ? await supabase
            .from("payments")
            .select("amount,status,created_at,order_id,orders!inner(tenant_id)")
            .eq("orders.tenant_id", tenantId)
            .order("created_at", { ascending: false })
            .limit(200)
        : { data: [] };

    const orders = ordersData as OrderRow[];
    const payments = paymentsData as PaymentRow[];

    const gmv = orders.reduce((sum, o) => sum + Number(o.total_amount ?? 0), 0);
    const orderCount = orders.length;
    const paid = payments.filter((p) => (p.status || "").toUpperCase() === "PAID").reduce((s, p) => s + Number(p.amount ?? 0), 0);
    const pending = payments.filter((p) => (p.status || "").toUpperCase() !== "PAID").reduce((s, p) => s + Number(p.amount ?? 0), 0);
    const aov = orderCount ? gmv / orderCount : 0;

    const recentOrders = orders.slice(0, 6);
    const recentPayments = payments.slice(0, 6);
    const totalPayments = paid + pending;
    const paidPct = totalPayments ? Math.round((paid / totalPayments) * 100) : 0;

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            {/* Full page with gradient background */}
            <div className="min-h-full w-full" style={{
                background: 'linear-gradient(135deg, #e8f0fe 0%, #f0f4f8 25%, #f5f7fa 50%, #f8f9fb 100%)'
            }}>
                {/* Gradient mesh overlays */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40"
                        style={{ background: 'radial-gradient(circle, rgba(147,197,253,0.5) 0%, transparent 70%)' }} />
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.4) 0%, transparent 70%)' }} />
                </div>

                <div className="relative z-10 px-10 py-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Analytics</p>
                            <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Commerce Command</h1>
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
                                        <p className="text-xs text-slate-500 mt-0.5">Daily order totals from orders.total_amount.</p>
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
                                            {recentOrders.map((order) => (
                                                <tr key={order.id} className="border-b border-slate-50 last:border-0">
                                                    <td className="py-3 text-sm font-medium text-slate-800">#{order.id.slice(0, 8)}</td>
                                                    <td className="py-3 text-sm text-slate-600">{order.buyer?.[0]?.email || "Unknown"}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyle(order.status)}`}>
                                                            {formatStatus(order.status)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-sm font-semibold text-slate-800 text-right">{formatCurrency(order.total_amount)}</td>
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
                                    recentPayments.map((payment) => (
                                        <div key={`${payment.order_id}-${payment.created_at}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">#{(payment.order_id || "").slice(0, 8)}</p>
                                                <p className="text-xs text-slate-500">{formatDate(payment.created_at)}</p>
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

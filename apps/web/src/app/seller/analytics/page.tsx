import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { ArrowUpRight, CheckCircle2, Clock, RefreshCw, Sparkles } from "lucide-react";

type OrderRow = {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    buyer?: { email: string | null } | null;
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

    const last7 = buildDailySeries(orders, 7);
    const recentOrders = orders.slice(0, 6);
    const recentPayments = payments.slice(0, 6);
    const totalPayments = paid + pending;
    const paidPct = totalPayments ? Math.round((paid / totalPayments) * 100) : 0;

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Analytics</h1>
                        <a
                            href="/seller/analytics"
                            className="h-9 w-9 rounded-lg border dash-border dash-panel flex items-center justify-center hover:dash-panel-strong"
                            aria-label="Refresh"
                        >
                            <RefreshCw className="h-4 w-4 dash-muted" />
                        </a>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            className="h-10 rounded-lg px-5 border dash-border dash-panel-strong text-sm font-semibold text-[color:var(--dash-text)]"
                        >
                            Export
                        </Button>
                        <Button
                            type="button"
                            className="h-10 rounded-lg px-5 bg-[linear-gradient(135deg,var(--dash-accent-start),var(--dash-accent-end))] text-sm font-semibold text-white"
                        >
                            Generate report
                        </Button>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Metric label="GMV" value={formatCurrency(gmv)} helper="Gross merchandise volume" />
                    <Metric label="Orders" value={orderCount} helper="Total orders" />
                    <Metric label="Paid" value={formatCurrency(paid)} helper="Captured payments" tone="positive" />
                    <Metric label="Pending" value={formatCurrency(pending)} helper="Awaiting capture" tone="info" />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
                    <Card className="rounded-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Orders (7d)</CardTitle>
                                <Badge tone="info">AOV {formatCurrency(aov)}</Badge>
                            </div>
                            <p className="text-sm dash-muted">Daily order totals from `orders.total_amount`.</p>
                        </CardHeader>
                        <CardContent>
                            {last7.every((d) => d.value === 0) ? (
                                <EmptyPanel title="No orders in the last 7 days" subtitle="Recent activity will appear here." />
                            ) : (
                                <LineChart data={last7} ariaLabel="Orders last 7 days" />
                            )}
                        </CardContent>
                    </Card>

                    <Card className="dash-panel-strong rounded-lg">
                        <CardHeader>
                            <CardTitle>Payment mix</CardTitle>
                            <p className="text-sm dash-muted">Paid vs pending capture.</p>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Paid</span>
                                    <span className="dash-muted">{paidPct}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-white/10">
                                    <div
                                        className="h-2 rounded-full bg-[linear-gradient(135deg,var(--dash-accent-start),var(--dash-accent-end))]"
                                        style={{ width: `${paidPct}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-xs dash-muted">
                                    <span>{formatCurrency(paid)} paid</span>
                                    <span>{formatCurrency(pending)} pending</span>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <SignalRow icon={<CheckCircle2 className="h-4 w-4" />} label="Paid payments" value={formatCurrency(paid)} tone="positive" />
                                <SignalRow icon={<Clock className="h-4 w-4" />} label="Pending capture" value={formatCurrency(pending)} tone="info" />
                                <SignalRow icon={<Sparkles className="h-4 w-4" />} label="Weekly GMV" value={formatCurrency(last7.reduce((s, d) => s + d.value, 0))} tone="info" />
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
                    <Card className="rounded-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Recent orders</CardTitle>
                                <a href="/seller/orders" className="text-xs font-semibold dash-muted hover:dash-text inline-flex items-center gap-1">
                                    View all <ArrowUpRight className="h-3 w-3" />
                                </a>
                            </div>
                            <p className="text-sm dash-muted">Latest activity from orders + buyers.</p>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentOrders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-10">
                                                <EmptyPanel title="No orders yet" subtitle="Orders will populate once created." />
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        recentOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-semibold">{order.id}</TableCell>
                                                <TableCell>{order.buyer?.email || "Unknown"}</TableCell>
                                                <TableCell>
                                                    <Badge tone={statusTone(order.status)}>{formatStatus(order.status)}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">{formatCurrency(order.total_amount)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle>Payment activity</CardTitle>
                            <p className="text-sm dash-muted">Latest payment events.</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recentPayments.length === 0 ? (
                                <EmptyPanel title="No payments yet" subtitle="Payments will surface here when available." />
                            ) : (
                                recentPayments.map((payment) => (
                                    <div key={`${payment.order_id}-${payment.created_at}`} className="rounded-lg border dash-border dash-panel p-3 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-semibold">{payment.order_id || "Order"}</div>
                                            <div className="text-xs dash-muted">{formatDate(payment.created_at)}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge tone={paymentTone(payment.status)}>{formatPayment(payment.status)}</Badge>
                                            <div className="text-sm font-semibold mt-1">{formatCurrency(payment.amount || 0)}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </DashboardLayout>
    );
}

function Metric({
    label,
    value,
    helper,
    tone,
}: {
    label: string;
    value: string | number;
    helper: string;
    tone?: "warning" | "positive" | "info";
}) {
    return (
        <Card className="dash-panel-strong rounded-lg">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.25em] dash-muted">{label}</div>
                    {tone && <Badge tone={tone}>{tone}</Badge>}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black tracking-tight">{value}</div>
                <p className="text-xs dash-muted mt-1">{helper}</p>
            </CardContent>
        </Card>
    );
}

function SignalRow({
    icon,
    label,
    value,
    tone,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    tone: "warning" | "positive" | "info";
}) {
    return (
        <div className="flex items-center justify-between rounded-lg border dash-border dash-panel px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
                <span className="dash-muted-strong">{icon}</span>
                <span>{label}</span>
            </div>
            <Badge tone={tone}>{value}</Badge>
        </div>
    );
}

function EmptyPanel({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="rounded-lg border border-dashed dash-border dash-panel p-6 text-center">
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs dash-muted mt-1">{subtitle}</p>
        </div>
    );
}

function buildDailySeries(items: OrderRow[], days: number) {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const series: Array<{ label: string; value: number }> = [];
    const map = new Map<string, number>();

    items.forEach((item) => {
        const d = new Date(item.created_at);
        if (Number.isNaN(d.getTime())) return;
        const key = d.toISOString().slice(0, 10);
        map.set(key, (map.get(key) || 0) + Number(item.total_amount ?? 0));
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

function formatCurrency(amount: number | null | undefined) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(amount || 0));
}

function formatDate(value: string | null | undefined) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function formatStatus(value: string | null | undefined) {
    if (!value) return "Unknown";
    return value
        .toLowerCase()
        .split("_")
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(" ");
}

function statusTone(status: string | null | undefined): "neutral" | "warning" | "positive" | "info" {
    const normalized = (status || "").toUpperCase();
    if (["SHIPPED", "DELIVERED"].includes(normalized)) return "positive";
    if (["CANCELLED"].includes(normalized)) return "warning";
    if (["READY_TO_SHIP", "IN_PRODUCTION", "ROUTED_TO_VENDOR"].includes(normalized)) return "info";
    return "neutral";
}

function formatPayment(value: string | null | undefined) {
    return value ? value.toLowerCase().replace(/^[a-z]/, (c) => c.toUpperCase()) : "Pending";
}

function paymentTone(status: string | null | undefined): "warning" | "positive" | "info" {
    const normalized = (status || "").toUpperCase();
    if (normalized === "PAID") return "positive";
    if (normalized === "FAILED") return "warning";
    return "info";
}

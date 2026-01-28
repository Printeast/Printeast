import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "@/components/ui/line-chart";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";

type OrderRow = { id: string; total_amount: number; created_at: string };
type PaymentRow = { amount: number; status: string; created_at: string };

export default async function SellerAnalyticsPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: orders = [] } = tenantId
        ? await supabase
              .from("orders")
              .select("id,total_amount,created_at")
              .eq("tenant_id", tenantId)
              .order("created_at", { ascending: false })
              .limit(120)
        : { data: [] };

    const { data: payments = [] } = tenantId
        ? await supabase
              .from("payments")
              .select("amount,status,created_at")
              .order("created_at", { ascending: false })
              .limit(120)
        : { data: [] };

    const gmv = (orders as OrderRow[]).reduce((sum, o) => sum + Number(o.total_amount ?? 0), 0);
    const orderCount = (orders as OrderRow[]).length;
    const paid = (payments as PaymentRow[]).filter((p) => (p.status || "").toUpperCase() === "PAID").reduce((s, p) => s + Number(p.amount ?? 0), 0);
    const pending = (payments as PaymentRow[]).filter((p) => (p.status || "").toUpperCase() !== "PAID").reduce((s, p) => s + Number(p.amount ?? 0), 0);
    const aov = orderCount ? gmv / orderCount : 0;

    const last7 = buildDailySeries(orders as OrderRow[], 7);

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }}>
            <div className="flex flex-col gap-6 dash-text">
                <header>
                    <p className="text-xs uppercase tracking-[0.25em] dash-muted">Analytics</p>
                    <h1 className="text-3xl font-black">Analytics &amp; Insights</h1>
                    <p className="dash-muted mt-1">Live metrics from orders and payments.</p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Metric label="GMV" value={currency(gmv)} />
                    <Metric label="Orders" value={orderCount} />
                    <Metric label="Paid" value={currency(paid)} tone="positive" />
                    <Metric label="Pending" value={currency(pending)} tone="warning" />
                </section>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Orders (7d)</CardTitle>
                            <Badge tone="info">Avg Order: {currency(aov)}</Badge>
                        </div>
                        <p className="text-sm dash-muted">Data from orders.total_amount by created_at.</p>
                    </CardHeader>
                    <CardContent>
                        {last7.every((d) => d.value === 0) ? (
                            <div className="rounded-2xl border border-dashed dash-border dash-panel p-6">
                                <p className="font-semibold dash-text">No orders in the last 7 days</p>
                                <p className="text-sm dash-muted">Recent activity will appear here.</p>
                            </div>
                        ) : (
                            <LineChart data={last7} ariaLabel="Orders last 7 days" />
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
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

function currency(amount: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount || 0);
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: "warning" | "positive" | "info" }) {
    return (
        <Card className="dash-panel-strong">
            <CardHeader className="pb-2">
                <div className="text-[11px] uppercase tracking-[0.25em] dash-muted">{label}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black tracking-tight">{value}</div>
                {tone && <Badge tone={tone} className="mt-2">{tone}</Badge>}
            </CardContent>
        </Card>
    );
}

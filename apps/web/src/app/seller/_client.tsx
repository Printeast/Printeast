"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SellerDashboardData } from "./_data";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart } from "@/components/ui/line-chart";
import { IconBag, IconChart, IconBoxes, IconWarning, IconWallet, IconDashboard } from "@/components/ui/icons";

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
            icon: IconBag,
        },
        {
            label: "Paid",
            value: currency(paymentsTotals.paid),
            icon: IconWallet,
        },
        {
            label: "Pending payouts",
            value: currency(paymentsTotals.pending),
            icon: IconChart,
        },
        {
            label: "Low stock",
            value: lowStockCount,
            icon: IconBoxes,
        },
    ];

    const lowStockItems = inventory.filter((i) => i.quantity < 20).slice(0, 5);
    const ordersSeries = buildDailySeries(orders.map((o) => ({ created_at: o.created_at, value: 1 })), 7);
    const ordersSeriesTotal = ordersSeries.reduce((sum, s) => sum + s.value, 0);

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }}>
            <div className="flex flex-col gap-8 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Seller</p>
                        <h1 className="text-3xl font-black dash-text">Commerce Command</h1>
                        <p className="dash-muted mt-1">Live signals from orders, inventory, and payouts.</p>
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
                                <CardTitle>Orders trend</CardTitle>
                                <p className="text-xs dash-muted">Last 7 days</p>
                            </div>
                            <Badge tone="info">{ordersSeriesTotal} total</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {ordersSeriesTotal === 0 ? (
                            <EmptyState icon={IconChart} title="No orders yet" subtitle="Orders will chart once activity starts." />
                        ) : (
                            <LineChart data={ordersSeries} ariaLabel="Orders over last 7 days" />
                        )}
                    </CardContent>
                </Card>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent orders</CardTitle>
                                    <p className="text-xs dash-muted">Latest 10</p>
                                </div>
                                <Badge tone="info">Live</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {orders.length === 0 ? (
                                <EmptyState icon={IconBag} title="No orders yet" subtitle="Orders will appear here once customers buy." />
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead className="text-right">Created</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-semibold">{order.id.slice(0, 8)}</TableCell>
                                                <TableCell>
                                <Badge tone={order.status?.toUpperCase() === "PAID" ? "positive" : "neutral"}>{order.status || "-"}</Badge>
                                                </TableCell>
                                                <TableCell>{order.items_count}</TableCell>
                                                <TableCell>{currency(order.total_amount)}</TableCell>
                                                <TableCell className="text-right dash-muted">{formatDate(order.created_at)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Payments</CardTitle>
                                <Badge>{`${payments.length || 0} rows`}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {payments.length === 0 ? (
                                <EmptyState icon={IconWallet} title="No payments" subtitle="Payouts will show once orders are paid." compact />
                            ) : (
                                <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                                    {payments.map((p) => (
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

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Inventory</CardTitle>
                                <Badge>{`${inventory.length || 0} SKUs`}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {inventory.length === 0 ? (
                                <EmptyState icon={IconBoxes} title="No products" subtitle="Add products to track inventory." compact />
                            ) : (
                                <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                                    {inventory.slice(0, 10).map((item) => (
                                        <div key={item.id} className="rounded-xl border dash-border dash-panel p-3 flex items-center justify-between">
                                            <div>
                                                <p className="dash-text font-semibold text-sm">{item.name}</p>
                                                <p className="text-[11px] dash-muted">{item.sku}</p>
                                            </div>
                                            <Badge tone={item.quantity < 20 ? "warning" : "neutral"}>{`${item.quantity} in stock`}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Low stock</CardTitle>
                                <Badge tone={lowStockItems.length ? "warning" : "neutral"}>{lowStockItems.length ? `${lowStockItems.length}` : "0"}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {lowStockItems.length === 0 ? (
                                <EmptyState icon={IconWarning} title="All good" subtitle="No SKUs below threshold." compact />
                            ) : (
                                <div className="space-y-3">
                                    {lowStockItems.map((item) => (
                                        <div key={item.id} className="rounded-xl border dash-border dash-panel p-3 flex items-center justify-between">
                                            <div>
                                                <p className="dash-text font-semibold text-sm">{item.name}</p>
                                                <p className="text-[11px] dash-muted">{item.sku}</p>
                                            </div>
                                            <Badge tone="warning">{`${item.quantity} left`}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Top products</CardTitle>
                                <Badge>{`${topProducts.length || 0}`}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {topProducts.length === 0 ? (
                                <EmptyState icon={IconDashboard} title="No sales yet" subtitle="Top products will appear after orders." compact />
                            ) : (
                                <div className="space-y-3">
                                    {topProducts.map((p) => (
                                        <div key={p.product_id} className="rounded-xl border dash-border dash-panel p-3 flex items-center justify-between">
                                            <div>
                                                <p className="dash-text font-semibold text-sm">{p.name || "Product"}</p>
                                                <p className="text-[11px] dash-muted">{p.sku}</p>
                                            </div>
                                            <Badge tone="positive">{`${p.orders} orders`}</Badge>
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

function currency(amount: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount || 0);
}

function formatDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

function EmptyState({ icon: Icon, title, subtitle, compact }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; compact?: boolean }) {
    return (
        <div className={`rounded-2xl border border-dashed dash-border dash-panel ${compact ? "p-4" : "p-6"}`}>
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 dash-muted-strong" />
                <div>
                    <p className="font-semibold dash-text">{title}</p>
                    <p className="text-sm dash-muted">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

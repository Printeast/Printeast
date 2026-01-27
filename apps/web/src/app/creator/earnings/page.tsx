import { getCreatorEarningsData } from "../_data";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconChart, IconWallet } from "@/components/ui/icons";

export default async function CreatorEarningsPage() {
    const { userEmail, payments, paymentsTotals, ordersCount } = await getCreatorEarningsData();

    return (
        <DashboardLayout user={{ email: userEmail, role: "CREATOR" }}>
            <div className="flex flex-col gap-8 dash-text">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Earnings</p>
                        <h1 className="text-3xl font-black dash-text">Revenue & Royalties</h1>
                        <p className="dash-muted mt-1">Pulled directly from Supabase payments.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Metric label="Paid" value={currency(paymentsTotals.paid)} icon={<IconWallet className="h-4 w-4" />} />
                    <Metric label="Pending" value={currency(paymentsTotals.pending)} icon={<IconChart className="h-4 w-4" />} />
                    <Metric label="Orders" value={ordersCount} icon={<IconChart className="h-4 w-4" />} />
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent payments</CardTitle>
                            <Badge>{payments.length} rows</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {payments.length === 0 ? (
                            <EmptyState title="No payouts yet" subtitle="Payments will appear once orders are paid." />
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Order</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-semibold">{currency(p.amount)}</TableCell>
                                            <TableCell>
                                                <Badge tone={p.status?.toUpperCase() === "PAID" ? "positive" : "warning"}>{p.status || "PENDING"}</Badge>
                                            </TableCell>
                                             <TableCell className="dash-muted">{p.order_id.slice(0, 8)}</TableCell>
                                             <TableCell className="text-right dash-muted">{formatDate(p.created_at)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
    return (
         <Card className="dash-panel-strong">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                     <div className="text-[11px] uppercase tracking-[0.25em] dash-muted">{label}</div>
                     <div className="h-9 w-9 rounded-full border dash-border dash-panel-strong flex items-center justify-center">
                         {icon}
                     </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black">{value}</div>
            </CardContent>
        </Card>
    );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
    return (
         <div className="rounded-2xl border border-dashed dash-border dash-panel p-6">
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

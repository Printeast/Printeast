import { getCreatorEarningsData } from "../_data";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DollarSign, Wallet2, TrendingUp } from "lucide-react";

export default async function CreatorEarningsPage() {
    const { userEmail, payments, paymentsTotals, ordersCount } = await getCreatorEarningsData();

    return (
        <DashboardLayout user={{ email: userEmail, role: "CREATOR" }}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Earnings</p>
                        <h1 className="text-3xl font-black text-white">Revenue & Royalties</h1>
                        <p className="text-slate-400 mt-1">Pulled directly from Supabase payments.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Metric label="Paid" value={currency(paymentsTotals.paid)} icon={<Wallet2 className="h-4 w-4" />} />
                    <Metric label="Pending" value={currency(paymentsTotals.pending)} icon={<DollarSign className="h-4 w-4" />} />
                    <Metric label="Orders" value={ordersCount} icon={<TrendingUp className="h-4 w-4" />} />
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Recent payments</h3>
                        <span className="text-xs text-slate-400">{payments.length} rows</span>
                    </div>
                    {payments.length === 0 ? (
                        <EmptyState title="No payouts yet" subtitle="Payments will appear once orders are paid." />
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <div className="grid grid-cols-4 bg-black/30 px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">
                                <span>Amount</span>
                                <span>Status</span>
                                <span>Order</span>
                                <span className="text-right">Date</span>
                            </div>
                            <div className="divide-y divide-white/10 bg-black/10">
                                {payments.map((p) => (
                                    <div key={p.id} className="grid grid-cols-4 px-4 py-3 text-sm text-slate-100">
                                        <span className="font-semibold">{currency(p.amount)}</span>
                                        <span>
                                            <Badge text={p.status || "PENDING"} tone={p.status?.toUpperCase() === "PAID" ? "positive" : "warning"} />
                                        </span>
                                        <span className="text-slate-300">{p.order_id.slice(0, 8)}</span>
                                        <span className="text-right text-slate-300">{formatDate(p.created_at)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function Metric({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
                {icon}
            </div>
            <div className="mt-3 text-2xl font-black">{value}</div>
        </div>
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

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 text-slate-200 p-6">
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

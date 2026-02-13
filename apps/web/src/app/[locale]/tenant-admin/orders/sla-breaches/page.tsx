import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getSlaBreaches } from "@/services/admin-data";

export default async function SlABreachesPage() {
    const { metrics, cards } = await getSlaBreaches();

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">SLA Breaches Monitoring</h1>
                            <p className="text-sm text-slate-500">Real-time tracking of production and shipping deadline exceptions.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">Filter</button>
                            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">Export Report</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Total Breaches</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">{metrics.total}</div>
                            <div className="text-[11px] text-rose-500 font-bold">↑ 12%</div>
                        </div>
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Critical Exceptions</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">{metrics.critical}</div>
                            <div className="text-[11px] text-slate-400">Past 24h</div>
                        </div>
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Avg. Resolution Time</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">{metrics.avgResolutionHrs}h</div>
                            <div className="text-[11px] text-emerald-600">↓ 0.5h</div>
                        </div>
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Compliance Rate</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">{metrics.compliance}%</div>
                            <div className="text-[11px] text-slate-400">Target 99.5%</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {cards.map((card) => (
                            <div key={card.title} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-2">
                                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.14em]">
                                    <span className={`${card.tag.includes("CRITICAL") ? "text-rose-600" : card.tag.includes("HIGH") ? "text-blue-600" : "text-amber-600"}`}>{card.tag}</span>
                                    <span className="text-slate-400 font-semibold">{card.time}</span>
                                </div>
                                <div className="text-sm font-bold text-slate-900 leading-snug">{card.title}</div>
                                <div className="text-xs text-slate-600">Vendor: {card.vendor}</div>
                                <div className="text-xs text-slate-600">Affected: {card.affected}</div>
                                <div className="flex items-center gap-2 pt-1">
                                    <button className="text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">Ignore</button>
                                    <button className="text-sm font-semibold text-white rounded-lg px-3 py-2 bg-[#1e4bff] hover:bg-[#163dcc] shadow">View Details</button>
                                </div>
                            </div>
                        ))}
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 h-full min-h-[200px] flex items-center justify-center text-slate-400 text-sm font-semibold">
                            Configure New Alert Rule
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

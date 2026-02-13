import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getHealthData } from "@/services/admin-data";

export default async function HealthPage() {
    const { scorePct, scoreDeltaPct, metricsToday, services } = await getHealthData();
    const allOperational = services.every((svc) => svc.status === "Operational");
    const deltaLabel = `${scoreDeltaPct >= 0 ? "+" : ""}${scoreDeltaPct}% from yesterday`;

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f7fbf9]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
                    <header className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daily Health Snapshot</h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    <span className="text-slate-600">📅</span>
                                    <span>Oct 24, 2023</span>
                                </div>
                                <button className="h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-800 shadow-sm">🔔</button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">Platform health across services, performance metrics, and connectivity checks.</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
                            <div className="text-xs font-bold text-slate-600 uppercase tracking-[0.12em]">Platform Health Score</div>
                            <div className="relative h-32 flex items-center justify-center">
                                <div className="absolute h-28 w-28 rounded-full border-[10px] border-slate-100" />
                                <div className="absolute h-28 w-28 rounded-full border-[10px] border-transparent" style={{ borderTopColor: "#2563eb", borderRightColor: "#2563eb" }} />
                                <div className="text-3xl font-black text-slate-900">{scorePct.toFixed(1)}%</div>
                            </div>
                            <div className={`text-sm font-bold ${scoreDeltaPct >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{deltaLabel}</div>
                            <div className="text-xs text-slate-500">Calculated across all microservices</div>
                        </div>

                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 flex flex-col gap-3 lg:col-span-2">
                            <div className="text-xs font-bold text-slate-600 uppercase tracking-[0.12em]">Key Performance Metrics Today</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[{
                                    label: "Successful Orders", value: metricsToday.successfulOrders.toLocaleString(), sub: `Peak: ${metricsToday.peakTime}`
                                }, {
                                    label: "Failed Payments", value: metricsToday.failedPayments.toLocaleString(), sub: `${metricsToday.failRatePct}% fail rate`, danger: metricsToday.failRatePct >= 1
                                }, {
                                    label: "New Signups", value: metricsToday.newSignups.toLocaleString(), sub: "New accounts today"
                                }].map((item) => (
                                    <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                        <div className="text-sm font-bold text-slate-800 mb-2">{item.label}</div>
                                        <div className="text-2xl font-black text-slate-900">{item.value}</div>
                                        <div className={`text-xs font-semibold ${item.danger ? "text-rose-500" : "text-slate-500"}`}>{item.sub}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 space-y-4">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-700 uppercase tracking-[0.12em]">
                            <span>Server Status & Connectivity</span>
                            <span className={`text-xs px-3 py-1 rounded-full font-bold ${allOperational ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>
                                {allOperational ? "All Systems Operational" : "Attention Needed"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {services.map((svc) => (
                                <div key={svc.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.14em]">{svc.tier}</div>
                                    <div className="text-sm font-bold text-slate-900 mt-1">{svc.name}</div>
                                    <div className="text-[11px] text-emerald-600 font-bold mt-2">{svc.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

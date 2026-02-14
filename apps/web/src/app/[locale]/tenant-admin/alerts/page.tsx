import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getAlertsData } from "@/services/admin-data";

export default async function AlertsPage() {
    const { metrics, urgent, investigation, logs } = await getAlertsData();

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f7f9fc]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-slate-900">Alerts & Incidents</h1>
                            <p className="text-sm text-slate-500">System live view • Session: CC-ADMIN-04</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                            <span className="text-rose-600">System Live</span>
                            <button className="ml-4 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">Filters</button>
                            <button className="rounded-lg bg-[#1e4bff] text-white px-4 py-2 shadow hover:bg-[#163dcc]">Quick Resolve</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm font-semibold text-slate-700">
                                <div>
                                    <div className="text-xs uppercase text-slate-500">Global Health</div>
                                    <div className="text-2xl font-black text-emerald-600">{metrics.globalHealthPct.toFixed(1)}%</div>
                                    <div className="text-[11px] text-emerald-600">Nominal Performance</div>
                                </div>
                                <div>
                                    <div className="text-xs uppercase text-slate-500">API Latency</div>
                                    <div className="text-xl font-black text-slate-900">{metrics.apiLatencyMs}ms</div>
                                </div>
                                <div>
                                    <div className="text-xs uppercase text-slate-500">Error Rate</div>
                                    <div className="text-xl font-black text-slate-900">{metrics.errorRatePct}%</div>
                                </div>
                                <div>
                                    <div className="text-xs uppercase text-slate-500">Throughput</div>
                                    <div className="text-xl font-black text-slate-900">{metrics.throughputPerS.toLocaleString()}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-[0.12em]">Urgent Action Required (02)</h3>
                                <div className="space-y-3">
                                    {urgent.map((item) => (
                                        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-rose-600">{item.id}</div>
                                                <div className="text-sm font-bold text-slate-900">{item.title}</div>
                                                <div className="text-xs text-slate-500">Service: {item.service} • Detected {item.detected}</div>
                                                <div className="text-xs text-slate-500">Duration: {item.duration}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">View Logs</button>
                                                <button className="text-sm font-semibold text-white rounded-lg px-3 py-2 bg-[#1e4bff] hover:bg-[#163dcc] shadow">Investigate</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-[0.12em]">Under Investigation (03)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {investigation.map((item) => (
                                        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-2">
                                            <div className="text-[11px] font-black uppercase tracking-[0.14em] text-amber-600">{item.id}</div>
                                            <div className="text-sm font-bold text-slate-900">{item.title}</div>
                                            <div className="text-xs text-slate-500">Service: {item.service}</div>
                                            <div className="text-xs text-slate-500">Detected {item.detected}</div>
                                            <div className="flex items-center gap-2 pt-1">
                                                <button className="text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50">View Logs</button>
                                                <button className="text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg px-3 py-2">Update</button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 h-full min-h-[160px] flex items-center justify-center text-slate-400 text-sm font-semibold">
                                        + Configure New Alert Rule
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-2">
                                <h3 className="text-sm font-bold text-slate-800">Real-time Metrics</h3>
                                <div className="space-y-3 text-xs text-slate-600 font-semibold">
                                    <div className="flex items-center justify-between">
                                        <span>Server Load: US-East</span>
                                        <span className="text-emerald-500">74%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Server Load: EU-West</span>
                                        <span className="text-emerald-500">32%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                                <h3 className="text-sm font-bold text-slate-800">Recent System Logs</h3>
                                <div className="space-y-3 text-xs text-slate-700">
                                    {logs.map((log, idx) => (
                                        <div key={idx} className="border-b border-slate-100 pb-2 last:border-none last:pb-0">
                                            <div className="text-[11px] text-slate-400">{log.time}</div>
                                            <div className={`font-semibold ${log.error ? "text-rose-600" : "text-slate-800"}`}>{log.msg}</div>
                                            <div className="text-[11px] text-slate-500">{log.service}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                                <h3 className="text-sm font-bold text-slate-800">On-call Support</h3>
                                <p className="text-xs text-slate-600">Engineering Team B — Rotation ends: 04:18:20</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

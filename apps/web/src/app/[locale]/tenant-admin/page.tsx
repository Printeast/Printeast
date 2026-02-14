import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getOverviewData } from "@/services/admin-data";

export default async function TenantAdminDashboard() {
    const { metrics, activity, map, status } = await getOverviewData();
    const revenueBars = [18, 22, 26, 28, 25, 30, 36];

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
                    <header className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                            <span>System Overview</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h1>
                                <p className="text-sm text-slate-500">High-level visibility across GMV, order volume, fulfillment health, and platform status.</p>
                                <p className="text-xs text-slate-400">October 24, 2023 • 10:45 AM</p>
                            </div>
                            <button className="inline-flex items-center gap-2 rounded-lg bg-[#2f54eb] px-4 py-2 text-white text-sm font-semibold shadow hover:bg-[#2444c7]">
                                <span className="text-lg">📄</span>
                                Generate Global Report
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                                <span>Global Revenue</span>
                                <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full text-[11px] font-bold">+{metrics.revenueDeltaPct}%</span>
                            </div>
                            <div className="mt-2 text-3xl font-black text-slate-900">${metrics.revenue.toLocaleString()}</div>
                            <div className="mt-4 flex items-end gap-1 h-28">
                                {revenueBars.map((h, i) => (
                                    <div key={i} className="flex-1 rounded-md bg-gradient-to-t from-indigo-500 to-blue-400" style={{ height: `${h * 3}px`, opacity: 0.2 + i * 0.1 }} />
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
                            <div className="text-xs text-slate-500 font-semibold">Active Users</div>
                            <div className="text-3xl font-black text-slate-900">{metrics.activeUsers.total.toLocaleString()}</div>
                            <div className="space-y-2 text-xs text-slate-600 font-semibold">
                                <div className="flex items-center gap-2">
                                    <span className="w-14 text-slate-500">Sellers</span>
                                    <div className="flex-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-500" style={{ width: "78%" }} /></div>
                                    <span className="w-12 text-right text-slate-700">{metrics.activeUsers.sellers.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-14 text-slate-500">Artists</span>
                                    <div className="flex-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-500" style={{ width: "62%" }} /></div>
                                    <span className="w-12 text-right text-slate-700">{metrics.activeUsers.artists.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-14 text-slate-500">Customers</span>
                                    <div className="flex-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-emerald-500" style={{ width: "55%" }} /></div>
                                    <span className="w-12 text-right text-slate-700">{metrics.activeUsers.customers.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                                <div className="text-xs text-slate-500 font-semibold">Order Volume</div>
                                <div className="text-2xl font-black text-slate-900 mt-1">{metrics.orderVolume.toLocaleString()}</div>
                                <div className="text-[11px] text-emerald-500 font-bold mt-1">+{metrics.orderDeltaPct}% vs last 24h</div>
                            </div>
                            <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                                <div className="text-xs text-slate-500 font-semibold">Avg. Order Value</div>
                                <div className="text-2xl font-black text-slate-900 mt-1">${metrics.averageOrderValue.toFixed(2)}</div>
                                <div className="text-[11px] text-slate-400 font-semibold mt-1">Stable trend</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 space-y-3">
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-600">🌐</span>
                                    <span>Platform Distribution</span>
                                </div>
                                <span className="text-xs text-slate-500">• Active Region</span>
                            </div>
                            <div className="rounded-xl bg-slate-50 border border-slate-100 h-[320px] relative overflow-hidden">
                                <div className="absolute inset-0" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')", backgroundSize: "cover", opacity: 0.25 }} />
                                {map.points.map((p, i) => (
                                    <span key={i} className="absolute h-4 w-4 rounded-full bg-blue-500/80 shadow-lg" style={{ left: `${50 + p.lng / 4}%`, top: `${50 - p.lat / 3}%` }} />
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-slate-700">
                                <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                                    <div className="text-xs text-slate-500">Top Territory</div>
                                    <div>{map.topTerritory}</div>
                                </div>
                                <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                                    <div className="text-xs text-slate-500">Daily Growth</div>
                                    <div className="text-emerald-600 text-sm font-bold">+{map.dailyGrowthPct}% WoW</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                                <span>Recent Activity</span>
                                <button className="text-xs text-blue-600 font-bold">View Log</button>
                            </div>
                            <div className="space-y-3">
                                {activity.map((item) => (
                                    <div key={item.title} className="flex gap-3 rounded-lg border border-slate-100 p-3 bg-slate-50/60">
                                        <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">{item.badge}</div>
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-slate-900 leading-tight">{item.title}</div>
                                            <div className="text-xs text-slate-600 leading-snug">{item.desc}</div>
                                            <div className="text-[11px] text-slate-400 font-semibold">{item.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> API Status: {status.apiStatus}</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Database: {status.dbStatus}</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Hub Response: {status.hubResponseMs}ms</span>
                        <span className="ml-auto text-slate-400">Version {status.version}-stable | Build {status.build}</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

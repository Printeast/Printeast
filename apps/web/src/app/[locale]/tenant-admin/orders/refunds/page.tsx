import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getRefunds } from "@/services/admin-data";

const statusPill = (s: string) => {
    if (s.includes("Verification")) return "bg-blue-50 text-blue-700 border border-blue-100";
    if (s.includes("Pending")) return "bg-amber-50 text-amber-700 border border-amber-100";
    return "bg-slate-100 text-slate-700 border border-slate-200";
};

export default async function RefundsPage() {
    const { summary, rows } = await getRefunds();

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">Refunds Management</h1>
                            <p className="text-sm text-slate-500">Track and process refund requests across the platform.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">Export CSV</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Pending Refund Value (Today)</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">${summary.pendingValue.toLocaleString()}</div>
                            <div className="text-[11px] text-emerald-600 font-bold">↑ 12%</div>
                        </div>
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Avg. Processing Time</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">{summary.avgProcessingHours.toFixed(1)} Hours</div>
                        </div>
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Success Rate</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">{summary.successRate.toFixed(1)}%</div>
                            <div className="text-[11px] text-slate-400">4,500+ successful payouts this month</div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="px-4 py-3 border-b border-slate-200 text-sm font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-slate-500">•</span> Pending Refund Requests
                        </div>
                        <table className="w-full text-sm text-slate-800">
                            <thead className="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">Order ID</th>
                                    <th className="px-4 py-3 text-left">Customer Details</th>
                                    <th className="px-4 py-3 text-left">Refund Amount</th>
                                    <th className="px-4 py-3 text-left">Reason</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, idx) => (
                                    <tr key={r.id} className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                                        <td className="px-4 py-3">
                                            <div className="text-[#1e4bff] font-bold">#{r.id}</div>
                                            <div className="text-[11px] text-slate-500">Placed: Oct 12, 2023</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-800">{r.customer}</td>
                                        <td className="px-4 py-3 font-bold text-slate-900">{r.amount}</td>
                                        <td className="px-4 py-3 text-slate-700">{r.reason}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${statusPill(r.status)}`}>{r.status}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button className="rounded-lg bg-[#1e4bff] text-white px-3 py-2 text-[13px] font-semibold shadow hover:bg-[#163dcc]">Process Refund</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-200 flex items-center gap-2">
                            Showing 1 to 5 of 42 entries
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

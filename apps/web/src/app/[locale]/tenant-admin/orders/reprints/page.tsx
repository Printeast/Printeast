import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getReprints } from "@/services/admin-data";

const pill = (status: string) => {
    if (status.includes("Awaiting")) return "bg-amber-50 text-amber-700 border border-amber-100";
    if (status.includes("Pending")) return "bg-blue-50 text-blue-700 border border-blue-100";
    if (status.includes("Production")) return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    if (status.includes("Disputed")) return "bg-rose-50 text-rose-700 border border-rose-100";
    return "bg-slate-100 text-slate-700 border border-slate-200";
};

export default async function ReprintsPage() {
    const { summary, rows } = await getReprints();

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">Reprints & Replacements Queue</h1>
                            <p className="text-sm text-slate-500">Manage and approve quality-related replacement requests across all vendors.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">Export CSV</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Pending Approval</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">{summary.pending}</div>
                            <div className="text-[11px] text-amber-600 font-bold">! 8 high priority</div>
                        </div>
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Processed (24h)</div>
                            <div className="text-3xl font-black text-slate-900 mt-1">{summary.processed24h}</div>
                            <div className="text-[11px] text-emerald-600 font-bold">↑ 12% vs yesterday</div>
                        </div>
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Most Common Issue</div>
                            <div className="text-2xl font-black text-slate-900 mt-1">{summary.commonIssue}</div>
                            <div className="text-[11px] text-slate-500">38% of all requests</div>
                        </div>
                        <div className="rounded-2xl bg-white shadow-sm border border-slate-200 p-4">
                            <div className="text-xs text-slate-500 font-semibold">Avg. Turnaround</div>
                            <div className="text-2xl font-black text-slate-900 mt-1">{summary.avgTurnaroundDays}d</div>
                            <div className="text-[11px] text-slate-500">Target: &lt; 24h</div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-sm text-slate-800">
                            <thead className="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">Order ID</th>
                                    <th className="px-4 py-3 text-left">Reason</th>
                                    <th className="px-4 py-3 text-left">Responsible Vendor</th>
                                    <th className="px-4 py-3 text-left">Replacement Status</th>
                                    <th className="px-4 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, idx) => (
                                    <tr key={r.id} className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                                        <td className="px-4 py-3">
                                            <div className="text-[#1e4bff] font-bold">#{r.id}</div>
                                            <div className="text-[11px] text-slate-500">2h ago</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-800">{r.reason}</td>
                                        <td className="px-4 py-3 font-semibold">{r.vendor}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${pill(r.status)}`}>{r.status}</span>
                                        </td>
                                        <td className="px-4 py-3 flex flex-wrap gap-2">
                                            <button className="rounded-lg bg-[#1e4bff] text-white px-3 py-2 text-[13px] font-semibold shadow hover:bg-[#163dcc]">Approve Reprint</button>
                                            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700">Assign New Vendor</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-200">Showing 4 of 24 pending items</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

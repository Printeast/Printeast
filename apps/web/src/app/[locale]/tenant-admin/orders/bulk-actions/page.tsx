"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getBulkActionsJobs, type BulkActionJob } from "@/services/admin-data";

const actions = [
    { title: "Bulk Update Status", desc: "Change order states for all selected entries." },
    { title: "Bulk Change Vendor", desc: "Re-route selected orders to a new fulfillment partner." },
    { title: "Batch Export Invoices", desc: "Generate and ZIP all invoices for the selection." },
];

type Filters = {
    vendor: string;
    status: string;
    dateFrom: string;
    dateTo: string;
    region: string;
};

export default function BulkActionsPage() {
    const [filters, setFilters] = useState<Filters>({ vendor: "", status: "Any Status", dateFrom: "", dateTo: "", region: "Global / All Regions" });
    const [previewCount, setPreviewCount] = useState<number | null>(null);
    const [jobs, setJobs] = useState<BulkActionJob[]>([]);
    const [selectedAction, setSelectedAction] = useState(actions[0]?.title ?? "");
    const [executionNote, setExecutionNote] = useState<string>("");

    const filteredPreview = useMemo(() => previewCount ?? 0, [previewCount]);

    useEffect(() => {
        getBulkActionsJobs().then(setJobs);
    }, []);

    const onCalculate = () => {
        // Demo: simulate a target count based on status choice
        const base = 120;
        const mod = filters.status === "Any Status" ? 1 : 0.4;
        setPreviewCount(Math.floor(base * mod));
        setExecutionNote("");
    };

    const resetFilters = () => {
        setFilters({ vendor: "", status: "Any Status", dateFrom: "", dateTo: "", region: "Global / All Regions" });
        setPreviewCount(null);
        setExecutionNote("");
    };

    const updateFilter = (key: keyof Filters, value: string) => setFilters((f) => ({ ...f, [key]: value }));

    const onExecute = () => {
        const target = filteredPreview || 0;
        setExecutionNote(`Queued "${selectedAction}" for ${target} orders${filters.vendor ? ` with vendor: ${filters.vendor}` : ""}.`);
    };

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1200px] mx-auto px-6 py-6 space-y-5">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-slate-900">Bulk Actions Management</h1>
                        <p className="text-sm text-slate-500">Execute global administrative changes across multiple orders. Use the criteria selection tool to identify the target order set before performing actions.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-4">
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                                <span className="flex items-center gap-2 text-[#1e4bff]"><span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm">1</span> Define Scope</span>
                                <span className="text-slate-300">—</span>
                                <span className={`flex items-center gap-2 ${filteredPreview > 0 ? "text-[#1e4bff]" : "text-slate-400"}`}><span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm">2</span> Review Selection</span>
                                <span className="text-slate-300">—</span>
                                <span className={`flex items-center gap-2 ${executionNote ? "text-[#1e4bff]" : "text-slate-400"}`}><span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm">3</span> Execute Action</span>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                                <h3 className="text-sm font-bold text-slate-800">Criteria Selection Tool</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500 font-semibold">Vendor Selection</div>
                                        <input
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                            value={filters.vendor}
                                            onChange={(e) => updateFilter("vendor", e.target.value)}
                                            placeholder="Choose a vendor..."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500 font-semibold">Order Status</div>
                                        <select
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                            value={filters.status}
                                            onChange={(e) => updateFilter("status", e.target.value)}
                                        >
                                            <option>Any Status</option>
                                            <option>Pending</option>
                                            <option>In Production</option>
                                            <option>Shipped</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500 font-semibold">Date Range</div>
                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                            <input
                                                type="date"
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                                value={filters.dateFrom}
                                                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                                            />
                                            <span className="text-slate-400 text-sm">to</span>
                                            <input
                                                type="date"
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                                value={filters.dateTo}
                                                onChange={(e) => updateFilter("dateTo", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-xs text-slate-500 font-semibold">Shipping Region</div>
                                        <input
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                            value={filters.region}
                                            onChange={(e) => updateFilter("region", e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button className="rounded-lg bg-[#1e4bff] text-white px-4 py-2 text-sm font-semibold shadow hover:bg-[#163dcc]" onClick={onCalculate}>
                                        Calculate Selection
                                    </button>
                                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700" onClick={resetFilters}>
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                                <div className="text-sm font-bold text-slate-800">Selection Preview</div>
                                <div className="text-sm text-slate-500">{filteredPreview} Orders Targeted</div>
                                <div className="text-sm text-slate-400">No criteria applied yet. Select filters above to see the breakdown of orders that will be affected by your bulk actions.</div>
                            </div>

                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-white text-blue-600 font-bold text-sm">2</span>
                                    Review Selection
                                </div>
                                <div className="text-xs text-slate-600">Confirm scope before executing.</div>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200">Status: {filters.status}</span>
                                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200">Vendor: {filters.vendor || "Any"}</span>
                                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200">Region: {filters.region || "Any"}</span>
                                    <span className="px-3 py-1 rounded-full bg-white border border-slate-200">Date: {filters.dateFrom || "Start"} → {filters.dateTo || "Now"}</span>
                                </div>
                                <div className="text-sm font-semibold text-slate-800">{filteredPreview} orders will be affected.</div>
                            </div>

                            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 space-y-3">
                                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <span className="h-6 w-6 flex items-center justify-center rounded-full bg-white text-emerald-600 font-bold text-sm">3</span>
                                    Execute Action
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-3 items-end">
                                    <div className="space-y-2">
                                        <div className="text-xs text-slate-600 font-semibold">Choose action</div>
                                        <select
                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                            value={selectedAction}
                                            onChange={(e) => setSelectedAction(e.target.value)}
                                        >
                                            {actions.map((a) => (
                                                <option key={a.title}>{a.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button
                                            className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-emerald-700 disabled:opacity-60"
                                            onClick={onExecute}
                                            disabled={!filteredPreview}
                                        >
                                            Execute
                                        </button>
                                        <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700" onClick={resetFilters}>
                                            Reset
                                        </button>
                                    </div>
                                </div>
                                {executionNote && <div className="text-sm font-semibold text-emerald-700">{executionNote}</div>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <span className="text-lg">⚡</span> Available Actions
                                </div>
                                <div className="space-y-2 text-sm text-slate-700">
                                    {actions.map((a) => (
                                        <div key={a.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <div className="font-bold text-slate-900">{a.title}</div>
                                            <div className="text-xs text-slate-500">{a.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-amber-200 bg-amber-50 shadow-sm p-4 text-sm text-amber-800">
                                <div className="font-bold">Super Admin Clearance</div>
                                <p className="text-xs text-amber-700">Bulk actions are irreversible via this tool. A double-confirmation screen will appear before execution.</p>
                            </div>
                        </div>
                    </div>

                     <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                            <span>Recent Bulk Activity</span>
                            <button className="text-xs text-blue-600 font-bold">View All Logs</button>
                        </div>
                        {jobs.length === 0 ? (
                            <div className="text-sm text-slate-500 mt-4">No bulk actions performed in the last 24 hours.</div>
                        ) : (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-xs uppercase text-slate-500">
                                            <th className="py-2">Job ID</th>
                                            <th className="py-2">Action</th>
                                            <th className="py-2">Targets</th>
                                            <th className="py-2">Status</th>
                                            <th className="py-2">Created</th>
                                            <th className="py-2">Finished</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {jobs.map((job) => (
                                            <tr key={job.jobId} className="text-slate-700">
                                                <td className="py-2 font-semibold text-slate-900">{job.jobId}</td>
                                                <td className="py-2">{job.action}</td>
                                                <td className="py-2">{job.targetCount.toLocaleString()}</td>
                                                <td className="py-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${job.status === "Completed" ? "bg-emerald-50 text-emerald-700" : job.status === "In Progress" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="py-2 text-slate-500">{new Date(job.createdAt).toLocaleString()}</td>
                                                <td className="py-2 text-slate-500">{job.finishedAt ? new Date(job.finishedAt).toLocaleString() : "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

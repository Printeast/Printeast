"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getOrders, OrderRow } from "@/services/admin-data";

const pillColor = (s: string) => {
    if (s === "In Production") return "bg-blue-50 text-blue-700 border border-blue-100";
    if (s === "Shipped") return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    if (s === "Pending") return "bg-amber-50 text-amber-700 border border-amber-100";
    if (s === "Delivered") return "bg-slate-100 text-slate-700 border border-slate-200";
    if (s === "Cancelled") return "bg-rose-50 text-rose-700 border border-rose-100";
    return "bg-slate-100 text-slate-700 border border-slate-200";
};

type Filters = {
    source: string;
    provider: string;
    dateFrom: string;
    dateTo: string;
    role: string;
};

export default function OrdersPage() {
    const [filters, setFilters] = useState<Filters>({ source: "All", provider: "All", dateFrom: "", dateTo: "", role: "All" });
    const [data, setData] = useState<OrderRow[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const rows = await getOrders();
            setData(rows);
            setLoading(false);
        };
        load();
    }, []);

    const filtered = useMemo(() => {
        return data.filter((o) => {
            const matchSource = filters.source === "All" || o.source === filters.source;
            const matchProvider = filters.provider === "All" || o.provider === filters.provider;
            const matchRole = filters.role === "All" || o.role === filters.role.toLowerCase();

            let matchDate = true;
            if (filters.dateFrom || filters.dateTo) {
                const placed = new Date(o.placedAt).getTime();
                const from = filters.dateFrom ? new Date(filters.dateFrom).getTime() : Number.NEGATIVE_INFINITY;
                const to = filters.dateTo ? new Date(filters.dateTo).getTime() : Number.POSITIVE_INFINITY;
                matchDate = placed >= from && placed <= to;
            }

            return matchSource && matchProvider && matchRole && matchDate;
        });
    }, [data, filters]);

    const onApply = () => {
        // In real impl, pass filters to API. Here we just re-run local filter (already memoized).
        setData((prev) => [...prev]);
    };

    const onReset = () => {
        setFilters({ source: "All", provider: "All", dateFrom: "", dateTo: "", role: "All" });
    };

    const updateFilter = (key: keyof Filters, value: string) => setFilters((f) => ({ ...f, [key]: value }));

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">All Orders Management</h1>
                            <p className="text-sm text-slate-500">Monitor and manage all customer orders across your platform.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">Export CSV</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-500">Store Source</div>
                            <select
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                value={filters.source}
                                onChange={(e) => updateFilter("source", e.target.value)}
                            >
                                <option>All</option>
                                <option>Vertex</option>
                                <option>Creative</option>
                                <option>Studio</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-500">Fulfillment Provider</div>
                            <select
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                value={filters.provider}
                                onChange={(e) => updateFilter("provider", e.target.value)}
                            >
                                <option>All</option>
                                <option>PrintX</option>
                                <option>EuroPrint</option>
                                <option>Textile</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-500">Role</div>
                            <select
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                                value={filters.role}
                                onChange={(e) => updateFilter("role", e.target.value)}
                            >
                                <option>All</option>
                                <option>artist</option>
                                <option>individual</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <div className="text-xs font-semibold text-slate-500">Date Range</div>
                            <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
                                <input
                                    type="date"
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                                    value={filters.dateFrom}
                                    onChange={(e) => updateFilter("dateFrom", e.target.value)}
                                />
                                <input
                                    type="date"
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                                    value={filters.dateTo}
                                    onChange={(e) => updateFilter("dateTo", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-end justify-end gap-2">
                            <button
                                className="rounded-lg bg-[#1e4bff] text-white px-4 py-2 text-sm font-semibold shadow hover:bg-[#163dcc]"
                                onClick={onApply}
                                disabled={loading}
                            >
                                Apply Filters
                            </button>
                            <button
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                                onClick={onReset}
                                disabled={loading}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-sm text-slate-800">
                            <thead className="text-xs uppercase tracking-wide text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left">Order ID</th>
                                    <th className="px-4 py-3 text-left">Seller Name</th>
                                    <th className="px-4 py-3 text-left">Role</th>
                                    <th className="px-4 py-3 text-left">Fulfillment Status</th>
                                    <th className="px-4 py-3 text-left">Total Value</th>
                                    <th className="px-4 py-3 text-left">Platform Fee</th>
                                    <th className="px-4 py-3 text-left"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((o, idx) => (
                                    <tr key={o.id} className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-slate-50/50" : "bg-white"}`}>
                                        <td className="px-4 py-3">
                                            <div className="text-[#1e4bff] font-bold">#{o.id}</div>
                                            <div className="text-[11px] text-slate-500">{new Date(o.placedAt).toLocaleString()}</div>
                                        </td>
                                        <td className="px-4 py-3 font-semibold">{o.seller}</td>
                                        <td className="px-4 py-3 text-slate-700">
                                            <div className="font-semibold text-slate-800">{o.contact}</div>
                                            <div className="text-[12px] font-semibold text-slate-500 capitalize">{o.role}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${pillColor(o.status)}`}>{o.status}</span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-slate-900">{o.value}</td>
                                        <td className="px-4 py-3 text-slate-700">{o.fee}</td>
                                        <td className="px-4 py-3 text-right text-slate-400">⋮</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-200">
                            <span>Showing 1 to 10 of 1,240 orders</span>
                            <div className="flex items-center gap-1 text-slate-700">
                                <button className="px-2 py-1 rounded border border-slate-200 bg-white">Previous</button>
                                {[1, 2, 3].map((n) => (
                                    <button key={n} className={`px-2 py-1 rounded border border-slate-200 ${n === 1 ? "bg-[#1e4bff] text-white" : "bg-white"}`}>{n}</button>
                                ))}
                                <button className="px-2 py-1 rounded border border-slate-200 bg-white">Next</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

"use client";

import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AlertTriangle, BarChart2, CheckCheck, Download, Users, ToggleLeft, ToggleRight, MapPin } from "lucide-react";

type SupplierPerf = {
    id: string;
    name: string;
    code: string;
    region: string;
    capacityPct: number;
    prodTimeHrs: number;
    slaCompliance: number;
    slaLabel: "HIGH" | "MED" | "CRIT";
    override: boolean;
};

const suppliers: SupplierPerf[] = [
    { id: "SUP-001", name: "North Star Printing", code: "PR-09221", region: "North America", capacityPct: 82, prodTimeHrs: 14.2, slaCompliance: 99.1, slaLabel: "HIGH", override: false },
    { id: "SUP-002", name: "Elite Graphics Co.", code: "PR-04532", region: "North America", capacityPct: 94, prodTimeHrs: 18.5, slaCompliance: 88.5, slaLabel: "MED", override: true },
    { id: "SUP-003", name: "Velocity Print Solutions", code: "PR-01123", region: "EMEA", capacityPct: 100, prodTimeHrs: 26.1, slaCompliance: 72.3, slaLabel: "CRIT", override: false },
    { id: "SUP-004", name: "Apex Fulfillment", code: "PR-00982", region: "APAC", capacityPct: 45, prodTimeHrs: 9.5, slaCompliance: 90.8, slaLabel: "HIGH", override: false },
    { id: "SUP-005", name: "Quantum Press", code: "PR-08871", region: "EMEA", capacityPct: 67, prodTimeHrs: 12.0, slaCompliance: 97.4, slaLabel: "HIGH", override: false },
];

const regions = ["All Regions", "North America", "EMEA", "APAC"];

function capacityColor(pct: number) {
    if (pct >= 90) return "bg-blue-500";
    if (pct >= 70) return "bg-green-500";
    if (pct >= 50) return "bg-amber-400";
    return "bg-slate-300";
}

function slaBadge(label: SupplierPerf["slaLabel"]) {
    if (label === "CRIT") return "bg-rose-50 text-rose-700 border border-rose-200";
    if (label === "MED") return "bg-amber-50 text-amber-700 border border-amber-200";
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
}

export default function CapacitySlaPage() {
    const [region, setRegion] = useState("All Regions");
    const [peakMode, setPeakMode] = useState(true);

    const visible = useMemo(() => {
        return suppliers.filter((s) => region === "All Regions" || s.region === region);
    }, [region]);

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-slate-900">Capacity & SLA Management</h1>
                            <p className="text-sm text-slate-500">Monitor manufacturing limits and production performance for active print suppliers.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPeakMode((v) => !v)}
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-black uppercase tracking-[0.12em] border ${peakMode ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-white text-slate-600 border-slate-200"}`}
                            >
                                Peak Season Mode
                                {peakMode ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            </button>
                            <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-slate-800">
                                <Download className="w-4 h-4" />
                                Export Report
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <MetricCard
                            title="Avg. Capacity Util."
                            value="78.4%"
                            sub={
                                <span className="text-emerald-600 text-sm font-bold">+2.1%</span>
                            }
                            icon={<BarChart2 className="w-4 h-4 text-slate-500" />}
                        />
                        <MetricCard
                            title="SLA Compliance"
                            value="96.2%"
                            sub={<span className="text-emerald-600 text-sm font-bold">Stable</span>}
                            icon={<CheckCheck className="w-4 h-4 text-emerald-500" />}
                        />
                        <MetricCard
                            title="Critical Backlogs"
                            value="3"
                            sub={<span className="text-rose-600 text-sm font-bold">+1 today</span>}
                            icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
                        />
                        <MetricCard
                            title="Active Suppliers"
                            value="42"
                            sub={<span className="text-slate-500 text-sm">Live</span>}
                            icon={<Users className="w-4 h-4 text-slate-500" />}
                        />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 text-sm font-bold text-slate-800">
                            <span>Live Supplier Performance</span>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
                                >
                                    {regions.map((r) => (
                                        <option key={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-800">
                                <thead className="text-[11px] uppercase tracking-[0.12em] text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Supplier Name</th>
                                        <th className="px-4 py-3 text-left">Current Daily Capacity %</th>
                                        <th className="px-4 py-3 text-left">Avg. Prod Time</th>
                                        <th className="px-4 py-3 text-left">SLA Compliance</th>
                                        <th className="px-4 py-3 text-left">Capacity Override</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visible.map((s) => (
                                        <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                                            <td className="px-4 py-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
                                                        <MapPin className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 leading-tight">{s.name}</div>
                                                        <div className="text-[11px] text-slate-500">ID: {s.code}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                        <div className={`h-full ${capacityColor(s.capacityPct)}`} style={{ width: `${s.capacityPct}%` }} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-800">{s.capacityPct}%</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">{s.prodTimeHrs.toFixed(1)} hrs</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${slaBadge(s.slaLabel)}`}>
                                                    {s.slaCompliance.toFixed(1)}% {s.slaLabel}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <ToggleSwitch checked={s.override} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 text-xs text-slate-500 border-t border-slate-200">
                            <span>Showing {visible.length} of {suppliers.length} active suppliers</span>
                            <div className="flex items-center gap-1 text-slate-700">
                                <button className="px-2 py-1 rounded border border-slate-200 bg-white">Previous</button>
                                {[1, 2].map((n) => (
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

function ToggleSwitch({ checked }: { checked: boolean }) {
    return (
        <div
            className={`relative h-6 w-11 rounded-full border transition-colors duration-200 ${checked ? "bg-[#1e4bff] border-[#1e4bff]" : "bg-slate-200 border-slate-300"}`}
            role="switch"
            aria-checked={checked}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`}
            />
        </div>
    );
}

type MetricCardProps = {
    title: string;
    value: string;
    sub: React.ReactNode;
    icon: React.ReactNode;
};

function MetricCard({ title, value, sub, icon }: MetricCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex items-center justify-between">
            <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500 flex items-center gap-2">
                    {title}
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500">
                        {icon}
                    </span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-1">{value}</div>
                <div className="text-xs mt-1">{sub}</div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AlertTriangle, Megaphone, Search, Filter, MinusCircle, Clock, AlertOctagon } from "lucide-react";

type Incident = {
    id: string;
    title: string;
    severity: "Critical" | "Major" | "Minor" | "Penalized";
    supplier: string;
    supplierId: string;
    region: string;
    status: string;
    time: string;
    description: string;
    cta?: string;
};

const incidents: Incident[] = [
    {
        id: "SUP-992",
        title: "Equipment Failure: DTG Production Line #4",
        severity: "Critical",
        supplier: "Facility North America West",
        supplierId: "#SUP-992",
        region: "North America West",
        status: "Investigating",
        time: "Oct 24, 2023 · 09:42 AM",
        description:
            "Primary DTG printers in the Seattle hub are offline due to a widespread power surge. Estimated 48-hour delay on all pending \"Premium Tee\" orders. Routing logic has been automatically updated to bypass this facility for new orders.",
        cta: "View Mitigation Log",
    },
    {
        id: "SUP-104",
        title: "Logistics Delay: Severe Weather",
        severity: "Major",
        supplier: "European Central Hub",
        supplierId: "#SUP-104",
        region: "DACH/FR",
        status: "Resolved",
        time: "Oct 23, 2023 · 02:15 PM",
        description:
            "Heavy snowfall in the Bavarian region impacted outbound shipments. Backlog has been cleared as of 14:00 today. All tracked packages are now moving through the Munich interchange.",
        cta: "Download Resolution Summary",
    },
    {
        id: "SUP-221",
        title: "Inaccurate Stock Reporting",
        severity: "Minor",
        supplier: "East Asia Apparel",
        supplierId: "#SUP-221",
        region: "APAC",
        status: "Penalized",
        time: "Oct 21, 2023 · 11:30 AM",
        description:
            "Supplier failed to report stock-outs on \"Navy Blue XL\" SKU for three consecutive days, leading to 142 customer cancellations. A performance penalty of $2,500 has been applied to the current billing cycle.",
        cta: "View Penalty Details",
    },
];

const severityColor: Record<Incident["severity"], string> = {
    Critical: "bg-rose-50 text-rose-700 border border-rose-200",
    Major: "bg-amber-50 text-amber-700 border border-amber-200",
    Minor: "bg-slate-100 text-slate-500 border border-slate-200",
    Penalized: "bg-purple-50 text-purple-700 border border-purple-200",
};

export default function SupplierIncidentsPage() {
    const [severity, setSeverity] = useState("All Severities");
    const [status, setStatus] = useState("All Statuses");
    const [range, setRange] = useState("Last 30 Days");
    const [search, setSearch] = useState("");

    const filtered = incidents.filter((inc) => {
        const matchesSeverity = severity === "All Severities" || inc.severity === severity;
        const matchesStatus = status === "All Statuses" || inc.status === status;
        const matchesSearch = !search || inc.title.toLowerCase().includes(search.toLowerCase()) || inc.supplier.toLowerCase().includes(search.toLowerCase());
        return matchesSeverity && matchesStatus && matchesSearch;
    });

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">Supplier Incidents Log</h1>
                            <p className="text-sm text-slate-500">Live visibility into supplier outages, delays, and escalations.</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-lg bg-[#1e4bff] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163dcc]">
                            <Megaphone className="w-4 h-4" /> Broadcast Alert to Sellers
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-xl shadow-sm p-3">
                        <FilterSelect label="Filter by:" value={severity} onChange={setSeverity} options={["All Severities", "Critical", "Major", "Minor", "Penalized"]} />
                        <FilterSelect label="" value={status} onChange={setStatus} options={["All Statuses", "Investigating", "Resolved", "Penalized"]} />
                        <FilterSelect label="" value={range} onChange={setRange} options={["Last 30 Days", "Last 7 Days", "Last 90 Days"]} />
                        <div className="flex items-center">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search suppliers..."
                                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="text-[12px] font-black uppercase tracking-[0.18em] text-slate-500">Live Incident Timeline</div>
                        <div className="space-y-3">
                            {filtered.map((inc, idx) => (
                                <div key={inc.id} className="grid grid-cols-[48px_1fr] gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`h-10 w-10 rounded-full border ${severityColor[inc.severity]} flex items-center justify-center`}> 
                                            {inc.severity === "Critical" && <AlertOctagon className="w-5 h-5" />}
                                            {inc.severity === "Major" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                                            {inc.severity === "Minor" && <MinusCircle className="w-5 h-5 text-slate-500" />}
                                            {inc.severity === "Penalized" && <Clock className="w-5 h-5 text-purple-700" />}
                                        </div>
                                        {idx !== filtered.length - 1 && <div className="flex-1 w-px bg-slate-200" />}
                                    </div>

                                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-2">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-900 leading-tight">{inc.title}</h3>
                                                    <span className={`text-[11px] font-black uppercase tracking-[0.12em] px-2 py-1 rounded-full ${severityColor[inc.severity]}`}>
                                                        {inc.severity}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-slate-500 mt-1">
                                                    Supplier: {inc.supplier} (ID: {inc.supplierId})
                                                </div>
                                            </div>
                                            <div className="text-[12px] text-slate-500">{inc.status}</div>
                                        </div>
                                        <div className="text-[13px] text-slate-700 leading-relaxed">{inc.description}</div>
                                        <div className="flex items-center justify-between text-[12px] text-slate-500">
                                            <div className="inline-flex items-center gap-2">{inc.time}</div>
                                            {inc.cta && (
                                                <button className="text-[12px] font-semibold text-[#1e4bff] hover:underline">{inc.cta}</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function FilterSelect({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: string[] }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <span className="text-[11px] font-semibold text-slate-500">{label}</span>}
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
                >
                    {options.map((opt) => (
                        <option key={opt}>{opt}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

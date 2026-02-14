"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState } from "react";
import { Plus, ChevronDown, ShieldCheck, AlertTriangle, MoreHorizontal, MoveVertical } from "lucide-react";

type Condition = {
    type: string;
    operator: string;
    value: string;
};

type RuleRow = {
    id: string;
    name: string;
    status: "ACTIVE" | "INACTIVE" | "DRAFT";
    summary: string[];
    created: string;
};

const ruleRows: RuleRow[] = [
    {
        id: "01",
        name: "High Value Domestic",
        status: "ACTIVE",
        created: "Created 2 days ago",
        summary: ["If Value > $1000 AND Region = US", "Then Route to HQ Warehouse"],
    },
    {
        id: "02",
        name: "Standard AU Shipping",
        status: "ACTIVE",
        created: "Created 1 week ago",
        summary: ["If Region = Australia", "Then Route to Sydney 3PL"],
    },
    {
        id: "03",
        name: "Holiday Surcharge Test",
        status: "INACTIVE",
        created: "Draft",
        summary: ["If Date matches Holiday", "Then Add $5.00 Handling"],
    },
];

export default function FulfillmentRoutingRulesPage() {
    const [conditions] = useState<Condition[]>([
        { type: "Destination Geography", operator: "is in", value: "Europe, UK" },
        { type: "Landed Cost", operator: "is less than", value: "$500.00" },
    ]);

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-slate-900">Fulfillment Routing Rules</h1>
                            <p className="text-sm text-slate-500">Define logic to automate order assignment across suppliers.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="inline-flex items-center gap-2 rounded-lg bg-[#1e4bff] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163dcc]">
                                <Plus className="w-4 h-4" />
                                Create New Rule
                            </button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-4">
                        <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                            <span className="inline-flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-slate-500" /> Rule Builder: Regional Priority
                            </span>
                            <div className="flex items-center gap-2 text-xs">
                                <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700">Cancel</button>
                                <button className="rounded-lg bg-[#1e4bff] text-white px-3 py-1.5 font-semibold shadow hover:bg-[#163dcc]">Save Changes</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 text-[#1e4bff] font-black flex items-center justify-center">IF</div>
                                <div className="flex-1 space-y-3">
                                    {conditions.map((c, idx) => (
                                        <div key={c.type} className="grid grid-cols-3 gap-3 items-center rounded-lg border border-slate-200 bg-white shadow-sm p-3">
                                            <LabeledSelect label="Condition Type" value={c.type} />
                                            <LabeledSelect label="Operator" value={c.operator} />
                                            <LabeledSelect label="Value" value={c.value} />
                                            {idx === 0 && (
                                                <div className="col-span-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                                                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                        AND
                                                    </span>
                                                    <span>Additional Condition</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 font-black flex items-center justify-center">THEN</div>
                                <div className="flex-1 grid grid-cols-3 gap-3 items-center rounded-lg border border-emerald-200 bg-emerald-50 shadow-sm p-3">
                                    <LabeledSelect label="Action" value="Route to Supplier" accent="emerald" />
                                    <LabeledSelect label="" value="" hiddenChevron />
                                    <LabeledSelect label="Supplier Selection" value="Main Distribution Center - Berlin" accent="emerald" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                            <span>Active Routing Stack</span>
                            <span className="text-[11px] text-slate-500">Rules are processed top-to-bottom</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-slate-800">
                                <thead className="text-[11px] uppercase tracking-[0.12em] text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="px-3 py-2 text-left w-12">#</th>
                                        <th className="px-3 py-2 text-left">Rule Name</th>
                                        <th className="px-3 py-2 text-left">Logic Summary</th>
                                        <th className="px-3 py-2 text-left">Status</th>
                                        <th className="px-3 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ruleRows.map((r) => (
                                        <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                                            <td className="px-3 py-3 text-slate-400 text-[12px] font-semibold">{r.id}</td>
                                            <td className="px-3 py-3">
                                                <div className="font-semibold text-slate-900">{r.name}</div>
                                                <div className="text-[11px] text-slate-500">{r.created}</div>
                                            </td>
                                            <td className="px-3 py-3 text-slate-800">
                                                {r.summary.map((line, idx) => (
                                                    <div key={idx} className={`${idx === 0 ? "text-[13px] font-semibold" : "text-[12px] text-blue-700"}`}>{line}</div>
                                                ))}
                                            </td>
                                            <td className="px-3 py-3">
                                                <StatusBadge status={r.status} />
                                            </td>
                                            <td className="px-3 py-3 text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 rounded-lg hover:bg-slate-100" aria-label="edit rule">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InfoCard
                            title="Global Optimization"
                            desc="Rules are automatically tested against current carrier rates to ensure minimum shipping spend."
                            icon={<ShieldCheck className="w-5 h-5" />}
                        />
                        <InfoCard
                            title="Capacity Aware"
                            desc="Routing logic bypasses suppliers currently at 100% processing capacity or in 'Incident' mode."
                            icon={<MoveVertical className="w-5 h-5" />}
                        />
                        <InfoCard
                            title="Performance Logs"
                            desc="Monitor which rules are triggering most frequently in the fulfillment analytics dashboard."
                            icon={<AlertTriangle className="w-5 h-5" />}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function LabeledSelect({ label, value, accent, hiddenChevron }: { label: string; value: string; accent?: "emerald"; hiddenChevron?: boolean }) {
    const accentBorder = accent === "emerald" ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white";
    const accentText = accent === "emerald" ? "text-emerald-700" : "text-slate-800";
    return (
        <div className={`rounded-lg border ${accentBorder} px-3 py-2 shadow-sm flex items-center justify-between gap-2`}>
            <div>
                {label && <div className="text-[11px] uppercase font-semibold text-slate-500">{label}</div>}
                <div className={`text-sm font-semibold ${accentText}`}>{value || ""}</div>
            </div>
            {!hiddenChevron && <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
    );
}

function StatusBadge({ status }: { status: RuleRow["status"] }) {
    if (status === "ACTIVE") return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>;
    if (status === "DRAFT") return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Draft</span>;
    return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Inactive</span>;
}

function InfoCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                {icon}
            </div>
            <div>
                <div className="font-bold text-slate-900 mb-1">{title}</div>
                <div className="text-sm text-slate-600 leading-relaxed">{desc}</div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Search, CheckCircle2, AlertTriangle, MapPin, ShieldCheck, MoreHorizontal, Plus, RefreshCw } from "lucide-react";

type SkuItem = {
    id: string;
    name: string;
    category: string;
    regions: number;
    status: "Configured" | "Partial Map" | "Unmapped";
};

type ProviderCard = {
    name: string;
    code: string;
    baseCost?: string;
    sla?: string;
    trigger?: string;
    fallbackCost?: string;
};

type RegionConfig = {
    name: string;
    status: "LIVE" | "DRAFT" | "IN PRODUCTION";
    primary?: ProviderCard;
    fallback?: ProviderCard;
    empty?: boolean;
};

const skuList: SkuItem[] = [
    { id: "SKU-PRT-00124", name: "Canvas Art Print - 24x36", category: "Wall Decor • Print-on-Demand", regions: 4, status: "Configured" },
    { id: "SKU-PRT-00125", name: "Canvas Art Print - 18x24", category: "Wall Decor • Print-on-Demand", regions: 4, status: "Partial Map" },
    { id: "SKU-PRT-00892", name: "Aura Coffee Mug - 11oz", category: "Drinkware • Ceramics", regions: 1, status: "Unmapped" },
];

const regions: RegionConfig[] = [
    {
        name: "North America (US/CA)",
        status: "IN PRODUCTION",
        primary: {
            name: "Stellar Prints West",
            code: "PRV-ST-881",
            baseCost: "$14.50",
            sla: "24-48 Hours",
        },
        fallback: {
            name: "EcoCanvas Hub",
            code: "PRV-EC-002",
            trigger: "SLA Exceeded > 15%",
            fallbackCost: "$16.20",
        },
    },
    {
        name: "European Union (DACH/FR)",
        status: "DRAFT",
        empty: true,
    },
];

export default function SkuSupplierMappingPage() {
    const [selectedSku, setSelectedSku] = useState<SkuItem>(skuList[0]!);
    const [search, setSearch] = useState("");

    const filteredSkus = skuList.filter((sku) => sku.name.toLowerCase().includes(search.toLowerCase()) || sku.id.toLowerCase().includes(search.toLowerCase()));

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <aside className="w-full lg:w-[320px] bg-white border border-slate-200 rounded-xl shadow-sm p-3 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 uppercase tracking-[0.14em] px-1">SKU → Supplier Mapping</div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by SKU, Product or Category..."
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                                {filteredSkus.map((sku) => (
                                    <button
                                        key={sku.id}
                                        onClick={() => setSelectedSku(sku)}
                                        className={`w-full text-left rounded-lg border px-3 py-3 transition-colors ${
                                            selectedSku.id === sku.id ? "border-[#1e4bff] bg-blue-50/60" : "border-slate-200 bg-white hover:border-blue-200"
                                        }`}
                                    >
                                        <div className="text-[12px] font-black uppercase tracking-[0.12em] text-[#1e4bff]">{sku.id}</div>
                                        <div className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{sku.name}</div>
                                        <div className="text-[12px] text-slate-500 mt-1">Category: {sku.category}</div>
                                        <div className="flex items-center gap-2 text-[11px] mt-2 text-slate-500">
                                            <span>{sku.regions} Regions</span>
                                            {sku.status === "Configured" && (
                                                <span className="inline-flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3 h-3" /> Configured</span>
                                            )}
                                            {sku.status === "Partial Map" && (
                                                <span className="inline-flex items-center gap-1 text-amber-500"><AlertTriangle className="w-3 h-3" /> Partial Map</span>
                                            )}
                                            {sku.status === "Unmapped" && (
                                                <span className="inline-flex items-center gap-1 text-slate-500">Unmapped</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <section className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl font-black text-slate-900">{selectedSku.name}</h1>
                                        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                                            {selectedSku.id}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Configure primary and fallback print providers for this SKU across global fulfillment zones. Changes will affect routing for new orders immediately.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 inline-flex items-center gap-2 hover:border-slate-300">
                                        <RefreshCw className="w-4 h-4" /> Bulk Import
                                    </button>
                                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
                                {[
                                    "Regional Fulfillment",
                                    "Service Details",
                                    "Cost Optimization",
                                ].map((tab, idx) => (
                                    <button
                                        key={tab}
                                        className={`pb-2 border-b-2 ${idx === 0 ? "border-[#1e4bff] text-[#1e4bff]" : "border-transparent hover:border-slate-200"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                                <div className="ml-auto flex items-center gap-2">
                                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">Show: Active Regions</button>
                                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1e4bff] inline-flex items-center gap-1">
                                        <Plus className="w-4 h-4" /> Add Region
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {regions.map((r) => (
                                    <div key={r.name} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                        <div className="flex items-center justify-between text-sm font-semibold text-slate-800 mb-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-500" />
                                                <span>{r.name}</span>
                                            </div>
                                            <span className={`text-[11px] font-black uppercase tracking-[0.12em] px-2 py-1 rounded-full ${
                                                r.status === "IN PRODUCTION" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                                            }`}>
                                                {r.status}
                                            </span>
                                        </div>

                                        {r.empty ? (
                                            <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white p-5 text-center text-slate-500">
                                                <div className="font-semibold">No Suppliers Assigned for EU</div>
                                                <div className="text-sm text-slate-500">Add a primary provider to begin fulfillment in this region.</div>
                                                <div className="mt-3">
                                                    <button className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300">
                                                        Configure Regional Providers
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <ProviderPanel title="Primary Provider" provider={r.primary!} canChange />
                                                <ProviderPanel title="Fallback Provider (Overflow)" provider={r.fallback!} canChange />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" /> Live
                                    <span className="ml-3">Last modified by super_admin today at 09:42 AM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300">Discard Changes</button>
                                    <button className="rounded-lg bg-[#1e4bff] text-white px-4 py-2 text-sm font-semibold shadow hover:bg-[#163dcc]">Save Mapping</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function ProviderPanel({ title, provider, canChange }: { title: string; provider: ProviderCard; canChange?: boolean }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-2">
            <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500 flex items-center justify-between">
                <span>{title}</span>
                {canChange && <button className="text-[#1e4bff] text-[11px] font-bold">Change</button>}
            </div>
            <div className="flex items-start gap-3">
                <ShieldCheck className="w-8 h-8 text-[#1e4bff]" />
                <div className="flex-1">
                    <div className="font-bold text-slate-900 leading-tight">{provider.name}</div>
                    <div className="text-[11px] text-slate-500">ID: {provider.code}</div>
                    <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-600 mt-2">
                        {provider.baseCost && (
                            <div>
                                <div className="text-[11px] uppercase font-semibold text-slate-500">Base Cost</div>
                                <div className="font-semibold text-slate-800">{provider.baseCost}</div>
                            </div>
                        )}
                        {provider.sla && (
                            <div>
                                <div className="text-[11px] uppercase font-semibold text-slate-500">SLA (Lead Time)</div>
                                <div className="font-semibold text-slate-800">{provider.sla}</div>
                            </div>
                        )}
                        {provider.trigger && (
                            <div>
                                <div className="text-[11px] uppercase font-semibold text-slate-500">Trigger Point</div>
                                <div className="font-semibold text-slate-800">{provider.trigger}</div>
                            </div>
                        )}
                        {provider.fallbackCost && (
                            <div>
                                <div className="text-[11px] uppercase font-semibold text-slate-500">Fallback Cost</div>
                                <div className="font-semibold text-slate-800">{provider.fallbackCost}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

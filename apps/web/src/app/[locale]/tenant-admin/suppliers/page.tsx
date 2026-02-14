"use client";

import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Search, Plus, MapPin, ShieldCheck, Factory, Package, Shirt, PanelsTopLeft } from "lucide-react";

type Supplier = {
    id: string;
    name: string;
    city: string;
    country: string;
    status: "Active" | "Pending" | "Maintenance" | "Inactive";
    categories: string[];
    successRate: number; // percent
    profileUrl?: string;
    createdAt: string;
    icon: "factory" | "package" | "shirt" | "panel";
};

const suppliers: Supplier[] = [
    {
        id: "SUP-001",
        name: "Global Print Solutions",
        city: "Berlin",
        country: "Germany",
        status: "Active",
        categories: ["Apparel", "DTG", "Headwear"],
        successRate: 98,
        createdAt: "2024-03-18T10:00:00Z",
        icon: "factory",
    },
    {
        id: "SUP-002",
        name: "Elite Canvas Arts",
        city: "Austin, TX",
        country: "USA",
        status: "Active",
        categories: ["Wall Art", "Canvas"],
        successRate: 100,
        createdAt: "2024-04-21T10:00:00Z",
        icon: "panel",
    },
    {
        id: "SUP-003",
        name: "Home Decor Co.",
        city: "London",
        country: "UK",
        status: "Maintenance",
        categories: ["Mugs", "Pillows", "Kitchenware"],
        successRate: 85,
        createdAt: "2023-12-01T10:00:00Z",
        icon: "package",
    },
    {
        id: "SUP-004",
        name: "Sticker Giant Pro",
        city: "Melbourne",
        country: "Australia",
        status: "Active",
        categories: ["Stickers", "Labels"],
        successRate: 99.9,
        createdAt: "2024-05-04T10:00:00Z",
        icon: "package",
    },
    {
        id: "SUP-005",
        name: "Premium Journals Hub",
        city: "Tokyo",
        country: "Japan",
        status: "Inactive",
        categories: ["Stationery", "Books"],
        successRate: 0,
        createdAt: "2023-10-14T10:00:00Z",
        icon: "package",
    },
    {
        id: "SUP-006",
        name: "Eco-Textiles Ltd.",
        city: "Amsterdam",
        country: "NL",
        status: "Active",
        categories: ["Organic Apparel", "Embroidery"],
        successRate: 92,
        createdAt: "2024-01-28T10:00:00Z",
        icon: "shirt",
    },
    {
        id: "SUP-007",
        name: "Metro Printworks",
        city: "Toronto",
        country: "Canada",
        status: "Pending",
        categories: ["Posters", "Calendars"],
        successRate: 0,
        createdAt: "2024-06-02T10:00:00Z",
        icon: "factory",
    },
];

const statusTone: Record<Supplier["status"], string> = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    Pending: "bg-amber-50 text-amber-700 border border-amber-100",
    Maintenance: "bg-orange-50 text-orange-700 border border-orange-100",
    Inactive: "bg-slate-100 text-slate-500 border border-slate-200",
};

const statusTabs: (Supplier["status"] | "All")[] = ["All", "Active", "Pending", "Maintenance", "Inactive"];

const sortOptions = [
    { label: "Recently Added", value: "recent" },
    { label: "Success Rate", value: "success" },
    { label: "Name", value: "name" },
];

function iconFor(kind: Supplier["icon"]) {
    if (kind === "package") return <Package className="w-5 h-5 text-slate-600" />;
    if (kind === "shirt") return <Shirt className="w-5 h-5 text-slate-600" />;
    if (kind === "panel") return <PanelsTopLeft className="w-5 h-5 text-slate-600" />;
    return <Factory className="w-5 h-5 text-slate-600" />;
}

export default function SupplierDirectoryPage() {
    const [tab, setTab] = useState<string>("All");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("recent");

    const filtered = useMemo(() => {
        let rows = suppliers.filter((s) => {
            const matchTab = tab === "All" || s.status === tab;
            const term = search.trim().toLowerCase();
            const matchSearch = !term || s.name.toLowerCase().includes(term) || s.categories.some((c) => c.toLowerCase().includes(term)) || `${s.city} ${s.country}`.toLowerCase().includes(term);
            return matchTab && matchSearch;
        });

        if (sort === "success") rows = rows.sort((a, b) => b.successRate - a.successRate);
        else if (sort === "name") rows = rows.sort((a, b) => a.name.localeCompare(b.name));
        else rows = rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return rows;
    }, [tab, search, sort]);

    return (
        <DashboardLayout user={{ email: "admin@printeast", role: "TENANT_ADMIN" as any }} fullBleed>
            <div className="min-h-full w-full bg-[#f6f8fb]">
                <div className="max-w-[1440px] mx-auto px-6 py-6 space-y-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black text-slate-900">Supplier Directory</h1>
                            <p className="text-sm text-slate-500">Manage all print providers and production nodes.</p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search suppliers..."
                                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>
                            <button className="inline-flex items-center gap-2 rounded-lg bg-[#1e4bff] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#163dcc]">
                                <Plus className="w-4 h-4" />
                                Add New Supplier
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {statusTabs.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setTab(s)}
                                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold border ${tab === s ? "bg-[#1e4bff] text-white border-[#1e4bff]" : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"}`}
                                >
                                    {s === "All" ? "All Suppliers" : s}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Sort by:</span>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map((s) => (
                            <div key={s.id} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                                            {iconFor(s.icon)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 leading-tight">{s.name}</h3>
                                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                                <MapPin className="w-4 h-4" />
                                                <span>{s.city}, {s.country}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-[11px] font-black uppercase tracking-[0.12em] px-2 py-1 rounded-full ${statusTone[s.status]}`}>
                                        {s.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {s.categories.map((c) => (
                                        <span key={c} className="text-[11px] font-semibold text-slate-600 rounded-full bg-slate-100 px-2 py-1 border border-slate-200">{c}</span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between text-sm text-slate-600">
                                    <div className="flex items-center gap-1 text-slate-600">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>{s.successRate ? `${s.successRate}% Success Rate` : "Awaiting data"}</span>
                                    </div>
                                    <button className="text-sm font-bold text-[#1e4bff] hover:underline">View Profile</button>
                                </div>
                            </div>
                        ))}

                        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center flex flex-col items-center justify-center p-6 text-slate-500">
                            <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div className="font-semibold">Add New Partner</div>
                            <div className="text-sm text-slate-500">Onboard a new supplier node</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-3">
                        <span>Showing {Math.min(filtered.length, 6)} of {suppliers.length} suppliers</span>
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
        </DashboardLayout>
    );
}

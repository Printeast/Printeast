"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Plus, RefreshCw, Search } from "lucide-react";

import { TemplateCard } from "./TemplateCard";

type Template = {
    id: string;
    prompt_text?: string;
    status?: string | null;
    createdAt: string;
    previewUrl?: string | null;
    designData?: any;
};

type Props = {
    templates: Template[];
};

type DropdownKey = "product" | "date" | "sort" | null;

const dateFilters = [
    { value: "any", label: "Any time" },
    { value: "last7", label: "Last 7 days" },
    { value: "last30", label: "Last 30 days" },
    { value: "year", label: "This year" },
];

const sortOptions = [
    { value: "new", label: "Newest" },
    { value: "old", label: "Oldest" },
    { value: "az", label: "A → Z" },
    { value: "za", label: "Z → A" },
];

const productTypeOptions = [
    "Men's clothing",
    "Women's clothing",
    "Kids & baby clothing",
    "Tote Bags",
    "Wall art",
    "Calendars",
    "Cards",
    "Photo books",
    "Hats",
    "Phone cases",
    "Mugs & Bottle",
    "Stationery & Business",
];

function getProductType(t: Template) {
    return (
        t.designData?.product?.type ||
        t.designData?.product?.category ||
        t.designData?.product?.title ||
        "Unspecified"
    );
}

export function FilterableTemplateList({ templates }: Props) {
    const [search, setSearch] = useState("");
    const [productFilter, setProductFilter] = useState("All types");
    const [dateFilter, setDateFilter] = useState("any");
    const [sort, setSort] = useState("new");
    const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);

    const productOptions = useMemo(
        () => ["All types", ...productTypeOptions],
        []
    );

    const filtered = useMemo(() => {
        const now = new Date();

        const passesDate = (tpl: Template) => {
            if (dateFilter === "any") return true;
            const created = new Date(tpl.createdAt);
            if (dateFilter === "last7") {
                const cutoff = new Date(now);
                cutoff.setDate(cutoff.getDate() - 7);
                return created >= cutoff;
            }
            if (dateFilter === "last30") {
                const cutoff = new Date(now);
                cutoff.setDate(cutoff.getDate() - 30);
                return created >= cutoff;
            }
            if (dateFilter === "year") {
                return created.getFullYear() === now.getFullYear();
            }
            return true;
        };

        const passesProduct = (tpl: Template) => {
            if (productFilter === "All types") return true;
            return getProductType(tpl) === productFilter;
        };

        const passesSearch = (tpl: Template) => {
            if (!search.trim()) return true;
            const haystack = `${tpl.prompt_text || ""} ${getProductType(tpl)}`.toLowerCase();
            return haystack.includes(search.toLowerCase());
        };

        const sorted = [...templates]
            .filter(passesDate)
            .filter(passesProduct)
            .filter(passesSearch)
            .sort((a, b) => {
                if (sort === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                if (sort === "old") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                if (sort === "az") return (a.prompt_text || "").localeCompare(b.prompt_text || "");
                if (sort === "za") return (b.prompt_text || "").localeCompare(a.prompt_text || "");
                return 0;
            });

        return sorted;
    }, [dateFilter, productFilter, search, sort, templates]);

    const bgSoft = "#F9F8F6";

    const renderDropdown = (
        key: Exclude<DropdownKey, null>,
        label: string,
        options: { value: string; label: string }[],
        current: string,
        onSelect: (value: string) => void,
    ) => {
        const open = openDropdown === key;
        return (
            <div className="relative">
                <button
                    onClick={() => setOpenDropdown(open ? null : key)}
                    className="h-12 px-5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm group"
                >
                    <span>{label}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>
                {open && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1 z-20">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onSelect(opt.value);
                                    setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 ${current === opt.value ? "text-blue-600" : ""}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="min-h-full w-full"
            style={{
                background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
            }}
        >
            <div className="relative z-10 px-10 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Templates</h1>
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3 text-[15px] font-black text-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all">
                        <Plus className="h-5 w-5" strokeWidth={3} /> Create New Template
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-10">
                    <div className="flex-1 min-w-[300px] relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search templates by title or tag..."
                            className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-[15px] placeholder:text-slate-400 focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {renderDropdown(
                            "product",
                            productFilter === "All types" ? "Product Type" : productFilter,
                            productOptions.map((p) => ({ value: p, label: p })),
                            productFilter,
                            setProductFilter,
                        )}

                        {renderDropdown("date", "Created Date", dateFilters, dateFilter, setDateFilter)}

                        {renderDropdown("sort", "Sort by", sortOptions, sort, setSort)}
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-40 pb-32">
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No templates yet</h3>
                            <p className="text-slate-500 font-medium text-lg">Create your first template to reuse across products.</p>
                        </div>

                        <button className="mt-8 rounded-xl bg-[#2563eb] px-10 py-4 text-[16px] font-black text-white shadow-sm hover:scale-[1.05] active:scale-95 transition-all">
                            Create now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((tpl) => (
                            <TemplateCard key={tpl.id} template={tpl} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

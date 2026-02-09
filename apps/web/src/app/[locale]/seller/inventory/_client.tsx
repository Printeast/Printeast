"use client";

import { useMemo, useState } from "react";
// import { useParams } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
    Filter,
    Search,
    LayoutGrid,
    List,
    Store,
    ExternalLink,
    Package,
    Box
} from "lucide-react";
type InventoryItem = {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    base_price?: number | null | undefined;
    category?: string | null | undefined;
    status?: string | null | undefined;
};

interface Props {
    userEmail: string;
    tenantId: string | null;
    initialInventory: InventoryItem[];
}

const categories = [
    "New Arrivals",
    "Bestsellers",
    "Holiday season",
    "Elevated Apparel",
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

export function SellerInventoryClient({ userEmail, initialInventory }: Props) {
    const [activeCategory, setActiveCategory] = useState("Men's clothing");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    // const params = useParams();
    // const locale = params?.locale || "en";

    const products = useMemo(
        () =>
            initialInventory.map((item) => ({
                id: item.id,
                name: item.name || "Untitled product",
                sku: item.sku,
                price: item.base_price,
                quantity: item.quantity,
                category: item.category || "Uncategorized", // Default category
                status: item.status || "In Stock", // Default status
            })),
        [initialInventory]
    );

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }} fullBleed>
            <div
                className="min-h-full h-auto w-full relative transition-colors duration-300"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                            <div>
                                <h1 className="text-2xl font-black text-foreground tracking-tight">Product Inventory</h1>
                                <p className="text-sm text-muted-foreground mt-1 font-medium">Manage your synchronized products and listings.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm group">
                                    <Filter className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                    <span>Filters</span>
                                </button>
                            </div>
                        </header>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Categories Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                                <h3 className="text-xs font-black text-foreground uppercase tracking-[0.15em] mb-4">CATEGORIES</h3>
                                <div className="space-y-1">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                                                ? "bg-accent text-accent-foreground shadow-sm"
                                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Toolbar */}
                            <div className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search by product name, SKU or ID..."
                                        className="h-11 w-full pl-11 pr-4 bg-background border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>
                                {/* Toolbar buttons */}
                                <select className="h-11 px-4 rounded-xl border border-border bg-background text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                                    <option>Newest First</option>
                                    <option>Oldest First</option>
                                    <option>Price: High to Low</option>
                                    <option>Price: Low to High</option>
                                </select>
                                <div className="flex p-1 bg-accent rounded-xl">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`h-10 w-12 flex items-center justify-center rounded-lg transition-all ${viewMode === "grid"
                                            ? "bg-background text-foreground shadow-sm border border-border"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`h-10 w-12 flex items-center justify-center rounded-lg transition-all ${viewMode === "list"
                                            ? "bg-background text-foreground shadow-sm border border-border"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Featured Highlights */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className="rounded-2xl p-6 text-white shadow-md group relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transform transition-transform group-hover:scale-110" />
                                    <h3 className="text-lg font-bold">New Arrivals</h3>
                                    <p className="text-sm text-white/80 mt-1 font-medium">Latest for Q1 2024</p>
                                    <button className="mt-4 text-[13px] font-bold text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">Explore Collection</button>
                                </div>
                                <div className="rounded-2xl p-6 text-white shadow-md group relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)" }}>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transform transition-transform group-hover:scale-110" />
                                    <h3 className="text-lg font-bold">Bestsellers</h3>
                                    <p className="text-sm text-white/80 mt-1 font-medium">Highest rated items</p>
                                    <button className="mt-4 text-[13px] font-bold text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all">View Trends</button>
                                </div>
                                <div className="rounded-2xl p-6 bg-card border border-border shadow-sm group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent rounded-bl-full transform transition-transform group-hover:scale-110" />
                                    <h3 className="text-lg font-bold text-foreground">Holiday Hub</h3>
                                    <p className="text-sm text-muted-foreground mt-1 font-medium">Seasonal favorites</p>
                                    <button className="mt-4 text-[13px] font-bold text-blue-600 hover:text-blue-700 transition-colors">Setup Store →</button>
                                </div>
                            </div>

                            {/* Products Area */}
                            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
                                <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                                    <h2 className="text-base font-bold text-foreground tracking-tight">{activeCategory}</h2>
                                    <div className="px-3 py-1 bg-accent border border-border rounded-full text-[11px] font-bold text-muted-foreground">
                                        {products.length} Items Found
                                    </div>
                                </div>
                                <div className="p-6">
                                    {products.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-20 h-20 bg-accent border border-border rounded-3xl flex items-center justify-center mb-6">
                                                <Package className="w-10 h-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">No products in this category</h3>
                                            <p className="text-[15px] text-muted-foreground max-w-sm leading-relaxed">Try switching categories or add your first product to see it here.</p>
                                        </div>
                                    ) : viewMode === "grid" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {products.map((product) => (
                                                <div key={product.id} className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                                                    <div className="aspect-square relative bg-accent/30 overflow-hidden">
                                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                                                            <Store className="w-12 h-12" />
                                                        </div>
                                                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-md border border-border text-[10px] font-black uppercase tracking-wider text-foreground">
                                                            {product.category}
                                                        </div>
                                                        <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="p-5 space-y-3">
                                                        <div>
                                                            <h4 className="font-bold text-foreground leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h4>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">ID: {product.id}</span>
                                                                <span className="w-1 h-1 rounded-full bg-border"></span>
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">SKU: {product.sku}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-2 border-t border-border">
                                                            <div className="text-lg font-black text-foreground">
                                                                {product.price !== undefined && product.price !== null
                                                                    ? formatCurrency(product.price)
                                                                    : "Ask for price"}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-[11px] font-black uppercase tracking-tight">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                                {product.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {products.map((item) => (
                                                <div key={item.id} className="flex items-center gap-5 p-4 bg-card border border-border rounded-2xl hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                                                    <div className="w-20 h-20 bg-accent border border-border rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50/30 transition-colors">
                                                        <Box className="w-8 h-8 text-muted-foreground group-hover:text-blue-200 transition-colors" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1.5">SKU: {item.sku || "—"}</p>
                                                        <h4 className="text-[15px] font-bold text-foreground truncate group-hover:text-blue-600 transition-colors">{item.name}</h4>
                                                        <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">{item.quantity} in stock</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black text-foreground">
                                                            {item.price !== undefined && item.price !== null
                                                                ? formatCurrency(item.price)
                                                                : "—"}
                                                        </p>
                                                        <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest mt-1">Details →</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

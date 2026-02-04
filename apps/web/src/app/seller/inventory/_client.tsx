"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LayoutGrid, List, RefreshCw, Search } from "lucide-react";

type InventoryItem = {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    base_price?: number;
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

    const products = useMemo(
        () =>
            initialInventory.map((item) => ({
                id: item.id,
                name: item.name || "Untitled product",
                sku: item.sku,
                price: item.base_price,
            })),
        [initialInventory]
    );

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }} fullBleed>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Product Catalogue</h1>
                        <Link
                            href="/seller/inventory"
                            className="h-9 w-9 rounded-lg border dash-border dash-panel flex items-center justify-center hover:dash-panel-strong"
                            aria-label="Refresh"
                        >
                            <RefreshCw className="h-4 w-4 dash-muted" />
                        </Link>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
                    <aside className="space-y-2">
                        {categories.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setActiveCategory(item)}
                                className={`w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition ${
                                    activeCategory === item
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-500 hover:bg-slate-50"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </aside>

                    <section className="space-y-5">
                        <div className="rounded-lg border dash-border dash-panel p-4 space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    placeholder="Which product are you looking for?"
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
                                    <option>Category</option>
                                </select>
                                <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
                                    <option>Technology</option>
                                </select>
                                <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
                                    <option>Brand</option>
                                </select>
                                <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
                                    <option>Color</option>
                                </select>
                                <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
                                    <option>Size</option>
                                </select>
                                <div className="ml-auto flex items-center gap-2">
                                    <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="Grid view">
                                        <LayoutGrid className="mx-auto h-4 w-4" />
                                    </button>
                                    <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50" aria-label="List view">
                                        <List className="mx-auto h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">Shipping region:</span>
                                <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
                                    <option>United States</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">Currency:</span>
                                <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
                                    <option>USD</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="rounded-lg p-6 text-white" style={{ background: "#1f3a8a" }}>
                                <h3 className="text-lg font-semibold">New Arrivals</h3>
                                <p className="text-sm text-white/80 mt-1">Latest additions to our catalog</p>
                            </div>
                            <div className="rounded-lg p-6 text-white" style={{ background: "#2563eb" }}>
                                <h3 className="text-lg font-semibold">Bestsellers</h3>
                                <p className="text-sm text-white/80 mt-1">Most popular items</p>
                            </div>
                            <div className="rounded-lg p-6 border border-blue-100 bg-blue-50 text-blue-700">
                                <h3 className="text-lg font-semibold">Holiday season</h3>
                                <p className="text-sm text-blue-500 mt-1">Seasonal favorites</p>
                            </div>
                        </div>

                        {products.length === 0 ? (
                            <div className="rounded-lg border border-dashed dash-border dash-panel p-8 text-center">
                                <p className="text-sm font-semibold text-slate-700">No products yet</p>
                                <p className="text-xs text-slate-500 mt-1">Add products to populate the catalogue.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {products.map((item) => (
                                    <div key={item.id} className="rounded-lg border dash-border dash-panel overflow-hidden">
                                        <div className="h-32 bg-slate-100 flex items-center justify-center">
                                            <div className="h-12 w-12 rounded-md bg-slate-300" />
                                        </div>
                                        <div className="p-4">
                                            <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                            <p className="text-xs text-slate-500">SKU: {item.sku || "-"}</p>
                                            <p className="mt-3 text-sm font-semibold text-blue-600">
                                                {item.price !== undefined && item.price !== null
                                                    ? formatCurrency(item.price)
                                                    : "Price on request"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

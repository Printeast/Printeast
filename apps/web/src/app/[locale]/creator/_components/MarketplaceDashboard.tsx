"use client";

<<<<<<< HEAD
import { useState } from "react";
=======
import React, { useState, useEffect, useRef } from "react";
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
import { ChevronDown, LayoutGrid, List, Plus, Upload } from "lucide-react";

const statusOptions = ["All", "Live", "Pending", "Rejected"];
const categoryOptions = ["All Categories", "Abstract", "Minimalist", "Floral", "Typography", "Illustrations"];
const sortOptions = [
    "Earning: Low to high",
    "Earning: High to low",
    "Listings: Newest",
    "Listings: Oldest",
    "Best Sellers",
];

<<<<<<< HEAD
const gridPlaceholders = Array.from({ length: 5 }, (_, index) => index);
const listPlaceholders = Array.from({ length: 5 }, (_, index) => index);
=======
const gridPlaceholders = [0, 1, 2];
const listPlaceholders = [0, 1, 2, 3];
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)

export function MarketplaceDashboard() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [category, setCategory] = useState(categoryOptions[0]);
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    const [catOpen, setCatOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

<<<<<<< HEAD
=======
    const catRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (catRef.current && !catRef.current.contains(target)) {
                setCatOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(target)) {
                setSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
    const toggleCategory = () => {
        setCatOpen((prev) => !prev);
        setSortOpen(false);
    };

    const toggleSort = () => {
        setSortOpen((prev) => !prev);
        setCatOpen(false);
    };

<<<<<<< HEAD
=======
    const handleSetView = (newView: "grid" | "list") => {
        console.log("Setting view to:", newView);
        setView(newView);
    };

>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
    return (
        <div
            className="min-h-screen overflow-y-auto"
            style={{
                background:
                    "radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), #F9F8F6",
            }}
        >
            <div className="mx-auto max-w-[1180px] px-6 py-8 pb-20 space-y-6 text-[15px] text-slate-800">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Marketplace Listings</h1>
                        <p className="text-base text-slate-600">Manage and monitor your published artwork across the store.</p>
                    </div>
<<<<<<< HEAD
                    <button className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm">
=======
                    <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4ed8] transition-colors">
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                        <Upload className="h-4 w-4" />
                        Upload New Design
                    </button>
                </header>

<<<<<<< HEAD
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
=======
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status:</span>
                        <div className="flex items-center gap-2">
                            {statusOptions.map((label, idx) => (
                                <button
                                    key={label}
<<<<<<< HEAD
                                    className={`rounded-full px-3 py-1 text-sm font-semibold ${idx === 0 ? "bg-[#2563eb] text-white" : "bg-slate-100 text-slate-600"}`}
=======
                                    type="button"
                                    className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${idx === 0 ? "bg-[#2563eb] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

<<<<<<< HEAD
                    <div className="relative">
=======
                    <div className="relative" ref={catRef}>
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category:</span>
                            <button
                                type="button"
                                onClick={toggleCategory}
<<<<<<< HEAD
                                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm"
                            >
                                {category}
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>
                        </div>
                        {catOpen && (
                            <div className="absolute z-10 mt-2 min-w-[180px] rounded-md border border-slate-200 bg-white py-2 shadow-md">
                                {categoryOptions.map((cat) => (
                                    <button
                                        key={cat}
                                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
=======
                                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                {category}
                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        {catOpen && (
                            <div className="absolute z-30 mt-2 min-w-[180px] rounded-md border border-slate-200 bg-white py-2 shadow-lg">
                                {categoryOptions.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                        onClick={() => {
                                            setCategory(cat);
                                            setCatOpen(false);
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

<<<<<<< HEAD
                    <div className="relative">
=======
                    <div className="relative" ref={sortRef}>
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sort by:</span>
                            <button
                                type="button"
                                onClick={toggleSort}
<<<<<<< HEAD
                                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm"
                            >
                                {sortBy}
                                <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>
                        </div>
                        {sortOpen && (
                            <div className="absolute z-10 mt-2 min-w-[180px] rounded-md border border-slate-200 bg-white py-2 shadow-md">
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
=======
                                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                {sortBy}
                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                        {sortOpen && (
                            <div className="absolute z-30 mt-2 min-w-[180px] rounded-md border border-slate-200 bg-white py-2 shadow-lg">
                                {sortOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                        onClick={() => {
                                            setSortBy(opt);
                                            setSortOpen(false);
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="ml-auto flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                        <button
<<<<<<< HEAD
                            className={`h-9 w-9 rounded-md flex items-center justify-center ${view === "grid" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-500"}`}
                            onClick={() => setView("grid")}
=======
                            type="button"
                            className={`h-9 w-9 rounded-md flex items-center justify-center transition-all ${view === "grid" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                            onClick={() => handleSetView("grid")}
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                            aria-label="Grid view"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
<<<<<<< HEAD
                            className={`h-9 w-9 rounded-md flex items-center justify-center ${view === "list" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-500"}`}
                            onClick={() => setView("list")}
=======
                            type="button"
                            className={`h-9 w-9 rounded-md flex items-center justify-center transition-all ${view === "list" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-500"}`}
                            onClick={() => handleSetView("list")}
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                            aria-label="List view"
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {view === "grid" ? (
                    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {gridPlaceholders.map((item) => (
                            <article key={item} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
<<<<<<< HEAD
                                <div className="relative mb-3 h-[180px] w-full rounded-xl bg-slate-100" />
=======
                                <div className="relative mb-3 h-[180px] w-full rounded-xl bg-slate-100 animate-pulse" />
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
                                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700">Status</span>
                                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-blue-700">Tag</span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-500">Category</span>
                                </div>
                                <div className="space-y-1">
<<<<<<< HEAD
                                    <div className="h-4 w-40 rounded bg-slate-100" />
                                    <div className="h-3 w-28 rounded bg-slate-100" />
=======
                                    <div className="h-4 w-40 rounded bg-slate-100 animate-pulse" />
                                    <div className="h-3 w-28 rounded bg-slate-100 animate-pulse" />
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-slate-300" />
<<<<<<< HEAD
                                        <span className="h-3 w-12 rounded bg-slate-100" />
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="h-3 w-10 rounded bg-slate-100" />
                                        <span className="h-3 w-8 rounded bg-slate-100" />
=======
                                        <span className="h-3 w-12 rounded bg-slate-100 animate-pulse" />
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="h-3 w-10 rounded bg-slate-100 animate-pulse" />
                                        <span className="h-3 w-8 rounded bg-slate-100 animate-pulse" />
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                                        <span className="h-4 w-20 rounded bg-slate-100" />
=======
                                        <span className="h-4 w-20 rounded bg-slate-100 animate-pulse" />
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-400">Live</span>
                                        <div className="h-4 w-8 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                            </article>
                        ))}
                        <article className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center flex flex-col items-center justify-center min-h-[220px]">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <Plus className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900">Add New Listing</h3>
                            <p className="mt-1 text-xs text-slate-500">Increase your reach by uploading new designs.</p>
                        </article>
                    </section>
                ) : (
                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <span>Artwork</span>
                            <span>Status</span>
                            <span>Category</span>
                            <span>Date Uploaded</span>
                            <span>Total Sales</span>
                            <span>Earnings</span>
                            <span />
                        </div>
                        {listPlaceholders.map((row) => (
                            <div
                                key={row}
                                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-3 border-b border-slate-100 px-4 py-4 text-sm text-slate-700"
                            >
                                <div className="flex items-center gap-3">
<<<<<<< HEAD
                                    <div className="h-10 w-10 rounded-lg bg-slate-100" />
                                    <div className="space-y-1">
                                        <div className="h-3 w-24 rounded bg-slate-100" />
                                        <div className="h-3 w-16 rounded bg-slate-100" />
                                    </div>
                                </div>
                                <div className="h-6 w-16 rounded-full bg-slate-100" />
                                <div className="h-6 w-20 rounded-full bg-slate-100" />
                                <div className="h-3 w-20 rounded bg-slate-100" />
                                <div className="h-3 w-16 rounded bg-slate-100" />
                                <div className="h-3 w-20 rounded bg-slate-100" />
                                <div className="h-6 w-6 rounded-full bg-slate-100" />
                            </div>
                        ))}
                        <div className="px-4 py-4">
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
=======
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 animate-pulse" />
                                    <div className="space-y-1">
                                        <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
                                        <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
                                    </div>
                                </div>
                                <div className="h-6 w-16 rounded-full bg-slate-100 animate-pulse" />
                                <div className="h-6 w-20 rounded-full bg-slate-100 animate-pulse" />
                                <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
                                <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
                                <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
                                <div className="h-6 w-6 rounded-full bg-slate-100 animate-pulse" />
                            </div>
                        ))}
                        <div className="px-4 py-4">
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 text-center">
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                <span className="font-semibold text-slate-700">Add New Listing</span>
                                <p className="text-xs text-slate-500">Upload a new design to expand your catalog.</p>
                            </div>
                        </div>
                    </section>
                )}

                <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Showing 0 of 0 listings</span>
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                        <button className="rounded-md border border-slate-200 bg-white px-3 py-1 text-slate-500" disabled>
=======
                        <button type="button" className="rounded-md border border-slate-200 bg-white px-3 py-1 text-slate-500 opacity-50 cursor-not-allowed">
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3].map((n) => (
                                <button
                                    key={n}
<<<<<<< HEAD
                                    className={`h-8 w-8 rounded-md border text-sm font-semibold ${n === 1 ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-slate-200 bg-white text-slate-700"}`}
=======
                                    type="button"
                                    className={`h-8 w-8 rounded-md border text-sm font-semibold transition-all ${n === 1 ? "border-[#2563eb] bg-[#2563eb] text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
<<<<<<< HEAD
                        <button className="rounded-md border border-slate-200 bg-white px-3 py-1 text-slate-500" disabled>
=======
                        <button type="button" className="rounded-md border border-slate-200 bg-white px-3 py-1 text-slate-500 opacity-50 cursor-not-allowed">
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

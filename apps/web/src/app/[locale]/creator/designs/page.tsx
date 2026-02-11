"use client";

<<<<<<< HEAD
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Search, Plus, Grid, List, MoreVertical, Upload, ChevronDown } from "lucide-react";
import { useState } from "react";
=======
import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Search, Plus, Grid, List, MoreVertical, Upload, ChevronDown } from "lucide-react";
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)

const placeholders = Array.from({ length: 6 }, (_, i) => i);
const categoryOptions = ["All Categories", "Illustration", "Abstract", "Typography"];

export default function CreatorDesignsPage() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [isCatOpen, setIsCatOpen] = useState(false);
<<<<<<< HEAD
=======
    const catRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (catRef.current && !catRef.current.contains(event.target as Node)) {
                setIsCatOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSetView = (newView: "grid" | "list") => {
        console.log("Setting view to:", newView);
        setView(newView);
    };

    const handleSelectCategory = (cat: string) => {
        console.log("Selecting category:", cat);
        setSelectedCategory(cat);
        setIsCatOpen(false);
    };
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)

    return (
        <DashboardLayout user={{ email: "creator@placeholder", role: "CREATOR" }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), #F9F8F6`,
                }}
            >
                <div className="mx-auto max-w-[1180px] px-6 py-8 space-y-6">
                    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">My Designs</h1>
                            <p className="text-base text-slate-600">Upload and manage your high-resolution artwork.</p>
                        </div>
<<<<<<< HEAD
                        <button className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#1d4ed8] transition-all">
=======
                        <button 
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#1d4ed8] transition-all"
                        >
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                            <Upload className="h-4 w-4" />
                            Upload New Design
                        </button>
                    </header>

                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative max-w-xs w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    placeholder="Search designs..."
                                    className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            
<<<<<<< HEAD
                            <div className="relative">
                                <button 
                                    onClick={() => setIsCatOpen(!isCatOpen)}
                                    className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all"
                                >
                                    {selectedCategory}
                                    <ChevronDown className="h-4 w-4 text-slate-400" />
                                </button>
                                {isCatOpen && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                                        {categoryOptions.map(opt => (
                                            <button 
                                                key={opt}
                                                onClick={() => { setSelectedCategory(opt); setIsCatOpen(false); }}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700"
=======
                            <div className="relative" ref={catRef}>
                                <button 
                                    type="button"
                                    onClick={() => setIsCatOpen(!isCatOpen)}
                                    className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    {selectedCategory}
                                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isCatOpen && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-30 py-2 py-2">
                                        {categoryOptions.map(opt => (
                                            <button 
                                                key={opt}
                                                type="button"
                                                onClick={() => handleSelectCategory(opt)}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700 font-medium transition-colors"
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                            <button 
<<<<<<< HEAD
                                onClick={() => setView("grid")}
                                className={`p-2 rounded-md transition-all ${view === "grid" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-500"}`}
=======
                                type="button"
                                onClick={() => handleSetView("grid")}
                                className={`p-2 rounded-md transition-all ${view === "grid" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                            >
                                <Grid className="h-4 w-4" />
                            </button>
                            <button 
<<<<<<< HEAD
                                onClick={() => setView("list")}
                                className={`p-2 rounded-md transition-all ${view === "list" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-500"}`}
=======
                                type="button"
                                onClick={() => handleSetView("list")}
                                className={`p-2 rounded-md transition-all ${view === "list" ? "bg-white text-[#2563eb] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {placeholders.map((idx) => (
                            <div 
                                key={idx} 
                                className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md ${view === "list" ? "flex items-center p-4 gap-6" : ""}`}
                            >
                                <div className={`bg-slate-50 relative animate-pulse ${view === "grid" ? "aspect-[4/3] w-full" : "h-20 w-20 rounded-lg flex-shrink-0"}`}>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                        <Grid className="h-10 w-10" />
                                    </div>
                                </div>
                                
                                <div className={`p-5 flex-1 ${view === "list" ? "p-0 flex items-center justify-between" : ""}`}>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                                            <div className="h-4 w-12 bg-slate-50 rounded animate-pulse" />
                                        </div>
                                        <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-3 w-24 bg-slate-50 rounded animate-pulse" />
                                    </div>

                                    <div className={`mt-5 flex items-center justify-between border-t border-slate-50 pt-4 ${view === "list" ? "mt-0 pt-0 border-0" : ""}`}>
                                        <div className="space-y-1">
                                            <div className="h-2 w-12 bg-slate-50 rounded" />
                                            <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
                                        </div>
<<<<<<< HEAD
                                        <button className="h-8 w-8 rounded-full flex items-center justify-center text-slate-300">
=======
                                        <button type="button" className="h-8 w-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors">
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {view === "grid" && (
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-white/50 hover:bg-white hover:border-[#2563eb] transition-all cursor-pointer group min-h-[300px]">
                                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-[#2563eb]/10 group-hover:text-[#2563eb] transition-all">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-slate-900">Add New Listing</h3>
                                <p className="text-sm text-slate-500 mt-1 max-w-[200px]">Expand your portfolio with a new design.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { TrendingUp, ShoppingBag, DollarSign, Users, ChevronDown, Calendar } from "lucide-react";
import { useState } from "react";

const topDesignsPlaceholders = Array.from({ length: 4 }, (_, i) => i);
const rangeOptions = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "Year to Date"];

export default function CreatorAnalyticsPage() {
    const [range, setRange] = useState("Last 30 Days");
    const [isRangeOpen, setIsRangeOpen] = useState(false);

    return (
        <DashboardLayout user={{ email: "creator@placeholder", role: "CREATOR" }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), #F9F8F6`,
                }}
            >
                <div className="mx-auto max-w-[1180px] px-6 py-8 space-y-8">
                    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
                            <p className="text-base text-slate-600">Deep dive into your performance and earnings.</p>
                        </div>
                        <div className="relative">
                            <button 
                                onClick={() => setIsRangeOpen(!isRangeOpen)}
                                className="inline-flex items-center gap-3 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                            >
                                <Calendar className="h-4 w-4 text-slate-400" />
                                {range}
                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isRangeOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isRangeOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                                    {rangeOptions.map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => { setRange(opt); setIsRangeOpen(false); }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700 font-medium"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </header>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { label: "Total Earnings", icon: DollarSign, color: "bg-blue-50 text-blue-600" },
                            { label: "Total Sales", icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600" },
                            { label: "View Count", icon: Users, color: "bg-purple-50 text-purple-600" },
                        ].map((metric, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${metric.color}`}>
                                        <metric.icon className="h-5 w-5" />
                                    </div>
                                    <div className="h-5 w-12 bg-slate-50 rounded animate-pulse" />
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{metric.label}</p>
                                <div className="h-8 w-24 bg-slate-100 rounded animate-pulse mt-2" />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Chart Placeholder */}
                        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900">Earnings Overview</h3>
                                <div className="flex gap-2 bg-slate-50 p-1 rounded-lg">
                                    {['Daily', 'Weekly', 'Monthly'].map((period, i) => (
                                        <button key={period} className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${i === 1 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex items-center justify-center min-h-[300px]">
                                <div className="text-center opacity-20 animate-pulse">
                                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                                    <p className="text-sm font-bold">Waiting for analytics data...</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Performers */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Top Performing Designs</h3>
                            <div className="space-y-5">
                                {topDesignsPlaceholders.map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-slate-50 animate-pulse flex-shrink-0" />
                                        <div className="flex-1 space-y-2 min-w-0">
                                            <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                                            <div className="h-2 w-16 bg-slate-50 rounded animate-pulse" />
                                        </div>
                                        <div className="text-right space-y-1">
                                            <div className="h-3 w-12 bg-slate-100 rounded animate-pulse ml-auto" />
                                            <div className="h-2 w-8 bg-slate-50 rounded animate-pulse ml-auto" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-400 cursor-not-allowed">
                                View Full List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

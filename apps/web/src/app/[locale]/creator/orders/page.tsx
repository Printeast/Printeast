"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Search, Filter, Download, MoreHorizontal, ChevronDown } from "lucide-react";
import { useState } from "react";

const placeholders = Array.from({ length: 6 }, (_, i) => i);
const statusOptions = ["All", "Shipped", "Processing", "Cancelled"];

export default function CreatorOrdersPage() {
    const [statusFilter, setStatusFilter] = useState("All");
    const [isStatusOpen, setIsStatusOpen] = useState(false);

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
                            <h1 className="text-2xl font-bold text-slate-900">Artwork Orders</h1>
                            <p className="text-base text-slate-600">Track sales and earnings from your published designs.</p>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                            <Download className="h-4 w-4" />
                            Export CSV
                        </button>
                    </header>

                    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                placeholder="Search by order ID or artwork..."
                                className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsStatusOpen(!isStatusOpen)}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                <Filter className="h-4 w-4" />
                                Status: {statusFilter}
                                <ChevronDown className={`h-4 w-4 transition-transform ${isStatusOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isStatusOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                                    {statusOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setStatusFilter(opt);
                                                setIsStatusOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-700 font-medium"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Artwork</th>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Your Earnings</th>
                                        <th className="px-6 py-4" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {placeholders.map((idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded bg-slate-100 animate-pulse" />
                                                    <div className="space-y-1">
                                                        <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
                                                        <div className="h-2 w-20 rounded bg-slate-50 animate-pulse" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-3 w-24 rounded bg-slate-100 animate-pulse" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-6 w-16 rounded-full bg-slate-100 animate-pulse" />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="h-4 w-12 rounded bg-slate-100 animate-pulse ml-auto" />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-300">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <p>Showing 0-0 of 0 orders</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded border border-slate-200 bg-white opacity-50 cursor-not-allowed">Prev</button>
                            <button className="px-3 py-1 rounded bg-[#2563eb] text-white">1</button>
                            <button className="px-3 py-1 rounded border border-slate-200 bg-white opacity-50 cursor-not-allowed">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

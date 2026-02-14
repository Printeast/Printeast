"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Calendar,
    ChevronDown,
    Filter,
    Globe,
    Truck,
    Wallet
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function OrderAdvancedFilters({ basePath = "/seller" }: { basePath?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [startDate, setStartDate] = useState(searchParams.get("start_date") || "");
    const [endDate, setEndDate] = useState(searchParams.get("end_date") || "");
    const [country, setCountry] = useState(searchParams.get("country") || "all");
    const [fulfillment, setFulfillment] = useState(searchParams.get("fulfillment") || "all");
    const [paymentStatus, setPaymentStatus] = useState(searchParams.get("payment_status") || "all");
    const [selectedStores, setSelectedStores] = useState<string[]>(searchParams.getAll("store") || []);

    const handleStoreChange = (store: string) => {
        setSelectedStores(prev =>
            prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
        );
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (startDate) params.set("start_date", startDate); else params.delete("start_date");
        if (endDate) params.set("end_date", endDate); else params.delete("end_date");
        if (country !== "all") params.set("country", country); else params.delete("country");
        if (fulfillment !== "all") params.set("fulfillment", fulfillment); else params.delete("fulfillment");
        if (paymentStatus !== "all") params.set("payment_status", paymentStatus); else params.delete("payment_status");

        params.delete("store");
        selectedStores.forEach(s => params.append("store", s));

        router.push(`${basePath}/orders?${params.toString()}`);
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setCountry("all");
        setFulfillment("all");
        setPaymentStatus("all");
        setSelectedStores([]);
        router.push(`${basePath}/orders`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 transition-all shadow-sm outline-none">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                alignOffset={-5}
                className="w-[340px] p-0 rounded-2xl shadow-2xl border-slate-200 overflow-hidden bg-white mt-1 animate-in fade-in zoom-in-95 duration-200"
            >
                <div className="p-5 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">Advanced Filters</h3>
                        <button
                            onClick={resetFilters}
                            className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
                        >
                            Reset
                        </button>
                    </div>

                    {/* DATE RANGE */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Date Range</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-0.5">Start Date</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full h-9 pl-9 pr-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all cursor-pointer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 ml-0.5">End Date</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full h-9 pl-9 pr-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COUNTRY */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Country</p>
                        <div className="relative group">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full h-10 pl-9 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all cursor-pointer"
                            >
                                <option value="all">All Countries</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="IN">India</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* FULFILLMENT */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Fulfillment</p>
                        <div className="relative group">
                            <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <select
                                value={fulfillment}
                                onChange={(e) => setFulfillment(e.target.value)}
                                className="w-full h-10 pl-9 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all cursor-pointer"
                            >
                                <option value="all">All statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* PAYMENT STATUS */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Payment Status</p>
                        <div className="relative group">
                            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <select
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                                className="w-full h-10 pl-9 pr-9 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all cursor-pointer"
                            >
                                <option value="all">All statuses</option>
                                <option value="PAID">Paid</option>
                                <option value="UNPAID">Unpaid</option>
                                <option value="REFUNDED">Refunded</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* STORES */}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Stores</p>
                        <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
                            {["Etsy Shop", "Shopify Main", "WooCommerce"].map(store => (
                                <label key={store} className="flex items-center gap-2 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedStores.includes(store)}
                                            onChange={() => handleStoreChange(store)}
                                            className="peer appearance-none w-[18px] h-[18px] border-2 border-slate-300 rounded-md checked:bg-[#2563eb] checked:border-[#2563eb] transition-all cursor-pointer hover:border-blue-400"
                                        />
                                        <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{store}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-3">
                        <button
                            className="flex-1 h-10 rounded-xl border-2 border-slate-100 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                            onClick={() => { }}
                        >
                            Cancel
                        </button>
                        <button
                            className="flex-1 h-10 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white text-[13px] font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

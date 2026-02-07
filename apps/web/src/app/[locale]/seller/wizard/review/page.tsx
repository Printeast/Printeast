"use client";

import React from "react";
import { ShieldCheck, Store, PenLine, Globe } from "lucide-react";

export default function ReviewPage() {
    return <ReviewWizardClient />;
}

export function ReviewWizardClient() {
    const variants = [
        { name: "White - S - DTG (Direct-to-garment)", size: "S", retail: "2,640.46 INR", profit: "1,320.23 INR" },
        { name: "White - M - DTG (Direct-to-garment)", size: "M", retail: "2,640.46 INR", profit: "1,320.23 INR" },
        { name: "White - L - DTG (Direct-to-garment)", size: "L", retail: "2,640.46 INR", profit: "1,320.23 INR" },
        { name: "White - XL - DTG (Direct-to-garment)", size: "XL", retail: "2,640.46 INR", profit: "1,320.23 INR" },
        { name: "White - 2XL - DTG (Direct-to-garment)", size: "2XL", retail: "3,130.24 INR", profit: "1,565.12 INR" },
        { name: "White - 3XL - DTG (Direct-to-garment)", size: "3XL", retail: "3,584.42 INR", profit: "1,792.21 INR" },
        { name: "White - 4XL - DTG (Direct-to-garment)", size: "4XL", retail: "4,641.94 INR", profit: "2,320.97 INR" },
        { name: "White - 5XL - DTG (Direct-to-garment)", size: "5XL", retail: "5,162.90 INR", profit: "2,581.45 INR" },
    ];

    const regions = [
        "North America", "Europe", "Oceania", "Asia", "South America", "United Kingdom", "Rest of the world"
    ];

    return (
        <div className="flex-1 bg-[#F9F8F6] p-10 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Review and Publish</h1>
                        <p className="text-sm text-slate-500 mt-1">Double check your product details before going live.</p>
                    </div>
                </div>

                {/* Product Summary Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Product summary</h3>
                        <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            <PenLine className="w-4 h-4" />
                            <span>Edit product options</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[12px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100">
                                    <th className="px-8 py-5">
                                        Variant name
                                        <span className="block text-[10px] text-slate-400 font-bold mt-1 normal-case tracking-normal">shown in Dashboard</span>
                                    </th>
                                    <th className="px-6 py-5">
                                        Size
                                        <span className="block text-[10px] text-slate-400 font-bold mt-1 normal-case tracking-normal">visible as option</span>
                                    </th>
                                    <th className="px-6 py-5 text-right">Retail price</th>
                                    <th className="px-6 py-5 text-right">Estimated profit</th>
                                    <th className="px-8 py-5 w-1/4">Delivery regions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {variants.map((variant, index) => (
                                    <tr key={index} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="px-8 py-6 text-sm font-bold text-slate-700">
                                            {variant.name}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-slate-500">
                                            {variant.size}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-slate-800 text-right">
                                            {variant.retail}
                                        </td>
                                        <td className="px-6 py-6 text-sm font-bold text-green-600 text-right">
                                            {variant.profit}
                                        </td>
                                        {/* Render regions only for the first row, spanning all rows, or repeat simpler list */}
                                        {/* Per screenshot, it seems repeated or just shown. I'll show it for each row but cleaner */}
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                                                {regions.slice(0, 4).map((r, i) => (
                                                    <span key={i} className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                        {r}
                                                    </span>
                                                ))}
                                                <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                    +3 more
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Final Checklist & Publish Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-200">
                                    <Store className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Printeast Main Store</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ready to sync</p>
                                    </div>
                                    <p className="text-sm text-slate-400 mt-2 font-medium">
                                        Your product will be published immediately and available for purchase.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 pl-16">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg text-green-700 text-xs font-bold">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Quality Verified</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 text-xs font-bold">
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>Global Shipping</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

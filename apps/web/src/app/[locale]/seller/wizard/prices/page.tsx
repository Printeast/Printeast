"use client";

import React, { useState, useEffect } from "react";
import { Info, ChevronDown, CheckCircle2, RotateCcw } from "lucide-react";
import { useWizard } from "@/context/WizardContext";

export default function PricesPage() {
    return <PricesWizardClient />;
}

export function PricesWizardClient() {
    const { state, updateSettings } = useWizard();
    const [profitMargin, setProfitMargin] = useState(state.settings.profitMargin);
    const [includeShipping, setIncludeShipping] = useState(state.settings.includeShipping);

    // Sync with global state for "Save as template" functionality
    useEffect(() => {
        updateSettings({ profitMargin, includeShipping });
    }, [profitMargin, includeShipping, updateSettings]);

    const variants = [
        { size: "S", baseCost: 1320.23, shipping: 1184.42 },
        { size: "M", baseCost: 1320.23, shipping: 1184.42 },
        { size: "L", baseCost: 1320.23, shipping: 1184.42 },
        { size: "XL", baseCost: 1320.23, shipping: 1184.42 },
        { size: "2XL", baseCost: 1565.12, shipping: 1184.42 },
        { size: "3XL", baseCost: 1792.21, shipping: 1184.42 },
        { size: "4XL", baseCost: 2320.97, shipping: 1184.42 },
        { size: "5XL", baseCost: 2581.45, shipping: 1184.42 },
    ];

    return (
        <div className="flex-1 bg-[#F9F8F6] p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-800">Set up prices</h1>
                    <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset to default</span>
                    </button>
                </div>
                <p className="text-[15px] text-slate-500 font-medium">
                    Your retail prices will always be converted and published in your store's currency.
                </p>

                {/* Sub-header Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-slate-500">Preview your costs in</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-all font-bold text-[13px] text-slate-700 shadow-sm">
                            <span>INR (₹)</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-[13px] font-bold text-slate-500 mx-2 text-slate-300">for</span>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-all font-bold text-[13px] text-slate-700 shadow-sm">
                            <span className="text-lg">🇮🇳</span>
                            <span>India</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Settings & Bulk Edit */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setIncludeShipping(!includeShipping)}
                    >
                        <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${includeShipping ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>
                            {includeShipping && <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-current rotate-45 mb-1" />}
                        </div>
                        <span className="text-[13px] font-bold text-slate-700">Include shipping cost in profit calculation</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-l-xl font-bold text-[13px] text-slate-700 min-w-[180px] shadow-sm">
                            <span>Set profit margin to</span>
                            <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                        </div>
                        <input
                            type="number"
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(Number(e.target.value))}
                            className="flex items-center h-[44px] px-4 w-20 bg-white border border-l-0 border-slate-200 text-slate-800 font-bold text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <div className="flex items-center h-[44px] px-4 bg-white border border-l-0 border-slate-200 text-slate-400 font-bold text-[15px] shadow-sm">
                            %
                        </div>
                        <button className="h-[44px] px-8 bg-[#1a1a24] text-white font-bold text-[13px] rounded-r-xl hover:bg-[#27272a] transition-all shadow-md">
                            Update
                        </button>
                    </div>
                </div>

                {/* Pricing Table Card */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-50">
                                <th className="px-8 py-6 align-top">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 relative bg-slate-50 rounded-lg flex-shrink-0 border border-slate-100 p-1">
                                            <div className="w-full h-full rounded bg-blue-50/50 flex items-center justify-center text-[8px] font-black text-blue-600/30">
                                                IMG
                                            </div>
                                        </div>
                                        <div className="max-w-[200px]">
                                            <p className="text-[13px] font-bold text-slate-800 leading-tight">Heavyweight Unisex Crewneck T-shirt | Gildan® 5000 White</p>
                                        </div>
                                    </div>
                                </th>
                                <th className="px-4 py-6 align-top text-right">
                                    <p className="text-[13px] font-black text-slate-800">Retail price (INR)</p>
                                    <p className="text-[11px] font-bold text-slate-400">This price will be shown to your customers</p>
                                </th>
                                <th className="px-4 py-6 align-top text-left pl-10">
                                    <div className="flex items-center gap-1">
                                        <p className="text-[13px] font-black text-slate-800">Price Guide</p>
                                        <Info className="w-3.5 h-3.5 text-slate-300" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-400">You vs others</p>
                                </th>
                                <th className="px-4 py-6 align-top text-right pr-10">
                                    <p className="text-[13px] font-black text-slate-800">Product costs (INR)</p>
                                    <p className="text-[11px] font-bold text-slate-400">for India</p>
                                </th>
                                <th className="px-4 py-6 align-top text-right pr-10">
                                    <p className="text-[13px] font-black text-slate-800">Shipping costs (INR)</p>
                                    <p className="text-[11px] font-bold text-slate-400">for India</p>
                                </th>
                                <th className="px-8 py-6 align-top text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <p className="text-[13px] font-black text-slate-800">Estimated profit (INR)</p>
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-400">+Profit margin %</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {/* All Variants Bulk Row */}
                            <tr className="bg-slate-50/50">
                                <td className="px-8 py-5">
                                    <span className="text-[14px] font-black text-slate-800">All Variants</span>
                                </td>
                                <td className="px-4 py-5 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-3 translate-x-3">
                                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-bold">-</button>
                                        <div className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-800 shadow-sm min-w-[150px] text-center">
                                            2,640.46 - 5,162.9
                                        </div>
                                        <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-bold">+</button>
                                    </div>
                                </td>
                                <td className="px-4 py-5 pl-10">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-3.5 h-3.5 text-slate-300" />
                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Coming soon</span>
                                    </div>
                                </td>
                                <td className="px-4 py-5 text-right font-bold text-slate-600 text-[13px] pr-10">
                                    1,320.23 - 2,581.45
                                </td>
                                <td className="px-4 py-5 text-right font-bold text-slate-600 text-[13px] pr-10">
                                    1,184.42
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13.5px] font-black text-green-600">1,320.23 - 2,581.45</span>
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-green-500/60 uppercase mr-6">50%</span>
                                    </div>
                                </td>
                            </tr>

                            {/* Individual Variants */}
                            {variants.map((v, i) => {
                                const retailValue = v.baseCost * 2; // Assuming 50% margin
                                const profit = retailValue - v.baseCost;
                                return (
                                    <tr key={i} className="group hover:bg-blue-50/20 transition-colors">
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <span className="text-[13px] font-bold text-slate-600">White - {v.size} - DTG (Direct-to-garment)</span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 translate-x-3">
                                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-bold">-</button>
                                                <div className="px-6 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-800 shadow-sm min-w-[150px] text-center">
                                                    {retailValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </div>
                                                <button className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors shadow-sm font-bold">+</button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 pl-10 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Coming soon</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold text-slate-500 text-[13px] pr-10">
                                            {v.baseCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-4 py-4 text-right font-bold text-slate-500 text-[13px] pr-10">
                                            {v.shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13.5px] font-black text-green-600">{profit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                </div>
                                                <span className="text-[10px] font-black text-green-500/60 uppercase mr-6">50%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

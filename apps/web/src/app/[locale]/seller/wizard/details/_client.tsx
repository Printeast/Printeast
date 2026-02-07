"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Info, Bold, Italic, List, ListOrdered, Link, Image as ImageIcon, Code, AlignCenter, AlignLeft, AlignRight, Underline as UnderlineIcon } from "lucide-react";
import Image from "next/image";
import { get } from "idb-keyval";

export function DetailsWizardClient() {
    const [title, setTitle] = useState("Heavyweight Unisex Crewneck T-shirt | Gildan® 5000 White");
    const [description, setDescription] = useState(
        "This heavyweight cotton t-shirt is a durable staple product with a classic fit. One of the most popular items, it has a relaxed style made for casual wear.\n\n• Seamless double-needle collar\n• Double-needle sleeve and bottom hems\n• Taped neck and shoulders for durability\n\nFabrication: Solid Colors are made from 100% cotton (preshrunk jersey knit); Ash Grey is 99% Airlume combed and ring-spun cotton, 1% polyester; Sport Grey is 90% cotton, 10% polyester; Heather Colors are 50% cotton, 50% polyester."
    );
    const [attachSizeTable, setAttachSizeTable] = useState(true);
    const [attachCare, setAttachCare] = useState(true);
    const [designPreview, setDesignPreview] = useState<string | null>(null);

    useEffect(() => {
        const loadPreview = async () => {
            try {
                // Try to get the design + blank combined preview
                const preview = await get("printeast_design_preview");
                if (preview) {
                    setDesignPreview(preview);
                }
            } catch (e) {
                console.error("Failed to load design preview", e);
            }
        };
        loadPreview();
    }, []);

    return (
        <div className="flex-1 bg-[#F9F8F6] p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Title Section */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Add your product title and description</h1>
                </div>

                {/* AI Promo Banner */}
                <div className="relative group overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Save time and make your products stand out by creating title and description with AI.</p>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 group">
                        <Sparkles className="w-4 h-4" />
                        <span>Generate with AI</span>
                    </button>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-8">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Side: Product Preview */}
                        <div className="lg:w-1/3 flex flex-col gap-4">
                            <div className="aspect-[4/5] relative rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden group shadow-inner">
                                {designPreview ? (
                                    <Image
                                        src={designPreview}
                                        alt="Product Preview"
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <ImageIcon className="w-12 h-12 opacity-20" />
                                        <span className="text-xs font-medium">Preview loading...</span>
                                    </div>
                                )}
                                {/* Status badge */}
                                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-slate-100 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                                    Primary View
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Form Fields */}
                        <div className="lg:w-2/3 space-y-8 text-slate-900">
                            {/* Title Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    Title
                                    <Info className="w-3 h-3 text-slate-300" />
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full h-12 px-5 bg-white border border-slate-200 rounded-xl text-[15px] font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 shadow-sm"
                                />
                            </div>

                            {/* Description Field */}
                            <div className="space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        Description
                                        <Info className="w-3 h-3 text-slate-300" />
                                    </span>
                                    <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 font-bold transition-colors">
                                        <Code className="w-3.5 h-3.5" />
                                        <span>HTML editor</span>
                                    </button>
                                </label>

                                <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                    {/* Editor Toolbar */}
                                    <div className="h-11 bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-1 overflow-x-auto scrollbar-hide">
                                        <div className="flex items-center gap-1 px-2 border-r border-slate-200 mr-2">
                                            <button className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-500">
                                                <span className="text-[13px] font-bold px-1.5">Default</span>
                                                <ChevronDown className="inline w-3 h-3 ml-1" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-0.5 mr-3">
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><Bold className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><Italic className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><UnderlineIcon className="w-4 h-4" /></button>
                                        </div>
                                        <div className="flex items-center gap-0.5 mr-3">
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><List className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><ListOrdered className="w-4 h-4" /></button>
                                        </div>
                                        <div className="flex items-center gap-0.5 mr-3">
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><AlignLeft className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500 border border-slate-200 bg-white text-blue-600"><AlignCenter className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><AlignRight className="w-4 h-4" /></button>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><Link className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><Code className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-white hover:text-blue-600 rounded-lg transition-all text-slate-500"><ImageIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    {/* Editor Content Area */}
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full min-h-[350px] p-6 bg-white rounded-b-2xl text-[14px] leading-relaxed font-medium text-slate-700 border-none focus:outline-none focus:ring-0 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Size Table Section */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setAttachSizeTable(!attachSizeTable)}>
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${attachSizeTable ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border-slate-200 text-transparent'}`}>
                                <div className="w-3 h-3 border-r-2 border-b-2 border-current rotate-45 mb-1" />
                            </div>
                            <span className="text-sm font-bold text-slate-800">Attach size table</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">You can edit size table in your store's platform</span>
                    </div>

                    {attachSizeTable && (
                        <div className="p-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                            {/* Metric System Toggle & Table */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded border-2 border-blue-600 bg-blue-600 flex items-center justify-center text-white">
                                        <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-current rotate-45 mb-0.5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Choose metric measurement system</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                                <th className="px-4 py-3"></th>
                                                {["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(s => (
                                                    <th key={s} className="px-4 py-3 text-center">{s}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-bold text-slate-600 divide-y divide-slate-50">
                                            <tr>
                                                <td className="px-4 py-4 whitespace-nowrap">A) Length (cm)</td>
                                                {[71.1, 73.7, 76.2, 78.7, 81.3, 83.8, 86, 89].map((v, i) => (
                                                    <td key={i} className="px-4 py-4 text-center">{v}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-4 whitespace-nowrap">B) Width (cm)</td>
                                                {[91.4, 101.6, 111.8, 122, 132, 142.2, 152, 162].map((v, i) => (
                                                    <td key={i} className="px-4 py-4 text-center">{v}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-4 whitespace-nowrap">C) Half Chest (cm)</td>
                                                {[45.7, 50.8, 55.9, 61, 66, 71.1, 76, 81].map((v, i) => (
                                                    <td key={i} className="px-4 py-4 text-center">{v}</td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Imperial System Toggle & Table */}
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded border-2 border-blue-600 bg-blue-600 flex items-center justify-center text-white">
                                        <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-current rotate-45 mb-0.5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">Choose imperial measurement system</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                                <th className="px-4 py-3"></th>
                                                {["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(s => (
                                                    <th key={s} className="px-4 py-3 text-center">{s}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-bold text-slate-600 divide-y divide-slate-50">
                                            <tr>
                                                <td className="px-4 py-4 whitespace-nowrap">A) Length (inches)</td>
                                                {[28, 29, 30, 31, 32, 33, 33.9, 35].map((v, i) => (
                                                    <td key={i} className="px-4 py-4 text-center">{v}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-4 whitespace-nowrap">B) Width (inches)</td>
                                                {[36, 40, 44, 48, 52, 56, 59.8, 63.8].map((v, i) => (
                                                    <td key={i} className="px-4 py-4 text-center">{v}</td>
                                                ))}
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-4 whitespace-nowrap">C) Half Chest (inches)</td>
                                                {[18, 20, 22, 24, 26, 28, 29.9, 31.9].map((v, i) => (
                                                    <td key={i} className="px-4 py-4 text-center">{v}</td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Care Instructions Section */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setAttachCare(!attachCare)}>
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center ${attachCare ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200' : 'bg-white border-slate-200 text-transparent'}`}>
                                <div className="w-3 h-3 border-r-2 border-b-2 border-current rotate-45 mb-1" />
                            </div>
                            <span className="text-sm font-bold text-slate-800">Attach care instructions</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">You can edit care instructions in your store's platform</span>
                    </div>

                    {attachCare && (
                        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Care Instructions</h4>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="md:col-span-1">
                                    <span className="text-sm font-bold text-slate-700">General</span>
                                </div>
                                <div className="md:col-span-3">
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                        The tee combines comfort, style, and durability, making it a top choice for both everyday wear and craft projects.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div className="md:col-span-1">
                                    <span className="text-sm font-bold text-slate-700">Wash</span>
                                </div>
                                <div className="md:col-span-3">
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                        Maintain the tee's look and feel by washing it in cold water with similar colors.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Styles for Scrollbar Hide */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

function ChevronDown(props: any) {
    return <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
}

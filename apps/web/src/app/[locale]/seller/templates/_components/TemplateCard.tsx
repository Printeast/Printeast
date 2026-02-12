"use client";

import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

interface TemplateProps {
    id: string;
    status?: string | null;
    previewUrl?: string | null;
    createdAt: string;
    prompt_text?: string;
    designData?: any;
}

export function TemplateCard({ template }: { template: TemplateProps }) {
    // Prefer prompt_text (flat title) over digging into designData (JSON)
    const title = template.prompt_text || template.designData?.product?.title || "Untitled Product";
    const productId = template.designData?.product?.id || "Custom Product";


    // Extract color/size/tech if available in variants or settings
    // For now, mock or extract if possible. The WizardContext suggests `variants.selected` are IDs.
    // We'll show placeholders or inferred data.
    const technology = "DTG (Direct-to-garment)";
    const sizes = "S, M, L, XL, 2XL, 3XL, 4XL, 5XL"; // Hardcoded for standard apparel for now, or derive from product.id
    const color = "White"; // Placeholder, usually would be in designData.variants or similar

    return (
        <div className="group relative bg-white border border-slate-200 rounded-[20px] p-4 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full">
            {/* Top Image Section with Overlay */}
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#F9F9F9] overflow-hidden mb-4">
                {/* 3-dot menu absolute top right */}
                <button className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-colors shadow-sm opacity-0 group-hover:opacity-100 duration-200">
                    <MoreHorizontal className="w-5 h-5" />
                </button>

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-20">
                    <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                        {template.status || "TEMPLATE"}
                    </span>
                </div>

                {/* Main Image */}
                {template.previewUrl ? (
                    <Image
                        src={template.previewUrl}
                        alt={title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <span className="text-xs font-bold uppercase tracking-widest">No Preview</span>
                    </div>
                )}

                {/* Hover Overlay with Buttons */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6 z-10">
                    <button className="w-full h-11 bg-[#1a1a24] hover:bg-black text-white text-sm font-bold rounded-full shadow-lg hover:shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        Add to store
                    </button>
                    <button className="w-full h-11 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 text-sm font-bold rounded-full shadow-md hover:shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Place an order
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col gap-1">
                <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2">
                    {title} | <span className="text-slate-500">{productId} {color}</span>
                </h3>

                <p className="text-xs text-slate-400 font-medium mb-3">
                    Created {new Date(template.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' })}
                </p>

                <div className="mt-auto space-y-1.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center text-xs">
                        <span className="text-slate-400 font-medium w-24">Technology:</span>
                        <span className="text-slate-700 font-semibold">{technology}</span>
                    </div>
                    <div className="flex items-center text-xs">
                        <span className="text-slate-400 font-medium w-24">Color:</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-200 bg-white shadow-sm" />
                            <span className="text-slate-700 font-semibold">{color}</span>
                        </div>
                    </div>
                    <div className="flex items-start text-xs">
                        <span className="text-slate-400 font-medium w-24 mt-0.5">Size:</span>
                        <span className="text-slate-500 leading-relaxed font-medium line-clamp-1">{sizes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

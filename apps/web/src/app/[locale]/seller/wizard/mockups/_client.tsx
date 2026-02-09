"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Check, ChevronDown, Download, Sparkles, Upload, ZoomIn, Crown } from "lucide-react";

// Mock data representing different angles/scenes of the same product
// overlayStyle defines how the "Standard Front View" canvas maps onto this specific image
const MOCKUP_TEMPLATES = [
    {
        id: 1,
        name: "Classic Front View",
        category: "mens",
        price: "free",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
        overlayStyle: { top: '-10%', left: '-10%', width: '120%', height: '120%' }
    },
    {
        id: 2,
        name: "Studio Back View",
        category: "mens",
        price: "free",
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1200&q=80",
        overlayStyle: { top: '-10%', left: '-10%', width: '120%', height: '120%' }
    },
    {
        id: 3,
        name: "Lifestyle Street",
        category: "lifestyle",
        price: "premium",
        image: "https://images.unsplash.com/photo-1550991152-12461a919379?auto=format&fit=crop&w=1200&q=80",
        overlayStyle: { top: '-10%', left: '-10%', width: '120%', height: '120%', transform: 'translateY(8%) scale(0.8)' }
    },
    {
        id: 4,
        name: "Folded Flat Lay",
        category: "flatlay",
        price: "free",
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=80",
        overlayStyle: { top: '-10%', left: '-10%', width: '120%', height: '120%', transform: 'rotate(-8deg)' }
    },
    {
        id: 5,
        name: "Hanger Minimal",
        category: "flatlay",
        price: "premium",
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=80",
        overlayStyle: { top: '-10%', left: '-10%', width: '120%', height: '120%' }
    },
    {
        id: 6,
        name: "Lifestyle Urban",
        category: "lifestyle",
        price: "premium",
        image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
        overlayStyle: { top: '-10%', left: '-10%', width: '120%', height: '120%' }
    },
    {
        id: 7,
        name: "Studio Front Alt",
        category: "mens",
        price: "free",
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80",
        overlayStyle: { top: '-10%', left: '-10%', width: '120%', height: '120%' }
    },
    {
        id: 8,
        name: "Studio Back Alt",
        category: "mens",
        price: "free",
        image: "https://images.unsplash.com/photo-1618354491438-25bc04584c23?auto=format&fit=crop&w=1200&q=80",
        overlayStyle: { top: '-10%', left: '-10%', width: '120%', height: '120%' }
    },
];

import { get } from "idb-keyval";

export function MockupsWizardClient() {
    const [selectedMockups, setSelectedMockups] = useState<number[]>([1]); // Default select first
    const [imageFormat, setImageFormat] = useState<"JPG" | "WebP" | "PNG">("JPG");
    const [priceFilter, setPriceFilter] = useState<"All" | "Free" | "Premium">("All");
    const [designPreview, setDesignPreview] = useState<string | null>(null);

    useEffect(() => {
        const loadPreview = async () => {
            try {
                // Use the raw design asset (transparent) for overlaying on mockups
                const asset = await get("printeast_design_asset");
                const preview = await get("printeast_design_preview"); // Fallback

                if (asset) {
                    setDesignPreview(asset);
                } else if (preview) {
                    setDesignPreview(preview);
                }
            } catch (e) {
                console.error("Failed to load preview from IDB", e);
            }
        };

        // Initial load
        loadPreview();

        // Listen for custom event from Design Studio
        const handleUpdate = () => loadPreview();
        window.addEventListener("printeast-preview-updated", handleUpdate);

        // Fallback polling (just in case)
        const interval = setInterval(loadPreview, 1000);

        return () => {
            window.removeEventListener("printeast-preview-updated", handleUpdate);
            clearInterval(interval);
        };
    }, []);

    const toggleMockup = (id: number) => {
        setSelectedMockups(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const togglePriceFilter = (filter: "All" | "Free" | "Premium") => {
        setPriceFilter(filter);
    };

    const isSelected = (id: number) => selectedMockups.includes(id);
    const isPrimary = (id: number) => selectedMockups.length > 0 && selectedMockups[0] === id;

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            {/* Header Section */}
            <div className="px-8 py-6 border-b border-slate-100 bg-white shrinking-0">
                <div className="flex flex-col gap-6">
                    {/* Top Row: Title & Format Controls */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Select mockups</h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Some of our mockups are created in <span className="text-blue-500 cursor-pointer hover:underline">Photific</span>.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-slate-500">Image format</span>
                                <div className="flex bg-slate-100 rounded-lg p-1">
                                    {(["JPG", "WebP", "PNG"] as const).map((fmt) => (
                                        <button
                                            key={fmt}
                                            onClick={() => setImageFormat(fmt)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${imageFormat === fmt
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                                }`}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200">
                                <Download className="w-4 h-4" />
                                Download ({selectedMockups.length})
                            </button>
                        </div>
                    </div>

                    {/* Bottom Row: Filters */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* Category Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 transition-colors cursor-default">
                                    All mockups
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            {/* Price Filter */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-slate-700">Price</span>
                                <div className="flex items-center gap-1">
                                    {(["All", "Free", "Premium"] as const).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => togglePriceFilter(p)}
                                            className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${priceFilter === p
                                                ? "bg-slate-900 text-white border-slate-900"
                                                : "bg-white text-slate-600 border-transparent hover:bg-slate-50"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-colors">
                                <Upload className="w-4 h-4" />
                                Upload your own
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] hover:bg-[#4f46e5] text-white text-sm font-semibold rounded-lg transition-all shadow-md shadow-indigo-500/20">
                                <Sparkles className="w-4 h-4" />
                                Magic mockups
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1600px] mx-auto">
                    {MOCKUP_TEMPLATES.map(mockup => (
                        <div
                            key={mockup.id}
                            onClick={() => toggleMockup(mockup.id)}
                            className={`group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${isSelected(mockup.id)
                                ? "border-slate-900 shadow-md"
                                : "border-transparent ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-lg hover:shadow-slate-200/50"
                                }`}
                        >
                            {/* Top Left: Checkbox */}
                            <div className={`absolute top-3 left-3 w-6 h-6 rounded border-2 flex items-center justify-center transition-all z-20 ${isSelected(mockup.id)
                                ? "bg-slate-900 border-slate-900"
                                : "bg-white border-slate-300 group-hover:border-slate-400"
                                }`}>
                                {isSelected(mockup.id) && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                            </div>

                            {/* Top Right: Primary Badge */}
                            {isPrimary(mockup.id) && (
                                <div className="absolute top-3 right-3 px-2 py-1 bg-[#3b82f6] text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm z-20">
                                    Primary
                                </div>
                            )}

                            {/* Image Container */}
                            <div className="aspect-[4/5] relative bg-slate-100 flex items-center justify-center overflow-hidden">
                                {/* Base Mockup Image */}
                                <Image
                                    src={mockup.image}
                                    alt={mockup.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 z-0"
                                />

                                {/* User Design Overlay */}
                                {designPreview && (
                                    <div
                                        className="absolute z-10 pointer-events-none transition-all duration-300 ease-out"
                                        style={{
                                            ...mockup.overlayStyle,
                                            mixBlendMode: 'multiply',
                                            filter: 'contrast(1.08) brightness(0.98) saturate(1.05) blur(0.4px)',
                                            opacity: 0.94
                                        }}
                                    >
                                        <img
                                            src={designPreview}
                                            alt="Your Design"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                {/* Bottom Left: Premium Icon */}
                                {mockup.price === 'premium' && (
                                    <div className="absolute bottom-3 left-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm z-20">
                                        <Crown className="w-3.5 h-3.5 text-purple-600 fill-purple-600" />
                                    </div>
                                )}

                                {/* Bottom Right: Zoom Icon */}
                                <div className="absolute bottom-3 right-3 w-8 h-8 bg-slate-900/0 hover:bg-slate-900/80 text-transparent hover:text-white rounded-lg flex items-center justify-center transition-all z-20 group/zoom">
                                    <ZoomIn className="w-4 h-4 text-slate-700 group-hover/zoom:text-white transition-colors" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More Button */}
                <div className="flex justify-center mt-12 mb-8">
                    <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                        Show more
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

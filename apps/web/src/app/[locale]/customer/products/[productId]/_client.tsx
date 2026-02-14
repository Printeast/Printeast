
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info, Check, Ruler } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

import { Role } from "@repo/types";

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    basePrice: number;
    images: string[];
    options: any;
    provider: string;
    stockStatus: string;
    tags: string[];
}

interface CustomerProductDetailsProps {
    product: Product;
    userEmail: string;
    role: Role;
}

export function CustomerProductDetails({ product, userEmail, role }: CustomerProductDetailsProps) {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    // Parse sizes/colors from options if available, or default
    const sizes = product.options?.sizes || ["S", "M", "L", "XL"];
    const colors = product.options?.colors || [{ name: "White", hex: "#FFFFFF" }];

    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);

    // Currency conversion
    const [currency, setCurrency] = useState("INR");
    const RATES = {
        INR: { rate: 1, symbol: "₹" },
        USD: { rate: 0.012, symbol: "$" },
        EUR: { rate: 0.011, symbol: "€" },
        GBP: { rate: 0.0095, symbol: "£" },
    };

    const currentRate = RATES[currency as keyof typeof RATES];
    const convertedPrice = (product.basePrice * currentRate.rate).toFixed(2);

    const handleStartOrder = () => {
        // Navigate to design/editor with this product selected
        // Using a query param to pass the product ID
        router.push(`/customer/design?productId=${product.id}&fresh=true`);
    };

    return (
        <DashboardLayout user={{ email: userEmail, role }} fullBleed>
            <div className="min-h-full w-full bg-[#f8f9fa] animate-in fade-in duration-500 pb-20">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Breadcrumb / Back */}
                    <button
                        onClick={() => router.push('/customer/products')}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
                    >
                        <div className="p-1 rounded-full bg-white border border-slate-200 group-hover:bg-slate-50 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        Back to catalog
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left Column: Images */}
                        <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
                            {/* Thumbnails */}
                            <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible md:w-24 flex-shrink-0 order-2 md:order-1">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`relative aspect-square w-16 md:w-full border-2 rounded-lg overflow-hidden transition-all flex-shrink-0 ${selectedImage === idx
                                            ? "border-blue-600 ring-1 ring-blue-600/20"
                                            : "border-transparent hover:border-slate-200 bg-white"
                                            }`}
                                    >
                                        <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 relative aspect-[4/5] md:aspect-square bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group order-1 md:order-2">
                                <Image
                                    src={product.images[selectedImage] || product.images[0] || ""}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="lg:col-span-5 space-y-8">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wider rounded border border-blue-100">
                                        {product.category}
                                    </span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                                    {product.name}
                                </h1>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900">{currentRate.symbol}{convertedPrice}</span>
                                        <span className="text-sm font-bold text-slate-400">base price</span>
                                    </div>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 uppercase cursor-pointer"
                                    >
                                        {Object.keys(RATES).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Selectors */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                {/* Colors */}
                                <div>
                                    <label className="text-sm font-black text-slate-900 uppercase tracking-wide mb-3 block">Available Colors</label>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((color: any, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedColor(color)}
                                                className={`group relative w-10 h-10 rounded-full border-2 shadow-sm transition-all hover:scale-110 ${selectedColor === color
                                                    ? "border-blue-600 ring-2 ring-blue-600/20"
                                                    : "border-slate-100"
                                                    }`}
                                                style={{ backgroundColor: color.hex }}
                                                title={color.name}
                                            >
                                                {selectedColor === color && (
                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                        <Check className={`w-5 h-5 ${["#FFFFFF", "#ffffff", "#FFF", "#fff"].includes(color.hex) ? "text-slate-900" : "text-white"} drop-shadow-md`} />
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 mt-2">Selected: <span className="text-slate-900">{selectedColor.name || "None"}</span></p>
                                </div>

                                {/* Sizes */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-black text-slate-900 uppercase tracking-wide">Select Size</label>
                                        <button className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
                                            <Ruler className="w-3.5 h-3.5" /> Size Guide
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {sizes.map((size: string) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${selectedSize === size
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4">
                                <button
                                    onClick={handleStartOrder}
                                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-black uppercase tracking-wide rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                >
                                    Start Designing
                                </button>
                                <p className="text-xs text-center text-slate-500 font-medium">
                                    Customize this product in our design studio and add it to your order.
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                                <h4 className="flex items-center gap-2 text-sm font-black text-blue-800 mb-2">
                                    <Info className="w-4 h-4" /> About this product
                                </h4>
                                <p className="text-sm text-blue-900/80 leading-relaxed">
                                    {product.description || "High-quality blank ready for your custom design."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

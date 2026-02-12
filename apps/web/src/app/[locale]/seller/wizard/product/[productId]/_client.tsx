"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Globe, Truck, Info, ChevronDown } from "lucide-react";

interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    currency: string;
    shipping: number;
    images: string[];
    orientations?: string[];
    sizes: string[];
    isBestseller?: boolean;
    provider: string;
}

interface ProductDetailsClientProps {
    product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState(0);
    const [orientation, setOrientation] = useState(product.orientations?.[0] || "");
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

    return (
        <div className="min-h-full w-full bg-[#FCFCFC] animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Breadcrumb / Back */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
                >
                    <div className="p-1 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to catalog
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Images */}
                    <div className="lg:col-span-7 flex gap-6">
                        {/* Thumbnails */}
                        <div className="flex flex-col gap-3 w-24 flex-shrink-0">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative aspect-[3/4] w-full border-2 rounded-lg overflow-hidden transition-all ${selectedImage === idx
                                        ? "border-slate-900 ring-1 ring-slate-900/10"
                                        : "border-transparent hover:border-slate-200"
                                        }`}
                                >
                                    <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 relative aspect-[3/4] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group">
                            <Image
                                src={product.images[selectedImage] || product.images[0] || ""}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            {product.isBestseller && (
                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#00C48C] text-white text-[11px] font-black uppercase tracking-wider rounded shadow-sm">
                                    Bestseller
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="lg:col-span-5 space-y-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                                {product.name}
                            </h1>
                            <p className="text-slate-500 font-medium text-lg">{product.category}</p>
                        </div>

                        {/* Orientation */}
                        {product.orientations && product.orientations.length > 0 && (
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-900">Orientation</label>
                                <div className="flex gap-2">
                                    {product.orientations.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setOrientation(opt)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${orientation === opt
                                                ? "bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-900/20"
                                                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-900">Sizes</label>
                            <div className="relative group">
                                <select
                                    className="w-full h-12 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all cursor-pointer"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    {product.sizes.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className="bg-white rounded-xl border border-slate-200 p-0 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                            <div className="flex-1 p-5 border-b sm:border-b-0 sm:border-r border-slate-100 space-y-1">
                                <span className="text-xs font-bold text-slate-500">Product price</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-slate-900">₹{product.price.toFixed(2)}</span>
                                    <span className="text-[10px] font-bold text-slate-400">excl. VAT</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-4 h-4 bg-purple-100 rounded flex items-center justify-center">
                                        <div className="w-2.5 h-2 text-purple-600">♛</div>
                                    </div>
                                    <span className="text-xs font-bold text-purple-700">₹{(product.price * 0.75).toFixed(2)} with Gelato+</span>
                                </div>
                            </div>
                            <div className="flex-1 p-5 space-y-1 bg-slate-50/50">
                                <span className="flex items-center gap-1 text-xs font-bold text-slate-500">
                                    Shipping from <Info className="w-3 h-3 text-slate-400" />
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-slate-900">₹{product.shipping.toFixed(2)}</span>
                                </div>
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs font-bold text-slate-600">4-6 business days</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>Delivery to</span>
                                        <span className="flex items-center gap-1 font-bold text-slate-700">
                                            🇺🇸 United States
                                            <ChevronDown className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Guide Toggle */}
                        <button className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors group">
                            <span className="text-sm font-bold text-slate-700">Price guide</span>
                            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
                        </button>

                        {/* Actions */}
                        <div className="pt-2">
                            <div className="flex">
                                <button
                                    onClick={() => router.push(`/seller/studio/${product.id}`)}
                                    className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-l-xl flex items-center justify-center transition-all shadow-lg shadow-slate-900/20"
                                >
                                    Add to order
                                </button>
                                <button className="h-12 px-4 bg-slate-900 border-l border-slate-700 hover:bg-slate-800 text-white rounded-r-xl flex items-center justify-center transition-all">
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-slate-600 mt-0.5" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Fulfilled in 22 countries</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Truck className="w-5 h-5 text-slate-600 mt-0.5" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm font-medium text-slate-600 leading-snug">
                                        Express shipping: estimated delivery in <span className="font-bold text-slate-900">3-4 business days</span>
                                    </p>
                                </div>
                                <Info className="w-4 h-4 text-slate-400 ml-auto" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Additional Sections Below */}
                <div className="mt-16 space-y-6 max-w-4xl">
                    {/* Description */}
                    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Description</h3>
                        <div className="prose prose-slate prose-sm max-w-none">
                            <p className="text-slate-600 leading-relaxed mb-4">
                                Our premium matte paper is heavier-weight, white, and features a smooth, uncoated finish that feels luxuriously soft to the touch.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6">
                                <li><strong>Paper Finishing:</strong> Matte, smooth, non-reflective surface.</li>
                                <li><strong>Paper Weight:</strong> 200 gsm (80 lb), thickness: 0.26 mm (10.3 mils).</li>
                                <li><strong>Sustainable Paper:</strong> FSC-certified or equivalent paper for sustainability.</li>
                                <li><strong>Available Sizes:</strong> 29 sizes in inches (US&CA) and cms (rest of the world).</li>
                            </ul>
                            <p className="text-xs text-slate-500 font-medium">
                                Learn about paper types and their unique textures and finishes <span className="text-blue-600 underline cursor-pointer">here</span>.
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                No minimum orders, printed and shipped on demand.
                            </p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-900 mb-1">Product UID</p>
                            <code className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                                flat_130x180-mm-5r_200-gsm-80lb-uncoated_4-0_ver
                            </code>
                        </div>
                    </div>

                    {/* Collapsible Sections (Mock) */}
                    {["EU GPSR Compliance Information", "Regional pricing", "Production"].map((section) => (
                        <div key={section} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group text-left">
                                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {section}
                                </h3>
                                <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                            </button>
                            {section === "EU GPSR Compliance Information" && (
                                <div className="px-6 pb-6 pt-0 animate-in fade-in slide-in-from-top-2">
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                                        <li>Manufacturer contact information:
                                            <ul className="list-circle pl-5 mt-1 space-y-1 text-xs">
                                                <li>Name: Printeast</li>
                                                <li>Email: support@printeast.com</li>
                                                <li>Postal address: 123 Oxford Street, London, W1D 2HG, United Kingdom</li>
                                            </ul>
                                        </li>
                                        <li>Age guidelines: For adults</li>
                                        <li>Warranty (consumer-sales only): 2 years</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

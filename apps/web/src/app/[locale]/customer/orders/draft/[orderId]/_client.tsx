
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Trash2,
    Copy,
    Edit2,
    Plus,
    Check
} from "lucide-react";

interface OrderItem {
    id: string;
    name: string;
    details: string;
    image: string;
    quantity: number;
    price: number;
    currency: string;
    isGelatoPlus?: boolean;
}

interface OrderDraftClientProps {
    orderId: string;
    initialItems: OrderItem[];
}

export function OrderDraftClient({ orderId, initialItems }: OrderDraftClientProps) {
    const router = useRouter();
    const [items, setItems] = useState<OrderItem[]>(initialItems);

    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // + tax/shipping if logic added

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans pb-32">
            {/* Top Stepper Bar with Blur */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-20 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-lg text-slate-900 tracking-tight">
                        Checkout
                    </div>

                    {/* Stepper */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm font-medium">
                        <div className="flex flex-col items-center group cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center mb-1.5 shadow-lg shadow-slate-900/20 transition-transform group-hover:scale-105">
                                <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                            <span className="text-slate-900 font-bold tracking-tight">Products</span>
                        </div>
                        <div className="h-px w-16 bg-gradient-to-r from-slate-900 to-gray-200 mb-6"></div>
                        <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center mb-1.5 bg-white">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            </div>
                            <span className="font-semibold tracking-tight text-slate-500">Shipping</span>
                        </div>
                        <div className="h-px w-16 bg-gray-200 mb-6"></div>
                        <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center mb-1.5 bg-white">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            </div>
                            <span className="font-semibold tracking-tight text-slate-500">Review & pay</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push(`/customer/orders/draft/${orderId}/shipping`)}
                        className="px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5"
                    >
                        Continue to shipping
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-10">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">#{orderId}</h1>
                        <div className="h-8 w-px bg-gray-300"></div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Created At</span>
                            <span className="text-sm font-bold text-slate-700">2026/02/10 00:21:53</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-wider rounded-md border border-blue-100 shadow-sm ml-2">Saved as draft</span>
                    </div>
                    <button className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                        <Trash2 className="w-4 h-4" />
                        Discard order
                    </button>
                </div>

                {/* Add Product Bar - Uplifted */}
                <button
                    onClick={() => router.push('/customer/products')}
                    className="group w-full text-left bg-white border border-dashed border-gray-300 hover:border-blue-500 hover:ring-4 hover:ring-blue-500/5 rounded-2xl p-5 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all mb-8 flex items-center gap-3 shadow-sm hover:shadow-md"
                >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-500 flex items-center justify-center transition-colors">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-base">Add product</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 group">
                                {/* Image */}
                                <div className="w-32 h-40 relative bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100 group-hover:border-blue-100 transition-colors">
                                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-white/50 shadow-sm">
                                        Front
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                                            <div className="text-xl font-black text-slate-900 tracking-tight">
                                                {item.price.toFixed(2)} {item.currency}
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-slate-500 max-w-md">{item.details}</p>
                                    </div>

                                    {/* Action Row */}
                                    <div className="flex items-end justify-between mt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 font-bold transition-all shadow-sm hover:shadow"
                                                    >-</button>
                                                    <div className="w-10 text-center font-bold text-slate-900 text-sm">
                                                        {item.quantity}
                                                    </div>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 font-bold transition-all shadow-sm hover:shadow"
                                                    >+</button>
                                                </div>
                                            </div>

                                            {item.isGelatoPlus && (
                                                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100/50 w-fit">
                                                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center shadow-sm">
                                                        <span className="text-[9px] text-white font-bold">G+</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-purple-700">Save on this item with Gelato+</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-6 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
                                                <Edit2 className="w-3.5 h-3.5" /> Edit
                                            </button>
                                            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
                                                <Copy className="w-3.5 h-3.5" /> Duplicate
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-wider hover:bg-red-50 rounded px-2 py-1"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column: Summary */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-28">
                            <h3 className="text-lg font-black text-slate-900 mb-8 flex justify-between items-center tracking-tight">
                                Summary
                                <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-1">
                                    INR <ChevronLeft className="w-3 h-3 -rotate-90" />
                                </span>
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm items-center">
                                    <span className="font-bold text-slate-500">Subtotal</span>
                                    <span className="font-bold text-slate-900 text-base">{subtotal.toFixed(2)} INR</span>
                                </div>
                                <div className="flex justify-between text-sm items-center pt-4 border-t border-gray-100">
                                    <span className="font-bold text-slate-900">Total <span className="text-xs text-slate-400 font-medium ml-1">excl. tax</span></span>
                                    <span className="font-black text-slate-900 text-xl">{total.toFixed(2)} INR</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(`/customer/orders/draft/${orderId}/shipping`)}
                                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                Continue to shipping
                            </button>
                        </div>

                        {/* Goes Well Together Upsell */}
                        <div>
                            <h4 className="text-lg font-black text-slate-900 mb-5 tracking-tight">Goes Well Together</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all cursor-pointer">
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-[#00C48C] text-white text-[9px] font-black uppercase rounded shadow-sm z-10 tracking-widest">New</div>
                                    <div className="aspect-square relative bg-gray-50">
                                        <Image src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80" alt="Upsell" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="p-4">
                                        <p className="font-bold text-sm text-slate-900 mb-1 leading-tight">Canvas Print</p>
                                        <p className="text-xs font-bold text-slate-400">From 1200 INR</p>
                                    </div>
                                </div>
                                <div className="relative group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all cursor-pointer">
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-[9px] font-black uppercase rounded shadow-sm z-10 tracking-widest">Profit +</div>
                                    <div className="aspect-square relative bg-gray-50">
                                        <Image src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80" alt="Upsell" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="p-4">
                                        <p className="font-bold text-sm text-slate-900 mb-1 leading-tight">Framed Poster</p>
                                        <p className="text-xs font-bold text-slate-400">From 1500 INR</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


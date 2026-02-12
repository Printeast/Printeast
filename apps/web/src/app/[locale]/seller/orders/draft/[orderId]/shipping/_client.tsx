"use client";

import { useRouter } from "next/navigation";
import {
    Trash2,
    Check,
    MapPin,
    Wallet,
    ChevronDown
} from "lucide-react";

interface OrderShippingClientProps {
    orderId: string;
}

export function OrderShippingClient({ orderId }: OrderShippingClientProps) {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans pb-32">
            {/* Top Stepper Bar with Blur */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-20 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-lg text-slate-900 tracking-tight">
                        {/* Empty or Logo if needed */}
                    </div>

                    {/* Stepper */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm font-medium">
                        <div
                            className="flex flex-col items-center group cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                            onClick={() => router.back()}
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 border border-slate-200">
                                <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                            <span className="text-slate-500 font-bold tracking-tight">Products</span>
                        </div>
                        <div className="h-px w-16 bg-slate-900 mb-6"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center mb-1.5 shadow-lg shadow-slate-900/20">
                                <MapPin className="w-4 h-4" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold tracking-tight text-slate-900">Shipping</span>
                        </div>
                        <div className="h-px w-16 bg-gray-200 mb-6"></div>
                        <div className="flex flex-col items-center opacity-40">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center mb-1.5 bg-white">
                                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <span className="font-semibold tracking-tight text-slate-500">Review & pay</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push(`/seller/orders/draft/${orderId}/review`)}
                        className="px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5"
                    >
                        Calculate shipping
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-8 py-10">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">#{orderId}</h1>
                        <span className="text-sm font-bold text-slate-500">2026/02/10 00:32:32</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-wider rounded-md border border-blue-100 shadow-sm ml-2">Saved as draft</span>
                    </div>
                    <button className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-all">
                        <Trash2 className="w-4 h-4" />
                        Discard order
                    </button>
                </div>

                {/* Shipping Form Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Shipping Address</h2>
                    </div>

                    <form className="space-y-6">
                        {/* Country */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Country</label>
                            <div className="relative">
                                <select className="w-full h-11 pl-4 pr-10 bg-white border border-gray-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none transition-all cursor-pointer hover:border-gray-300">
                                    <option value="IN">🇮🇳 India</option>
                                    <option value="US">🇺🇸 United States</option>
                                    <option value="GB">🇬🇧 United Kingdom</option>
                                    <option value="CA">🇨🇦 Canada</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Name Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">First name</label>
                                <input
                                    type="text"
                                    placeholder="First name"
                                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Last name</label>
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Address 1 */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Address line 1</label>
                            <input
                                type="text"
                                placeholder="Address line 1"
                                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                            />
                        </div>

                        {/* Address 2 (Opt) */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-bold text-slate-700">Address line 2 <span className="text-slate-400 font-normal">(optional)</span></label>
                            </div>
                            <input
                                type="text"
                                placeholder="Address line 2"
                                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                            />
                        </div>

                        {/* Company (Opt) */}
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-bold text-slate-700">Company name <span className="text-slate-400 font-normal">(optional)</span></label>
                            </div>
                            <input
                                type="text"
                                placeholder="Company name"
                                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                            />
                        </div>

                        {/* Zip | Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Post/Zip code</label>
                                <input
                                    type="text"
                                    placeholder="Post/Zip code"
                                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Phone</label>
                                <input
                                    type="tel"
                                    placeholder="081234 56789"
                                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                                />
                            </div>
                        </div>

                        {/* City | State (Opt) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">City</label>
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-sm font-bold text-slate-700">State / Province / Region <span className="text-slate-400 font-normal">(optional)</span></label>
                                </div>
                                <input
                                    type="text"
                                    placeholder="State / Province / Region"
                                    className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all hover:border-gray-300"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center justify-center gap-1 mx-auto">
                        Show details
                    </button>
                </div>
            </div>
        </div>
    );
}

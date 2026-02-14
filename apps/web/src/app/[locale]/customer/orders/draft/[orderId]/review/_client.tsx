
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Trash2,
    Check,
    Wallet,
    Info,
    CreditCard,
    Plus
} from "lucide-react";

interface OrderReviewClientProps {
    orderId: string;
}

export function OrderReviewClient({ orderId }: OrderReviewClientProps) {
    const router = useRouter();

    // Mock data for the screenshot match
    const productPrice = 956.06;
    const shippingPrice = 1056.4;
    const total = productPrice + shippingPrice;

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-sans pb-32">
            {/* Top Stepper Bar with Blur */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-20 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-lg text-slate-900 tracking-tight">
                        {/* Logo area */}
                    </div>

                    {/* Stepper */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm font-medium">
                        <div
                            className="flex flex-col items-center group cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                            onClick={() => router.push(`/customer/orders/draft/${orderId}`)}
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 border border-slate-200">
                                <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                            <span className="text-slate-500 font-bold tracking-tight">Products</span>
                        </div>
                        <div className="h-px w-16 bg-slate-900 mb-6"></div>
                        <div
                            className="flex flex-col items-center group cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                            onClick={() => router.back()}
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 border border-slate-200">
                                <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                            <span className="text-slate-500 font-bold tracking-tight">Shipping</span>
                        </div>
                        <div className="h-px w-16 bg-slate-900 mb-6"></div>
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center mb-1.5 shadow-lg shadow-slate-900/20">
                                <Wallet className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold tracking-tight text-slate-900">Review & pay</span>
                        </div>
                    </div>

                    <button
                        className="px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5"
                    >
                        Pay {total.toFixed(2)} INR
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
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

                {/* 1. Products Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Products</h2>
                        <button className="text-sm font-bold text-blue-600 hover:underline">Edit</button>
                    </div>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <th className="px-8 py-4 font-bold w-32 text-center">Image</th>
                                <th className="px-8 py-4 font-bold">Product name</th>
                                <th className="px-8 py-4 font-bold text-center">Quantity</th>
                                <th className="px-8 py-4 font-bold text-right">Unit price</th>
                                <th className="px-8 py-4 font-bold text-right">Retail price <span className="text-blue-600">INR</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6 text-center">
                                    <div className="w-16 h-20 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mx-auto shadow-sm relative">
                                        {/* Mock Image */}
                                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-300">Img</div>
                                        <Image
                                            src="https://images.unsplash.com/photo-1582140163304-405494292150?auto=format&fit=crop&w=200&q=80"
                                            alt="Product"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-900 text-base">Premium Matte Poster</div>
                                    <div className="text-sm text-slate-500 font-medium mt-0.5">13x18cm / 5x7", Vertical (portrait) orientation</div>
                                </td>
                                <td className="px-8 py-6 text-center font-bold text-slate-900">1</td>
                                <td className="px-8 py-6 text-right">
                                    <div className="font-bold text-slate-900 text-base">{productPrice.toFixed(2)} INR <Info className="w-3.5 h-3.5 inline text-slate-400 align-top" /></div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <input type="text" className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right font-medium text-slate-900 focus:outline-none focus:border-blue-500" />
                                        <span className="font-bold text-slate-500 text-sm">INR</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 2. Shipping Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Shipping</h2>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-500">Retail price <input type="text" className="w-20 px-2 py-1 border border-gray-300 rounded mx-1 text-center" /> INR</span>
                            <button className="text-sm font-bold text-blue-600 hover:underline">Edit</button>
                        </div>
                    </div>

                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <span className="text-sm font-bold text-slate-500 block mb-1">Method</span>
                            <span className="text-base font-bold text-slate-900">Blue Dart (16 Feb - 17 Feb)</span>
                        </div>
                        <div className="text-right">
                            <span className="text-base font-black text-slate-900">{shippingPrice.toFixed(1)} INR</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 px-8 py-8">
                        <div>
                            <div className="space-y-1 text-sm font-medium text-slate-600">
                                <p className="font-bold text-slate-900">Soumyadyuti Dey</p>
                                <p className="font-bold text-slate-900">SMS TRADERS</p>
                                <p>Behari Colony</p>
                                <p>4/2387, Gali No. 10, Behari Colony</p>
                                <p>110032 Shahdara</p>
                                <p>Delhi</p>
                                <p>India</p>
                                <p className="text-blue-600 pt-1">deysoumyadyuti@gmail.com</p>
                                <p>08700330958</p>
                            </div>
                        </div>
                        <div className="border-l border-gray-100 pl-8 space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Order ID</h4>
                                <p className="text-sm font-bold text-slate-900">{orderId}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</h4>
                                <p className="text-sm font-bold text-blue-600 flex items-center gap-1 cursor-pointer">INR <ChevronLeft className="w-3 h-3 -rotate-90" /></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Payment Method */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">Payment Method</h2>
                    </div>

                    <div className="px-8 pt-6">
                        <div className="flex gap-2 mb-6">
                            <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 rounded-lg hover:bg-gray-50 transition-colors">Wallets</button>
                            <button className="px-4 py-2 text-sm font-bold text-slate-900 bg-blue-50/50 text-blue-600 rounded-lg border border-blue-100">Methods</button>
                        </div>

                        <div className="p-4 bg-blue-50/30 border border-blue-100 rounded-xl flex items-center gap-3 mb-8 cursor-pointer ring-2 ring-blue-500/20">
                            <div className="w-5 h-5 rounded-full border-[5px] border-blue-600 bg-white"></div>
                            <div className="w-8 h-8 rounded border border-blue-200 bg-white flex items-center justify-center text-blue-600">
                                <Plus className="w-4 h-4" strokeWidth={3} />
                            </div>
                            <span className="text-sm font-bold text-blue-600">+ Add New Payment Method</span>
                        </div>

                        <div className="space-y-6 pb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="w-5 h-5 text-slate-900" />
                                <span className="font-bold text-slate-900">Credit Card</span>
                                <div className="flex gap-1 ml-auto opacity-70">
                                    {/* Mock Card Icons */}
                                    <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                                    <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                                    <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Card number</label>
                                <div className="relative">
                                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Expiry date</label>
                                    <input type="text" placeholder="MM/YY" className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">CVC / CVV</label>
                                    <div className="relative">
                                        <input type="text" placeholder="3 digits" className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-5 bg-gray-100 rounded border border-gray-200"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Name on card</label>
                                <input type="text" placeholder="J. Smith" className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-sm font-bold text-slate-700">Country</label>
                                <select className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer">
                                    <option>Select country</option>
                                    <option>India</option>
                                    <option>United States</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Street</label>
                                    <input type="text" className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">House number</label>
                                    <input type="text" className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Postal code</label>
                                    <input type="text" className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">City</label>
                                    <input type="text" className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


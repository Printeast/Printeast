"use client";

import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { Package, ShoppingBag, Store, Truck } from "lucide-react";

const mockUser = getMockUser() || { email: "seller@printeast.test", role: "SELLER" as const };

export default function SellerDashboard() {
    const metrics = [
        { label: "Open orders", value: "142", icon: ShoppingBag, tone: "from-emerald-400 to-green-500" },
        { label: "Inventory", value: "2.4k units", icon: Package, tone: "from-sky-400 to-blue-500" },
        { label: "Storefront health", value: "98%", icon: Store, tone: "from-amber-400 to-orange-500" },
    ];

    const orders = [
        { id: "PE-1042", customer: "Alina McCoy", status: "Packing", total: "$142.00", eta: "Today" },
        { id: "PE-1041", customer: "Jason Cruz", status: "Label created", total: "$98.50", eta: "Tomorrow" },
        { id: "PE-1040", customer: "Mia Patel", status: "In production", total: "$264.90", eta: "2 days" },
    ];

    const inventory = [
        { sku: "HOODIE-BLK", name: "Heavyweight Hoodie", stock: 320, trend: "+12%" },
        { sku: "TEE-CR", name: "Organic Tee", stock: 190, trend: "+4%" },
        { sku: "POSTER-A2", name: "Gallery Poster", stock: 860, trend: "-2%" },
    ];

    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Seller</p>
                        <h1 className="text-3xl font-black text-white">Commerce Command</h1>
                        <p className="text-slate-400 mt-1">Orders, inventory, and storefront experience in one view.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition">Launch promo</button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30">Add product</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {metrics.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * i }}
                                className="rounded-2xl border border-white/5 bg-white/5 p-4"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${item.tone} text-white flex items-center justify-center`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs text-slate-400">Live</span>
                                </div>
                                <div className="text-3xl font-black">{item.value}</div>
                                <p className="text-slate-300 text-sm mt-2">{item.label}</p>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Orders</p>
                                <h3 className="text-xl font-bold">Live queue</h3>
                            </div>
                            <button className="text-xs font-semibold text-primary-pink">View all</button>
                        </div>
                        <div className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-semibold text-white">{order.id}</p>
                                        <p className="text-xs text-slate-400">{order.customer}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-slate-200">{order.status}</span>
                                        <div className="text-sm font-semibold text-white">{order.total}</div>
                                        <div className="text-xs text-slate-400">ETA {order.eta}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Inventory</p>
                                <h3 className="text-xl font-bold">Critical SKUs</h3>
                            </div>
                            <Truck className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="space-y-3">
                            {inventory.map((item) => (
                                <div key={item.sku} className="rounded-xl bg-black/20 px-3 py-3 border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-semibold text-sm">{item.name}</p>
                                            <p className="text-[11px] text-slate-400">{item.sku}</p>
                                        </div>
                                        <div className="text-sm font-semibold text-white">{item.stock}</div>
                                    </div>
                                    <div className="mt-2 text-xs text-primary-orange font-semibold">{item.trend} vs last week</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

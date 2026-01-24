"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { motion } from "framer-motion";
import { Boxes, AlertTriangle, RefreshCcw } from "lucide-react";

const mockUser = getMockUser() || { email: "seller@printeast.test", role: "SELLER" as const };

const stock = [
    { sku: "HOODIE-BLK", name: "Heavyweight Hoodie", stock: 320, reorder: "140", status: "Healthy" },
    { sku: "TEE-CR", name: "Organic Tee", stock: 190, reorder: "120", status: "Watch" },
    { sku: "POSTER-A2", name: "Gallery Poster", stock: 860, reorder: "300", status: "Healthy" },
    { sku: "TOTE-XL", name: "Canvas Tote", stock: 40, reorder: "120", status: "Low" },
];

export default function SellerInventoryPage() {
    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Inventory</p>
                        <h1 className="text-3xl font-black text-white">Supply & Reorder</h1>
                        <p className="text-slate-400 mt-1">Spot low stock, trigger POs, and watch velocity.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2">
                            <RefreshCcw className="h-4 w-4" /> Sync vendors
                        </button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30 flex items-center gap-2">
                            <Boxes className="h-4 w-4" /> New SKU
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Stock levels</h3>
                        <button className="text-xs font-semibold text-primary-pink">Export</button>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-white/10">
                        <div className="grid grid-cols-5 bg-black/30 px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">
                            <span>SKU</span>
                            <span>Product</span>
                            <span>On hand</span>
                            <span>Reorder at</span>
                            <span className="text-right">Status</span>
                        </div>
                        <div className="divide-y divide-white/10 bg-black/10">
                            {stock.map((row) => (
                                <div key={row.sku} className="grid grid-cols-5 px-4 py-3 text-sm text-slate-100">
                                    <span className="font-semibold">{row.sku}</span>
                                    <span className="text-slate-300">{row.name}</span>
                                    <span>{row.stock}</span>
                                    <span>{row.reorder}</span>
                                    <span className="text-right">
                                        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${row.status === "Low"
                                                ? "bg-red-500/20 border border-red-500/40 text-red-100"
                                                : row.status === "Watch"
                                                    ? "bg-amber-400/20 border border-amber-400/40 text-amber-100"
                                                    : "bg-white/10 border border-white/15 text-slate-100"}`}>{row.status}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Backend can feed live stock counts and thresholds; hook vendor APIs to the Sync button.</p>
                </div>

                <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 flex items-center gap-3 text-amber-50">
                    <AlertTriangle className="h-5 w-5" />
                    <div className="text-sm">Low-stock alerts can be driven by a cron/webhook; surface here when below reorder points.</div>
                </div>
            </div>
        </DashboardLayout>
    );
}

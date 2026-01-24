"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { motion } from "framer-motion";
import { BadgeCheck, Filter, Printer } from "lucide-react";

const mockUser = getMockUser() || { email: "seller@printeast.test", role: "SELLER" as const };

const queue = [
    { id: "PE-1044", customer: "Nova Studio", items: 3, total: "$182.00", status: "Packing", sla: "Today" },
    { id: "PE-1043", customer: "Eden Supply", items: 2, total: "$126.40", status: "Label created", sla: "Today" },
    { id: "PE-1042", customer: "Luma Co.", items: 5, total: "$268.00", status: "In production", sla: "Tomorrow" },
];

const stats = [
    { label: "Open", value: "142" },
    { label: "Late", value: "6" },
    { label: "Shipped", value: "1,284" },
];

export default function SellerOrdersPage() {
    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Orders</p>
                        <h1 className="text-3xl font-black text-white">Live queue</h1>
                        <p className="text-slate-400 mt-1">Monitor fulfillment stages with clear SLAs.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2">
                            <Filter className="h-4 w-4" /> Filters
                        </button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30 flex items-center gap-2">
                            <Printer className="h-4 w-4" /> Print labels
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i }}
                            className="rounded-2xl border border-white/5 bg-white/5 p-4"
                        >
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                            <div className="text-3xl font-black mt-1">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Queue</h3>
                        <button className="text-xs font-semibold text-primary-pink">Export</button>
                    </div>
                    <div className="overflow-hidden rounded-xl border border-white/10">
                        <div className="grid grid-cols-6 bg-black/30 px-4 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide">
                            <span>Order</span>
                            <span>Customer</span>
                            <span>Items</span>
                            <span>Total</span>
                            <span>Status</span>
                            <span className="text-right">SLA</span>
                        </div>
                        <div className="divide-y divide-white/10 bg-black/10">
                            {queue.map((order) => (
                                <div key={order.id} className="grid grid-cols-6 px-4 py-3 text-sm text-slate-100">
                                    <span className="font-semibold">{order.id}</span>
                                    <span className="text-slate-300">{order.customer}</span>
                                    <span>{order.items}</span>
                                    <span>{order.total}</span>
                                    <span>
                                        <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold">{order.status}</span>
                                    </span>
                                    <span className="text-right text-slate-300">{order.sla}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Backend can supply order feed, status enums, and label generation endpoints.</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-primary-orange" />
                    <div className="text-sm text-slate-200">Integrate fulfillment webhooks here to auto-progress statuses.</div>
                </div>
            </div>
        </DashboardLayout>
    );
}

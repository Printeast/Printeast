"use client";

import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, ShoppingBag } from "lucide-react";

export default function IndividualDashboard() {
    return (
        <div className="min-h-screen bg-[#FDFDFD] p-8 md:p-12 font-inter">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-10"
            >
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">Customer Area</p>
                        <h1 className="text-neutral-900 text-4xl font-black tracking-tight font-poppins">
                            My Orders
                        </h1>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Active Orders", value: "0", icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Completed", value: "0", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
                        { label: "Reward Points", value: "150", icon: ShoppingBag, color: "text-purple-500", bg: "bg-purple-50" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-neutral-500 font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-neutral-900">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State / Work in Progress */}
                <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-12 text-center space-y-4 shadow-sm">
                    <div className="bg-neutral-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="text-neutral-300" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900">Your order history is empty</h2>
                    <p className="text-neutral-500 max-w-md mx-auto">
                        Once you start making purchases, your order status and tracking information will appear here.
                    </p>
                    <div className="pt-6">
                        <button className="bg-neutral-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all shadow-lg shadow-black/10">
                            Start Shopping
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

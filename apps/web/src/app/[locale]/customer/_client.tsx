"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
    Clock,
    ShoppingBag,
    Sparkles,
    Heart,
    Search,
    Gift,
    ArrowRight,
    TrendingUp,
    Palette
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CustomerDashboardData } from "./_data";

export function CustomerDashboardClient({ userEmail, userName, data }: { userEmail: string; userName?: string; data: CustomerDashboardData }) {
    const bgSoft = "#F9F8F6";

    const steps = [
        {
            number: "01",
            title: "Discover Designs",
            description: "Explore unique artwork from creators worldwide.",
            cta: "Browse Gallery",
            href: "/customer/products",
            icon: Search,
            active: true,
        },
        {
            number: "02",
            title: "Pick Your Product",
            description: "Choose from apparel, home decor, or accessories.",
            cta: "View Catalog",
            href: "/customer/products",
            icon: Palette,
        },
        {
            number: "03",
            title: "Order & Enjoy",
            description: "We handle the printing and shipping to your door.",
            cta: "My Orders",
            href: "/customer/orders",
            icon: ShoppingBag,
        },
    ];

    return (
        <DashboardLayout user={{ email: userEmail, role: "CUSTOMER" }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(34,197,94,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(37,99,235,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="mx-auto max-w-[1240px] px-10 py-8 space-y-10">
                    {/* Hero Banner */}
                    <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#22c55e] to-[#16a34a] p-8 text-white shadow-md">
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-20 pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl opacity-10 pointer-events-none" />

                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h1 className="text-2xl font-semibold mb-1">Welcome back{userName ? `, ${userName}` : ""}!</h1>
                                    <p className="text-sm text-white/80">
                                        Explore unique designs from global creators. You have {data.stats.activeOrders} active orders arriving soon.
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Link href="/customer/products" className="inline-flex items-center h-9 rounded-xl bg-white px-4 text-sm font-semibold text-[#22c55e] shadow-sm hover:scale-105 transition-transform">
                                            Start Shopping
                                        </Link>
                                        <Link href="/customer/orders" className="inline-flex items-center h-9 rounded-xl border border-white/70 px-4 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                                            Track My Orders
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="w-full max-w-[220px] rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
                                <p className="text-[12px] font-extrabold text-white/90 uppercase tracking-wider">Reward Points</p>
                                <p className="mt-2 text-4xl font-black text-white">{data.stats.rewardPoints}</p>
                                <div className="mt-2.5 space-y-1">
                                    <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3" />
                                        $15.00 discount ready
                                    </p>
                                    <p className="text-[11px] font-semibold text-white/70 flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        {data.stats.activeOrders} Active orders
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">How to Get Started</h2>
                            <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-1/3" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div
                                        key={step.number}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`group relative rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/50 hover:border-emerald-200 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-500`}
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.active ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-400"} transition-colors`}>
                                                <Icon className="h-6 w-6" strokeWidth={2.5} />
                                            </div>
                                            <span className="text-4xl font-black text-slate-50 tracking-tighter group-hover:text-emerald-50/50 transition-colors">{step.number}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{step.title}</h3>
                                        <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">{step.description}</p>
                                        <Link href={step.href} className="mt-6 inline-flex items-center gap-2 text-[13px] font-black text-emerald-600 hover:gap-3 transition-all tracking-tight uppercase">
                                            {step.cta}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Discovery Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Trending Designs */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Trending in Marketplace</h2>
                                <Link href="/customer/products" className="text-sm font-bold text-emerald-600 hover:underline transition-all">Explore All</Link>
                            </div>

                            {data.trendingDesigns.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.trendingDesigns.map((design) => (
                                        <div key={design.id} className="group bg-white rounded-3xl p-3 border border-slate-200/50 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                                            <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-slate-100">
                                                <Image src={design.image} alt={design.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 transition-colors">
                                                    <Heart size={14} className="fill-current" />
                                                </button>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{design.category}</div>
                                                <h4 className="font-black text-slate-900 truncate uppercase tracking-tight text-sm">{design.name}</h4>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="text-sm font-black text-slate-900">$29.00+</div>
                                                    <button className="text-[10px] font-black text-emerald-600 uppercase tracking-tight hover:underline">Customize</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        {/* Recent Activity */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">My Recent Orders</h2>
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col min-h-[400px]">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[80px] rounded-full" />
                                <div className="relative z-10 flex-1 flex flex-col">
                                    {data.recentOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {data.recentOrders.map((order) => (
                                                <div key={order.id} className="flex items-center justify-between group cursor-pointer border-b border-white/10 pb-4 last:border-0 hover:border-white/20 transition-all">
                                                    <div>
                                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Order #{order.id.slice(0, 8)}</div>
                                                        <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{new Date(order.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-black text-white">${order.total_amount.toFixed(2)}</div>
                                                        <div className="text-[10px] font-black text-slate-400 uppercase mt-1">{order.status}</div>
                                                    </div>
                                                </div>
                                            ))}
                                            <Link href="/customer/orders" className="mt-4 inline-flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-all">
                                                See All Orders <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                <ShoppingBag className="text-slate-500" size={24} />
                                            </div>
                                            <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                                                &quot;You haven&apos;t placed any orders yet. Ready for your first custom piece?&quot;
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-8">
                                        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                                                <TrendingUp className="w-3 h-3" />
                                                Market Insight
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                                                &quot;Oversized hoodies with minimalist forest prints are trending this season.&quot;
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Member Perk Section */}
                    <section className="bg-white rounded-[3rem] p-12 border border-slate-200/50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    Join the <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Premium Club</span>
                                </h2>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    Get exclusive early access to designer drops, double reward points, and free shipping on orders over $50.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button className="inline-flex items-center h-12 rounded-2xl bg-slate-900 px-8 text-xs font-black text-white uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                                        Learn More
                                    </button>
                                    <Link href="/customer/resources" className="inline-flex items-center h-12 rounded-2xl bg-slate-100 px-6 text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                        Explore Perks
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="bg-emerald-50 h-32 rounded-3xl border border-emerald-200/40 p-5 transition-transform hover:-translate-y-1">
                                        <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center mb-2 shadow-sm">
                                            <Gift size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-emerald-600/60 tracking-wider">Early Access</p>
                                        <p className="text-xs font-bold text-slate-700 mt-1">New Drops Weekly</p>
                                    </div>
                                    <div className="bg-slate-50 h-32 rounded-3xl border border-slate-200/40 p-5 transition-transform hover:-translate-y-1">
                                        <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center mb-2 shadow-sm">
                                            <TrendingUp size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Points Boost</p>
                                        <p className="text-xs font-bold text-slate-700 mt-1">2x Multiplier</p>
                                    </div>
                                </div>
                                <div className="pt-8 space-y-4">
                                    <div className="bg-slate-50 h-32 rounded-3xl border border-slate-200/40 p-5 transition-transform hover:-translate-y-1">
                                        <div className="w-10 h-10 rounded-xl bg-white text-purple-600 flex items-center justify-center mb-2 shadow-sm">
                                            <Sparkles size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Custom Studio</p>
                                        <p className="text-xs font-bold text-slate-700 mt-1">Advanced Tools</p>
                                    </div>
                                    <div className="bg-slate-900 h-32 rounded-3xl p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-slate-800 transition-colors">
                                        <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-emerald-500/20">
                                            <Gift size={16} />
                                        </div>
                                        <p className="text-[9px] font-black uppercase text-emerald-400 tracking-tighter">Daily Bonus</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Palette, Upload, ShoppingBag, Link2, TrendingUp, User, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CreatorDashboardData } from "./_data";

export function CreatorDashboardClient({ userEmail, userName, data }: { userEmail: string, userName?: string, data: CreatorDashboardData }) {
    const bgSoft = "#F9F8F6";

    const steps = [
        {
            number: "01",
            title: "Upload Art",
            description: "Upload your high-resolution designs to the studio.",
            cta: "Go to Studio",
            href: "/creator/marketplace",
            icon: Upload,
            active: true,
        },
        {
            number: "02",
            title: "Prepare Listing",
            description: "Set your commission and add product mockups.",
            cta: "Manage Designs",
            href: "/creator/designs",
            icon: Palette,
        },
        {
            number: "03",
            title: "Enable Payouts",
            description: "Connect your bank account to start receiving earnings.",
            cta: "Setup Payouts",
            href: "/creator/earnings",
            icon: ShoppingBag,
        },
    ];

    const trendingNiches = [
        { name: "Retro Futurist", icon: "🚀", growth: "+12%" },
        { name: "Minimalist Lines", icon: "✍️", growth: "+45%" },
        { name: "Cyberpunk Glow", icon: "🌃", growth: "+28%" },
        { name: "Organic Shapes", icon: "🌿", growth: "+18%" },
    ];

    return (
        <DashboardLayout user={{ email: userEmail, role: "CREATOR" }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(147,51,234,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(37,99,235,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="mx-auto max-w-[1240px] px-10 py-8 space-y-10">
                    {/* Hero Banner */}
                    <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#9333ea] to-[#4f46e5] p-8 text-white shadow-md">
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
                                        Your creativity is shaping the marketplace. You have {data.stats.activeDesigns} active designs live today.
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <Link href="/creator/marketplace" className="inline-flex items-center h-9 rounded-xl bg-white px-4 text-sm font-semibold text-[#9333ea] shadow-sm hover:scale-105 transition-transform">
                                            Go to Marketplace
                                        </Link>
                                        <Link href="/creator/designs" className="inline-flex items-center h-9 rounded-xl border border-white/70 px-4 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                                            Manage My Studio
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="w-full max-w-[220px] rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
                                <p className="text-[12px] font-extrabold text-white/90 uppercase tracking-wider">Total Earnings</p>
                                <p className="mt-2 text-4xl font-black text-white">${data.stats.totalEarnings.toFixed(0)}</p>
                                <div className="mt-2.5 space-y-1">
                                    <p className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                                        <TrendingUp className="w-3 h-3" />
                                        +5.2% this week
                                    </p>
                                    <p className="text-[11px] font-semibold text-white/70">
                                        {data.stats.totalSales} total sales
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Steps */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Getting Started</h2>
                            <div className="h-1 w-32 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-1/3" />
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
                                        className={`group relative rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/50 hover:border-purple-200 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-500`}
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.active ? "bg-purple-100 text-purple-600" : "bg-slate-50 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-400"} transition-colors`}>
                                                <Icon className="h-6 w-6" strokeWidth={2.5} />
                                            </div>
                                            <span className="text-4xl font-black text-slate-50 tracking-tighter group-hover:text-purple-50/50 transition-colors">{step.number}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-700 transition-colors uppercase tracking-tight">{step.title}</h3>
                                        <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">{step.description}</p>
                                        <Link href={step.href} className="mt-6 inline-flex items-center gap-2 text-[13px] font-black text-purple-600 hover:gap-3 transition-all tracking-tight uppercase">
                                            {step.cta}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Trends */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Designs */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Recently Published</h2>
                                <Link href="/creator/designs" className="text-sm font-bold text-purple-600 hover:underline transition-all">View all studio</Link>
                            </div>

                            {data.designs.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.designs.slice(0, 4).map((design) => (
                                        <div key={design.id} className="group bg-white rounded-3xl p-3 border border-slate-200/50 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                                            <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-slate-100">
                                                {design.image_url ? (
                                                    <Image src={design.image_url} alt={design.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                        <Palette className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-slate-900 truncate uppercase tracking-tight text-sm">{design.name}</h4>
                                                <p className="text-xs text-slate-400 mt-1">{new Date(design.created_at).toLocaleDateString()}</p>
                                                <div className="mt-2 inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
                                                    {design.status}
                                                </div>
                                            </div>
                                            <Link href={`/creator/designs/${design.id}`} className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-purple-600 transition-all mr-2">
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 text-center space-y-4">
                                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload className="text-slate-300" size={24} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">No designs yet</h3>
                                    <p className="text-sm text-slate-500 max-w-[280px] mx-auto">Upload your first artwork to see it featured here on your landing page.</p>
                                    <div className="pt-2">
                                        <Link href="/creator/marketplace" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
                                            Start Studio
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Marketplace Trends */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Marketplace Trends</h2>
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[80px] rounded-full" />
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center gap-2 text-purple-400 font-black text-[10px] uppercase tracking-[0.3em]">
                                        <TrendingUp className="w-3 h-3" />
                                        Hot this week
                                    </div>
                                    <div className="space-y-4">
                                        {trendingNiches.map((niche) => (
                                            <div key={niche.name} className="flex items-center justify-between group cursor-help">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{niche.icon}</span>
                                                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight">{niche.name}</span>
                                                </div>
                                                <span className="text-[11px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
                                                    {niche.growth}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-8 mt-auto">
                                        <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                                            <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                                                &quot;Abstract patterns are surging in popularity for organic cotton tees.&quot;
                                            </p>
                                            <p className="mt-3 text-[10px] font-black text-purple-400 uppercase tracking-widest">— AI Insights</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Branding Section */}
                    <section className="bg-white rounded-[3rem] p-12 border border-slate-200/50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    Build Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Creator Hub</span>
                                </h2>
                                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                    Your portfolio is more than just images. It&apos;s your brand. Customize your creator page to stand out in the marketplace.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link href="/creator/branding" className="inline-flex items-center h-12 rounded-2xl bg-slate-900 px-8 text-xs font-black text-white uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                                        Customize Identity
                                    </Link>
                                    <Link href="/creator/portfolio" className="inline-flex items-center h-12 rounded-2xl bg-slate-100 px-6 text-xs font-black text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                        View Public Page
                                    </Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="bg-slate-50 h-32 rounded-3xl border border-slate-200/40 p-4 transition-transform hover:-translate-y-1">
                                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                                            <Link2 size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">Custom Domain</p>
                                        <p className="text-xs font-bold text-slate-700 mt-1">artist.printeast.com</p>
                                    </div>
                                    <div className="bg-slate-50 h-32 rounded-3xl border border-slate-200/40 p-4 transition-transform hover:-translate-y-1">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                                            <User size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">Verified Pro</p>
                                        <p className="text-xs font-bold text-slate-700 mt-1">Status: Pending</p>
                                    </div>
                                </div>
                                <div className="pt-8 space-y-4">
                                    <div className="bg-slate-50 h-32 rounded-3xl border border-slate-200/40 p-4 transition-transform hover:-translate-y-1">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                                            <TrendingUp size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase text-slate-400">SEO Boost</p>
                                        <p className="text-xs font-bold text-slate-700 mt-1">High visibility</p>
                                    </div>
                                    <div className="bg-slate-900 h-32 rounded-3xl p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-slate-800 transition-colors">
                                        <div className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-purple-500/20">
                                            <Plus size={16} />
                                        </div>
                                        <p className="text-[9px] font-black uppercase text-purple-400 tracking-tighter">New Widget</p>
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

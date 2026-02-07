"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SellerDashboardData } from "./_data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Link2, ShoppingBag, Upload } from "lucide-react";
import { Role } from "@repo/types";

interface Props {
    userEmail: string;
    data: SellerDashboardData;
    role?: Role;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    clubTitle?: string;
    connectTitle?: string;
    connectDescription?: string;
    connectCta?: string;
    connectHref?: string;
}

export function SellerDashboardClient({
    userEmail,
    data,
    role = "SELLER",
    secondaryCtaLabel,
    secondaryCtaHref,
    clubTitle,
    connectTitle,
    connectDescription,
    connectCta,
    connectHref,
}: Props) {
    const [newOrders, setNewOrders] = React.useState(0);

    React.useEffect(() => {
        const count = data.orders.filter((order) => {
            const createdAt = order.created_at ? new Date(order.created_at) : null;
            if (!createdAt || Number.isNaN(createdAt.getTime())) return false;
            return Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;
        }).length;
        setNewOrders(count);
    }, [data.orders]);

    const steps = [
        {
            number: "01",
            title: connectTitle || "Connect Store",
            description: connectDescription || "Link your e-commerce store to sync products.",
            cta: connectCta || "Connect Now",
            href: connectHref || "/seller/storefront",
            icon: Link2,
            active: true,
        },
        {
            number: "02",
            title: "Upload Design",
            description: "Upload your artwork in high resolution for quality.",
            cta: "Start Upload",
            href: "/seller/design",
            icon: Upload,
        },
        {
            number: "03",
            title: "Place First Order",
            description: "Order a sample to verify quality before selling.",
            cta: "Awaiting Step 2",
            href: "/seller/orders",
            icon: ShoppingBag,
        },
    ];

    const trendingProducts = [
        {
            label: "Bestseller",
            name: "Product Name",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
        },
        {
            label: "New",
            name: "Product Name",
            image: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?auto=format&fit=crop&w=900&q=80",
        },
        {
            label: "",
            name: "Product Name",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
        },
        {
            label: "",
            name: "Product Name",
            image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80",
        },
    ];

    const marketingTips = [
        {
            tag: "Social Strategy",
            title: "Article Title",
            description: "Article Description placeholder text",
            image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80",
        },
        {
            tag: "Business Ops",
            title: "Article Title",
            description: "Article Description placeholder text",
            image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
        },
        {
            tag: "Market Research",
            title: "Article Title",
            description: "Article Description placeholder text",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        },
    ];

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="mx-auto max-w-[1240px] px-10 py-8 relative z-10 space-y-10">
                    <section className="relative overflow-hidden rounded-[24px] bg-[#2563eb] p-8 text-white shadow-md">
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-2xl">
                                <h1 className="text-2xl font-semibold">Welcome back!</h1>
                                <p className="mt-2 text-sm text-white/80">
                                    Your store is growing! You&apos;ve had {newOrders} new orders in the last 24 hours. Keep up the creative momentum.
                                </p>
                                <div className="mt-5 flex flex-wrap gap-3">
                                    <Link href="/seller/design" className="inline-flex items-center h-9 rounded-xl bg-white px-4 text-sm font-semibold text-[#2563eb] shadow-sm">
                                        Launch New Campaign
                                    </Link>
                                    <Link href={secondaryCtaHref || "/seller/storefront"} className="inline-flex items-center h-9 rounded-xl border border-white/70 px-4 text-sm font-semibold text-white">
                                        {secondaryCtaLabel || "View Storefront"}
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full max-w-[220px] rounded-2xl border border-white/30 bg-white/20 backdrop-blur-md p-5 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
                                <p className="text-[12px] font-extrabold text-white/90 uppercase tracking-wider">Today&apos;s Earnings</p>
                                <p className="mt-2 text-4xl font-black text-white">$0.00</p>
                                <p className="mt-1.5 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    +0% vs yesterday
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-semibold text-slate-900">Getting Started</h2>
                            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-400 border border-black/5">
                                3 Steps left
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {steps.map((step) => {
                                const Icon = step.icon;
                                const iconStyles = step.active
                                    ? "bg-[#2563eb]/10 text-[#2563eb]"
                                    : "bg-slate-100 text-slate-400";
                                const linkStyles = step.active
                                    ? "text-[#2563eb]"
                                    : "text-slate-400";
                                return (
                                    <div
                                        key={step.number}
                                        className={`rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/50 transition-all duration-300 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] ${step.active ? "border-b-[4px] border-b-[#2563eb]" : ""}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconStyles}`}>
                                                <Icon className="h-5 w-5" strokeWidth={2.5} />
                                            </div>
                                            <span className="text-2xl font-black text-slate-100 tracking-tighter">{step.number}</span>
                                        </div>
                                        <h3 className="mt-5 text-[15px] font-black text-slate-900">{step.title}</h3>
                                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{step.description}</p>
                                        <Link href={step.href} className={`mt-4 inline-flex items-center gap-2 text-sm font-black tracking-tight ${linkStyles} hover:underline`}>
                                            {step.cta}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">Trending Products</h2>
                                <p className="text-sm text-slate-400">Top picks for your niche this month</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {trendingProducts.map((product) => (
                                <div key={product.image} className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-200/50 transition-all hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] group">
                                    <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100">
                                        <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                        {product.label ? (
                                            <span className="absolute left-3 top-3 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-black text-slate-700 uppercase tracking-widest shadow-sm">
                                                {product.label}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-[15px] font-black text-slate-900">{product.name}</p>
                                        <button className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-100 transition-colors">
                                            Add to Design
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900">Marketing Tips</h2>
                            <Link href="/seller/resources" className="text-xs font-semibold text-[#2563eb]">
                                See all tutorials
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            {marketingTips.map((tip) => (
                                <div key={tip.tag} className="relative overflow-hidden rounded-2xl bg-slate-900 text-white">
                                    <Image src={tip.image} alt={tip.tag} width={600} height={420} className="h-44 w-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <span className="inline-flex items-center rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
                                            {tip.tag}
                                        </span>
                                        <h3 className="mt-2 text-sm font-semibold">{tip.title}</h3>
                                        <p className="mt-1 text-xs text-white/70">{tip.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-2xl bg-[#0b1220] px-6 py-5 text-white">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-base font-semibold">{clubTitle || "Seller's Club"}</h2>
                                <p className="mt-1 text-xs text-white/70">
                                    Get exclusive access to premium mockups, weekly trend reports, and a community of creators.
                                </p>
                            </div>
                            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-10 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 text-xs text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                                />
                                <button className="h-10 rounded-xl bg-[#2563eb] px-5 text-xs font-semibold text-white">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}

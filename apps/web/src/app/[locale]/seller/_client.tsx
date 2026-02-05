"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SellerDashboardData } from "./_data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Link2, ShoppingBag, Upload } from "lucide-react";

interface Props {
    userEmail: string;
    data: SellerDashboardData;
}

export function SellerDashboardClient({ userEmail, data }: Props) {
    const newOrders = data.orders.filter((order) => {
        const createdAt = order.created_at ? new Date(order.created_at) : null;
        if (!createdAt || Number.isNaN(createdAt.getTime())) return false;
        return Date.now() - createdAt.getTime() < 24 * 60 * 60 * 1000;
    }).length;

    const steps = [
        {
            number: "01",
            title: "Connect Store",
            description: "Link your e-commerce store to sync products.",
            cta: "Connect Now",
            href: "/seller/storefront",
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

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }} fullBleed>
            <div className="min-h-full bg-[#F9F8F6] px-8 py-6">
                <div className="mx-auto max-w-[1200px] space-y-6">
                    <section className="relative overflow-hidden rounded-2xl bg-[#2563eb] p-7 text-white">
                        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-2xl">
                                <h1 className="text-2xl font-semibold">Welcome back!</h1>
                                <p className="mt-2 text-sm text-white/80">
                                    Your store is growing! You&apos;ve had {newOrders} new orders in the last 24 hours. Keep up the creative momentum.
                                </p>
                                <div className="mt-5 flex flex-wrap gap-3">
                                    <button className="h-9 rounded-xl bg-white px-4 text-sm font-semibold text-[#2563eb] shadow-sm">
                                        Launch New Campaign
                                    </button>
                                    <button className="h-9 rounded-xl border border-white/70 px-4 text-sm font-semibold text-white">
                                        View Storefront
                                    </button>
                                </div>
                            </div>
                            <div className="w-full max-w-[220px] rounded-2xl border border-white/20 bg-white/10 p-4">
                                <p className="text-[11px] font-semibold text-white/70">Today&apos;s Earnings</p>
                                <p className="mt-2 text-3xl font-semibold">$0.00</p>
                                <p className="mt-1 text-xs text-emerald-200">+0% vs yesterday</p>
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
                                        className={`rounded-2xl bg-white p-5 shadow-sm border border-black/5 ${step.active ? "border-b-[3px] border-b-[#2563eb]" : ""}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${iconStyles}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-2xl font-semibold text-slate-200">{step.number}</span>
                                        </div>
                                        <h3 className="mt-4 text-sm font-semibold text-slate-900">{step.title}</h3>
                                        <p className="mt-1 text-xs text-slate-500">{step.description}</p>
                                        <Link href={step.href} className={`mt-3 inline-flex items-center gap-2 text-xs font-semibold ${linkStyles}`}>
                                            {step.cta}
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Trending Products</h2>
                                <p className="text-xs text-slate-400">Top picks for your niche this month</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-slate-500">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-slate-500">
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {trendingProducts.map((product) => (
                                <div key={product.image} className="rounded-2xl bg-white p-4 shadow-sm border border-black/5">
                                    <div className="relative h-36 overflow-hidden rounded-xl bg-[#F3F4F6]">
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                        {product.label ? (
                                            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                                {product.label}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-sm font-semibold text-slate-900">Product Name</p>
                                        <button className="mt-3 w-full rounded-xl border border-black/10 bg-[#F9F8F6] py-2 text-xs font-semibold text-slate-600">
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
                                <h2 className="text-base font-semibold">Join our Seller&apos;s Club</h2>
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

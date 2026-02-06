"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight, Headset, Info } from "lucide-react";

interface Props {
    userEmail: string;
}

const primary = "#2563eb";
const bgSoft = "#F9F8F6";

const seamless = [
    {
        name: "Shopify",
        description: "Hosted store builder with fast setup and strong apps.",
        logo: "https://img.icons8.com/color/96/shopify.png",
    },
    {
        name: "Amazon",
        description: "Reach high-intent buyers with marketplace scale.",
        logo: "https://img.icons8.com/color/96/amazon.png",
    },
    {
        name: "Etsy",
        description: "Quickly test handmade and niche products.",
        logo: "https://img.icons8.com/color/96/etsy.png",
    },
    {
        name: "WooCommerce",
        description: "WordPress-based stores with deep customization.",
        logo: "https://img.icons8.com/color/96/woocommerce.png",
    },
    {
        name: "Instagram",
        description: "Turn social content into shoppable moments.",
        logo: "https://img.icons8.com/color/96/instagram-new--v1.png",
    },
    {
        name: "TikTok Shop",
        description: "Sell with viral, trend-driven commerce.",
        logo: "https://img.icons8.com/color/96/tiktok.png",
    },
    {
        name: "Direct API",
        description: "Custom automation for unique workflows.",
        logo: "https://img.icons8.com/color/96/api.png",
    },
];

const integrations = [
    { name: "Amazon", logo: "https://img.icons8.com/color/96/amazon.png" },
    { name: "TikTok Shop", logo: "https://img.icons8.com/color/96/tiktok.png" },
    { name: "WooCommerce", logo: "https://img.icons8.com/color/96/woocommerce.png" },
    { name: "Wix", logo: "https://logo.clearbit.com/wix.com" },
    { name: "Squarespace", logo: "https://logo.clearbit.com/squarespace.com" },
    { name: "BigCommerce", logo: "https://img.icons8.com/color/96/bigcommerce.png" },
    { name: "Instagram", logo: "https://img.icons8.com/color/96/instagram-new--v1.png" },
    { name: "API", logo: "https://img.icons8.com/color/96/api.png" },
    { name: "Adobe Commerce", logo: "https://logo.clearbit.com/business.adobe.com" },
    { name: "Big Cartel", logo: "https://logo.clearbit.com/bigcartel.com" },
    { name: "eBay", logo: "https://img.icons8.com/color/96/ebay.png" },
    { name: "Ecwid", logo: "https://logo.clearbit.com/ecwid.com" },
    { name: "Gumroad", logo: "https://logo.clearbit.com/gumroad.com" },
    { name: "Magento", logo: "https://img.icons8.com/color/96/magento.png" },
    { name: "Prestashop", logo: "https://logo.clearbit.com/prestashop.com" },
    { name: "Square", logo: "https://img.icons8.com/color/96/square.png" },
    { name: "Walmart", logo: "https://img.icons8.com/color/96/walmart.png" },
    { name: "Weebly", logo: "https://logo.clearbit.com/weebly.com" },
    { name: "Custom", logo: "https://img.icons8.com/color/96/package.png" },
    { name: "Nuvemshop", logo: "https://logo.clearbit.com/nuvemshop.com.br" },
    { name: "Base", logo: "https://img.icons8.com/color/96/database.png" },
    { name: "YouTube", logo: "https://img.icons8.com/color/96/youtube-play--v1.png" },
    { name: "Storenvy", logo: "https://img.icons8.com/color/96/shop.png" },
];

const compareRows = [
    {
        platform: "Shopify",
        setup: "Fast (easy)",
        upfront: "Low",
        fixed: "Monthly subscription (plan-based)",
        fees: "Extra platform fee only if you use a third-party payment gateway (plan-based)",
        bestFor: "Most small to scaling brands wanting speed, stability, and ease",
        highlight: false,
        logo: "https://img.icons8.com/color/96/shopify.png",
    },
    {
        platform: "WooCommerce",
        setup: "Moderate (needs hosting + WordPress)",
        upfront: "Low-Medium",
        fixed: "Hosting, domain, and optional themes/plugins",
        fees: "No WooCommerce platform fee per transaction (only payment gateway fees)",
        bestFor: "Brands wanting maximum control and lower long-term platform fees",
        highlight: true,
        logo: "https://img.icons8.com/color/96/woocommerce.png",
    },
    {
        platform: "Etsy",
        setup: "Instant",
        upfront: "Very low",
        fixed: "None required (per listing)",
        fees: "Listing fee + transaction fee per sale",
        bestFor: "Handmade, creative, or niche products; fast demand testing",
        highlight: false,
        logo: "https://img.icons8.com/color/96/etsy.png",
    },
    {
        platform: "Amazon",
        setup: "Moderate",
        upfront: "Low-Medium",
        fixed: "Seller plan may apply (region dependent)",
        fees: "Referral fees vary by category + additional seller fees",
        bestFor: "High-volume products and large-scale marketplace selling",
        highlight: false,
        logo: "https://img.icons8.com/color/96/amazon.png",
    },
    {
        platform: "Instagram Shop",
        setup: "Moderate",
        upfront: "Low",
        fixed: "Usually no fixed platform fee",
        fees: "Typically no marketplace commission when checkout happens on your website; marketing costs may apply",
        bestFor: "Brands with strong social content and creator-driven sales",
        highlight: true,
        logo: "https://img.icons8.com/color/96/instagram-new--v1.png",
    },
    {
        platform: "TikTok Shop",
        setup: "Moderate",
        upfront: "Low",
        fixed: "None required; ads optional",
        fees: "Commission varies by region, category, and seller program",
        bestFor: "Viral, trend-driven, impulse-purchase products",
        highlight: true,
        logo: "https://img.icons8.com/color/96/tiktok.png",
    },
    {
        platform: "Direct API",
        setup: "Slow (engineering-heavy)",
        upfront: "High",
        fixed: "Hosting, infrastructure, and ongoing development",
        fees: "None (you own the entire commerce stack)",
        bestFor: "Enterprises, marketplaces, and custom workflows",
        highlight: false,
        logo: "https://img.icons8.com/color/96/api.png",
    },
];

export function SellerStorefrontClient({ userEmail }: Props) {
    const seamlessSlides = React.useMemo(() => {
        const chunks: typeof seamless[] = [] as any;
        for (let i = 0; i < seamless.length; i += 4) {
            chunks.push(seamless.slice(i, i + 4));
        }
        return chunks;
    }, []);

    const [seamlessIndex, setSeamlessIndex] = React.useState(0);
    const [showAll, setShowAll] = React.useState(false);

    const visibleIntegrations = showAll ? integrations : integrations.slice(0, 8);

    const toggleSeamless = (dir: "prev" | "next") => {
        setSeamlessIndex((prev) => {
            if (dir === "prev") return prev === 0 ? seamlessSlides.length - 1 : prev - 1;
            return prev === seamlessSlides.length - 1 ? 0 : prev + 1;
        });
    };

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }} fullBleed>
            <div
                className="min-h-full w-full relative bg-blue-50/50"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="mx-auto max-w-[1180px] px-8 py-10 space-y-12 text-[15px]">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Storefronts</h1>
                            <p className="text-slate-500 mt-1">Manage and sync your sales channels seamlessly.</p>
                        </div>
                    </div>

                    {/* Seamless integrations */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Seamless Integrations</h3>
                                <p className="text-sm text-slate-500">Connect the most popular sales channels in minutes.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => toggleSeamless("prev")} className="h-10 w-10 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors">
                                    <ChevronLeft className="h-5 w-5 text-slate-600" />
                                </button>
                                <button onClick={() => toggleSeamless("next")} className="h-10 w-10 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors">
                                    <ChevronRight className="h-5 w-5 text-slate-600" />
                                </button>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-slate-200/60 bg-white p-2 shadow-sm">
                            <div className="grid grid-cols-1 gap-1 lg:grid-cols-4">
                                {(seamlessSlides[seamlessIndex] || []).map((item) => (
                                    <div key={item.name} className="flex flex-col gap-4 p-6 rounded-xl hover:bg-slate-50/80 transition-all group cursor-pointer border border-transparent hover:border-slate-100">
                                        <div className="flex flex-col gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform">
                                                <Image src={item.logo} alt={item.name} width={40} height={40} className="object-contain" />
                                            </div>
                                            <div>
                                                <div className="text-base font-bold text-slate-900 mb-1">{item.name}</div>
                                                <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>
                                            </div>
                                        </div>
                                        <Link className="text-[13px] font-bold text-blue-600 inline-flex items-center gap-1 hover:gap-2 transition-all mt-auto" href="#">
                                            Learn more
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Connected stores card */}
                    <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="max-w-md">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">My Connected Stores</h3>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">You haven&apos;t connected any stores yet. Link your first sales channel to start syncing products.</p>
                            </div>
                            <button
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" /> Connect My First Store
                            </button>
                        </div>
                    </div>

                    {/* All integrations */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">All Integrations</h3>
                            <p className="text-sm text-slate-500">Broaden your reach with specialized platforms.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {visibleIntegrations.map(({ name, logo }) => (
                                <div
                                    key={name}
                                    className="flex items-center gap-4 rounded-xl border border-slate-200/60 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md hover:border-blue-200 hover:translate-y-[-2px] group cursor-pointer"
                                >
                                    <div className="h-12 w-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center p-2.5 transition-colors group-hover:bg-blue-50">
                                        <Image src={logo} alt={name} width={32} height={32} className="object-contain" />
                                    </div>
                                    <div className="text-[14px] font-bold text-slate-800">{name}</div>
                                    <div className="ml-auto h-8 w-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white">
                                        <Info className="w-4 h-4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-white py-4 text-sm font-bold text-slate-500 hover:border-slate-300 hover:bg-slate-50/50 transition-all"
                            onClick={() => setShowAll((p) => !p)}
                        >
                            {showAll ? "Collapse Integrations" : "View All Platforms"}
                        </button>
                    </div>

                    {/* CTA cards */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-slate-900">Don’t have a store yet?</h3>
                        <p className="text-base text-slate-600">Pick the path that fits your business.</p>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">Create a Printeast store for free</h3>
                                <p className="mt-1 text-base text-slate-600">Launch a hosted storefront with zero upfront cost.</p>
                                <button className="mt-4 w-full rounded-lg bg-[--primary] py-3 text-sm font-semibold text-white" style={{ backgroundColor: primary }}>
                                    Create store
                                </button>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900">Printeast Marketplace</h3>
                                <p className="mt-1 text-base text-slate-600">Tap into our marketplace and reach ready-to-buy customers.</p>
                                <button className="mt-4 w-full rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800">
                                    Explore marketplace
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Compare platforms */}
                    <div className="space-y-3">
                        <h3 className="text-base font-semibold text-slate-900">Compare Platforms</h3>
                        <p className="text-sm text-slate-500">Deep dive into features, costs, and scalability.</p>
                        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Platform</th>
                                            <th className="px-4 py-3">Setup Speed</th>
                                            <th className="px-4 py-3">Upfront Cost</th>
                                            <th className="px-4 py-3">Ongoing Fixed Cost</th>
                                            <th className="px-4 py-3">Selling Fees (Platform)</th>
                                            <th className="px-4 py-3">Best for</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {compareRows.map((row, idx) => (
                                            <tr
                                                key={row.platform}
                                                className={`${idx % 2 === 1 ? "bg-[#EEF2FF]" : "bg-white"}`}
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-9 w-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center">
                                                            <Image src={row.logo} alt={row.platform} width={20} height={20} className="object-contain" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-800">{row.platform}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-800">{row.setup}</td>
                                                <td className="px-4 py-3 text-sm text-slate-800">{row.upfront}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700 leading-relaxed">{row.fixed}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700 leading-relaxed">{row.fees}</td>
                                                <td className="px-4 py-3 text-sm text-slate-700 leading-relaxed">{row.bestFor}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTAs */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 pb-12">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
                            <h3 className="text-lg font-bold text-slate-900">Moving from another platform?</h3>
                            <p className="text-base text-slate-600">Our migration specialists will help you transfer your entire catalog to Printeast effortlessly.</p>
                            <button
                                className="mt-auto w-full rounded-lg bg-[--primary] py-3 text-sm font-semibold text-white"
                                style={{ backgroundColor: primary }}
                            >
                                Migration Wizard
                            </button>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-600">
                                    <Headset className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Customer Support</h3>
                            </div>
                            <p className="text-base text-slate-600">Get help from our team anytime you need it.</p>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                24/7 live chat, priority onboarding, and migration guidance.
                            </div>
                            <button
                                className="w-full rounded-lg bg-[--primary] py-3 text-sm font-semibold text-white"
                                style={{ backgroundColor: primary }}
                            >
                                Contact support
                            </button>
                            <button className="text-xs font-semibold text-[#2563eb]">View help center</button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
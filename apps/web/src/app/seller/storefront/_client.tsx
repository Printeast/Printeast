"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Headset, Plus, RefreshCw, Store } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    userEmail: string;
}

const allIntegrations = [
    "Amazon",
    "TikTok Shop",
    "WooCommerce",
    "Wix",
    "Squarespace",
    "BigCommerce",
    "Manual",
    "API",
    "Adobe Commerce",
    "Big Cartel",
    "eBay",
    "Ecwid",
    "Gumroad",
    "Magento",
    "Prestashop",
    "Square",
    "Walmart",
    "Weebly",
    "Webflow",
    "All integrations",
    "Base",
    "Instagram",
    "Nuvemshop",
    "Storenvy",
    "YouTube",
];

const integrationLogos: Record<string, string> = {
    Shopify: "/assets/integrations/shopify.png",
    WooCommerce: "/assets/integrations/woocommerce.png",
    Amazon: "/assets/integrations/amazon.png",
    Etsy: "/assets/integrations/etsy.png",
    "Instagram Shop": "/assets/integrations/instagram.png",
    Instagram: "/assets/integrations/instagram.png",
    "TikTok Shop": "/assets/integrations/tiktok.png",
    "Direct API": "/assets/integrations/api.png",
    API: "/assets/integrations/api.png",
};

const topIntegrations = [
    {
        name: "Shopify",
        description: "Hosted store builder with fast setup and strong apps.",
        href: "#",
    },
    {
        name: "WooCommerce",
        description: "WordPress-based stores with deep customization.",
        href: "#",
    },
    {
        name: "Amazon",
        description: "Reach high-intent buyers with marketplace scale.",
        href: "#",
    },
    {
        name: "Etsy",
        description: "Quickly test handmade and niche products.",
        href: "#",
    },
    {
        name: "Instagram",
        description: "Turn social content into shoppable moments.",
        href: "#",
    },
    {
        name: "TikTok Shop",
        description: "Sell with viral, trend-driven commerce.",
        href: "#",
    },
    {
        name: "Direct API",
        description: "Custom automation for unique workflows.",
        href: "#",
    },
];

const integrationSlides = (items: typeof topIntegrations) => {
    const slides = [];
    for (let index = 0; index < items.length; index += 4) {
        slides.push(items.slice(index, index + 4));
    }
    return slides;
};

const comparison = [
    {
        platform: "Shopify",
        setupSpeed: "Fast (easy)",
        upfrontCost: "Low",
        ongoingCost: "Monthly subscription (plan-based)",
        sellingFees:
            "Extra platform fee only if you use a third-party payment gateway (plan-based)",
        bestFor: "Most small to scaling brands wanting speed, stability, and ease",
    },
    {
        platform: "WooCommerce",
        setupSpeed: "Moderate (needs hosting + WordPress)",
        upfrontCost: "Low-Medium",
        ongoingCost: "Hosting, domain, and optional themes/plugins",
        sellingFees:
            "No WooCommerce platform fee per transaction (only payment gateway fees)",
        bestFor: "Brands wanting maximum control and lower long-term platform fees",
    },
    {
        platform: "Etsy",
        setupSpeed: "Instant",
        upfrontCost: "Very low",
        ongoingCost: "None required (per listing)",
        sellingFees: "Listing fee + transaction fee per sale",
        bestFor: "Handmade, creative, or niche products; fast demand testing",
    },
    {
        platform: "Amazon",
        setupSpeed: "Moderate",
        upfrontCost: "Low-Medium",
        ongoingCost: "Seller plan may apply (region dependent)",
        sellingFees: "Referral fees vary by category + additional seller fees",
        bestFor: "High-volume products and large-scale marketplace selling",
    },
    {
        platform: "Instagram Shop",
        setupSpeed: "Moderate",
        upfrontCost: "Low",
        ongoingCost: "Usually no fixed platform fee",
        sellingFees:
            "Typically no marketplace commission when checkout happens on your website; marketing costs may apply",
        bestFor: "Brands with strong social content and creator-driven sales",
    },
    {
        platform: "TikTok Shop",
        setupSpeed: "Moderate",
        upfrontCost: "Low",
        ongoingCost: "None required; ads optional",
        sellingFees: "Commission varies by region, category, and seller program",
        bestFor: "Viral, trend-driven, impulse-purchase products",
    },
    {
        platform: "Direct API",
        setupSpeed: "Slow (engineering-heavy)",
        upfrontCost: "High",
        ongoingCost: "Hosting, infrastructure, and ongoing development",
        sellingFees: "None (you own the entire commerce stack)",
        bestFor: "Enterprises, marketplaces, and custom workflows",
    },
];

export function SellerStorefrontClient({ userEmail }: Props) {
    const [showAll, setShowAll] = useState(false);
    const integrationScrollRef = useRef<HTMLDivElement>(null);
    const integrationPages = useMemo(() => integrationSlides(topIntegrations), []);

    const scrollIntegrations = (direction: "left" | "right") => {
        const container = integrationScrollRef.current;
        if (!container) return;
        const scrollAmount = container.clientWidth;
        container.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const integrationList = useMemo(
        () => (showAll ? allIntegrations : allIntegrations.slice(0, 8)),
        [showAll]
    );

    return (
        <DashboardLayout user={{ email: userEmail || "seller", role: "SELLER" }} fullBleed>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Stores</h1>
                        <Link
                            href="/seller/storefront"
                            className="h-9 w-9 rounded-lg border dash-border dash-panel flex items-center justify-center hover:dash-panel-strong"
                            aria-label="Refresh"
                        >
                            <RefreshCw className="h-4 w-4 dash-muted" />
                        </Link>
                    </div>
                </header>

                <section className="space-y-3">
                    <div className="rounded-lg border dash-border dash-panel p-5">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">My Connected Stores</h2>
                                <p className="text-sm dash-muted">Manage your active sales channels.</p>
                                <p className="mt-2 text-sm text-slate-500">No stores connected yet.</p>
                            </div>
                            <button className="rounded-xl border border-dashed dash-border dash-panel px-5 py-3 text-sm font-semibold text-slate-600 flex items-center justify-center gap-2">
                                <Plus className="h-4 w-4" /> Start connecting stores now
                            </button>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">Seamless Integrations</h3>
                            <p className="text-sm dash-muted">
                                Connect the most popular sales channels in minutes.
                            </p>
                            <Link href="#" className="text-xs font-semibold text-blue-600">
                                Learn more
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-500"
                                onClick={() => scrollIntegrations("left")}
                                aria-label="Scroll integrations left"
                            >
                                <ChevronLeft className="mx-auto h-4 w-4" />
                            </button>
                            <button
                                className="h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-500"
                                onClick={() => scrollIntegrations("right")}
                                aria-label="Scroll integrations right"
                            >
                                <ChevronRight className="mx-auto h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div
                        ref={integrationScrollRef}
                        className="integration-scroll grid grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 auto-cols-[100%]"
                    >
                        {integrationPages.map((page, pageIndex) => (
                            <div key={`integration-page-${pageIndex}`} className="rounded-lg border dash-border dash-panel p-5">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {page.map((integration) => {
                                        const logo = integrationLogos[integration.name];
                                        return (
                                            <div key={integration.name} className="flex flex-col gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                                    {logo ? (
                                                        <img
                                                            src={logo}
                                                            alt={integration.name}
                                                            className="h-7 w-7 object-contain"
                                                        />
                                                    ) : (
                                                        <Store className="h-4 w-4 text-slate-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">
                                                        {integration.name}
                                                    </div>
                                                    <p className="text-xs text-slate-500">{integration.description}</p>
                                                </div>
                                                <Link href={integration.href} className="text-xs font-semibold text-blue-600">
                                                    Learn more
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-3">
                    <div>
                        <h3 className="text-xl font-semibold">All integrations</h3>
                        <p className="text-sm dash-muted">Connect your favorite sales channels.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {integrationList.map((name) => {
                            const logo = integrationLogos[name];
                            return (
                                <div key={name} className="rounded-lg border border-slate-200 bg-white px-4 py-3 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                        {logo ? (
                                            <img src={logo} alt={name} className="h-7 w-7 object-contain" />
                                        ) : (
                                            <Store className="h-4 w-4 text-slate-500" />
                                        )}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-800">{name}</div>
                                    <button className="ml-auto h-7 w-7 rounded-full border border-slate-200 text-slate-500 text-xs">?</button>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        className="w-full rounded-lg border border-dashed border-slate-200 bg-white py-2 text-xs font-semibold text-slate-500"
                        onClick={() => setShowAll((prev) => !prev)}
                    >
                        {showAll ? "Show less" : "Show all integrations"}
                    </button>
                </section>

                <section className="space-y-3">
                    <div>
                        <h3 className="text-xl font-semibold">Don't have a store yet?</h3>
                        <p className="text-sm dash-muted">Pick the path that fits your business.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border dash-border dash-panel p-5 flex flex-col gap-3">
                            <div className="text-base font-semibold">Create a Printeast store for free</div>
                            <p className="text-sm dash-muted">
                                Launch a hosted storefront with zero upfront cost.
                            </p>
                            <button className="mt-auto w-full rounded-lg bg-[#2563eb] py-3 text-sm font-semibold text-white">
                                Create store
                            </button>
                        </div>
                        <div className="rounded-lg border dash-border dash-panel p-5 flex flex-col gap-3">
                            <div className="text-base font-semibold">Printeast Marketplace</div>
                            <p className="text-sm dash-muted">
                                Tap into our marketplace and reach ready-to-buy customers.
                            </p>
                            <button className="mt-auto w-full rounded-lg border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700">
                                Explore marketplace
                            </button>
                        </div>
                    </div>
                </section>

                <section className="space-y-3">
                    <div>
                        <h3 className="text-xl font-semibold">Compare Platforms</h3>
                        <p className="text-sm dash-muted">Deep dive into features, costs, and scalability.</p>
                    </div>
                    <div className="rounded-lg border dash-border dash-panel">
                        <div className="grid grid-cols-[1.1fr_1.2fr_0.8fr_1.4fr_1.6fr_1.7fr] gap-2 border-b border-slate-200 px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                            <div>Platform</div>
                            <div>Setup speed</div>
                            <div>Upfront cost</div>
                            <div>Ongoing fixed cost</div>
                            <div>Selling fees (platform)</div>
                            <div>Best for</div>
                        </div>
                        <div className="divide-y divide-slate-200 text-sm">
                            {comparison.map((row, index) => {
                                const logo = integrationLogos[row.platform] || integrationLogos["Instagram Shop"];
                                return (
                                    <div
                                        key={row.platform}
                                        className="grid grid-cols-[1.1fr_1.2fr_0.8fr_1.4fr_1.6fr_1.7fr] gap-2 items-start px-4 py-3"
                                        style={{ backgroundColor: index % 2 === 1 ? "#D7D0FB" : "#ffffff" }}
                                    >
                                        <div className="flex items-center gap-2 font-semibold text-slate-900">
                                            <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
                                                {logo ? (
                                                    <img src={logo} alt={row.platform} className="h-4 w-4 object-contain" />
                                                ) : (
                                                    <Store className="h-4 w-4 text-slate-500" />
                                                )}
                                            </div>
                                            {row.platform}
                                        </div>
                                        <div className="text-slate-600">{row.setupSpeed}</div>
                                        <div className="text-slate-600">{row.upfrontCost}</div>
                                        <div className="text-slate-600">{row.ongoingCost}</div>
                                        <div className="text-slate-600">{row.sellingFees}</div>
                                        <div className="text-slate-600">{row.bestFor}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5">
                    <div className="rounded-2xl border dash-border dash-panel p-6 flex flex-col justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-semibold">Moving from another platform?</h3>
                            <p className="text-sm dash-muted">
                                Our migration specialists will help you transfer your entire catalog to Printeast effortlessly.
                            </p>
                        </div>
                        <button className="inline-flex items-center justify-center rounded-lg bg-[#2563eb] px-5 py-3 text-base font-semibold text-white">
                            Migration Wizard
                        </button>
                    </div>

                    <div className="rounded-lg border dash-border dash-panel p-6 flex h-full flex-col">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full border border-slate-200 bg-white flex items-center justify-center">
                                <Headset className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold">Customer Support</h3>
                                <p className="text-sm dash-muted">Get help from our team anytime you need it.</p>
                            </div>
                        </div>
                        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
                            24/7 live chat, priority onboarding, and migration guidance.
                        </div>
                        <button className="mt-4 w-full rounded-lg bg-[#2563eb] py-3 text-base font-semibold text-white">
                            Contact support
                        </button>
                        <Link href="#" className="mt-3 text-xs text-blue-600 font-semibold">
                            View help center
                        </Link>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

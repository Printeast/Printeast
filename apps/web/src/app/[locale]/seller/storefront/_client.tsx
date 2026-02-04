"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Plus, Store, ChevronLeft, ChevronRight, ClipboardList, CreditCard, BarChart3, Box } from "lucide-react";

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

// High-quality colorful logos found online
const integrationLogos: Record<string, string> = {
    Shopify: "https://img.icons8.com/color/96/shopify.png",
    WooCommerce: "https://img.icons8.com/color/96/woocommerce.png",
    Amazon: "https://img.icons8.com/color/96/amazon.png",
    Etsy: "https://img.icons8.com/color/144/etsy.png",
    "Instagram Shop": "https://img.icons8.com/color/96/instagram-new--v1.png",
    Instagram: "https://img.icons8.com/color/96/instagram-new--v1.png",
    "TikTok Shop": "https://img.icons8.com/color/96/tiktok.png",
    "Direct API": "https://img.icons8.com/color/96/api.png",
    API: "https://img.icons8.com/color/96/api.png",
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
        ongoingCost: "Monthly",
        bestFor: "Small to scaling brands wanting speed and ease",
    },
    {
        platform: "WooCommerce",
        setupSpeed: "Moderate",
        upfrontCost: "Moderate",
        ongoingCost: "Variable",
        bestFor: "Maximum control and lower platform fees",
    },
    {
        platform: "Etsy",
        setupSpeed: "Instant",
        upfrontCost: "Very low",
        ongoingCost: "Per sale",
        bestFor: "Handmade, creative, fast demand testing",
    },
    {
        platform: "Amazon",
        setupSpeed: "Moderate",
        upfrontCost: "Moderate",
        ongoingCost: "Variable",
        bestFor: "High-volume items and large-scale selling",
    },
    {
        platform: "Instagram Shop",
        setupSpeed: "Moderate",
        upfrontCost: "Low",
        ongoingCost: "Variable",
        bestFor: "Brands with strong social content and creators",
    },
    {
        platform: "TikTok Shop",
        setupSpeed: "Moderate",
        upfrontCost: "Low",
        ongoingCost: "Variable",
        bestFor: "Viral, trend-driven, impulse-purchase products",
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
            {/* 
               FIX: Added min-h-screen and overflow-y-visible to ensure scrolling works 
               within the DashboardLayout's main container.
            */}
            <div className="relative w-full min-h-full transition-colors duration-300" style={{
                background: 'linear-gradient(145deg, var(--background) 0%, var(--card) 60%, var(--accent) 100%)'
            }}>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-[0.15]"
                        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
                    <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-10 dark:opacity-[0.10]"
                        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
                </div>

                <div className="relative z-10 px-8 sm:px-12 py-12 space-y-12 max-w-[1400px]">
                    <header>
                        <div className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">SELLER</div>
                        <h1 className="text-5xl font-black text-foreground tracking-tight mb-4">Commerce Command</h1>
                        <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
                            Live signals from orders, inventory, and payouts.
                        </p>
                    </header>

                    {/* Shortcuts Section matching image */}
                    <section className="bg-card/30 border border-border/50 rounded-3xl p-10 backdrop-blur-sm shadow-2xl">
                        <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">Workspace shortcuts</h2>
                        <p className="text-sm text-muted-foreground font-medium mb-8">Quick links into your seller toolkit (LinkedIn backend-ready).</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
                            {[
                                "My Templates",
                                "AI & Design Studio",
                                "Analytics & Insights",
                                "Branding",
                                "Resources",
                                "24/7 Support"
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] group-hover:scale-125 transition-transform" />
                                    <span className="text-[15px] font-bold text-foreground/90 group-hover:text-blue-400 transition-colors">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Summary Cards matching image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "OPEN ORDERS", value: "0", icon: ClipboardList, color: "bg-blue-500/10 text-blue-500" },
                            { label: "PAID", value: "$0", icon: CreditCard, color: "bg-green-500/10 text-green-600" },
                            { label: "PENDING PAYOUTS", value: "$0", icon: BarChart3, color: "bg-orange-500/10 text-orange-600" },
                            { label: "LOW STOCK", value: "0", icon: Box, color: "bg-purple-500/10 text-purple-600" }
                        ].map((card) => (
                            <div key={card.label} className="bg-card/40 border border-border/50 rounded-3xl p-8 backdrop-blur-sm shadow-xl flex flex-col gap-6 group hover:border-blue-500/30 transition-all">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{card.label}</span>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-border ${card.color}`}>
                                        <card.icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-4xl font-black text-foreground">{card.value}</div>
                            </div>
                        ))}
                    </div>

                    <section className="pt-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-foreground tracking-tight">Active Integrations</h3>
                            <button className="px-4 py-2 rounded-xl border border-border bg-card/50 text-[12px] font-black uppercase tracking-widest hover:bg-card transition-colors">Connect New</button>
                        </div>
                    </section>
                    <section>
                        <div className="rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm shadow-sm p-8 border-dashed border-2">
                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-center md:text-left">
                                <div>
                                    <h2 className="text-xl font-black text-foreground tracking-tight">My Connected Stores</h2>
                                    <p className="text-sm text-muted-foreground mt-1 font-medium italic">You haven't connected any stores yet. Choose a platform below to start selling!</p>
                                </div>
                                <button className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mx-auto md:mx-0">
                                    <Plus className="h-5 w-5" /> Start Integration
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-black text-foreground tracking-tight">Popular Platforms</h3>
                                <p className="text-sm text-muted-foreground mt-1 font-medium">
                                    Official direct-sync integrations for seamless order management.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="h-9 w-9 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80 transition-all shadow-sm flex items-center justify-center"
                                    onClick={() => scrollIntegrations("left")}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    className="h-9 w-9 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-border/80 transition-all shadow-sm flex items-center justify-center"
                                    onClick={() => scrollIntegrations("right")}
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div
                            ref={integrationScrollRef}
                            className="flex overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory gap-6 pb-4"
                        >
                            {integrationPages.map((page, pageIndex) => (
                                <div key={pageIndex} className="min-w-full snap-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {page.map((integration) => {
                                        const logo = integrationLogos[integration.name];
                                        return (
                                            <div key={integration.name} className="flex flex-col gap-5 p-6 rounded-2xl border border-border/80 bg-card hover:shadow-xl hover:shadow-blue-900/[0.03] transition-all group border-b-4 border-b-transparent hover:border-b-blue-600">
                                                <div className="h-16 w-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center overflow-hidden transition-transform group-hover:-translate-y-1">
                                                    {logo ? (
                                                        <img
                                                            src={logo}
                                                            alt={integration.name}
                                                            className="w-10 h-10 object-contain"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <Store className="h-6 w-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-[15px] font-black text-foreground uppercase tracking-tight">
                                                        {integration.name}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1.5 font-medium leading-relaxed">{integration.description}</p>
                                                </div>
                                                <Link href={integration.href} className="text-[11px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest decoration-dotted underline underline-offset-4">
                                                    Connect Store →
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight">All Sync Options</h3>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Browse our full list of supported marketplaces and tools.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {integrationList.map((name) => {
                                const logo = integrationLogos[name];
                                return (
                                    <div key={name} className="rounded-xl border border-border/80 bg-card px-5 py-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                                        <div className="h-11 w-11 rounded-xl bg-accent border border-border flex items-center justify-center p-2 group-hover:bg-card transition-colors">
                                            {logo ? (
                                                <img src={logo} alt={name} className="w-6 h-6 object-contain" />
                                            ) : (
                                                <Store className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="text-[14px] font-black text-foreground tracking-tight">{name}</div>
                                        <button className="ml-auto h-7 w-7 rounded-full bg-accent text-muted-foreground text-[10px] font-black border border-border">?</button>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className="w-full rounded-2xl border-2 border-dashed border-border bg-card/50 py-4 text-xs font-black text-muted-foreground hover:text-foreground hover:border-border/80 transition-all uppercase tracking-widest"
                            onClick={() => setShowAll((prev) => !prev)}
                        >
                            {showAll ? "Hide full list" : "Browse all integrations"}
                        </button>
                    </section>

                    <section className="space-y-6">
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight">Need a custom store?</h3>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">We provide hosted solutions for sellers who want a full branded experience.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-border/80 bg-card shadow-sm p-8 flex flex-col gap-5 border-t-4 border-t-blue-600">
                                <div>
                                    <div className="text-lg font-black text-foreground tracking-tight">Printeast Native Store</div>
                                    <p className="text-sm text-muted-foreground mt-2 font-medium leading-relaxed">
                                        The fastest way to start selling. Zero upfront cost, fully managed hosting, and automatic order routing.
                                    </p>
                                </div>
                                <button className="mt-auto w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-4 text-sm font-black text-white shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">
                                    Create Free Store
                                </button>
                            </div>
                            <div className="rounded-2xl border border-border/80 bg-card shadow-sm p-8 flex flex-col gap-5 border-t-4 border-t-accent">
                                <div>
                                    <div className="text-lg font-black text-foreground tracking-tight">Partner Marketplace</div>
                                    <p className="text-sm text-muted-foreground mt-2 font-medium leading-relaxed">
                                        Don't want to handle marketing? Join our marketplace and get your products in front of our organic traffic.
                                    </p>
                                </div>
                                <button className="mt-auto w-full rounded-xl border-2 border-border bg-card hover:bg-accent py-4 text-sm font-black text-foreground transition-all active:scale-[0.98]">
                                    Join Marketplace
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 pb-20">
                        <div>
                            <h3 className="text-xl font-black text-foreground tracking-tight">Comparison Guide</h3>
                            <p className="text-sm text-muted-foreground mt-1 font-medium">Compare setup speeds and costs across platforms.</p>
                        </div>
                        <div className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden border-separate">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border bg-accent/50">
                                            <th className="px-8 py-5 text-[11px] uppercase font-black tracking-widest text-muted-foreground">Integration</th>
                                            <th className="px-8 py-5 text-[11px] uppercase font-black tracking-widest text-muted-foreground">Speed</th>
                                            <th className="px-8 py-5 text-[11px] uppercase font-black tracking-widest text-muted-foreground">Upfront</th>
                                            <th className="px-8 py-5 text-[11px] uppercase font-black tracking-widest text-muted-foreground">Recommendation</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border font-medium">
                                        {comparison.map((row) => {
                                            const logo = integrationLogos[row.platform] || integrationLogos["Instagram Shop"];
                                            return (
                                                <tr key={row.platform} className="hover:bg-accent/30 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center p-1.5 shadow-sm">
                                                                {logo ? (
                                                                    <img src={logo} alt={row.platform} className="w-5 h-5 object-contain" />
                                                                ) : (
                                                                    <Store className="h-4 w-4 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <span className="text-[15px] font-black text-foreground">{row.platform}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-sm text-foreground font-bold">{row.setupSpeed}</td>
                                                    <td className="px-8 py-5 text-sm text-foreground font-bold">{row.upfrontCost}</td>
                                                    <td className="px-8 py-5 text-sm text-muted-foreground font-medium leading-relaxed max-w-sm">{row.bestFor}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}

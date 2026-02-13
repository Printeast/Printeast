"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Role } from "@repo/types";

interface SidebarProps {
    role: Role;
}

import {
    LayoutGrid,
    ClipboardList,
    Box,
    Store,
    LayoutTemplate,
    Sparkles,
    BarChart3,
    Palette,
    BookOpen,
    Headset,
    Home,
    PenTool,
    LifeBuoy,
    ShieldCheck,
    ServerCog,
    Settings,
    Activity,
    Users,
    Banknote,
    Truck,
    Megaphone,
    Dot,
} from "lucide-react";

type SideLink = { label: string; href: string; icon: React.ElementType };
type SidebarSection = { title?: string; items: SideLink[] };

const SELLER_LINKS: SidebarSection[] = [
    {
        title: "MAIN",
        items: [
            { label: "Home", href: "/seller", icon: LayoutGrid },
            { label: "Orders", href: "/seller/orders", icon: ClipboardList },
        ]
    },
    {
        title: "CREATION",
        items: [

            { label: "Products", href: "/seller/inventory", icon: Box },
            { label: "Store", href: "/seller/storefront", icon: Store },
            { label: "My Templates", href: "/seller/templates", icon: LayoutTemplate },
            { label: "AI & Design Studio", href: "/seller/design", icon: Sparkles },
        ]
    },
    {
        title: "SUPPORT",
        items: [
            { label: "Analytics & Insights", href: "/seller/analytics", icon: BarChart3 },
            { label: "Branding", href: "/seller/branding", icon: Palette },
            { label: "Resources", href: "/seller/resources", icon: BookOpen },
            { label: "24/7 Support", href: "/seller/support", icon: Headset },
        ]
    }
];

const CREATOR_LINKS: SidebarSection[] = [
    {
        items: [
            { label: "Home", href: "/creator", icon: Home },
            { label: "Products", href: "/creator/products", icon: Box },
            { label: "Orders", href: "/creator/orders", icon: ClipboardList },
            { label: "Marketplace Listings", href: "/creator/marketplace", icon: Store },
            { label: "My Designs", href: "/creator/designs", icon: PenTool },
            { label: "AI & Design Studio", href: "/creator/ai-studio", icon: Sparkles },
            { label: "Analytics & Insights", href: "/creator/analytics", icon: BarChart3 },
            { label: "Branding", href: "/creator/branding", icon: Palette },
            { label: "Resources", href: "/creator/resources", icon: BookOpen },
            { label: "Community & Help", href: "/creator/community", icon: LifeBuoy },
        ],
    },
];

const CUSTOMER_LINKS: SidebarSection[] = [
    {
        items: [
            { label: "Home", href: "/customer", icon: Home },
            { label: "Products", href: "/customer/products", icon: Box },
            { label: "Orders", href: "/customer/orders", icon: ClipboardList },
            { label: "My Templates", href: "/customer/templates", icon: LayoutTemplate },
            { label: "AI & Design Studio", href: "/customer/ai-studio", icon: Sparkles },
            { label: "Resources", href: "/customer/resources", icon: BookOpen },
        ],
    },
];

type AdminSection = { title: string; icon: React.ElementType; items: { label: string; href: string }[] };

const ADMIN_SECTIONS: AdminSection[] = [
    {
        title: "Dashboard",
        icon: LayoutGrid,
        items: [
            { label: "Overview", href: "/tenant-admin" },
            { label: "Alerts & Incidents", href: "/tenant-admin/alerts" },
            { label: "Daily Health Snapshot", href: "/tenant-admin/health" },
        ],
    },
    {
        title: "Orders & Fulfillment",
        icon: ClipboardList,
        items: [
            { label: "All Orders", href: "/tenant-admin/orders" },
            { label: "SLA Breaches", href: "/tenant-admin/orders/sla-breaches" },
            { label: "Reprints & Replacements", href: "/tenant-admin/orders/reprints" },
            { label: "Refunds Queue", href: "/tenant-admin/orders/refunds" },
            { label: "Bulk Actions", href: "/tenant-admin/orders/bulk-actions" },
        ],
    },
    {
        title: "Suppliers",
        icon: Truck,
        items: [
            { label: "Supplier Directory", href: "/tenant-admin/suppliers" },
            { label: "Capacity & SLA", href: "/tenant-admin/suppliers/capacity" },
            { label: "SKU → Supplier Mapping", href: "/tenant-admin/suppliers/mapping" },
            { label: "Routing Rules", href: "/tenant-admin/suppliers/routing" },
            { label: "Supplier Incidents", href: "/tenant-admin/suppliers/incidents" },
        ],
    },
    {
        title: "Sellers & Artists",
        icon: Users,
        items: [
            { label: "Seller Accounts", href: "/tenant-admin/sellers" },
            { label: "Artist Accounts", href: "/tenant-admin/sellers/artists" },
            { label: "Performance & Risk", href: "/tenant-admin/sellers/performance" },
            { label: "Design Moderation", href: "/tenant-admin/sellers/moderation" },
            { label: "Account Actions", href: "/tenant-admin/sellers/actions" },
        ],
    },
    {
        title: "Products",
        icon: Box,
        items: [
            { label: "Catalog", href: "/tenant-admin/products" },
            { label: "SKU Health", href: "/tenant-admin/products/health" },
        ],
    },
    {
        title: "Customer Support",
        icon: Headset,
        items: [
            { label: "Tickets", href: "/tenant-admin/support/tickets" },
            { label: "Escalations", href: "/tenant-admin/support/escalations" },
            { label: "Refund Requests", href: "/tenant-admin/support/refunds" },
            { label: "CX Analytics", href: "/tenant-admin/support/analytics" },
        ],
    },
    {
        title: "Finance",
        icon: Banknote,
        items: [
            { label: "Revenue Overview", href: "/tenant-admin/finance/revenue" },
            { label: "Unit Economics", href: "/tenant-admin/finance/unit-economics" },
            { label: "Seller Payouts", href: "/tenant-admin/finance/seller-payouts" },
            { label: "Supplier Payouts", href: "/tenant-admin/finance/supplier-payouts" },
            { label: "Refund Leakage", href: "/tenant-admin/finance/refund-leakage" },
            { label: "Invoices & Exports", href: "/tenant-admin/finance/invoices" },
        ],
    },
    {
        title: "Risk & Compliance",
        icon: ShieldCheck,
        items: [
            { label: "Fraud Monitor", href: "/tenant-admin/risk/fraud" },
            { label: "Chargebacks", href: "/tenant-admin/risk/chargebacks" },
            { label: "Account Flags", href: "/tenant-admin/risk/account-flags" },
            { label: "Policy Violations", href: "/tenant-admin/risk/policy-violations" },
        ],
    },
    {
        title: "Platform & AI",
        icon: ServerCog,
        items: [
            { label: "System Health", href: "/tenant-admin/platform/health" },
            { label: "API & Webhooks", href: "/tenant-admin/platform/api" },
            { label: "AI Usage & Cost", href: "/tenant-admin/platform/ai-usage" },
            { label: "Feature Toggles", href: "/tenant-admin/platform/features" },
            { label: "Incident Mode", href: "/tenant-admin/platform/incidents" },
        ],
    },
    {
        title: "Marketing & Promotions",
        icon: Megaphone,
        items: [
            { label: "Campaigns", href: "/tenant-admin/marketing/campaigns" },
        ],
    },
    {
        title: "Governance",
        icon: Activity,
        items: [
            { label: "Roles & Permissions", href: "/tenant-admin/governance/roles" },
            { label: "Admin Users", href: "/tenant-admin/governance/admins" },
            { label: "Audit Logs", href: "/tenant-admin/governance/audit-logs" },
            { label: "Compliance (GDPR / Tax)", href: "/tenant-admin/governance/compliance" },
            { label: "Data Exports", href: "/tenant-admin/governance/data-exports" },
        ],
    },
    {
        title: "Settings",
        icon: Settings,
        items: [
            { label: "Global Config", href: "/tenant-admin/settings/global" },
            { label: "Regions & Currencies", href: "/tenant-admin/settings/regions" },
            { label: "Shipping Rules", href: "/tenant-admin/settings/shipping" },
            { label: "Payment Methods", href: "/tenant-admin/settings/payments" },
        ],
    },
];

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    if (role === "TENANT_ADMIN" as Role) {
        const [collapsed, setCollapsed] = useState(false);

        useEffect(() => {
            const handler = () => setCollapsed((v) => !v);
            window.addEventListener("toggle-sidebar", handler as EventListener);
            return () => window.removeEventListener("toggle-sidebar", handler as EventListener);
        }, []);

        return (
            <aside
                className={`flex-shrink-0 border-r border-sidebar-border flex flex-col h-screen sticky top-0 font-inter transition-all duration-300 relative overflow-visible ${collapsed ? "w-[88px]" : "w-[260px]"}`}
                style={{ background: 'linear-gradient(180deg, var(--background) 0%, var(--sidebar) 40%, var(--card) 100%)' }}
            >
                <div className="p-4 flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sidebar-accent rounded-xl flex items-center justify-center border border-sidebar-border shadow-sm p-1.5 flex-shrink-0 leading-none">
                            <NextImage src="/assets/printeast_logo.png" alt="Printeast" width={24} height={24} priority className="h-auto w-auto object-contain" />
                        </div>
                        {!collapsed && (
                            <div>
                                <h1 className="font-bold text-lg leading-tight text-sidebar-foreground tracking-tight">Printeast</h1>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block leading-none">ADMIN</span>
                            </div>
                        )}
                    </Link>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-visible px-2 py-2 space-y-2 pr-2">
                    {ADMIN_SECTIONS.map((section) => {
                        const Icon = section.icon;

                        if (collapsed) {
                            return (
                                <div key={section.title} className="group relative">
                                    <button className="w-full flex items-center justify-center rounded-xl bg-transparent hover:bg-slate-100 text-slate-700 py-3 transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </button>
                                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity absolute left-full top-1/2 -translate-y-1/2 ml-3 w-64 z-50 drop-shadow-2xl">
                                        <div className="rounded-2xl bg-white text-slate-800 shadow-2xl p-4 border border-slate-200">
                                            <div className="flex items-center gap-2 mb-3 text-sm font-black uppercase tracking-[0.12em] text-slate-700">
                                                <Icon className="w-4 h-4" />
                                                <span>{section.title}</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {section.items.map((link) => (
                                                    <li key={link.href}>
                                                        <Link
                                                            href={link.href}
                                                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] font-semibold text-slate-800 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                        >
                                                            <Dot className="w-3 h-3 text-slate-400" />
                                                            <span>{link.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <details key={section.title} className="px-2 py-1" open>
                                <summary className="flex items-center gap-2 text-[11px] font-black text-slate-900 uppercase tracking-[0.14em] px-1 py-1 cursor-pointer select-none">
                                    <Icon className="w-4 h-4" />
                                    <span>{section.title}</span>
                                </summary>
                                <ul className="space-y-1 mt-1 ml-2">
                                    {section.items.map((link) => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                            >
                                                <Dot className="w-3 h-3 text-slate-400" />
                                                <span>{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        );
                    })}
                </div>
            </aside>
        );
    }

    let sections: SidebarSection[] = [];
    if (role === "SELLER") {
        sections = SELLER_LINKS;
    } else if (role === "CREATOR") {
        sections = CREATOR_LINKS;
    } else if (role === "CUSTOMER") {
        sections = CUSTOMER_LINKS;
    } else {
        sections = [{ items: [] }];
    }

    const normalizedPath = pathname.replace(/^\/[a-zA-Z]{2}/, "") || "/";

    return (
        <aside className="w-[260px] flex-shrink-0 border-r border-sidebar-border flex flex-col h-screen sticky top-0 font-inter text-sidebar-foreground transition-all duration-300 relative" style={{
            background: 'linear-gradient(180deg, var(--background) 0%, var(--sidebar) 40%, var(--card) 100%)'
        }}>
            <div className="p-6 pb-2">
                <Link href="/" className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-sidebar-accent rounded-xl flex items-center justify-center border border-sidebar-border shadow-sm p-1.5 flex-shrink-0 leading-none">
                        <NextImage
                            src="/assets/printeast_logo.png"
                            alt="Printeast"
                            width={24}
                            height={24}
                            priority
                            className="h-auto w-auto object-contain"
                        />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight text-sidebar-foreground tracking-tight">Printeast</h1>
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block leading-none">DASHBOARD</span>
                    </div>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
                {sections.map((section, idx) => (
                    <div key={idx}>
                        {section.title && (
                            <h3 className="px-3 mb-4 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                                {section.title}
                            </h3>
                        )}
                        <nav className="space-y-0.5">
                            {section.items.map((link) => {
                                const Icon = link.icon;
                                const isActive = normalizedPath === link.href || pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all duration-200 relative ${isActive
                                            ? "bg-blue-50 text-blue-700 shadow-sm"
                                            : "text-muted-foreground hover:text-sidebar-foreground hover:bg-slate-100/50"
                                            }`}
                                    >
                                        {/* Sleek active indicator */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[4px] bg-blue-600 rounded-r-md" />
                                        )}
                                        <Icon className={`w-[18px] h-[18px] transition-colors ${isActive ? "text-blue-600" : "text-muted-foreground group-hover:text-slate-700"}`} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>
        </aside>
    );
}

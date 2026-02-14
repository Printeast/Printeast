"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { Role } from "@repo/types";
import { memo, useMemo } from "react";

interface SidebarProps {
    role: Role;
    primaryRole?: Role;
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
    DollarSign,
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
            { label: "AI & Design Studio", href: "/seller/wizard", icon: Sparkles },
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
            { label: "Earnings", href: "/creator/earnings", icon: DollarSign },
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

import { RoleSwitcher } from "@/components/dashboard/RoleSwitcher";

export const Sidebar = memo(function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    // Memoize locale extraction
    const locale = useMemo(() => pathname.split('/')[1] || 'en', [pathname]);

    // Memoize sections based on role
    const sections = useMemo(() => {
        if (role === "SELLER") return SELLER_LINKS;
        if (role === "CREATOR") return CREATOR_LINKS;
        if (role === "CUSTOMER") return CUSTOMER_LINKS;
        return [{ items: [] }];
    }, [role]);

    // Memoize normalized path
    const normalizedPath = useMemo(() =>
        pathname.replace(/^\/[a-zA-Z]{2}/, "") || "/",
        [pathname]
    );

    // Memoize dashboard title
    const dashboardTitle = useMemo(() => {
        if (role === 'SELLER') return 'SELLER DASHBOARD';
        if (role === 'CREATOR') return 'CREATOR STUDIO';
        if (role === 'CUSTOMER') return 'INDIVIDUAL SPACE';
        return 'DASHBOARD';
    }, [role]);

    return (
        <aside className="w-[260px] flex-shrink-0 border-r border-sidebar-border flex flex-col h-screen sticky top-0 font-inter text-sidebar-foreground transition-all duration-300 relative z-50 hover:z-50" style={{
            background: 'linear-gradient(180deg, var(--background) 0%, var(--sidebar) 40%, var(--card) 100%)'
        }}>
            <div className="p-4 pb-2 flex items-center justify-start gap-1">
                <Link href="/" className="flex items-center gap-3">
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
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block leading-none">{dashboardTitle}</span>
                    </div>
                </Link>

                {/* Switcher Button - Compact Access */}
                <div className="relative">
                    <RoleSwitcher userRole={role} locale={locale} compact={true} />
                </div>
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
});

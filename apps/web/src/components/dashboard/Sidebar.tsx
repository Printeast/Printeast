"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@repo/types";
import {
    LayoutDashboard,
    Palette,
    Wallet2,
    ShoppingBag,
    Boxes,
    Settings,
    Users2,
    BarChart2,
    Store,
    ShieldCheck,
} from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };

const NAV: Record<Role, NavItem[]> = {
    SUPER_ADMIN: [
        { label: "Platform Overview", href: "/tenant-admin", icon: LayoutDashboard },
        { label: "Tenants", href: "/tenant-admin/tenants", icon: Users2 },
        { label: "Systems", href: "/tenant-admin/systems", icon: ShieldCheck },
    ],
    TENANT_ADMIN: [
        { label: "Overview", href: "/tenant-admin", icon: LayoutDashboard },
        { label: "Teams", href: "/tenant-admin/teams", icon: Users2 },
        { label: "Settings", href: "/tenant-admin/settings", icon: Settings },
    ],
    CREATOR: [
        { label: "Studio", href: "/creator", icon: Palette },
        { label: "Portfolio", href: "/creator/portfolio", icon: LayoutDashboard },
        { label: "Earnings", href: "/creator/earnings", icon: Wallet2 },
    ],
    SELLER: [
        { label: "Orders", href: "/seller", icon: ShoppingBag },
        { label: "Inventory", href: "/seller/inventory", icon: Boxes },
        { label: "Storefront", href: "/seller/storefront", icon: Store },
    ],
    VENDOR: [
        { label: "Production", href: "/vendor", icon: Boxes },
        { label: "Logistics", href: "/vendor/logistics", icon: BarChart2 },
    ],
    AFFILIATE: [
        { label: "Links", href: "/affiliate", icon: LayoutDashboard },
        { label: "Payouts", href: "/affiliate/payouts", icon: Wallet2 },
    ],
    CUSTOMER: [
        { label: "Orders", href: "/customer", icon: ShoppingBag },
        { label: "Profile", href: "/customer/profile", icon: Settings },
    ],
};

interface SidebarProps {
    role: Role;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const links = NAV[role] || [];

    return (
        <aside className="w-64 border-r border-base-border bg-white px-4 py-6 shadow-sm" aria-label="Role navigation">
            <div className="mb-8 flex items-center gap-3 px-2">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-orange to-primary-pink text-white flex items-center justify-center font-black text-lg">
                    P
                </div>
                <div>
                    <div className="text-lg font-black text-text-main">Printeast</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">{role.replace("_", " ")}</div>
                </div>
            </div>

            <nav className="space-y-1" aria-label={`${role} navigation`}>
                {links.map((link) => {
                    const active = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${active
                                    ? "bg-gradient-to-r from-primary-orange/15 to-primary-pink/15 text-text-main border border-primary-orange/30"
                                    : "text-text-secondary hover:bg-base-bg"}
                            `}
                            aria-current={active ? "page" : undefined}
                        >
                            <Icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}

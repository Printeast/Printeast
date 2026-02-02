"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Role } from "@repo/types";
import {
    IconBag,
    IconBoxes,
    IconBrush,
    IconChart,
    IconDashboard,
    IconSettings,
    IconShield,
    IconSpark,
    IconStore,
    IconTemplates,
    IconUser,
    IconUsers,
    IconWallet,
} from "@/components/ui/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import logo from "@/printeast_logo-removebg-preview.png";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };
type NavSection = { title: string; items: NavItem[] };

const NAV: Record<Role, NavItem[]> = {
    SUPER_ADMIN: [
        { label: "Platform Overview", href: "/tenant-admin", icon: IconDashboard },
        { label: "Tenants", href: "/tenant-admin/tenants", icon: IconUsers },
        { label: "Systems", href: "/tenant-admin/systems", icon: IconShield },
    ],
    TENANT_ADMIN: [
        { label: "Overview", href: "/tenant-admin", icon: IconDashboard },
        { label: "Teams", href: "/tenant-admin/teams", icon: IconUsers },
        { label: "Settings", href: "/tenant-admin/settings", icon: IconSettings },
    ],
    CREATOR: [
        { label: "Studio", href: "/creator", icon: IconBrush },
        { label: "Portfolio", href: "/creator/portfolio", icon: IconDashboard },
        { label: "Earnings", href: "/creator/earnings", icon: IconWallet },
    ],
    SELLER: [],
    VENDOR: [
        { label: "Production", href: "/vendor", icon: IconBoxes },
        { label: "Logistics", href: "/vendor/logistics", icon: IconChart },
    ],
    AFFILIATE: [
        { label: "Links", href: "/affiliate", icon: IconDashboard },
        { label: "Payouts", href: "/affiliate/payouts", icon: IconWallet },
    ],
    CUSTOMER: [
        { label: "Orders", href: "/customer", icon: IconBag },
        { label: "Profile", href: "/customer/profile", icon: IconSettings },
    ],
};

interface SidebarProps {
    role: Role;
    collapsed?: boolean;
    onToggle?: () => void;
}

export function Sidebar({ role, collapsed }: SidebarProps) {
    const pathname = usePathname();
    const links = NAV[role] || [];
    const sellerSections: NavSection[] = [
        {
            title: "Main",
            items: [
                { label: "Home", href: "/seller", icon: IconDashboard },
                { label: "Orders", href: "/seller/orders", icon: IconBag },
            ],
        },
        {
            title: "Creation",
            items: [
                { label: "Products", href: "/seller/inventory", icon: IconBoxes },
                { label: "My Store", href: "/seller/storefront", icon: IconStore },
                { label: "My Templates", href: "/seller/templates", icon: IconTemplates },
                { label: "AI & Design Studio", href: "/seller/design", icon: IconSpark },
            ],
        },
        {
            title: "Support",
            items: [
                { label: "Analytics & Insights", href: "/seller/analytics", icon: IconChart },
                { label: "Branding", href: "/seller/branding", icon: IconBrush },
                { label: "Resources", href: "/seller/resources", icon: IconShield },
                { label: "24/7 Support", href: "/seller/support", icon: IconUsers },
            ],
        },
    ];

    return (
        <aside
            className={`border-r dash-border dash-panel px-3 py-6 shadow-sm transition-all duration-200 ${collapsed ? "w-[78px]" : "w-64"}`}
            aria-label="Role navigation"
        >
            <div className={`mb-8 flex items-center gap-3 px-2 ${collapsed ? "justify-center" : "justify-start"}`}>
                <div className="h-10 w-10 rounded-2xl dash-panel border dash-border flex items-center justify-center shadow-[0_8px_24px_-12px_rgba(255,125,90,0.6)]">
                    <Image src={logo} alt="Printeast logo" className="h-8 w-8 object-contain" />
                </div>
                {!collapsed && (
                    <div>
                        <div className="text-lg font-black dash-text">Printeast</div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] dash-muted">{role.replace("_", " ")}</div>
                    </div>
                )}
            </div>

            <nav className="space-y-4" aria-label={`${role} navigation`}>
                {(role === "SELLER" ? sellerSections : [{ title: "", items: links }]).map((section) => (
                    <div key={section.title || "main"} className="space-y-1">
                        {!collapsed && section.title && (
                            <div className="px-3 pt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                {section.title}
                            </div>
                        )}
                        {section.items.map((link) => {
                            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                            const Icon = link.icon;
                            const item = (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${active
                                            ? "bg-gradient-to-r from-[var(--dash-accent-start)]/30 to-[var(--dash-accent-end)]/15 text-[color:var(--dash-text)] border border-[var(--dash-accent-start)]/40"
                                            : "dash-muted hover:bg-[var(--dash-panel-strong)]"}
                                    ${collapsed ? "justify-center" : ""}`}
                                    aria-current={active ? "page" : undefined}
                                >
                                    <Icon className={`h-4 w-4 ${active ? "dash-text" : "dash-muted-strong"}`} />
                                    {!collapsed && <span className="truncate">{link.label}</span>}
                                </Link>
                            );

                            return collapsed ? (
                                <Tooltip key={link.href}>
                                    <TooltipTrigger asChild>{item}</TooltipTrigger>
                                    <TooltipContent side="right">{link.label}</TooltipContent>
                                </Tooltip>
                            ) : (
                                item
                            );
                        })}
                    </div>
                ))}
            </nav>

            {null}
        </aside>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@repo/types";

interface SidebarProps {
    role: Role;
}

const SIDEBAR_LINKS: Record<Role, { label: string; href: string }[]> = {
    SUPER_ADMIN: [
        { label: "Tenants", href: "/dashboard/tenants" },
        { label: "Platform Stats", href: "/dashboard/stats" },
    ],
    TENANT_ADMIN: [
        { label: "Overview", href: "/dashboard" },
        { label: "Team", href: "/dashboard/team" },
        { label: "Settings", href: "/dashboard/settings" },
    ],
    CREATOR: [
        { label: "My Designs", href: "/dashboard/designs" },
        { label: "Studio", href: "/dashboard/studio" },
        { label: "Earnings", href: "/dashboard/earnings" },
    ],
    SELLER: [
        { label: "Storefront", href: "/dashboard/store" },
        { label: "Products", href: "/dashboard/products" },
        { label: "Orders", href: "/dashboard/orders" },
    ],
    VENDOR: [
        { label: "Production", href: "/dashboard/production" },
        { label: "Inventory", href: "/dashboard/inventory" },
    ],
    AFFILIATE: [
        { label: "Links", href: "/dashboard/links" },
        { label: "Payouts", href: "/dashboard/payouts" },
    ],
    CUSTOMER: [
        { label: "My Orders", href: "/dashboard/orders" },
        { label: "Profile", href: "/dashboard/profile" },
    ],
};

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const links = SIDEBAR_LINKS[role] || [];

    return (
        <aside className="w-64 border-r border-base-border bg-white px-4 py-8">
            <div className="mb-10 px-4">
                <span className="bg-printeast-gradient bg-clip-text text-2xl font-black text-transparent italic">
                    Printeast
                </span>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                    {role.replace("_", " ")}
                </div>
            </div>

            <nav className="space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all ${pathname === link.href
                                ? "bg-base-bg text-text-main"
                                : "text-text-secondary hover:bg-base-bg hover:text-text-main"
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

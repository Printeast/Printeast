import {
    Activity,
    Banknote,
    ClipboardList,
    Headset,
    LayoutGrid,
    Megaphone,
    ServerCog,
    Settings,
    ShieldCheck,
    Truck,
    Users,
    Box,
    BookOpen,
    Store,
} from "lucide-react";

export type AdminNavItem = { label: string; href: string; icon?: React.ComponentType<any> };
export type AdminNavGroup = { title: string; icon: React.ComponentType<any>; items: AdminNavItem[] };

export const adminNavGroups: AdminNavGroup[] = [
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
        items: [{ label: "Campaigns", href: "/tenant-admin/marketing/campaigns" }],
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

export const adminNavIconMap = {
    dashboard: LayoutGrid,
    orders: ClipboardList,
    suppliers: Truck,
    sellers: Users,
    products: Box,
    support: Headset,
    finance: Banknote,
    risk: ShieldCheck,
    platform: ServerCog,
    marketing: Megaphone,
    governance: Activity,
    settings: Settings,
    library: BookOpen,
    store: Store,
};

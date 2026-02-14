"use client";

import Image from "next/image";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, MoreHorizontal, RefreshCw, Search, Shirt, LayoutTemplate, Store } from "lucide-react";
import { OrderAdvancedFilters } from "./OrderAdvancedFilters";
import { ActiveFilterBadges } from "./ActiveFilterBadges";
import { ActionMenuButton } from "@/components/seller/ActionMenuButton";
import { api } from "@/services/api.service";

type OrderItemRow = {
    id: string;
    price_at_time: number;
    product?: { name: string | null; mockup_template_url: string | null } | null;
    design?: { preview_url: string | null; image_url: string | null; prompt_text: string | null } | null;
};

type OrderRow = {
    id: string;
    status: string;
    total_amount: number;
    created_at: string;
    buyer?: { email: string | null } | null;
    order_items?: OrderItemRow[] | null;
};
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/browser";
import { Role } from "@repo/types";

interface OrdersClientProps {
    role?: Role;
    basePath?: string;
    pageTitle?: string;
    pageDescription?: string;
    inventoryPath?: string;
}

export function OrdersClient({
    role = "SELLER",
    basePath = "/seller",
    pageTitle = "Orders",
    inventoryPath
}: OrdersClientProps) {
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = params.locale as string;

    const finalInventoryPath = inventoryPath || `/${locale}${basePath}/products`;

    const [userEmail, setUserEmail] = useState(role.toLowerCase());
    const [orders, setOrders] = useState<OrderRow[]>([]);
    const [loading, setLoading] = useState(true);

    const q = searchParams.get("q");
    const status = searchParams.get("status");
    const stores = searchParams.getAll("store");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const { data: userRes } = await supabase.auth.getUser();
            const email = userRes.user?.email || session?.user?.email || role.toLowerCase();
            setUserEmail(email);

            try {
                // The API call assumes generic /orders endpoint works for both roles
                const res = await api.get<any>(`/orders?q=${q || ""}&status=${status || ""}`, session?.access_token);
                if (res.success && res.data) {
                    const formattedOrders = (res.data.orders || []).map((o: any) => ({
                        id: o.id,
                        status: o.status,
                        total_amount: o.totalAmount,
                        created_at: o.createdAt,
                        buyer: o.buyer,
                        order_items: (o.items || []).map((item: any) => ({
                            id: item.id,
                            price_at_time: item.priceAtTime,
                            product: { name: item.productName, mockup_template_url: item.imageUrl },
                            design: { preview_url: item.imageUrl }
                        }))
                    }));
                    setOrders(formattedOrders);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [q, status, role]);

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role: role }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold text-foreground">{pageTitle}</h1>
                            <Link
                                href={`/${locale}${basePath}/orders`}
                                className="ml-1 w-7 h-7 flex items-center justify-center rounded-md bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <ActionMenuButton
                                label="New order"
                                options={[
                                    {
                                        icon: <Shirt className="w-5 h-5" />,
                                        title: "Select from catalog",
                                        description: "Select a product from catalog",
                                        href: finalInventoryPath,
                                    },
                                    {
                                        icon: <LayoutTemplate className="w-5 h-5" />,
                                        title: "Use a template",
                                        description: "Select a template to create products",
                                        href: `/${locale}${basePath}/templates`,
                                    },
                                    {
                                        icon: <Store className="w-5 h-5" />,
                                        title: "Select from store",
                                        description: "Copy products from another store",
                                        href: finalInventoryPath,
                                    },
                                ]}
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-all shadow-sm">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Export Account Statement</DropdownMenuItem>
                                    <DropdownMenuItem>Export Invoices</DropdownMenuItem>
                                    <DropdownMenuItem>Export Billing Receipts</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Import orders</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <form method="get" className="w-full">
                                <input
                                    name="q"
                                    defaultValue={q || ""}
                                    placeholder="Search order ID, product, or customer"
                                    className="w-full h-11 pl-11 pr-4 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all shadow-sm"
                                />
                                {stores.map(s => <input key={s} type="hidden" name="store" value={s} />)}
                                <input type="hidden" name="status" value={status || ""} />
                            </form>
                        </div>

                        <OrderAdvancedFilters basePath={basePath} />

                        <button className="h-11 px-4 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:border-border/80 flex items-center gap-2 transition-all shadow-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    <ActiveFilterBadges basePath={basePath} />

                    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-border">
                                    <TableHead className="h-12 pl-6 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Product</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Order ID</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Customer</TableHead>
                                    <TableHead className="h-12 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="h-12 pr-6 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={6} className="py-20 text-center">
                                            <div className="flex justify-center items-center">
                                                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : orders.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={6} className="py-32">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-14 h-14 mb-5 flex items-center justify-center">
                                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M24 4L4 14V34L24 44L44 34V14L24 4Z" fill="var(--muted)" />
                                                        <path d="M24 4L4 14L24 24L44 14L24 4Z" fill="var(--accent)" />
                                                        <path d="M24 24V44L44 34V14L24 24Z" fill="var(--secondary)" />
                                                        <path d="M24 24V44L4 34V14L24 24Z" fill="var(--muted)" />
                                                        <path d="M24 4L44 14L24 24L4 14L24 4Z" stroke="var(--border)" strokeWidth="1" />
                                                        <path d="M24 24V44" stroke="var(--border)" strokeWidth="1" />
                                                        <path d="M4 14V34L24 44" stroke="var(--border)" strokeWidth="1" />
                                                        <path d="M44 14V34L24 44" stroke="var(--border)" strokeWidth="1" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-base font-semibold text-foreground mb-2">No orders yet</h3>
                                                <p className="text-sm text-muted-foreground max-w-[300px] leading-relaxed mb-4">
                                                    Once you receive your first order, it will appear here.
                                                </p>
                                                <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors">
                                                    Learn more about managing orders
                                                </a>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => {
                                        const items = order.order_items ?? [];
                                        const firstItem = items[0];
                                        const productName = firstItem?.product?.name || firstItem?.design?.prompt_text || "Product";
                                        const imageUrl =
                                            firstItem?.design?.preview_url ||
                                            firstItem?.design?.image_url ||
                                            firstItem?.product?.mockup_template_url ||
                                            null;

                                        return (
                                            <TableRow key={order.id} className="hover:bg-accent/30 cursor-pointer border-b border-border/50 last:border-0 transition-colors">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-muted border border-border rounded-lg flex items-center justify-center overflow-hidden">
                                                            {imageUrl ? (
                                                                <Image src={imageUrl} alt={productName} width={40} height={40} className="w-full h-full object-cover" unoptimized />
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-muted-foreground">IMG</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-sm text-foreground">{productName}</div>
                                                            <div className="text-xs text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-muted-foreground">#{order.id.slice(0, 8)}</TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-foreground">{formatDate(order.created_at)}</div>
                                                    <div className="text-xs text-muted-foreground">{formatTime(order.created_at)}</div>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">{order.buyer?.email || "Guest"}</TableCell>
                                                <TableCell>
                                                    <Badge tone={statusTone(order.status)}>{formatStatus(order.status)}</Badge>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right font-semibold text-sm text-foreground">
                                                    {formatCurrency(order.total_amount)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function formatDate(value: string | null | undefined) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "2-digit" });
}

function formatTime(value: string | null | undefined) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(amount: number | null | undefined) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(amount || 0));
}

function formatStatus(value: string | null | undefined) {
    if (!value) return "Unknown";
    if (value === "CREATED") return "Draft";
    return value.toLowerCase().split("_").map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1)).join(" ");
}

function statusTone(status: string | null | undefined): "neutral" | "warning" | "positive" | "info" {
    const normalized = (status || "").toUpperCase();
    if (["SHIPPED", "DELIVERED"].includes(normalized)) return "positive";
    if (["CANCELLED"].includes(normalized)) return "warning";
    if (["IN_PRODUCTION", "ROUTED_TO_VENDOR", "READY_TO_SHIP"].includes(normalized)) return "info";
    return "neutral";
}

import Image from "next/image";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { CalendarDays, Download, Filter, Globe, MoreHorizontal, Plus, RefreshCw, Search, Truck, Wallet, X } from "lucide-react";
import { DateInput } from "@/components/ui/date-input";

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

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SellerOrdersPage({ searchParams }: { searchParams?: SearchParams }) {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const q = readParam(searchParams?.q);
    const status = readParam(searchParams?.status);
    const stores = readParamList(searchParams?.store);
    const country = readParam(searchParams?.country);
    const fulfillment = readParam(searchParams?.fulfillment);
    const payment = readParam(searchParams?.payment);
    const start = readParam(searchParams?.start);
    const end = readParam(searchParams?.end);
    const range = readParam(searchParams?.range) || (start || end ? "custom" : undefined);
    const resolvedRange = resolveRange(range, start, end);

    let orders: OrderRow[] = [];
    if (tenantId) {
        let query = supabase
            .from("orders")
            .select("id,status,total_amount,created_at,buyer:users!orders_buyer_id_fkey(email),order_items(id,price_at_time,product:products(name,mockup_template_url),design:designs(preview_url,image_url,prompt_text))")
            .eq("tenant_id", tenantId)
            .order("created_at", { ascending: false })
            .limit(50);

        if (status && status !== "all") {
            query = query.eq("status", status);
        }

        if (resolvedRange.start) {
            query = query.gte("created_at", resolvedRange.start);
        }

        if (resolvedRange.end) {
            query = query.lte("created_at", resolvedRange.end);
        }

        if (q) {
            const term = q.replace(/[%_]/g, "").trim();
            if (term) {
                query = query.or(`id.ilike.%${term}%,users.email.ilike.%${term}%`);
            }
        }

        const { data } = await query;
        orders = (data ?? []) as OrderRow[];
    }

    const filterParams = {
        q,
        status,
        range,
        start: range === "custom" ? start : undefined,
        end: range === "custom" ? end : undefined,
        store: stores.length ? stores : undefined,
        country,
        fulfillment,
        payment,
    };
    const chips = buildFilterChips({ status, stores, country, rangeLabel: resolvedRange?.label, fulfillment, payment });

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Orders</h1>
                            <Link
                                href={`/seller/orders${buildQuery(filterParams)}`}
                                className="h-9 w-9 rounded-lg border dash-border dash-panel flex items-center justify-center hover:dash-panel-strong"
                                aria-label="Refresh"
                            >
                            <RefreshCw className="h-4 w-4 dash-muted" />
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="h-10 w-10 rounded-full border dash-border dash-panel flex items-center justify-center hover:dash-panel-strong"
                                    aria-label="More options"
                                >
                                    <MoreHorizontal className="h-4 w-4 dash-muted" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem>Export Account Statement</DropdownMenuItem>
                                <DropdownMenuItem>Export Invoices</DropdownMenuItem>
                                <DropdownMenuItem>Export Billing Receipts</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Import orders</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            type="button"
                            className="h-10 rounded-lg px-5 bg-[#2563eb] text-white text-sm font-semibold shadow"
                        >
                            <Plus className="mr-2 h-4 w-4" /> New
                        </Button>
                    </div>
                </header>

                <section className="space-y-3">
                    <div className="flex items-center gap-3">
                        <form method="get" className="relative flex-1">
                            <input type="hidden" name="status" value={status || ""} />
                            <input type="hidden" name="range" value={range || ""} />
                            {range === "custom" && <input type="hidden" name="start" value={start || ""} />}
                            {range === "custom" && <input type="hidden" name="end" value={end || ""} />}
                            {stores.map((value) => (
                                <input key={value} type="hidden" name="store" value={value} />
                            ))}
                            <input type="hidden" name="country" value={country || ""} />
                            <input type="hidden" name="fulfillment" value={fulfillment || ""} />
                            <input type="hidden" name="payment" value={payment || ""} />
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                name="q"
                                defaultValue={q}
                                placeholder="Search order ID, product, or customer"
                                className={`${fieldClass} h-11 rounded-lg pl-11 pr-4 text-sm`}
                            />
                        </form>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="h-11 px-5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition shadow-sm"
                                >
                                    <Filter className="h-4 w-4" /> Filters
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[320px] p-4">
                                <form method="get" className="space-y-3">
                                    <input type="hidden" name="q" value={q || ""} />
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-semibold">Advanced Filters</h3>
                                        <a href="/seller/orders" className="text-xs font-semibold text-slate-400 hover:text-slate-600">
                                            Reset
                                        </a>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date Range</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-500">Start Date</label>
                                                <div className="relative">
                                                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <DateInput
                                                        name="start"
                                                        defaultValue={start}
                                                        placeholder="dd/mm/yyyy"
                                                        className={`${fieldClass} pl-9 text-slate-500`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-500">End Date</label>
                                                <div className="relative">
                                                    <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                    <DateInput
                                                        name="end"
                                                        defaultValue={end}
                                                        placeholder="dd/mm/yyyy"
                                                        className={`${fieldClass} pl-9 text-slate-500`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Country</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <select name="country" defaultValue={country || "all"} className={`${fieldClass} pl-9`}>
                                                <option value="all">All Countries</option>
                                                <option value="india">India</option>
                                                <option value="united-kingdom">United Kingdom</option>
                                                <option value="usa">USA</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Fulfillment</label>
                                        <div className="relative">
                                            <Truck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <select name="fulfillment" defaultValue={fulfillment || "all"} className={`${fieldClass} pl-9`}>
                                                <option value="all">All statuses</option>
                                                <option value="in-house">In-house</option>
                                                <option value="partner">Partner</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Payment Status</label>
                                        <div className="relative">
                                            <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <select name="payment" defaultValue={payment || "all"} className={`${fieldClass} pl-9`}>
                                                <option value="all">All statuses</option>
                                                <option value="paid">Paid</option>
                                                <option value="pending">Pending</option>
                                                <option value="failed">Failed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stores</label>
                                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" name="store" value="etsy" defaultChecked={stores.includes("etsy")} className="h-4 w-4 rounded border-slate-300" />
                                                Etsy Shop
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" name="store" value="shopify" defaultChecked={stores.includes("shopify")} className="h-4 w-4 rounded border-slate-300" />
                                                Shopify Main
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" name="store" value="woocommerce" defaultChecked={stores.includes("woocommerce")} className="h-4 w-4 rounded border-slate-300" />
                                                WooCommerce
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pt-1">
                                        <a
                                            href="/seller/orders"
                                            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </a>
                                        <Button type="submit" className="flex-1 h-11 rounded-xl bg-[#2563eb] text-sm font-semibold text-white">
                                            Apply Filters
                                        </Button>
                                    </div>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <button
                            type="button"
                            className="h-11 px-5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition shadow-sm"
                        >
                            <Download className="h-4 w-4" /> Export
                        </button>
                    </div>
                    {chips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            {chips.map((chip) => {
                                const nextParams = chip.key === "range"
                                    ? { ...filterParams, range: undefined, start: undefined, end: undefined }
                                    : chip.key === "store" && chip.value
                                        ? {
                                              ...filterParams,
                                              store: (stores || []).filter((value) => value !== chip.value),
                                          }
                                        : { ...filterParams, [chip.key]: chip.clearTo };
                                return (
                                    <span key={chip.key} className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {chip.label}
                                        <Link
                                            href={`/seller/orders${buildQuery(nextParams)}`}
                                            className="flex h-4 w-4 items-center justify-center rounded-md text-blue-400 hover:bg-blue-100 hover:text-blue-700"
                                            aria-label={`Clear ${chip.label}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </Link>
                                    </span>
                                );
                            })}
                            <Link href="/seller/orders" className="text-xs font-semibold text-blue-700 hover:text-blue-800">
                                Clear all
                            </Link>
                        </div>
                    )}
                </section>
                <section className="rounded-lg border dash-border dash-panel">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-16">
                                        <div className="mx-auto max-w-md text-center">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                                <span className="text-xl">📦</span>
                                            </div>
                                            <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
                                            <p className="mt-2 text-sm text-slate-500">
                                                Once you receive your first order, it will appear here.
                                            </p>
                                            <Link href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb]">
                                                Learn more about managing orders
                                            </Link>
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
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                                                        {imageUrl ? (
                                                            <Image src={imageUrl} alt={productName} width={48} height={48} className="h-12 w-12 object-cover" unoptimized />
                                                        ) : (
                                                            <span className="text-xs text-slate-400">IMG</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{productName}</div>
                                                        <div className="text-xs text-slate-500">{items.length} item{items.length === 1 ? "" : "s"}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-slate-900">{order.id}</TableCell>
                                            <TableCell>
                                                <div className="text-sm font-semibold text-slate-900">{formatDate(order.created_at)}</div>
                                                <div className="text-xs text-slate-500">{formatTime(order.created_at)}</div>
                                            </TableCell>
                                            <TableCell>{order.buyer?.email || "Customer"}</TableCell>
                                            <TableCell>
                                                <Badge tone={statusTone(order.status)}>{formatStatus(order.status)}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-slate-900">{formatCurrency(order.total_amount)}</TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </section>
            </div>
        </DashboardLayout>
    );
}

const fieldClass =
    "h-10 w-full rounded-xl border border-slate-200 bg-[#f9fafb] px-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20";

function readParam(value: string | string[] | undefined) {
    if (!value) return undefined;
    if (Array.isArray(value)) return value[0];
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
}

function readParamList(value: string | string[] | undefined) {
    if (!value) return [] as string[];
    if (Array.isArray(value)) return value.map((entry) => entry.trim()).filter(Boolean);
    const trimmed = value.trim();
    return trimmed.length ? [trimmed] : [];
}

function buildFilterChips(params: { status?: string; stores: string[]; country?: string; rangeLabel?: string; fulfillment?: string; payment?: string }) {
    const chips = [] as Array<{ key: string; label: string; clearTo: string; value?: string }>;
    if (params.status && params.status !== "all") chips.push({ key: "status", label: `Status: ${formatStatus(params.status)}`, clearTo: "all" });
    params.stores
        .filter((value) => value && value !== "all")
        .forEach((value) => chips.push({ key: "store", label: `Store: ${titleCase(value)}`, clearTo: "all", value }));
    if (params.country && params.country !== "all") chips.push({ key: "country", label: `Country: ${titleCase(params.country)}`, clearTo: "all" });
    if (params.rangeLabel) chips.push({ key: "range", label: `Date: ${params.rangeLabel}`, clearTo: "all" });
    if (params.fulfillment && params.fulfillment !== "all") chips.push({ key: "fulfillment", label: `Fulfillment: ${titleCase(params.fulfillment)}`, clearTo: "all" });
    if (params.payment && params.payment !== "all") chips.push({ key: "payment", label: `Payment: ${titleCase(params.payment)}`, clearTo: "all" });
    return chips;
}

function titleCase(value: string) {
    if (!value || value === "all") return "All";
    if (value === "usa") return "USA";
    if (value === "woocommerce") return "WooCommerce";
    return value
        .split("-")
        .map((chunk) => (chunk ? chunk.charAt(0).toUpperCase() + chunk.slice(1) : chunk))
        .join(" ");
}

function buildQuery(params: Record<string, string | string[] | undefined>) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return;
        if (Array.isArray(value)) {
            value.forEach((entry) => {
                if (!entry) return;
                if (entry === "all" && key !== "q") return;
                search.append(key, entry);
            });
            return;
        }
        if (value === "all" && key !== "q") return;
        search.set(key, value);
    });
    const query = search.toString();
    return query ? `?${query}` : "";
}

function formatDate(value: string | null | undefined) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function formatTime(value: string | null | undefined) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatCurrency(amount: number | null | undefined) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(amount || 0));
}

function formatStatus(value: string | null | undefined) {
    if (!value) return "Unknown";
    if (value === "CREATED") return "Draft";
    return value
        .toLowerCase()
        .split("_")
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(" ");
}

function statusTone(status: string | null | undefined): "neutral" | "warning" | "positive" | "info" {
    const normalized = (status || "").toUpperCase();
    if (["SHIPPED", "DELIVERED"].includes(normalized)) return "positive";
    if (["CANCELLED"].includes(normalized)) return "warning";
    if (["IN_PRODUCTION", "ROUTED_TO_VENDOR", "READY_TO_SHIP"].includes(normalized)) return "info";
    return "neutral";
}

function toStartOfDay(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
}

function toEndOfDay(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
}

function resolveRange(range: string | undefined, start: string | undefined, end: string | undefined) {
    if (!range || range === "all") return { label: undefined, start: undefined, end: undefined };
    const now = new Date();
    if (range === "custom") {
        return {
            label: buildCustomRangeLabel(start, end),
            start: start ? toStartOfDay(start) : undefined,
            end: end ? toEndOfDay(end) : undefined,
        };
    }
    const days = range === "last-7" ? 7 : range === "last-90" ? 90 : 30;
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);
    return {
        label: days === 7 ? "Last 7 Days" : days === 90 ? "Last 90 Days" : "Last 30 Days",
        start: toStartOfDay(startDate.toISOString()),
        end: toEndOfDay(now.toISOString()),
    };
}

function buildCustomRangeLabel(start: string | undefined, end: string | undefined) {
    if (start && end) return `${formatDate(start)} - ${formatDate(end)}`;
    if (start) return `From ${formatDate(start)}`;
    if (end) return `Until ${formatDate(end)}`;
    return "Custom";
}

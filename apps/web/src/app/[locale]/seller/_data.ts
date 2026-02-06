import { createClient } from "@/utils/supabase/server";
type OrderStatus = string;
type PaymentStatus = string;

type ProductRow = {
    id: string;
    name: string;
    sku: string;
    base_price?: number;
    inventory?: Array<{ quantity?: number }>;
};

export interface SellerDashboardData {
    orders: Array<{
        id: string;
        status: OrderStatus;
        total_amount: number;
        tracking_number: string | null;
        created_at: string;
        items_count: number;
    }>;
    inventory: Array<{
        id: string;
        name: string;
        sku: string;
        quantity: number;
        base_price?: number;
    }>;
    topProducts: Array<{
        product_id: string;
        name: string;
        sku: string;
        orders: number;
    }>;
    payments: Array<{
        id: string;
        amount: number;
        status: PaymentStatus;
        created_at: string;
    }>;
    paymentsTotals: {
        paid: number;
        pending: number;
    };
    lowStockCount: number;
}

import { api } from "@/services/api.service";

export async function getSellerDashboardData(token?: string): Promise<SellerDashboardData> {
    try {
        const res = await api.get<any>("/analytics/stats", token);

        if (!res.success || !res.data) {
            return emptyState();
        }

        const stats = res.data;

        // Map backend response to Frontend Interface
        return {
            orders: stats.recentOrders.map((o: any) => ({
                id: o.id,
                status: o.status,
                total_amount: o.totalAmount,
                tracking_number: o.trackingNumber,
                created_at: o.createdAt,
                items_count: o.itemsCount
            })),
            inventory: [], // This page primarily uses summary stats; detail inventory fetch separate
            topProducts: stats.topProducts.map((p: any) => ({
                product_id: p.id,
                name: p.name,
                sku: p.sku,
                orders: p.orderCount
            })),
            payments: stats.recentPayments.map((p: any) => ({
                id: p.id,
                amount: p.amount,
                status: p.status,
                created_at: p.createdAt
            })),
            paymentsTotals: {
                paid: stats.summary.revenue, // Simplified for now
                pending: 0
            },
            lowStockCount: stats.summary.lowStockCount,
        };
    } catch (error) {
        console.error("[Dashboard] Fetch failed:", error);
        return emptyState();
    }
}

export async function getSellerInventoryData() {
    const supabase = await createClient();
    const tenantId = await resolveTenantId(supabase);

    if (!tenantId) {
        return { tenantId: null, inventory: [] as SellerDashboardData["inventory"] };
    }

    const { data: productRows = [] } = await supabase
        .from("products")
        .select("id,name,sku,base_price,inventory(quantity)")
        .eq("tenant_id", tenantId)
        .limit(100);

    const inventory = (productRows as ProductRow[]).map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        base_price: p.base_price ? Number(p.base_price) : undefined,
        quantity: Array.isArray(p.inventory) && p.inventory[0]?.quantity ? Number(p.inventory[0].quantity) : 0,
    }));

    return { tenantId, inventory };
}

export async function resolveTenantId(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data: userRes } = await supabase.auth.getUser();
    const fromMeta = userRes.user?.user_metadata?.tenant_id || userRes.user?.app_metadata?.tenant_id;
    if (fromMeta) return fromMeta;
    const uid = userRes.user?.id;
    if (!uid) return null;
    const { data } = await supabase.from("users").select("tenant_id").eq("id", uid).single();
    return data?.tenant_id ?? null;
}

function emptyState(): SellerDashboardData {
    return {
        orders: [],
        inventory: [],
        topProducts: [],
        payments: [],
        paymentsTotals: { paid: 0, pending: 0 },
        lowStockCount: 0,
    };
}

import { createClient } from "@/utils/supabase/server";

type OrderStatus = string;
type PaymentStatus = string;

type OrderRow = {
    id: string;
    status: OrderStatus;
    total_amount: number;
    tracking_number: string | null;
    created_at: string;
    order_items?: Array<{ count?: number }>;
};

type PaymentRow = {
    id: string;
    amount: number;
    status: PaymentStatus;
    created_at: string;
};

type ProductRow = {
    id: string;
    name: string;
    sku: string;
    base_price?: number;
    inventory?: Array<{ quantity?: number }>;
};

type OrderItemRow = {
    product_id: string;
    products?: {
        name?: string;
        sku?: string;
        tenant_id?: string;
    } | null;
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

export async function getSellerDashboardData(): Promise<SellerDashboardData> {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const tenantId = userRes.user?.user_metadata?.tenant_id || userRes.user?.app_metadata?.tenant_id;

    if (!tenantId) {
        return emptyState();
    }

    // Orders with item counts
    const { data: orderRows = [] } = await supabase
        .from("orders")
        .select("id,status,total_amount,tracking_number,created_at,order_items(count)")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false })
        .limit(10);

    const orders = (orderRows as OrderRow[]).map((row) => ({
        id: row.id,
        status: row.status,
        total_amount: Number(row.total_amount ?? 0),
        tracking_number: row.tracking_number ?? null,
        created_at: row.created_at,
        items_count: Array.isArray(row.order_items) && row.order_items[0]?.count ? Number(row.order_items[0].count) : 0,
    }));

    // Payments
    const { data: paymentRows = [] } = await supabase
        .from("payments")
        .select("id,amount,status,created_at")
        .order("created_at", { ascending: false })
        .limit(20);

    const payments = (paymentRows as PaymentRow[]).map((p) => ({
        id: p.id,
        amount: Number(p.amount ?? 0),
        status: p.status ?? "PENDING",
        created_at: p.created_at,
    }));

    const paymentsTotals = payments.reduce(
        (acc, p) => {
            if ((p.status || "").toUpperCase() === "PAID") acc.paid += p.amount;
            else acc.pending += p.amount;
            return acc;
        },
        { paid: 0, pending: 0 },
    );

    // Inventory per product
    const { data: productRows = [] } = await supabase
        .from("products")
        .select("id,name,sku,base_price,inventory(quantity)")
        .eq("tenant_id", tenantId)
        .limit(50);

    const inventory = (productRows as ProductRow[]).map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        base_price: p.base_price ? Number(p.base_price) : undefined,
        quantity: Array.isArray(p.inventory) && p.inventory[0]?.quantity ? Number(p.inventory[0].quantity) : 0,
    }));

    const lowStockCount = inventory.filter((item) => item.quantity < 20).length;

    // Top products by order count (joins products through the foreign key)
    const { data: orderItems = [] } = await supabase
        .from("order_items")
        .select("product_id, products!inner(name,sku,tenant_id)")
        .eq("products.tenant_id", tenantId)
        .limit(200);

    const productAgg = new Map<string, { name: string; sku: string; orders: number }>();
    (orderItems as OrderItemRow[]).forEach((row) => {
        const pid = row.product_id;
        const name = row.products?.name ?? "";
        const sku = row.products?.sku ?? "";
        const current = productAgg.get(pid) || { name, sku, orders: 0 };
        current.orders += 1;
        productAgg.set(pid, current);
    });

    const topProducts = Array.from(productAgg.entries())
        .map(([product_id, info]) => ({ product_id, ...info }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 6);

    return {
        orders,
        inventory,
        topProducts,
        payments,
        paymentsTotals,
        lowStockCount,
    };
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

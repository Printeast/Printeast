import { createClient } from "@/utils/supabase/server";

type DesignRow = {
    id: string;
    status: string;
    prompt_text: string | null;
    image_url: string | null;
    created_at: string;
};

type PaymentRow = {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    order_id: string;
};

export interface CreatorDashboardData {
    designs: DesignRow[];
    ordersCount: number;
    payments: PaymentRow[];
    paymentsTotals: { paid: number; pending: number };
    liveDesigns: number;
    draftDesigns: number;
}

export async function getCreatorDashboardData(): Promise<{ userEmail: string; data: CreatorDashboardData }> {
    const supabase = await createClient();
    const userInfo = await resolveUser(supabase);

    if (!userInfo.userId) {
        return {
            userEmail: userInfo.email || "creator",
            data: emptyData(),
        };
    }

    const designs = await fetchDesigns(supabase, userInfo.userId, userInfo.tenantId);
    const { payments, ordersCount, paymentsTotals } = await fetchPaymentsForCreator(supabase, userInfo.userId);

    const liveDesigns = designs.filter((d) => (d.status || "").toUpperCase() !== "DRAFT").length;
    const draftDesigns = designs.filter((d) => (d.status || "").toUpperCase() === "DRAFT").length;

    return {
        userEmail: userInfo.email || "creator",
        data: {
            designs,
            ordersCount,
            payments,
            paymentsTotals,
            liveDesigns,
            draftDesigns,
        },
    };
}

export async function getCreatorPortfolioData() {
    const supabase = await createClient();
    const userInfo = await resolveUser(supabase);
    const designs = userInfo.userId ? await fetchDesigns(supabase, userInfo.userId, userInfo.tenantId) : [];
    return { userEmail: userInfo.email || "creator", designs };
}

export async function getCreatorEarningsData() {
    const supabase = await createClient();
    const userInfo = await resolveUser(supabase);
    const paymentsData = userInfo.userId ? await fetchPaymentsForCreator(supabase, userInfo.userId) : { payments: [], ordersCount: 0, paymentsTotals: { paid: 0, pending: 0 } };
    return { userEmail: userInfo.email || "creator", ...paymentsData };
}

async function fetchDesigns(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, tenantId: string | null): Promise<DesignRow[]> {
    const query = supabase
        .from("designs")
        .select("id,status,prompt_text,image_url,created_at")
        .eq("userId", userId)
        .order("created_at", { ascending: false })
        .limit(20);

    if (tenantId) query.eq("tenant_id", tenantId);

    const { data = [] } = await query;
    return data as DesignRow[];
}

async function fetchPaymentsForCreator(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
    // Find orders that include this creator's designs
    const { data: orderItems = [] } = await supabase
        .from("order_items")
        .select("order_id, designs!inner(userId)")
        .eq("designs.userId", userId)
        .limit(200);

    const orderIds = Array.from(new Set(orderItems.map((row: { order_id: string }) => row.order_id))).filter(Boolean);

    if (orderIds.length === 0) {
        return { payments: [], ordersCount: 0, paymentsTotals: { paid: 0, pending: 0 } };
    }

    const paymentsQuery = supabase
        .from("payments")
        .select("id,amount,status,created_at,order_id")
        .in("order_id", orderIds)
        .order("created_at", { ascending: false })
        .limit(50);

    // tenantId filter via orders join is not direct; rely on RLS or we can fetch orders to verify tenant if needed.
    const { data: paymentRows = [] } = await paymentsQuery;

    const payments = (paymentRows as PaymentRow[]).map((p) => ({
        ...p,
        amount: Number(p.amount || 0),
        status: p.status || "PENDING",
    }));

    const paymentsTotals = payments.reduce(
        (acc, p) => {
            if (p.status.toUpperCase() === "PAID") acc.paid += p.amount;
            else acc.pending += p.amount;
            return acc;
        },
        { paid: 0, pending: 0 },
    );

    return {
        payments,
        ordersCount: orderIds.length,
        paymentsTotals,
    };
}

async function resolveUser(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { data: userRes } = await supabase.auth.getUser();
    const email = userRes.user?.email || null;
    const userId = userRes.user?.id || null;
    const metaTenant = userRes.user?.user_metadata?.tenant_id || userRes.user?.app_metadata?.tenant_id;
    if (metaTenant || !userId) {
        return { userId, tenantId: metaTenant || null, email };
    }
    const { data } = await supabase.from("users").select("tenant_id").eq("id", userId).single();
    return { userId, tenantId: data?.tenant_id ?? null, email };
}

function emptyData(): CreatorDashboardData {
    return {
        designs: [],
        ordersCount: 0,
        payments: [],
        paymentsTotals: { paid: 0, pending: 0 },
        liveDesigns: 0,
        draftDesigns: 0,
    };
}

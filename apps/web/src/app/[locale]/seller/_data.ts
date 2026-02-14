
import { createClient, createAdminClient } from "@/utils/supabase/server";
import { api } from "@/services/api.service";

type OrderStatus = string;
type PaymentStatus = string;

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
        .select(`
            id,name,sku,base_price,
            category:categories(name),
            inventory(quantity),
            images,
            metadata,
            provider,
            description,
            tags
        `)
        .eq("tenant_id", tenantId)
        .limit(100);

    const inventory = ((productRows || []) as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        base_price: p.base_price ? Number(p.base_price) : undefined,
        quantity: Array.isArray(p.inventory) && p.inventory[0]?.quantity ? Number(p.inventory[0].quantity) : 0,
        images: Array.isArray(p.images) ? p.images : (p.metadata?.images || []),
        category: p.category?.name || p.metadata?.category || "General",
        provider: p.provider || p.metadata?.provider || "Printful",
        options: p.metadata?.options || {},
        tags: Array.isArray(p.tags) ? p.tags : (p.metadata?.tags || []),
        description: p.description || p.metadata?.description || ""
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

export async function getGlobalCatalog() {
    const supabase = await createAdminClient();

    // 1. Get the system tenant ID
    console.log("[getGlobalCatalog] Fetching system tenant 'printeast'...");
    const { data: tenants, error: tenantError } = await supabase
        .from("tenants")
        .select("id")
        .eq("slug", "printeast");

    if (tenantError) {
        console.error("[getGlobalCatalog] Tenant Fetch Error:", tenantError);
    }
    console.log("[getGlobalCatalog] Tenants found:", tenants);

    if (tenantError || !tenants || tenants.length === 0) {
        console.error("Error fetching system tenant 'printeast':", tenantError?.message || "Not found (Count: " + (tenants?.length || 0) + ")");
        return [];
    }

    const tenant = tenants[0];
    if (!tenant) return [];

    // 2. Fetch products for this tenant
    const { data: products } = await supabase
        .from("products")
        .select('*')
        .eq("tenant_id", tenant.id);

    // 3. Map to UI format with heuristics
    return (products || []).map(p => {
        // Heuristic for category since DB relation is missing
        // Heuristic for category since DB relation is missing
        let category = "General";
        const n = (p.name || "").toLowerCase();

        // Priority checks first (Specific > General)
        if (n.includes("kid") || n.includes("baby") || n.includes("toddler") || n.includes("youth") || n.includes("infant") || n.includes("bodysuit") || n.includes("onesie") || n.includes("bib")) {
            category = "Kids & Baby";
        } else if (n.includes("women") || n.includes("lady") || n.includes("ladies") || n.includes("girl") || n.includes("dress") || n.includes("skirt") || n.includes("bikini") || n.includes("crop")) {
            category = "Women's Clothing";
        } else if (n.includes("mug") || n.includes("bottle") || n.includes("tumbler") || n.includes("cup") || n.includes("glass") || n.includes("coaster")) {
            category = "Drinkware";
        } else if (n.includes("case") || n.includes("cover") || n.includes("iphone") || n.includes("samsung")) {
            category = "Phone Cases";
        } else if (n.includes("notebook") || n.includes("journal") || n.includes("sticker") || n.includes("calendar") || n.includes("card")) {
            category = "Stationery";
        } else if (n.includes("canvas") || n.includes("poster") || n.includes("print") || n.includes("framed")) {
            category = "Wall Art";
        } else if (n.includes("bag") || n.includes("tote") || n.includes("hat") || n.includes("cap") || n.includes("beanie") || n.includes("sock") || n.includes("apron") || n.includes("mouse pad") || n.includes("scarf")) {
            category = "Accessories";
        } else if (n.includes("shirt") || n.includes("hoodie") || n.includes("sweat") || n.includes("tank") || n.includes("polo") || n.includes("jacket") || n.includes("sleeve") || n.includes("men") || n.includes("unisex")) {
            category = "Men's Clothing"; // Default fallback for generic apparel
        }

        // Override if metadata has it
        if (p.metadata?.category) category = p.metadata.category;

        // Also cast category from "category" property if it somehow exists
        if ((p as any).category?.name) category = (p as any).category.name;

        // Consolidate images from various potential sources
        const images: string[] = [];
        if (Array.isArray((p as any).images)) images.push(...(p as any).images);
        if ((p as any).mockup_template_url) images.push((p as any).mockup_template_url);
        if (Array.isArray(p.metadata?.images)) images.push(...p.metadata.images);

        // Fallback to placeholder if still empty (though ProductCatalog handles this too)
        // We'll leave it empty to let ProductCatalog handle the fallback default

        return {
            id: p.id,
            sku: p.sku,
            name: p.name,
            basePrice: Number(p.base_price || p.basePrice || 0),
            description: p.description || p.metadata?.description || "",
            images: images,
            options: p.metadata?.options || {},
            provider: p.provider || p.metadata?.provider || "Printful",
            stockStatus: p.metadata?.stockStatus || "In Stock",
            tags: Array.isArray(p.tags) ? p.tags : (p.metadata?.tags || []),
            category: category,
            quantity: 999 // Global catalog items are always "in stock"
        };
    });
}


function generateDescription(name: string, category: string): string {
    const n = name.toLowerCase();

    if (category === "Drinkware") {
        if (n.includes("mug")) return "Sturdy and glossy ceramic mug, perfect for your morning coffee or afternoon tea. Microwave and dishwasher safe.";
        if (n.includes("bottle")) return "Durable stainless steel water bottle to keep your drinks hot or cold for hours. Leak-proof and stylish.";
        if (n.includes("tumbler")) return "Premium insulated tumbler that fits in most car cup holders. Keeps beverages at the perfect temperature.";
        return "High-quality drinkware item, durable and perfect for custom printing.";
    }

    if (category === "Men's Clothing" || category === "Women's Clothing" || category === "Kids & Baby") {
        if (n.includes("hoodie")) return "Classic cozy hoodie featuring a soft interior and double-lined hood. Perfect for cooler evenings.";
        if (n.includes("sweatshirt")) return "Soft and durable fleece sweatshirt with double-needle stitched fleece for extra durability.";
        if (n.includes("tank")) return "Lightweight and breathable tank top, ideal for active lifestyles or warm weather.";
        return "Premium cotton-blend apparel designed for comfort and durability. Features high-quality fabric suitable for direct-to-garment printing.";
    }

    if (category === "Wall Art") {
        if (n.includes("canvas")) return "Museum-quality canvas print, hand-stretched over a solid wood frame. Fade-resistant and ready to hang.";
        if (n.includes("poster")) return "High-quality poster printed on thick, durable matte paper. Adds a bold statement to any room.";
        return "Premium wall art printed on high-quality materials to ensure vibrant colors and longevity.";
    }

    if (category === "Phone Cases") {
        return "Slim and protective phone case made of durable polycarbonate. Supports wireless charging and protects against drops and scratches.";
    }

    if (category === "Stationery") {
        if (n.includes("notebook")) return "Custom spiral notebook with ruled line paper. Great for jotting down notes, ideas, or sketches.";
        return "High-quality stationery item perfect for office or personal use.";
    }

    if (category === "Accessories") {
        if (n.includes("tote")) return "Spacious and sturdy tote bag, perfect for groceries, books, or beach essentials.";
        if (n.includes("hat") || n.includes("cap")) return "Stylish and comfortable headwear with an adjustable strap for the perfect fit.";
        return "Versatile accessory made from quality materials.";
    }

    return "High-quality product ready for your custom design. Made from premium materials for the best printing results.";
}

export async function getProductById(productId: string) {
    const supabase = await createAdminClient();

    const { data: product, error } = await supabase
        .from("products")
        .select(`*`)
        .eq("id", productId)
        .single();

    if (error || !product) {
        console.error("[getProductById] Error:", error);
        return null;
    }

    // Reuse similar mapping logic (could be extracted to a helper)
    let category = "General";
    const n = (product.name || "").toLowerCase();

    // Priority checks
    if (n.includes("kid") || n.includes("baby") || n.includes("toddler") || n.includes("youth") || n.includes("infant") || n.includes("bodysuit") || n.includes("onesie") || n.includes("bib")) {
        category = "Kids & Baby";
    } else if (n.includes("women") || n.includes("lady") || n.includes("ladies") || n.includes("girl") || n.includes("dress") || n.includes("skirt") || n.includes("bikini") || n.includes("crop")) {
        category = "Women's Clothing";
    } else if (n.includes("mug") || n.includes("bottle") || n.includes("tumbler") || n.includes("cup") || n.includes("glass") || n.includes("coaster")) {
        category = "Drinkware";
    } else if (n.includes("case") || n.includes("cover") || n.includes("iphone") || n.includes("samsung")) {
        category = "Phone Cases";
    } else if (n.includes("notebook") || n.includes("journal") || n.includes("sticker") || n.includes("calendar") || n.includes("card")) {
        category = "Stationery";
    } else if (n.includes("canvas") || n.includes("poster") || n.includes("print") || n.includes("framed")) {
        category = "Wall Art";
    } else if (n.includes("bag") || n.includes("tote") || n.includes("hat") || n.includes("cap") || n.includes("beanie") || n.includes("sock") || n.includes("apron") || n.includes("mouse pad") || n.includes("scarf")) {
        category = "Accessories";
    } else if (n.includes("shirt") || n.includes("hoodie") || n.includes("sweat") || n.includes("tank") || n.includes("polo") || n.includes("jacket") || n.includes("sleeve") || n.includes("men") || n.includes("unisex")) {
        category = "Men's Clothing";
    }

    if (product.metadata?.category) category = product.metadata.category;
    if ((product as any).category?.name) category = (product as any).category.name;

    const images: string[] = [];
    if (Array.isArray((product as any).images)) images.push(...(product as any).images);
    if ((product as any).mockup_template_url) images.push((product as any).mockup_template_url);
    if (Array.isArray(product.metadata?.images)) images.push(...product.metadata.images);

    return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        basePrice: Number(product.base_price || product.basePrice || 0),
        description: (product as any).description || product.metadata?.description || generateDescription(product.name, category),
        images: images,
        options: product.metadata?.options || {},
        provider: product.provider || product.metadata?.provider || "Printful",
        stockStatus: product.metadata?.stockStatus || "In Stock",
        tags: Array.isArray(product.tags) ? product.tags : (product.metadata?.tags || []),
        category: category,
        quantity: 999 // Global catalog items are always "in stock"
    };
}

export async function getProductCategories() {
    const supabase = await createAdminClient();
    // Fetch categories that belong to the system tenant (or current context tenant)
    // For now assuming printeast system tenant categories are global
    const { data: tenants } = await supabase.from("tenants").select("id").eq("slug", "printeast");
    if (!tenants || tenants.length === 0) return [];

    const tenant = tenants[0];
    if (!tenant) return [];

    const { data } = await supabase
        .from("categories")
        .select("name")
        .eq("tenant_id", tenant.id)
        .order("name");

    return (data || []).map(c => c.name);
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

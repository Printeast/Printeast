import { createClient } from "@/utils/supabase/server";
import { getGlobalCatalog, getProductCategories, getSellerInventoryData } from "../../seller/_data";
import { SellerInventoryClient } from "../../seller/inventory/_client";

export default async function CustomerInventoryPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "individual";

    // 1. Try to get user-specific inventory first (if they are a seller/creator)
    let { tenantId, inventory } = await getSellerInventoryData();
    let categories = await getProductCategories();

    // 2. Fallback to global catalog if user has no products
    if (!inventory || inventory.length === 0) {
        inventory = await getGlobalCatalog();
    }

    return (
        <SellerInventoryClient
            userEmail={userEmail}
            tenantId={tenantId}
            initialInventory={inventory}
            categories={categories}
            role="CUSTOMER"
            basePath="/customer"
        />
    );
}

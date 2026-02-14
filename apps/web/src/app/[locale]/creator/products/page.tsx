import { createClient } from "@/utils/supabase/server";
import { getSellerInventoryData, getGlobalCatalog, getProductCategories } from "../../seller/_data";
import { InventoryClient } from "../../seller/inventory/_client";

export default async function CreatorProductsPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "creator";

    // Reuse seller logic to fetch inventory
    // This works if creators store products in the same 'products' table with a tenant_id
    // If not, it falls back to global catalog (blanks)
    const { tenantId, inventory } = await getSellerInventoryData();

    // If inventory is empty, show GLOBAL CATALOG so user can browse blanks
    const globalCatalog = await getGlobalCatalog();
    const categories = await getProductCategories();

    // Fallback logic
    const displayInventory = inventory && inventory.length > 0 ? inventory : globalCatalog;

    return (
        <InventoryClient
            userEmail={userEmail}
            tenantId={tenantId}
            initialInventory={displayInventory}
            categories={categories}
            role="CREATOR"
            basePath="/creator"
        />
    );
}

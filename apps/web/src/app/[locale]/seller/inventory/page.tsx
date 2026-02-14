import { createClient } from "@/utils/supabase/server";
import { getSellerInventoryData, getGlobalCatalog, getProductCategories } from "../_data";
import { SellerInventoryClient } from "./_client";

export default async function SellerInventoryPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";

    const { tenantId, inventory } = await getSellerInventoryData();

    // If inventory is empty, show GLOBAL CATALOG so user can browse blanks
    // This replaces the generic MOCK_INVENTORY with real seeded products
    const globalCatalog = await getGlobalCatalog();
    const categories = await getProductCategories();

    // Fallback logic
    const displayInventory = inventory && inventory.length > 0 ? inventory : globalCatalog;

    return <SellerInventoryClient userEmail={userEmail} tenantId={tenantId} initialInventory={displayInventory} categories={categories} />;
}

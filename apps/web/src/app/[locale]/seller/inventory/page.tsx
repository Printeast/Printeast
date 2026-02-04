import { createClient } from "@/utils/supabase/server";
import { getSellerInventoryData } from "../_data";
import { SellerInventoryClient } from "./_client";

export default async function SellerInventoryPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";

    const { tenantId, inventory } = await getSellerInventoryData();

    return <SellerInventoryClient userEmail={userEmail} tenantId={tenantId} initialInventory={inventory} />;
}

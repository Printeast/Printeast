import { createClient } from "@/utils/supabase/server";
import { getSellerInventoryData } from "../../seller/_data";
import { SellerInventoryClient } from "../../seller/inventory/_client";

export default async function CreatorInventoryPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "creator";

    const { tenantId, inventory } = await getSellerInventoryData();

    return (
        <SellerInventoryClient 
            userEmail={userEmail} 
            tenantId={tenantId} 
            initialInventory={inventory} 
            role="CREATOR"
        />
    );
}

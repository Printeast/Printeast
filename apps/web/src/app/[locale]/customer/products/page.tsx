import { createClient } from "@/utils/supabase/server";
<<<<<<< HEAD
import { getSellerInventoryData } from "../seller/_data";
import { SellerInventoryClient } from "../seller/inventory/_client";
=======
import { getSellerInventoryData } from "../../seller/_data";
import { SellerInventoryClient } from "../../seller/inventory/_client";
>>>>>>> 4b8b864 (Improve templates filters, inventory defaults, creator branding; resolve slow rendering)

export default async function CustomerInventoryPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "individual";

    const { tenantId, inventory } = await getSellerInventoryData();

    return (
        <SellerInventoryClient 
            userEmail={userEmail} 
            tenantId={tenantId} 
            initialInventory={inventory} 
            role="CUSTOMER"
        />
    );
}

import { createClient } from "@/utils/supabase/server";
import { getSellerInventoryData } from "../_data";
import { SellerInventoryClient } from "./_client";

export default async function SellerInventoryPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";

    const { tenantId, inventory } = await getSellerInventoryData();

    // Mock data for display when inventory is empty
    const MOCK_INVENTORY: any[] = [
        {
            id: "mock-1",
            name: "Unisex Heavy Blend™ Crewneck Sweatshirt",
            sku: "GLDN-18000-BLK-L",
            quantity: 45,
            base_price: 32.99,
            category: "Men's clothing",
            status: "In Stock"
        },
        {
            id: "mock-2",
            name: "Premium Fine Art Matte Paper",
            sku: "ART-MATTE-18x24",
            quantity: 12,
            base_price: 24.50,
            category: "Wall art",
            status: "Low Stock"
        },
        {
            id: "mock-3",
            name: "Stainless Steel Water Bottle",
            sku: "BOTTLE-500ML-SLV",
            quantity: 85,
            base_price: 28.00,
            category: "Mugs & Bottle",
            status: "In Stock"
        },
        {
            id: "mock-4",
            name: "Classic Dad Hat",
            sku: "HAT-NVY-OS",
            quantity: 120,
            base_price: 18.99,
            category: "Hats",
            status: "In Stock"
        },
        {
            id: "mock-5",
            name: "Organic Cotton Tote Bag",
            sku: "TOTE-ORG-NAT",
            quantity: 0,
            base_price: 14.50,
            category: "Tote Bags",
            status: "Out of Stock"
        }
    ];

    const displayInventory = inventory && inventory.length > 0 ? inventory : MOCK_INVENTORY;

    return <SellerInventoryClient userEmail={userEmail} tenantId={tenantId} initialInventory={displayInventory} />;
}

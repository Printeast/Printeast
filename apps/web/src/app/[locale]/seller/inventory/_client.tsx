"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProductCatalog, ProductCard } from "@/components/dashboard/product-catalog";

import { Role } from "@repo/types";

interface InventoryClientProps {
    userEmail: string;
    tenantId: string | null;
    initialInventory: any[];
    categories?: string[];
    role?: Role;
    basePath?: string;
}

export function InventoryClient({
    userEmail,
    initialInventory,
    categories,
    role = "SELLER",
    basePath = "/seller"
}: InventoryClientProps) {
    const router = useRouter();

    // Map inventory data to ProductCard format
    const products: ProductCard[] = useMemo(() => {
        return initialInventory.map((item) => ({
            id: item.id,
            name: item.name || "Untitled Product",
            sku: item.sku || "",
            basePrice: item.basePrice || item.base_price || 0,
            description: item.description || "",
            images: item.images || [],
            options: item.options || {},
            provider: item.provider || "System",
            stockStatus: item.stockStatus || (item.quantity > 0 ? "In Stock" : "Out of Stock"),
            tags: item.tags || [],
            category: item.category || "General"
        }));
    }, [initialInventory]);

    const handleProductSelect = (productId: string) => {
        router.push(`${basePath}/products/${productId}`);
    };

    return (
        <DashboardLayout user={{ email: userEmail || "user", role }} fullBleed>
            {/* 
                Reusing the unified ProductCatalog component.
                Differences from Wizard:
                1. Wrapped in DashboardLayout (Sidebars visible)
                2. On click goes to product details instead of wizard
            */}
            <ProductCatalog
                initialProducts={products}
                onProductSelect={handleProductSelect}
                categories={categories || []}
            />
        </DashboardLayout>
    );
}

// Backwards compatibility alias
export { InventoryClient as SellerInventoryClient };

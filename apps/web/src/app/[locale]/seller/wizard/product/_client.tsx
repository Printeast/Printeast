"use client";

import { ProductCatalog, ProductCard } from "@/components/dashboard/product-catalog";

export function WizardCatalogClient({ initialProducts, categories }: { initialProducts?: ProductCard[], categories?: string[] }) {
    return <ProductCatalog initialProducts={initialProducts} categories={categories || []} />;
}

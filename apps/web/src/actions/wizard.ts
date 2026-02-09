"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
// @ts-ignore
import { prisma } from "@repo/database";

// Helper to ensure tenant exists
async function ensureTenant(userId: string) {
    let userData = await prisma.user.findUnique({
        where: { id: userId },
        select: { tenantId: true }
    });

    let tenantId = userData?.tenantId;

    if (!tenantId) {
        console.log("No tenant found for user, provisioning new tenant via Prisma...");
        try {
            const newTenant = await prisma.tenant.create({
                data: {
                    name: "My Store",
                    slug: `store-${userId.slice(0, 8)}`,
                    tier: "FREE"
                }
            });

            tenantId = newTenant.id;

            await prisma.user.update({
                where: { id: userId },
                data: { tenantId: tenantId }
            });

        } catch (prismaError) {
            console.error("Prisma provisioning error:", prismaError);
            throw new Error("Failed to provision tenant via Prisma");
        }
    }
    return tenantId;
}

export async function saveWizardTemplate(state: any) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const tenantId = await ensureTenant(user.id);

        await prisma.design.create({
            data: {
                tenantId: tenantId!,
                userId: user.id,
                promptText: state.product?.title || "Untitled Template",
                imageUrl: state.design?.previewUrl || "https://placehold.co/600x400?text=No+Preview",
                designData: state,
                status: "TEMPLATE",
                previewUrl: state.design?.previewUrl
            }
        });

        revalidatePath("/seller/templates");
        return { success: true };
    } catch (error) {
        console.error("Save template error:", error);
        return { success: false, error: "Failed to save template" };
    }
}

export async function publishWizardProduct(state: any) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const tenantId = await ensureTenant(user.id);

        // Determine base price from variants or default
        let basePrice = 20.00;
        const prices = Object.values(state.variants?.prices || {}) as any[];
        if (prices.length > 0) {
            // Find minimum retail price
            const minPrice = Math.min(...prices.map(p => Number(p.retail || 0)));
            if (minPrice > 0) basePrice = minPrice;
        }

        // 1. Create Product
        const product = await prisma.product.create({
            data: {
                tenantId: tenantId!,
                name: state.product?.title || "Untitled Product",
                basePrice: basePrice,
                sku: `PROD-${Date.now()}`,
                metadata: state, // Store full wizard state as metadata
                printArea: state.design?.state, // Store canvas JSON if needed specifically
                mockupTemplateUrl: state.design?.previewUrl
            }
        });

        // 2. Create Variants
        // We iterate over selected variants if present, or create a default one
        const selectedVariants = state.variants?.selected || [];

        if (selectedVariants.length > 0) {
            for (const variantId of selectedVariants) {
                // Fetch variant details or assume standard naming based on ID (e.g. "gildan-5000-black-L")
                // For MVP, we just create records using the ID as SKU
                const variantPrice = state.variants?.prices?.[variantId]?.retail || basePrice;

                await prisma.productVariant.create({
                    data: {
                        productId: product.id,
                        name: variantId, // e.g. "Black / L"
                        sku: `${product.sku}-${variantId}`,
                        price: variantPrice,
                        inventory: 100, // Default infinite inventory for POD
                        metadata: { sourceVariantId: variantId }
                    }
                });
            }
        } else {
            // Create at least one default variant
            await prisma.productVariant.create({
                data: {
                    productId: product.id,
                    name: "Standard",
                    sku: `${product.sku}-STD`,
                    price: product.basePrice,
                    inventory: 100
                }
            });
        }

        // 3. Create Design Entry as well (Published Status)
        await prisma.design.create({
            data: {
                tenantId: tenantId!,
                userId: user.id,
                promptText: state.product?.title || "Published Product Design",
                imageUrl: state.design?.previewUrl || "https://placehold.co/600x400?text=No+Preview",
                designData: state,
                status: "PUBLISHED",
                previewUrl: state.design?.previewUrl
            }
        });

        revalidatePath("/seller/inventory");
        revalidatePath("/seller/templates");

        return { success: true, productId: product.id };
    } catch (error) {
        console.error("Publish product error:", error);
        return { success: false, error: "Failed to publish product" };
    }
}

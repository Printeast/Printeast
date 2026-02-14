
import { prisma } from "@repo/database";

async function main() {
    console.log("Starting smart description update...");

    // Fetch products with category information
    const products = await prisma.product.findMany({
        include: {
            category: true
        }
    });

    console.log(`Found ${products.length} products to process.`);

    let updatedCount = 0;

    for (const product of products) {
        // Generate a smart description based on available data
        const description = generateDescription(product);

        await prisma.product.update({
            where: { id: product.id },
            data: { description: description || null }
        });

        updatedCount++;
    }

    console.log(`Successfully updated descriptions for ${updatedCount} products.`);
}

function generateDescription(product: any) {
    const name = product.name;
    const categoryName = product.category?.name || "Apparel";
    const provider = product.provider || "Printeast";

    // Feature extraction from tags
    const tags = product.tags || [];
    const features = tags.length > 0
        ? ` Key features include: ${tags.join(", ")}.`
        : "";

    // Base template selection (can be randomized or based on category)
    const templates = [
        `Elevate your style with the ${name}. Sourced from ${provider}, this premium item from our ${categoryName} collection is designed for durability and comfort.${features} Perfect for custom designs or everyday wear.`,
        `Discover the ${name}, a standout piece in our ${categoryName} lineup. Crafted with care by ${provider}, it offers a perfect blend of quality and functionality.${features} Make it yours today.`,
        `The ${name} represents the best of ${categoryName}. Sourced from ${provider}, this product ensures satisfaction with every use.${features} Ideal for personalization and branding.`
    ];

    // Simple deterministic choice based on name length to vary descriptions
    const templateIndex = name.length % templates.length;
    return templates[templateIndex];
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

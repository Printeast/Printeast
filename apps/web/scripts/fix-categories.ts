
import { prisma } from "@repo/database";

async function main() {
    console.log("Starting category fix...");

    // 1. Get default tenant
    let tenant = await prisma.tenant.findFirst({ where: { slug: "printeast" } });
    if (!tenant) {
        console.log("Tenant 'printeast' not found, using first available tenant.");
        tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            console.error("No tenant found. Please verify DB state.");
            return;
        }
    }
    const tenantId = tenant.id;
    console.log(`Using tenant: ${tenant.name} (${tenantId})`);

    // 2. Define standard categories and create if missing
    const standardCats = [
        "Men's Clothing", "Women's Clothing", "Kids & Baby", "Accessories",
        "Home & Living", "Drinkware", "Wall Art", "Phone Cases", "Stationery", "General"
    ];

    const categoryMap: Record<string, string> = {};

    for (const name of standardCats) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        let cat = await prisma.category.findFirst({
            where: { tenantId, slug }
        });

        if (!cat) {
            // Check based on name if slug logic differs
            cat = await prisma.category.findFirst({
                where: { tenantId, name }
            });
        }

        if (!cat) {
            cat = await prisma.category.create({
                data: {
                    name,
                    slug,
                    tenantId
                }
            });
            console.log(`Created category: ${name}`);
        }
        categoryMap[name] = cat.id;
    }

    // 3. Link unlinked products
    const products = await prisma.product.findMany({
        where: { categoryId: null }
    });

    console.log(`Found ${products.length} products without category.`);

    let updatedCount = 0;
    for (const p of products) {
        const nameLower = p.name.toLowerCase();
        let targetCatName = "General";

        if (nameLower.includes("shirt") || nameLower.includes("hoodie") || nameLower.includes("sweat") || nameLower.includes("jacket") || nameLower.includes("tee")) {
            if (nameLower.includes("women") || nameLower.includes("lady") || nameLower.includes("girl") || nameLower.includes("her")) {
                targetCatName = "Women's Clothing";
            } else if (nameLower.includes("kid") || nameLower.includes("baby") || nameLower.includes("youth") || nameLower.includes("toddler")) {
                targetCatName = "Kids & Baby";
            } else {
                targetCatName = "Men's Clothing";
            }
        } else if (nameLower.includes("mug") || nameLower.includes("bottle") || nameLower.includes("tumbler") || nameLower.includes("cup") || nameLower.includes("glass")) {
            targetCatName = "Drinkware";
        } else if (nameLower.includes("poster") || nameLower.includes("canvas") || nameLower.includes("print") || nameLower.includes("framed")) {
            targetCatName = "Wall Art";
        } else if (nameLower.includes("phone") || nameLower.includes("case") || nameLower.includes("iphone") || nameLower.includes("samsung")) {
            targetCatName = "Phone Cases";
        } else if (nameLower.includes("bag") || nameLower.includes("hat") || nameLower.includes("cap") || nameLower.includes("beanie") || nameLower.includes("totebag") || nameLower.includes("mask") || nameLower.includes("apron")) {
            targetCatName = "Accessories";
        } else if (nameLower.includes("notebook") || nameLower.includes("journal") || nameLower.includes("sticker") || nameLower.includes("pen")) {
            targetCatName = "Stationery";
        } else if (nameLower.includes("pillow") || nameLower.includes("blanket") || nameLower.includes("towel")) {
            targetCatName = "Home & Living";
        }

        const catId = categoryMap[targetCatName];
        if (catId) {
            await prisma.product.update({
                where: { id: p.id },
                data: { categoryId: catId }
            });
            updatedCount++;
        }
    }
    console.log(`Linked ${updatedCount} products to categories.`);
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

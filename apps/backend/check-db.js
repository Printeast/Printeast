
const { PrismaClient } = require('@repo/database');
const prisma = new PrismaClient();

async function checkDesigns() {
    try {
        console.log("Checking designs in DB...");
        const designs = await prisma.design.findMany();
        console.log(`Found ${designs.length} designs.`);
        if (designs.length > 0) {
            console.log("First 3 designs:");
            console.log(JSON.stringify(designs.slice(0, 3), null, 2));
        }

        console.log("Checking users...");
        const users = await prisma.user.findMany();
        console.log(`Found ${users.length} users.`);
        if (users.length > 0) {
            console.log("First user:", JSON.stringify(users[0], null, 2));
        }

        console.log("Checking tenants...");
        const tenants = await prisma.tenant.findMany();
        console.log(`Found ${tenants.length} tenants.`);
        console.log(JSON.stringify(tenants, null, 2));

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDesigns();

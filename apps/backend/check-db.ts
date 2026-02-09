
import { prisma } from '@repo/database';

async function checkDesigns() {
    try {
        console.log("Checking specific user...");
        const targetUserId = "edcb0580-0f6e-4c88-8450-5f000a17f4da";
        const user = await prisma.user.findUnique({
            where: { id: targetUserId }
        });
        console.log(`User ${targetUserId}:`, user ? "Found" : "Not Found");
        if (user) {
            console.log("Email:", user.email);
            console.log("Tenant:", user.tenantId);
        } else {
            console.log("This user ID exists in Designs but NOT in Users table?");
        }

        const allUsers = await prisma.user.findMany();
        console.log("Total users in DB:", allUsers.length);
        allUsers.forEach(u => console.log(`User: ${u.id} - ${u.email}`));

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkDesigns();

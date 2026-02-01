const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const roles = [
        { name: 'ADMIN', permissions: { all: true } },
        { name: 'TENANT_ADMIN', permissions: { manage_tenant: true } },
        { name: 'SELLER', permissions: { manage_products: true, manage_orders: true } },
        { name: 'CREATOR', permissions: { create_designs: true } },
        { name: 'CUSTOMER', permissions: { buy_products: true } },
    ];

    console.log('Seeding roles...');

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: { permissions: role.permissions },
            create: { name: role.name, permissions: role.permissions },
        });
    }

    console.log('Seeding default tenant...');
    const defaultTenant = await prisma.tenant.upsert({
        where: { slug: 'printeast' },
        update: {},
        create: {
            name: 'Printeast Main',
            slug: 'printeast',
            tier: 'FREE'
        }
    });

    console.log('Default Tenant ID:', defaultTenant.id);
    console.log('Roles and Tenant seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

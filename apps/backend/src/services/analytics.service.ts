import { prisma } from "../config/prisma";

export class AnalyticsService {
    /**
     * Calculates high-level dashboard metrics.
     * NOTE: This query can be heavy. It IS INTENDED to be cached by the Redis Middleware.
     */
    async getSellerStats(tenantId: string) {
        // Parallelize queries for extreme performance
        const [ordersAgg, products, topProductGroups, lowStock, recentOrders, recentPayments, paymentsAgg] = await Promise.all([
            // 1. Core Summary Stats
            prisma.order.aggregate({
                where: { tenantId },
                _sum: { totalAmount: true },
                _count: { id: true },
            }),
            // 2. Product Count
            prisma.product.count({
                where: { tenantId },
            }),
            // 3. Top Variants (By item order count)
            prisma.orderItem.groupBy({
                by: ["variantId"],
                where: { order: { tenantId } },
                _count: { id: true },
                orderBy: { _count: { id: "desc" } },
                take: 5,
            }),
            // 4. Low Stock Check
            prisma.inventory.count({
                where: { variant: { product: { tenantId } }, quantity: { lt: 20 } },
            }),
            // 5. Recent Orders
            prisma.order.findMany({
                where: { tenantId },
                orderBy: { createdAt: "desc" },
                take: 7,
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    trackingNumber: true,
                    createdAt: true,
                    buyer: { select: { email: true } },
                    _count: { select: { items: true } }
                }
            }),
            // 6. Recent Payments
            prisma.payment.findMany({
                where: { order: { tenantId } },
                orderBy: { createdAt: "desc" },
                take: 10,
                select: { id: true, amount: true, status: true, createdAt: true, orderId: true }
            }),
            // 7. Payments Aggregation (Paid vs Pending)
            prisma.payment.groupBy({
                by: ["status"],
                where: { order: { tenantId } },
                _sum: { amount: true }
            })
        ]);

        // Fetch details for top variants
        const topVariantDetails = await prisma.productVariant.findMany({
            where: { id: { in: topProductGroups.map(p => p.variantId) } },
            select: {
                id: true,
                name: true,
                sku: true,
                product: { select: { name: true } }
            }
        });

        const paidPayments = paymentsAgg.find(p => p.status === 'PAID')?._sum.amount?.toNumber() || 0;
        const totalPayments = paymentsAgg.reduce((sum, p) => sum + (p._sum.amount?.toNumber() || 0), 0);

        return {
            summary: {
                revenue: ordersAgg._sum.totalAmount?.toNumber() || 0,
                orders: ordersAgg._count.id,
                products: products,
                lowStockCount: lowStock,
                paidAmount: paidPayments,
                pendingAmount: totalPayments - paidPayments,
                aov: ordersAgg._count.id ? (ordersAgg._sum.totalAmount?.toNumber() || 0) / ordersAgg._count.id : 0
            },
            recentOrders: recentOrders.map(o => ({
                id: o.id,
                status: o.status,
                totalAmount: o.totalAmount.toNumber(),
                trackingNumber: o.trackingNumber,
                createdAt: o.createdAt.toISOString(),
                buyerEmail: (o.buyer as any)?.email || 'Guest',
                itemsCount: o._count.items
            })),
            recentPayments: recentPayments.map(p => ({
                id: p.id,
                orderId: p.orderId,
                amount: p.amount.toNumber(),
                status: p.status,
                createdAt: p.createdAt.toISOString()
            })),
            topProducts: topVariantDetails.map(v => ({
                id: v.id,
                name: `${v.product.name} (${v.name})`,
                sku: v.sku,
                orderCount: topProductGroups.find(tp => tp.variantId === v.id)?._count.id || 0
            })),
            currency: "USD",
        };
    }

    async getRevenueChart(tenantId: string) {
        // Return dummy chart data for now
        return [
            { date: "Mon", amount: 1200 },
            { date: "Tue", amount: 1900 },
            { date: "Wed", amount: 1500 },
            { date: "Thu", amount: 2400 },
            { date: "Fri", amount: 2100 },
            { date: "Sat", amount: 1800 },
            { date: "Sun", amount: 2200 },
        ];
    }
}

export const analyticsService = new AnalyticsService();

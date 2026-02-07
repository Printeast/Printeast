import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export class OrderService {
    async getSellerOrders(tenantId: string, filters: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }) {
        const { page = 1, limit = 50, status, search } = filters;
        const skip = (page - 1) * limit;

        const where: any = { tenantId };

        if (status && status !== "all") {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { buyer: { email: { contains: search, mode: 'insensitive' } } }
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    buyer: {
                        select: { email: true }
                    },
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: {
                                        select: { name: true, mockupTemplateUrl: true }
                                    }
                                }
                            },
                            design: {
                                select: { previewUrl: true, imageUrl: true }
                            }
                        }
                    }
                }
            }) as any,
            prisma.order.count({ where })
        ]);

        return {
            orders: orders.map((o: any) => ({
                id: o.id,
                status: o.status,
                totalAmount: o.totalAmount?.toNumber() ?? 0,
                createdAt: o.createdAt.toISOString(),
                buyer: {
                    email: o.buyer?.email ?? "Unknown",
                    fullName: o.buyer?.email ?? "Unknown"
                },
                items: (o.items || []).map((item: any) => {
                    const product = item.variant?.product;
                    const design = item.design;
                    // Robust image fallback chain: Generated Preview -> Uploaded Design -> Product Template -> Placeholder
                    const mainImage = design?.previewUrl || design?.imageUrl || product?.mockupTemplateUrl || null;

                    return {
                        id: item.id,
                        productName: product?.name || design?.promptText || "Custom Product",
                        variantName: item.variant?.name || "Standard",
                        priceAtTime: item.priceAtTime?.toNumber() ?? 0,
                        quantity: item.quantity ?? 1,
                        imageUrl: mainImage
                    };
                })
            })),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getOrderById(tenantId: string, orderId: string) {
        const order = await prisma.order.findFirst({
            where: { id: orderId, tenantId },
            include: {
                buyer: true,
                items: {
                    include: {
                        variant: { include: { product: true } },
                        design: true
                    }
                },
                payment: true
            }
        });

        if (!order) throw new AppError("Order not found", 404);
        return order;
    }
}

export const orderService = new OrderService();

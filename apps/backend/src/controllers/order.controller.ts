import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service";

export class OrderController {
    async getOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const tenantId = (req as any).tenantId;
            const { page, limit, status, q } = req.query;

            // Strict typing for exactOptionalPropertyTypes
            const filters: {
                page?: number;
                limit?: number;
                status?: string;
                search?: string;
            } = {};

            if (page) filters.page = parseInt(page as string);
            if (limit) filters.limit = parseInt(limit as string);
            if (status) filters.status = status as string;
            if (q) filters.search = q as string;

            const data = await orderService.getSellerOrders(tenantId, filters);

            res.json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    }

    async getOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const tenantId = (req as any).tenantId;
            const order = await orderService.getOrderById(tenantId, req.params.id as string);

            res.json({
                success: true,
                data: order
            });
        } catch (error) {
            next(error);
        }
    }
}

export const orderController = new OrderController();

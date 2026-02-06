import { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service";
import { AppError } from "../utils/app-error";

export class AnalyticsController {
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            // In IsolationMiddleware, we attach tenantId to req.user or req
            // Assuming req.user from AuthMiddleware
            const user = (req as any).user;

            if (!user || !user.tenantId) {
                // Fallback or Error
                return next(new AppError("Tenant Context Missing", 400));
            }

            const stats = await analyticsService.getSellerStats(user.tenantId);

            res.status(200).json({
                success: true,
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const analyticsController = new AnalyticsController();

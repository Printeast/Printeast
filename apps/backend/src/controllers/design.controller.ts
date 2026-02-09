import { Request, Response, NextFunction } from "express";
import { designService } from "../services/design.service";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * Helper to extract and validate auth user
 */
function getAuthUser(req: Request): { tenantId: string; userId: string } | null {
    const user = (req as AuthRequest).user;
    if (!user?.tenantId || !user?.userId) return null;
    return {
        tenantId: user.tenantId as string,
        userId: user.userId as string
    };
}

function getAuthTenant(req: Request): string | null {
    const user = (req as AuthRequest).user;
    if (!user?.tenantId) return null;
    return user.tenantId as string;
}

export class DesignController {
    /**
     * Create a new design
     * POST /api/v1/designs
     */
    async createDesign(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { designData, imageUrl, previewUrl, printFileUrl, status } = req.body;
            const auth = getAuthUser(req);

            if (!auth) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }

            const design = await designService.create({
                tenantId: auth.tenantId,
                userId: auth.userId,
                designData,
                imageUrl,
                previewUrl,
                printFileUrl,
                status,
            });

            res.status(201).json({
                success: true,
                data: design,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a design by ID
     * GET /api/v1/designs/:id
     */
    async getDesign(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const tenantId = getAuthTenant(req);

            if (!tenantId) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }

            const design = await designService.getById(id, tenantId as string);

            if (!design) {
                res.status(404).json({ success: false, message: "Design not found" });
                return;
            }

            res.status(200).json({
                success: true,
                data: design,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all designs for current user
     * GET /api/v1/designs
     */
    async getMyDesigns(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const auth = getAuthUser(req);
            const { status, limit, offset } = req.query;

            if (!auth) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }

            // Build filters with strict typing for exactOptionalPropertyTypes
            const filters: { status?: string; limit?: number; offset?: number } = {};
            if (status) filters.status = status as string;
            if (limit) filters.limit = parseInt(limit as string);
            if (offset) filters.offset = parseInt(offset as string);

            const designs = await designService.getByUser(auth.userId, auth.tenantId, filters);

            res.status(200).json({
                success: true,
                data: designs,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update a design
     * PUT /api/v1/designs/:id
     */
    async updateDesign(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const { designData, imageUrl, previewUrl, printFileUrl, status } = req.body;
            const auth = getAuthUser(req);

            if (!auth) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }

            const design = await designService.update(id, auth.tenantId, auth.userId, {
                designData,
                imageUrl,
                previewUrl,
                printFileUrl,
                status,
            });

            res.status(200).json({
                success: true,
                data: design,
            });
        } catch (error: any) {
            if (error.message?.includes("not found")) {
                res.status(404).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }

    /**
     * Delete a design
     * DELETE /api/v1/designs/:id
     */
    async deleteDesign(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const auth = getAuthUser(req);

            if (!auth) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }

            await designService.delete(id, auth.tenantId, auth.userId);
            res.status(204).send();
        } catch (error: any) {
            if (error.message?.includes("not found")) {
                res.status(404).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }

    /**
     * Get design templates
     * GET /api/v1/designs/templates
     */
    async getTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const tenantId = getAuthTenant(req);
            const { category, limit } = req.query;

            if (!tenantId) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }

            // Build filters with strict typing
            const filters: { category?: string; limit?: number } = {};
            if (category) filters.category = category as string;
            if (limit) filters.limit = parseInt(limit as string);

            const templates = await designService.getTemplates(tenantId as string, filters);

            res.status(200).json({
                success: true,
                data: templates,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Duplicate a design (use template)
     * POST /api/v1/designs/:id/duplicate
     */
    async duplicateDesign(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;
            const auth = getAuthUser(req);

            if (!auth) {
                res.status(401).json({ success: false, message: "Authentication required" });
                return;
            }

            const design = await designService.duplicate(id, auth.tenantId as string, auth.userId as string);

            res.status(201).json({
                success: true,
                data: design,
            });
        } catch (error: any) {
            if (error.message?.includes("not found")) {
                res.status(404).json({ success: false, message: error.message });
                return;
            }
            next(error);
        }
    }
}

export const designController = new DesignController();

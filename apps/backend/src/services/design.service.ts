import { prisma, Prisma } from "@repo/database";

export interface CreateDesignDto {
    tenantId: string;
    userId: string;
    designData?: Prisma.InputJsonValue | null;
    imageUrl?: string;
    previewUrl?: string | null;
    printFileUrl?: string | null;
    status?: string;
}

export interface UpdateDesignDto {
    designData?: Prisma.InputJsonValue | null;
    imageUrl?: string;
    previewUrl?: string | null;
    printFileUrl?: string | null;
    status?: string;
}

export class DesignService {
    /**
     * Create a new design
     */
    async create(data: CreateDesignDto) {
        return prisma.design.create({
            data: {
                tenantId: data.tenantId,
                userId: data.userId,
                designData: data.designData ?? Prisma.JsonNull,
                imageUrl: data.imageUrl || "",
                previewUrl: data.previewUrl ?? null,
                printFileUrl: data.printFileUrl ?? null,
                status: data.status || "DRAFT",
            },
        });
    }

    /**
     * Get a design by ID (with tenant isolation)
     */
    async getById(id: string, tenantId: string) {
        return prisma.design.findFirst({
            where: {
                id,
                tenantId,
            },
        });
    }

    /**
     * Get all designs for a user (with tenant isolation)
     */
    async getByUser(userId: string, tenantId: string, options?: { status?: string; limit?: number; offset?: number }) {
        return prisma.design.findMany({
            where: {
                userId,
                tenantId,
                ...(options?.status && { status: options.status }),
            },
            select: {
                id: true,
                status: true,
                createdAt: true,
                userId: true,
                imageUrl: true,
                previewUrl: true,
                // EXCLUDE huge designData JSON for list views
            },
            orderBy: { createdAt: "desc" },
            take: options?.limit || 20,
            skip: options?.offset || 0,
        });
    }

    /**
     * Update a design
     */
    async update(id: string, tenantId: string, userId: string, data: UpdateDesignDto) {
        // Verify ownership
        const existing = await prisma.design.findFirst({
            where: { id, tenantId, userId },
        });

        if (!existing) {
            throw new Error("Design not found or access denied");
        }

        const updateData: Prisma.DesignUpdateInput = {};
        if (data.designData !== undefined) updateData.designData = data.designData ?? Prisma.JsonNull;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.previewUrl !== undefined) updateData.previewUrl = data.previewUrl ?? null;
        if (data.printFileUrl !== undefined) updateData.printFileUrl = data.printFileUrl ?? null;
        if (data.status !== undefined) updateData.status = data.status;

        return prisma.design.update({
            where: { id },
            data: updateData,
        });
    }

    /**
     * Delete a design
     */
    async delete(id: string, tenantId: string, userId: string) {
        // Verify ownership
        const existing = await prisma.design.findFirst({
            where: { id, tenantId, userId },
        });

        if (!existing) {
            throw new Error("Design not found or access denied");
        }

        return prisma.design.delete({
            where: { id },
        });
    }

    /**
     * Get design templates (public/system templates)
     */
    async getTemplates(tenantId: string, options?: { category?: string; limit?: number }) {
        // For now, return designs marked as TEMPLATE status
        return prisma.design.findMany({
            where: {
                tenantId,
                status: "TEMPLATE",
            },
            orderBy: { createdAt: "desc" },
            take: options?.limit || 50,
        });
    }

    /**
     * Duplicate a design (for "use template" functionality)
     */
    async duplicate(sourceId: string, tenantId: string, newUserId: string) {
        const source = await prisma.design.findFirst({
            where: { id: sourceId, tenantId },
        });

        if (!source) {
            throw new Error("Source design not found");
        }

        return prisma.design.create({
            data: {
                tenantId,
                userId: newUserId,
                designData: source.designData ?? Prisma.JsonNull,
                imageUrl: source.imageUrl,
                previewUrl: source.previewUrl ?? null,
                status: "DRAFT",
            },
        });
    }
}

export const designService = new DesignService();

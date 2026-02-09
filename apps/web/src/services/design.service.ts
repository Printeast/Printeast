/**
 * Design Service - Frontend API client for Design Studio
 * Integrates with backend /api/v1/designs endpoints
 */

import { api } from "./api.service";

export interface DesignData {
    id?: string;
    tenantId?: string;
    userId?: string;
    designData: any; // Fabric.js canvas JSON
    imageUrl?: string;
    previewUrl?: string;
    printFileUrl?: string;
    status?: "DRAFT" | "ACTIVE" | "TEMPLATE" | "ARCHIVED";
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateDesignInput {
    designData: any;
    imageUrl?: string;
    previewUrl?: string;
    printFileUrl?: string;
    status?: string;
}

export interface UpdateDesignInput {
    designData?: any;
    imageUrl?: string;
    previewUrl?: string;
    printFileUrl?: string;
    status?: string;
}

class DesignService {
    /**
     * Create a new design
     */
    async create(data: CreateDesignInput) {
        return api.post<DesignData>("/designs", data);
    }

    /**
     * Get a design by ID
     */
    async getById(id: string) {
        return api.get<DesignData>(`/designs/${id}`);
    }

    /**
     * Get all designs for current user
     */
    async getMyDesigns(options?: { status?: string; limit?: number; offset?: number }) {
        const params = new URLSearchParams();
        if (options?.status) params.append("status", options.status);
        if (options?.limit) params.append("limit", options.limit.toString());
        if (options?.offset) params.append("offset", options.offset.toString());

        const queryString = params.toString();
        return api.get<DesignData[]>(`/designs${queryString ? `?${queryString}` : ""}`);
    }

    /**
     * Update a design
     */
    async update(id: string, data: UpdateDesignInput) {
        return api.put<DesignData>(`/designs/${id}`, data);
    }

    /**
     * Delete a design
     */
    async delete(id: string) {
        return api.delete(`/designs/${id}`);
    }

    /**
     * Get design templates
     */
    async getTemplates(options?: { category?: string; limit?: number }) {
        const params = new URLSearchParams();
        if (options?.category) params.append("category", options.category);
        if (options?.limit) params.append("limit", options.limit.toString());

        const queryString = params.toString();
        return api.get<DesignData[]>(`/designs/templates${queryString ? `?${queryString}` : ""}`);
    }

    /**
     * Duplicate a design (use as template)
     */
    async duplicate(id: string) {
        return api.post<DesignData>(`/designs/${id}/duplicate`, {});
    }

    /**
     * Auto-save design (debounced in component)
     */
    async autoSave(id: string, designData: any) {
        return this.update(id, { designData });
    }

    /**
     * Export design as image (generates preview)
     * This would typically call a separate endpoint or use client-side canvas export
     */
    async exportAsImage(canvas: any): Promise<string> {
        // Use Fabric.js toDataURL for client-side export
        if (!canvas) throw new Error("Canvas not available");
        return canvas.toDataURL({
            format: "png",
            quality: 1,
            multiplier: 2, // 2x resolution for print
        });
    }

    /**
     * Get signed URL for uploading design assets
     */
    async getUploadUrl(fileName: string) {
        return api.post<{ signedUrl: string; publicUrl: string }>("/storage/sign", { fileName });
    }
}

export const designService = new DesignService();

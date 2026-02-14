import { api } from "@/services/api.service";

export interface CreatorDashboardData {
    designs: Array<{
        id: string;
        name: string;
        image_url: string;
        status: string;
        created_at: string;
    }>;
    stats: {
        totalEarnings: number;
        activeDesigns: number;
        totalSales: number;
    };
}

export async function getCreatorDashboardData(token?: string): Promise<CreatorDashboardData> {
    try {
        const [designsRes, statsRes] = await Promise.all([
            api.get<any>("/designs", token),
            api.get<any>("/analytics/stats", token) // We can reuse stats or have a creator specific one
        ]);

        return {
            designs: (designsRes.data || []).map((d: any) => ({
                id: d.id,
                name: d.name || "Untitled Design",
                image_url: d.previewUrl || d.imageUrl || "",
                status: d.status || "Live",
                created_at: d.createdAt || new Date().toISOString()
            })),
            stats: {
                totalEarnings: statsRes.data?.summary?.revenue || 0,
                activeDesigns: (designsRes.data || []).length,
                totalSales: statsRes.data?.summary?.ordersCount || 0
            }
        };
    } catch (error) {
        console.error("[CreatorDashboard] Fetch failed:", error);
        return {
            designs: [],
            stats: { totalEarnings: 0, activeDesigns: 0, totalSales: 0 }
        };
    }
}

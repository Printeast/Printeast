import { api } from "@/services/api.service";

export interface CustomerDashboardData {
    recentOrders: Array<{
        id: string;
        status: string;
        total_amount: number;
        created_at: string;
    }>;
    stats: {
        totalOrders: number;
        activeOrders: number;
        rewardPoints: number;
    };
    trendingDesigns: Array<{
        id: string;
        name: string;
        image: string;
        category: string;
    }>;
}

export async function getCustomerDashboardData(token?: string): Promise<CustomerDashboardData> {
    try {
        const ordersRes = await api.get<any>("/orders", token);

        return {
            recentOrders: (ordersRes.data?.orders || []).slice(0, 5).map((o: any) => ({
                id: o.id,
                status: o.status,
                total_amount: o.totalAmount,
                created_at: o.createdAt
            })),
            stats: {
                totalOrders: ordersRes.data?.total || 0,
                activeOrders: (ordersRes.data?.orders || []).filter((o: any) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length,
                rewardPoints: 150 // Mocked for now
            },
            trendingDesigns: [
                {
                    id: "1",
                    name: "Cyberpunk Cityscape",
                    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80",
                    category: "Digital Art"
                },
                {
                    id: "2",
                    name: "Minimalist Forest",
                    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
                    category: "Photography"
                },
                {
                    id: "3",
                    name: "Abstract Neon",
                    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80",
                    category: "Abstract"
                },
                {
                    id: "4",
                    name: "Vintage Floral",
                    image: "https://images.unsplash.com/photo-1490750967868-8864v9ce1a4b?auto=format&fit=crop&w=800&q=80",
                    category: "Illustration"
                }
            ]
        };
    } catch (error) {
        console.error("[CustomerDashboard] Fetch failed:", error);
        return {
            recentOrders: [],
            stats: { totalOrders: 0, activeOrders: 0, rewardPoints: 0 },
            trendingDesigns: []
        };
    }
}

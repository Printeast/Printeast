import React from "react";
import { createClient } from "@/utils/supabase/server";
import { api } from "@/services/api.service";
import { AnalyticsClient } from "./AnalyticsClient";

export default async function SellerAnalyticsPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || session?.user?.email || "seller";

    // Fetch from high-performance backend
    const res = await api.get<any>("/analytics/stats", session?.access_token);
    const stats = res.data || { summary: {}, recentOrders: [], recentPayments: [] };

    return (
        <AnalyticsClient
            userEmail={userEmail}
            stats={stats}
            role="SELLER"
            basePath="/seller"
        />
    );
}

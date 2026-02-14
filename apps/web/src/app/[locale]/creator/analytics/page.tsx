import React from "react";
import { createClient } from "@/utils/supabase/server";
import { api } from "@/services/api.service";
import { AnalyticsClient } from "../../seller/analytics/AnalyticsClient";

export default async function CreatorAnalyticsPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || session?.user?.email || "creator";

    // Fetch from high-performance backend
    const res = await api.get<any>("/analytics/stats", session?.access_token);
    const stats = res.data || { summary: {}, recentOrders: [], recentPayments: [] };

    return (
        <AnalyticsClient
            userEmail={userEmail}
            stats={stats}
            role="CREATOR"
            basePath="/creator"
            pageTitle="Analytics & Insights"
            pageDescription="Deep dive into your performance and earnings."
        />
    );
}

import { getSellerDashboardData } from "./_data";
import { SellerDashboardClient } from "./_client";
import { createClient } from "@/utils/supabase/server";

export default async function SellerPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";

    // Fetch real data
    const data = await getSellerDashboardData();

    return <SellerDashboardClient userEmail={userEmail} data={data} />;
}

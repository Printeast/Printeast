import { getSellerDashboardData } from "./_data";
import { SellerDashboardClient } from "./_client";
import { createClient } from "@/utils/supabase/server";

export default async function SellerPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const { data: userRes } = await supabase.auth.getUser();

    // Secure Fallback: Use getUser for identity, session for token
    const userEmail = userRes.user?.email || session?.user?.email || "seller";
    const userName = userRes.user?.user_metadata?.full_name || userRes.user?.user_metadata?.name || "";

    // Fetch real data (passing token for server-side auth)
    const data = await getSellerDashboardData(session?.access_token);

    return <SellerDashboardClient userEmail={userEmail} userName={userName} data={data} />;
}

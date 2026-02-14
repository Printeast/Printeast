import { createClient } from "@/utils/supabase/server";
import { CustomerDashboardClient } from "./_client";
import { getCustomerDashboardData } from "./_data";

export default async function CustomerDashboardPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    const data = await getCustomerDashboardData(session?.access_token);
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";

    return <CustomerDashboardClient userEmail={user?.email || "customer"} userName={userName} data={data} />;
}

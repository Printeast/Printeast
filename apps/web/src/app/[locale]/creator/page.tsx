import { createClient } from "@/utils/supabase/server";
import { CreatorDashboardClient } from "./_client";
import { getCreatorDashboardData } from "./_data";

export default async function CreatorDashboardPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    const data = await getCreatorDashboardData(session?.access_token);
    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "";

    return <CreatorDashboardClient userEmail={user?.email || "creator"} userName={userName} data={data} />;
}

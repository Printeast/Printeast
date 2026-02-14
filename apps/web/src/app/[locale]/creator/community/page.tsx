import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../../seller/_data";
import { SupportClient } from "../../seller/support/SupportClient";

export default async function CreatorCommunityPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "creator";
    const userId = userRes.user?.id || null;
    const tenantId = await resolveTenantId(supabase);

    const { data: notificationsData } = userId
        ? await supabase
            .from("notifications")
            .select("id,type,content,is_read,created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(20)
        : { data: null };
    const notifications = notificationsData || [];

    const { data: auditsData } = tenantId
        ? await supabase
            .from("audit_logs")
            .select("id,action,resource,created_at")
            .eq("tenant_id", tenantId)
            .order("created_at", { ascending: false })
            .limit(20)
        : { data: null };
    const audits = auditsData || [];

    return (
        <SupportClient
            userEmail={userEmail}
            notifications={notifications}
            audits={audits}
            role="CREATOR"
            pageTitle="Community & Help"
            pageDescription="Stay connected with the creator community and get the support you need."
        />
    );
}

import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { SupportClient } from "./SupportClient";

export default async function SellerSupportPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
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
            role="SELLER"
        />
    );
}

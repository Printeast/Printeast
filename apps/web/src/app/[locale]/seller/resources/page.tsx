import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { ResourcesClient } from "./ResourcesClient";

export default async function SellerResourcesPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: suppliers } = await supabase.from("suppliers").select("id,name,location,contact_email").limit(20);

    const { data: vendors } = tenantId
        ? await supabase.from("vendors").select("id,name,location,api_endpoint").eq("tenant_id", tenantId).limit(20)
        : { data: [] };

    return (
        <ResourcesClient
            userEmail={userEmail}
            supplierRows={suppliers || []}
            vendorRows={vendors || []}
            role="SELLER"
        />
    );
}

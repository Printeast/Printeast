import { createClient } from "@/utils/supabase/server";
import { SellerStorefrontClient } from "./_client";

export default async function SellerStorefrontPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";

    return <SellerStorefrontClient userEmail={userEmail} />;
}

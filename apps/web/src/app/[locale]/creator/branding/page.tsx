import { createClient } from "@/utils/supabase/server";
import { BrandingClient } from "../../seller/branding/BrandingClient";

export default async function CreatorBrandingPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || "creator";

    return (
        <BrandingClient
            userEmail={userEmail}
            role="CREATOR"
            pageTitle="Creator Branding and Packaging Services"
        />
    );
}

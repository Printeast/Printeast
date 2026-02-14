import { createClient } from "@/utils/supabase/server";
import { BrandingClient } from "./BrandingClient";

export default async function SellerBrandingPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || "seller";

    return (
        <BrandingClient
            userEmail={userEmail}
            role="SELLER"
            pageTitle="Seller Branding and Packaging Services"
        />
    );
}

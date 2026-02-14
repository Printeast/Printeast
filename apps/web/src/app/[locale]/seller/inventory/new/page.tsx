import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { ProductCatalog } from "@/components/dashboard/product-catalog";
import { getGlobalCatalog } from "../../_data";

export default async function NewProductPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";

    const products = await getGlobalCatalog();

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            <ProductCatalog initialProducts={products} />
        </DashboardLayout>
    );
}

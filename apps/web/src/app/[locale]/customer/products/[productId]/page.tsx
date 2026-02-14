
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getProductById } from "../../../seller/_data";
import { CustomerProductDetails } from "./_client";

interface PageProps {
    params: Promise<{
        productId: string;
        locale: string;
    }>;
}

export default async function CustomerProductPage({ params }: PageProps) {
    const { productId } = await params;
    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "customer@example.com";

    return <CustomerProductDetails product={product} userEmail={userEmail} role="CUSTOMER" />;
}

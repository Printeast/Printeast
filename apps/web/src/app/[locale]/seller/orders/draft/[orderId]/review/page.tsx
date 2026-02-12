
import { OrderReviewClient } from "./_client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";

export default async function OrderReviewPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fallback user data if not logged in (mock)
    const userData = user ? { email: user.email!, role: (user.user_metadata?.role || "SELLER") as any } : { email: "seller@example.com", role: "SELLER" as any };

    return (
        <DashboardLayout user={userData} fullBleed={true} hideHeader={true}>
            <OrderReviewClient orderId={orderId} />
        </DashboardLayout>
    );
}

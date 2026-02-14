
import { OrderShippingClient } from "./_client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";

export default async function OrderShippingPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fallback user data if not logged in (mock) - Customer role
    const userData = user ? { email: user.email!, role: (user.user_metadata?.role || "CUSTOMER") as any } : { email: "customer@example.com", role: "CUSTOMER" as any };

    return (
        <DashboardLayout user={userData} fullBleed={true} hideHeader={true}>
            <OrderShippingClient orderId={orderId} />
        </DashboardLayout>
    );
}

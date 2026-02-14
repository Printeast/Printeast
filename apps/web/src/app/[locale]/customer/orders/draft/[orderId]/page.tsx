
import { OrderDraftClient } from "./_client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";

export default async function OrderDraftPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params;

    // Mock Data for the screenshot scenario
    const mockItems = [
        {
            id: "item-1",
            name: "Premium Matte Poster",
            details: "13x18cm / 5x7\", Vertical (portrait) orientation",
            image: "https://images.unsplash.com/photo-1582140163304-405494292150?auto=format&fit=crop&w=800&q=80",
            quantity: 1,
            price: 956.06,
            currency: "INR",
            isGelatoPlus: true
        }
    ];

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fallback user data if not logged in (mock)
    const userData = user ? { email: user.email!, role: (user.user_metadata?.role || "CUSTOMER") as any } : { email: "customer@example.com", role: "CUSTOMER" as any };

    return (
        <DashboardLayout user={userData} fullBleed={true} hideHeader={true}>
            <OrderDraftClient orderId={orderId} initialItems={mockItems} />
        </DashboardLayout>
    );
}

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";

export default async function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userData = user ? { email: user.email!, role: (user.user_metadata?.role || "SELLER") as any } : { email: "seller@example.com", role: "SELLER" as any };

    return (
        <DashboardLayout user={userData} fullBleed={true}>
            {children}
        </DashboardLayout>
    );
}

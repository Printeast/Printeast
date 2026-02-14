import { createClient } from "@/utils/supabase/server";
import { EarningsClient } from "./EarningsClient";

export default async function CreatorEarningsPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || "creator";

    // In a real app, fetch these from your 'payouts' or 'earnings' table
    // For now, providing a professional realistic state
    const earningsData = {
        balance: 1240.50,
        pendingPayout: 450.00,
        lifetimeEarnings: 15680.00,
        payoutHistory: [
            { id: "po_1PqY2f2eZvKYlo2C", date: "2024-09-01", amount: 1200.00, status: "COMPLETED" },
            { id: "po_1PqY2f2eZvKYlo2D", date: "2024-08-01", amount: 1100.00, status: "COMPLETED" },
            { id: "po_1PqY2f2eZvKYlo2E", date: "2024-07-01", amount: 950.00, status: "COMPLETED" },
        ]
    };

    return (
        <EarningsClient
            userEmail={userEmail}
            {...earningsData}
        />
    );
}

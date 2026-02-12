import { SellerDashboardClient } from "../seller/_client";
import type { SellerDashboardData } from "../seller/_data";

const emptyDashboardData: SellerDashboardData = {
    orders: [],
    inventory: [],
    topProducts: [],
    payments: [],
    paymentsTotals: { paid: 0, pending: 0 },
    lowStockCount: 0,
};

export default function CreatorDashboard() {
    return (
        <SellerDashboardClient
            userEmail="creator"
            data={emptyDashboardData}
            role="CREATOR"
            secondaryCtaLabel="View Marketplace"
            secondaryCtaHref="/creator/marketplace"
            clubTitle="Artist's Club"
            connectTitle="Connect Marketplace"
            connectDescription="Link your marketplace to sync listings."
            connectCta="Connect Now"
            connectHref="/creator/marketplace"
        />
    );
}

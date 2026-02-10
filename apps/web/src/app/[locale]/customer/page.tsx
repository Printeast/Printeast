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

export default function IndividualDashboard() {
    return (
        <SellerDashboardClient
            userEmail="individual"
            data={emptyDashboardData}
            role="CUSTOMER"
            secondaryCtaLabel="Explore Store"
            secondaryCtaHref="/"
            clubTitle="Customer Club"
            connectTitle="Shop Favorites"
            connectDescription="Start browsing your favorite products."
            connectCta="Browse Now"
            connectHref="/"
        />
    );
}

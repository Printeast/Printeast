import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MarketplaceDashboard } from "../_components/MarketplaceDashboard";

export default function CreatorMarketplacePage() {
    return (
        <DashboardLayout user={{ email: "creator@placeholder", role: "CREATOR" }} fullBleed>
            <MarketplaceDashboard />
        </DashboardLayout>
    );
}

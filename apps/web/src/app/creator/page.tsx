import { getCreatorDashboardData } from "./_data";
import { CreatorDashboardClient } from "./_client";

export default async function CreatorPage() {
    const { userEmail, data } = await getCreatorDashboardData();
    return <CreatorDashboardClient userEmail={userEmail} data={data} />;
}

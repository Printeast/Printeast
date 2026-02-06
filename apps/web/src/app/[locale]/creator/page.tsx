import { redirect } from "next/navigation";

export default function CreatorDashboard({ params }: { params: { locale: string } }) {
    redirect(`/${params.locale}/creator/marketplace`);
}

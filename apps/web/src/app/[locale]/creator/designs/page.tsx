import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { DesignsClient } from "../../seller/templates/DesignsClient";

export default async function CreatorDesignsPage() {
    const supabase = await createClient();
    // @ts-ignore
    const { prisma } = await import("@repo/database");

    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || "creator";

    const prismaTemplates = user ? await prisma.design.findMany({
        where: {
            userId: user.id,
            status: { not: "DRAFT" }
        },
        select: {
            id: true,
            promptText: true,
            createdAt: true,
            previewUrl: true,
            status: true,
            designData: true,
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 50
    }) : [];

    const templates = prismaTemplates.map((t: any) => ({
        id: t.id,
        prompt_text: t.promptText,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        previewUrl: t.previewUrl,
        designData: t.designData || null,
    }));

    return (
        <DashboardLayout user={{ email: userEmail, role: "CREATOR" }} fullBleed>
            <DesignsClient
                templates={templates}
                pageTitle="My High-Res Designs"
                pageDescription="Upload and manage your professional artwork portfolio."
                createLabel="Upload New Design"
            />
        </DashboardLayout>
    );
}

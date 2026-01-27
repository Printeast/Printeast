import { getCreatorPortfolioData } from "../_data";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconDashboard, IconImage } from "@/components/ui/icons";

export default async function CreatorPortfolioPage() {
    const { userEmail, designs } = await getCreatorPortfolioData();

    return (
        <DashboardLayout user={{ email: userEmail, role: "CREATOR" }}>
            <div className="flex flex-col gap-8 dash-text">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Portfolio</p>
                        <h1 className="text-3xl font-black dash-text">Collections</h1>
                        <p className="dash-muted mt-1">Your latest designs from Supabase.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 dash-muted-strong">
                                <IconDashboard className="h-4 w-4" />
                                <CardTitle>Designs</CardTitle>
                            </div>
                            <Badge>{designs.length} items</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {designs.length === 0 ? (
                            <EmptyState title="No designs" subtitle="Create a design to see it here." />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {designs.map((d) => (
                                    <div key={d.id} className="rounded-2xl border dash-border dash-panel p-4 flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-xs dash-muted">
                                            <Badge tone={d.status?.toUpperCase() === "DRAFT" ? "warning" : "neutral"}>{d.status || "-"}</Badge>
                                            <span>{formatDate(d.created_at)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm dash-text font-semibold">
                                            <IconImage className="h-4 w-4 dash-muted-strong" />
                                            {d.prompt_text ? truncate(d.prompt_text, 60) : "Untitled"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="rounded-2xl border border-dashed dash-border dash-panel p-6">
            <p className="font-semibold dash-text">{title}</p>
            <p className="text-sm dash-muted">{subtitle}</p>
        </div>
    );
}

function formatDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncate(value: string, len: number) {
    return value.length > len ? `${value.slice(0, len)}…` : value;
}

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { IconBrush } from "@/components/ui/icons";

export default async function SellerDesignPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: designs = [] } = tenantId
        ? await supabase
              .from("designs")
              .select("id,prompt_text,status,created_at,image_url,preview_url")
              .eq("tenant_id", tenantId)
              .order("created_at", { ascending: false })
              .limit(30)
        : { data: [] };

    const draftCount = designs.filter((d) => (d.status || "").toUpperCase() === "DRAFT").length;
    const liveCount = designs.length - draftCount;

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }}>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Design</p>
                        <h1 className="text-3xl font-black">AI &amp; Design Studio</h1>
                        <p className="dash-muted mt-1">Manage drafts and live designs stored in Supabase.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge tone="info">{liveCount} Live</Badge>
                        <Badge tone="warning">{draftCount} Draft</Badge>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Start new</CardTitle>
                            <p className="text-sm dash-muted">Kick off a fresh prompt or upload.</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <button
                                type="button"
                                className="w-full rounded-xl bg-[linear-gradient(135deg,var(--dash-accent-start),var(--dash-accent-end))] text-white font-semibold px-4 py-2.5 flex items-center justify-center gap-2 shadow"
                            >
                                <IconBrush className="h-4 w-4" /> Generate with AI
                            </button>
                            <button
                                type="button"
                                className="w-full rounded-xl border dash-border dash-panel px-4 py-2.5 font-semibold dash-text hover:bg-[var(--dash-panel-strong)] transition"
                            >
                                Upload design file
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Recent designs</CardTitle>
                            <p className="text-sm dash-muted">Latest 30 rows from designs.</p>
                        </CardHeader>
                        <CardContent>
                            {designs.length === 0 ? (
                                <div className="rounded-2xl border border-dashed dash-border dash-panel p-6">
                                    <p className="font-semibold dash-text">No designs yet</p>
                                    <p className="text-sm dash-muted">Create or upload to see items here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {designs.map((d) => (
                                        <div key={d.id} className="rounded-xl border dash-border dash-panel p-3 space-y-2">
                                            <div className="flex items-center justify-between text-xs dash-muted">
                                                <span>{new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                                <Badge tone={(d.status || "").toUpperCase() === "DRAFT" ? "warning" : "neutral"}>{d.status || ""}</Badge>
                                            </div>
                                            <div className="h-28 rounded-lg dash-panel-strong border dash-border overflow-hidden flex items-center justify-center text-[11px] dash-muted">
                                                {d.preview_url || d.image_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={d.preview_url || d.image_url} alt="Preview" className="h-full w-full object-cover" />
                                                ) : (
                                                    "No preview"
                                                )}
                                            </div>
                                            <div className="text-sm font-semibold dash-text line-clamp-2">{d.prompt_text || "Untitled"}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}

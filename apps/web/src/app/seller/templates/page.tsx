import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";

export default async function SellerTemplatesPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: designRows = [] } = tenantId
        ? await supabase
              .from("designs")
              .select("id,prompt_text,status,created_at,preview_url")
              .eq("tenant_id", tenantId)
              .order("created_at", { ascending: false })
              .limit(24)
        : { data: [] };

    const templates = (designRows as Array<{ id: string; prompt_text: string | null; status: string; created_at: string; preview_url?: string | null }>).filter(
        (d) => (d.status || "").toUpperCase() !== "DRAFT",
    );

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }}>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Templates</p>
                        <h1 className="text-3xl font-black">My Templates</h1>
                        <p className="dash-muted mt-1">Published designs ready for reuse across products.</p>
                    </div>
                    <Badge tone="info">{templates.length} Live</Badge>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Library</CardTitle>
                        <p className="text-sm dash-muted">Fetched from Supabase designs (status != DRAFT).</p>
                    </CardHeader>
                    <CardContent>
                        {templates.length === 0 ? (
                            <div className="rounded-2xl border border-dashed dash-border dash-panel p-6">
                                <p className="font-semibold dash-text">No templates yet</p>
                                <p className="text-sm dash-muted">Publish a design from AI & Design Studio to see it here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {templates.map((tpl) => (
                                    <div key={tpl.id} className="rounded-2xl border dash-border dash-panel p-4 flex flex-col gap-2">
                                        <div className="flex items-center justify-between text-xs dash-muted">
                                            <span>{new Date(tpl.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                            <Badge>{tpl.status || "LIVE"}</Badge>
                                        </div>
                                        <div className="h-32 rounded-xl dash-panel-strong border dash-border overflow-hidden flex items-center justify-center text-[11px] dash-muted">
                                            {tpl.preview_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={tpl.preview_url} alt="Preview" className="h-full w-full object-cover" />
                                            ) : (
                                                "No preview"
                                            )}
                                        </div>
                                        <div className="text-sm font-semibold dash-text line-clamp-2">
                                            {tpl.prompt_text || "Untitled template"}
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

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { LayoutTemplate } from "lucide-react";
import Image from "next/image";

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
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            {/* Full page with gradient background */}
            <div className="min-h-full w-full relative transition-colors duration-300" style={{
                background: 'linear-gradient(145deg, var(--background) 0%, var(--card) 60%, var(--accent) 100%)'
            }}>
                {/* Gradient mesh overlays */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-[0.15]"
                        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
                    <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-10 dark:opacity-[0.10]"
                        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
                </div>

                <div className="relative z-10 px-10 py-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400 mb-1">Templates</p>
                            <h1 className="text-[28px] font-bold text-foreground leading-tight">My Templates</h1>
                            <p className="text-sm text-muted-foreground mt-1">Published designs ready for reuse across products.</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 text-xs font-semibold rounded-full">{templates.length} Live</span>
                    </div>

                    {/* Library Card */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h2 className="text-base font-semibold text-foreground">Library</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Fetched from Supabase designs (status != DRAFT).</p>
                        </div>
                        <div className="px-6 py-5">
                            {templates.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-4">
                                        <LayoutTemplate className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-base font-semibold text-foreground mb-1">No templates yet</h3>
                                    <p className="text-sm text-muted-foreground">Publish a design from AI & Design Studio to see it here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {templates.map((tpl) => (
                                        <div key={tpl.id} className="bg-muted border border-border rounded-lg p-4 space-y-3 hover:bg-accent transition-all">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(tpl.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                </span>
                                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-secondary text-secondary-foreground">
                                                    {tpl.status || "LIVE"}
                                                </span>
                                            </div>
                                            <div className="h-28 rounded-lg bg-background border border-border overflow-hidden flex items-center justify-center">
                                                {tpl.preview_url ? (
                                                    <Image
                                                        src={tpl.preview_url}
                                                        alt="Preview"
                                                        width={200}
                                                        height={112}
                                                        className="w-full h-full object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <span className="text-[11px] text-muted-fore ground">No preview</span>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-foreground line-clamp-2">
                                                {tpl.prompt_text || "Untitled template"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

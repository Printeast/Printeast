import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";

type TenantRow = { name: string; slug: string; metadata?: Record<string, unknown> | null };
type ProductRow = { id: string; name: string; sku: string; mockup_template_url?: string | null; metadata?: Record<string, unknown> | null };
type CategoryRow = { id: string; name: string; parent_id: string | null };

export default async function SellerBrandingPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: tenantData } = tenantId
        ? await supabase.from("tenants").select("name,slug,metadata").eq("id", tenantId).single()
        : { data: null };

    const { data: products = [] } = tenantId
        ? await supabase
              .from("products")
              .select("id,name,sku,mockup_template_url,metadata")
              .eq("tenant_id", tenantId)
              .limit(24)
        : { data: [] };

    const { data: categories = [] } = tenantId
        ? await supabase.from("categories").select("id,name,parent_id").eq("tenant_id", tenantId).limit(24)
        : { data: [] };

    const brandColors = (tenantData?.metadata as { colors?: string[] } | undefined)?.colors || [];

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }}>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Branding</p>
                        <h1 className="text-3xl font-black">Brand &amp; Identity</h1>
                        <p className="dash-muted mt-1">Tenant, product branding, and taxonomy from Supabase.</p>
                    </div>
                    <Badge tone="info">{products.length} Products</Badge>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Brand kit</CardTitle>
                            <p className="text-sm dash-muted">From tenants table (name, slug, metadata.colors).</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="rounded-xl border dash-border dash-panel px-4 py-3">
                                    <p className="text-xs dash-muted">Name</p>
                                    <p className="text-lg font-semibold dash-text">{tenantData?.name || "Tenant"}</p>
                                </div>
                                <div className="rounded-xl border dash-border dash-panel px-4 py-3">
                                    <p className="text-xs dash-muted">Slug</p>
                                    <p className="text-lg font-semibold dash-text">{tenantData?.slug || "-"}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {brandColors.length === 0 ? (
                                        <p className="text-sm dash-muted">Add colors in tenant metadata.colors</p>
                                    ) : (
                                        brandColors.map((c) => (
                                            <span key={c} className="h-9 w-9 rounded-xl border dash-border" style={{ background: c }} />
                                        ))
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Categories</CardTitle>
                            <p className="text-sm dash-muted">From categories table.</p>
                        </CardHeader>
                        <CardContent>
                            {categories.length === 0 ? (
                                <div className="rounded-xl border border-dashed dash-border dash-panel p-4">
                                    <p className="font-semibold dash-text">No categories</p>
                                    <p className="text-sm dash-muted">Add rows in categories to see them here.</p>
                                </div>
                            ) : (
                                <ul className="space-y-2 text-sm">
                                    {categories.map((c) => (
                                        <li key={c.id} className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--dash-accent-start)]" />
                                            <span>{c.name}</span>
                                            {c.parent_id && <span className="text-[11px] dash-muted">Child of {c.parent_id.slice(0, 6)}</span>}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product branding</CardTitle>
                        <p className="text-sm dash-muted">Products with SKU and mockup templates.</p>
                    </CardHeader>
                    <CardContent>
                        {products.length === 0 ? (
                            <div className="rounded-2xl border border-dashed dash-border dash-panel p-6">
                                <p className="font-semibold dash-text">No products</p>
                                <p className="text-sm dash-muted">Create products to manage branding assets.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {products.map((p) => (
                                    <div key={p.id} className="rounded-xl border dash-border dash-panel p-3 space-y-2">
                                        <div className="flex items-center justify-between text-xs dash-muted">
                                            <span>{p.sku}</span>
                                            <Badge tone={p.mockup_template_url ? "info" : "neutral"}>{p.mockup_template_url ? "Template" : "Missing"}</Badge>
                                        </div>
                                        <div className="text-sm font-semibold dash-text line-clamp-2">{p.name}</div>
                                        <div className="text-[11px] dash-muted break-all">
                                            {p.mockup_template_url || "Add mockup_template_url in products"}
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

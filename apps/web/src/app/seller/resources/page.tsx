import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";

type SupplierRow = { id: string; name: string; location: string | null; contact_email: string };
type VendorRow = { id: string; name: string; location: string | null; api_endpoint: string | null };

export default async function SellerResourcesPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: suppliers = [] } = await supabase.from("suppliers").select("id,name,location,contact_email").limit(20);

    const { data: vendors = [] } = tenantId
        ? await supabase.from("vendors").select("id,name,location,api_endpoint").eq("tenant_id", tenantId).limit(20)
        : { data: [] };

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }}>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Resources</p>
                        <h1 className="text-3xl font-black">Resources</h1>
                        <p className="dash-muted mt-1">Suppliers and vendors from Supabase tables.</p>
                    </div>
                    <Badge tone="info">{suppliers.length + vendors.length} entries</Badge>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Suppliers</CardTitle>
                            <p className="text-sm dash-muted">From suppliers table.</p>
                        </CardHeader>
                        <CardContent>
                            {suppliers.length === 0 ? (
                                <EmptyState title="No suppliers" subtitle="Add rows to suppliers to see them here." />
                            ) : (
                                <ul className="space-y-3 text-sm">
                                    {suppliers.map((s) => (
                                        <li key={s.id} className="rounded-xl border dash-border dash-panel p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold dash-text">{s.name}</span>
                                                <Badge tone="neutral">Supplier</Badge>
                                            </div>
                                            <p className="dash-muted text-xs mt-1">{s.location || "Location N/A"}</p>
                                            <p className="dash-muted text-xs">{s.contact_email}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vendors</CardTitle>
                            <p className="text-sm dash-muted">From vendors table (tenant scoped).</p>
                        </CardHeader>
                        <CardContent>
                            {vendors.length === 0 ? (
                                <EmptyState title="No vendors" subtitle="Add rows to vendors to see them here." />
                            ) : (
                                <ul className="space-y-3 text-sm">
                                    {vendors.map((v) => (
                                        <li key={v.id} className="rounded-xl border dash-border dash-panel p-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold dash-text">{v.name}</span>
                                                <Badge tone="info">Vendor</Badge>
                                            </div>
                                            <p className="dash-muted text-xs mt-1">{v.location || "Location N/A"}</p>
                                            <p className="dash-muted text-xs break-all">{v.api_endpoint || "API endpoint not set"}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Helpful links</CardTitle>
                        <p className="text-sm dash-muted">Static links (frontend-only) for quick access.</p>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            {["Fulfillment SLA", "Asset guidelines", "API docs", "Billing"].map((label) => (
                                <li key={label} className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--dash-accent-start)]" />
                                    <span className="dash-text">{label}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="rounded-xl border border-dashed dash-border dash-panel p-4">
            <p className="font-semibold dash-text">{title}</p>
            <p className="text-sm dash-muted">{subtitle}</p>
        </div>
    );
}

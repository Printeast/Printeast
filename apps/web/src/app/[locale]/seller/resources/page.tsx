import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import Link from "next/link";

import { Role } from "@repo/types";

export default async function SellerResourcesPage({ role = "SELLER" }: { role?: Role }) {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: suppliers } = await supabase.from("suppliers").select("id,name,location,contact_email").limit(20);

    const { data: vendors } = tenantId
        ? await supabase.from("vendors").select("id,name,location,api_endpoint").eq("tenant_id", tenantId).limit(20)
        : { data: [] };

    const supplierRows = suppliers ?? [];
    const vendorRows = vendors ?? [];

    const helpfulLinks = [
        { label: "Fulfillment SLA", href: "#" },
        { label: "Asset guidelines", href: "#" },
        { label: "API docs", href: "#" },
        { label: "Billing", href: "#" },
    ];

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Resources</p>
                            <h1 className="text-[28px] font-bold text-foreground leading-tight">Resources</h1>
                            <p className="text-sm text-muted-foreground mt-1">Suppliers and vendors from Supabase tables.</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                            {supplierRows.length + vendorRows.length} entries
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Suppliers Card */}
                        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-base font-semibold text-foreground">Suppliers</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">From suppliers table.</p>
                            </div>
                            <div className="px-6 py-5">
                                {supplierRows.length === 0 ? (
                                    <div className="p-4 bg-accent/20 rounded-lg">
                                        <p className="text-sm font-medium text-foreground">No suppliers</p>
                                        <p className="text-xs text-muted-foreground">Add rows to suppliers to see them here.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[300px] overflow-auto">
                                        {supplierRows.map((s) => (
                                            <div key={s.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border border-border/50">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                                                    <p className="text-xs text-muted-foreground">{s.location || "Location N/A"}</p>
                                                    <p className="text-xs text-muted-foreground">{s.contact_email}</p>
                                                </div>
                                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-accent text-muted-foreground border border-border">
                                                    Supplier
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vendors Card */}
                        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-base font-semibold text-foreground">Vendors</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">From vendors table (tenant scoped).</p>
                            </div>
                            <div className="px-6 py-5">
                                {vendorRows.length === 0 ? (
                                    <div className="p-4 bg-accent/20 rounded-lg">
                                        <p className="text-sm font-medium text-foreground">No vendors</p>
                                        <p className="text-xs text-muted-foreground">Add rows to vendors to see them here.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[300px] overflow-auto">
                                        {vendorRows.map((v) => (
                                            <div key={v.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border border-border/50">
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">{v.name}</p>
                                                    <p className="text-xs text-muted-foreground">{v.location || "Location N/A"}</p>
                                                    <p className="text-xs text-muted-foreground break-all">{v.api_endpoint || "API endpoint not set"}</p>
                                                </div>
                                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50/10 text-blue-400 border border-blue-500/20">
                                                    Vendor
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Helpful Links Card */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h2 className="text-base font-semibold text-foreground">Helpful links</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Static links (frontend-only) for quick access.</p>
                        </div>
                        <div className="px-6 py-5">
                            <ul className="space-y-2">
                                {helpfulLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-2 text-sm text-foreground hover:text-blue-500 transition-colors"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

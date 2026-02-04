import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { Palette } from "lucide-react";

export default async function SellerBrandingPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: tenantData } = tenantId
        ? await supabase.from("tenants").select("name,slug,metadata").eq("id", tenantId).single()
        : { data: null };

    const { data: productsData } = tenantId
        ? await supabase
            .from("products")
            .select("id,name,sku,mockup_template_url,metadata")
            .eq("tenant_id", tenantId)
            .limit(24)
        : { data: null };
    const products = productsData || [];

    const { data: categoriesData } = tenantId
        ? await supabase.from("categories").select("id,name,parent_id").eq("tenant_id", tenantId).limit(24)
        : { data: null };
    const categories = categoriesData || [];

    const brandColors = (tenantData?.metadata as { colors?: string[] } | undefined)?.colors || [];

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            {/* Full page with gradient background */}
            <div className="min-h-full w-full" style={{
                background: 'linear-gradient(135deg, #e8f0fe 0%, #f0f4f8 25%, #f5f7fa 50%, #f8f9fb 100%)'
            }}>
                {/* Gradient mesh overlays */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40"
                        style={{ background: 'radial-gradient(circle, rgba(147,197,253,0.5) 0%, transparent 70%)' }} />
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.4) 0%, transparent 70%)' }} />
                </div>

                <div className="relative z-10 px-10 py-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Branding</p>
                            <h1 className="text-[28px] font-bold text-slate-900 leading-tight">Brand & Identity</h1>
                            <p className="text-sm text-slate-500 mt-1">Tenant, product branding, and taxonomy from Supabase.</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">{products.length} Products</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Brand Kit Card */}
                        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Brand kit</h2>
                                <p className="text-xs text-slate-500 mt-0.5">From tenants table (name, slug, metadata.colors).</p>
                            </div>
                            <div className="px-6 py-5">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1">Name</p>
                                        <p className="text-base font-semibold text-slate-800">{tenantData?.name || "Tenant"}</p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500 mb-1">Slug</p>
                                        <p className="text-base font-semibold text-slate-800">{tenantData?.slug || "-"}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {brandColors.length === 0 ? (
                                            <p className="text-sm text-slate-500">Add colors in tenant metadata.colors</p>
                                        ) : (
                                            brandColors.map((c) => (
                                                <span key={c} className="h-9 w-9 rounded-lg border border-slate-200 shadow-sm" style={{ background: c }} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories Card */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Categories</h2>
                                <p className="text-xs text-slate-500 mt-0.5">From categories table.</p>
                            </div>
                            <div className="px-6 py-5">
                                {categories.length === 0 ? (
                                    <div className="p-4 bg-slate-50 rounded-lg">
                                        <p className="text-sm font-medium text-slate-800">No categories</p>
                                        <p className="text-xs text-slate-500">Add rows in categories to see them here.</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {categories.map((c) => (
                                            <li key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                                                <span>{c.name}</span>
                                                {c.parent_id && <span className="text-[10px] text-slate-400">Child of {c.parent_id.slice(0, 6)}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Branding Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-base font-semibold text-slate-900">Product branding</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Products with SKU and mockup templates.</p>
                        </div>
                        <div className="px-6 py-5">
                            {products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                        <Palette className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-800 mb-1">No products</h3>
                                    <p className="text-sm text-slate-500">Create products to manage branding assets.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {products.map((p) => (
                                        <div key={p.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500">{p.sku}</span>
                                                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${p.mockup_template_url
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}>
                                                    {p.mockup_template_url ? "Template" : "Missing"}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 line-clamp-2">{p.name}</p>
                                            <p className="text-[10px] text-slate-500 break-all">
                                                {p.mockup_template_url || "Add mockup_template_url in products"}
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

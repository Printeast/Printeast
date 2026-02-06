import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { Plus, RefreshCw, Search, Calendar, ChevronDown } from "lucide-react";
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

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-10">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Templates</h1>
                            <button className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                        <button className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3 text-[15px] font-black text-white shadow-sm hover:scale-[1.02] active:scale-95 transition-all">
                            <Plus className="h-5 w-5" strokeWidth={3} /> Create New Template
                        </button>
                    </div>

                    {/* Filters & Search Section */}
                    <div className="flex flex-wrap items-center gap-4 mb-10">
                        <div className="flex-1 min-w-[300px] relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                placeholder="Search templates by title or tag..."
                                className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-[15px] placeholder:text-slate-400 focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="h-12 px-5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm group">
                                <span>Product Type</span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </button>

                            <button className="h-12 px-5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm group">
                                <span>Created Date</span>
                                <Calendar className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </button>

                            <button className="h-12 px-5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm group">
                                <span>Sort by</span>
                                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    {templates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center pt-40 pb-32">
                            <div className="text-center space-y-3">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">No templates yet</h3>
                                <p className="text-slate-500 font-medium text-lg">Create your first template to reuse across products.</p>
                            </div>

                            <button className="mt-8 rounded-xl bg-[#2563eb] px-10 py-4 text-[16px] font-black text-white shadow-sm hover:scale-[1.05] active:scale-95 transition-all">
                                Create now
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {templates.map((tpl) => (
                                <div key={tpl.id} className="bg-white border border-slate-200/60 rounded-[24px] p-6 space-y-5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:border-blue-200 transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-blue-50 text-blue-500 border border-blue-100 shadow-sm">
                                            {tpl.status || "LIVE"}
                                        </span>
                                    </div>
                                    <div className="h-56 rounded-[18px] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center relative">
                                        {tpl.preview_url ? (
                                            <Image
                                                src={tpl.preview_url}
                                                alt="Preview"
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                unoptimized
                                            />
                                        ) : (
                                            <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No preview</span>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[18px] font-black text-slate-900 leading-tight line-clamp-2 tracking-tight group-hover:text-blue-600 transition-colors">
                                            {tpl.prompt_text || "Untitled template"}
                                        </p>
                                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">
                                            Created {new Date(tpl.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

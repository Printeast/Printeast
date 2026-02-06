import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { Paintbrush, Upload } from "lucide-react";
import Image from "next/image";

export default async function SellerDesignPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const tenantId = await resolveTenantId(supabase);

    const { data: designsData } = tenantId
        ? await supabase
            .from("designs")
            .select("id,prompt_text,status,created_at,image_url,preview_url")
            .eq("tenant_id", tenantId)
            .order("created_at", { ascending: false })
            .limit(30)
        : { data: null };
    const designs = designsData || [];

    const draftCount = designs.filter((d) => (d.status || "").toUpperCase() === "DRAFT").length;
    const liveCount = designs.length - draftCount;

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
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
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Design</p>
                            <h1 className="text-[28px] font-bold text-slate-900 leading-tight">AI & Design Studio</h1>
                            <p className="text-sm text-slate-500 mt-1">Manage drafts and live designs stored in Supabase.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">{liveCount} Live</span>
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full">{draftCount} Draft</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Start New Card */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Start new</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Kick off a fresh prompt or upload.</p>
                            </div>
                            <div className="px-6 py-5 space-y-3">
                                <button className="w-full h-11 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm">
                                    <Paintbrush className="w-4 h-4" />
                                    Generate with AI
                                </button>
                                <button className="w-full h-11 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                                    <Upload className="w-4 h-4" />
                                    Upload design file
                                </button>
                            </div>
                        </div>

                        {/* Recent Designs Card */}
                        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Recent designs</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Latest 30 rows from designs.</p>
                            </div>
                            <div className="px-6 py-5">
                                {designs.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                            <Paintbrush className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <h3 className="text-base font-semibold text-slate-800 mb-1">No designs yet</h3>
                                        <p className="text-sm text-slate-500">Create or upload to see items here.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {designs.map((d) => (
                                            <div key={d.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${(d.status || "").toUpperCase() === "DRAFT"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-slate-100 text-slate-600"
                                                        }`}>
                                                        {d.status || "Draft"}
                                                    </span>
                                                </div>
                                                <div className="h-24 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                                                    {d.preview_url || d.image_url ? (
                                                        <Image
                                                            src={d.preview_url || d.image_url}
                                                            alt="Preview"
                                                            width={200}
                                                            height={96}
                                                            className="w-full h-full object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400">No preview</span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-slate-800 line-clamp-2">{d.prompt_text || "Untitled"}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

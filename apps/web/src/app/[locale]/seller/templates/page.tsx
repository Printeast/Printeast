import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { Plus, RefreshCw, Search, Calendar, ChevronDown } from "lucide-react";
import { Role } from "@repo/types";

import { TemplateCard } from "./_components/TemplateCard";

export default async function SellerTemplatesPage({ role = "SELLER" }: { role?: Role }) {
    const supabase = await createClient();
    // @ts-ignore
    const { prisma } = await import("@repo/database");

    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || "seller";

    // Fetch designs directly from DB to avoid RLS/Cache issues with fresh tenants
    // We fetch ALL designs for this user that are not DRAFTS (so TEMPLATE, PUBLISHED, etc.)
    const prismaTemplates = user ? await prisma.design.findMany({
        where: {
            userId: user.id,
            status: { not: "DRAFT" }
        },
        select: {
            id: true,
            promptText: true,
            createdAt: true,
            previewUrl: true,
            // designData: true -- REMOVED FOR PERFORMANCE
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 24
    }) : [];

    // Map Prisma camelCase to the component's expected snake_case used in JSX
    const templates = prismaTemplates.map((t: any) => ({
        id: t.id,
        prompt_text: t.promptText,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        previewUrl: t.previewUrl,
        // designData: t.designData
    }));

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role }} fullBleed>
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
                            {templates.map((tpl: any) => (
                                <TemplateCard key={tpl.id} template={tpl} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

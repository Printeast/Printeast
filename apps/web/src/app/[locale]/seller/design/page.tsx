import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { Paintbrush, Upload, Plus } from "lucide-react";
import Link from "next/link";
import { DesignCard } from "./_components/DesignCard";

interface Design {
    id: string;
    promptText?: string;
    status?: string;
    createdAt?: string;
    imageUrl?: string;
    previewUrl?: string;
}

export default async function SellerDesignPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || "seller";
    const token = session?.access_token;

    // Fetch designs from Backend API to bypass RLS and ensure consistency
    let designs: Design[] = [];
    try {
        if (token) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
            const res = await fetch(`${apiUrl}/designs?limit=30`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                cache: "no-store"
            });

            if (res.ok) {
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    designs = json.data as Design[];
                }
            } else {
                console.error("Failed to fetch designs:", res.status, await res.text());
            }
        }
    } catch (e) {
        console.error("Error fetching designs from API:", e);
    }

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
                                <Link
                                    href="/seller/wizard/design?fresh=true"
                                    className="w-full h-11 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                                >
                                    <Paintbrush className="w-4 h-4" />
                                    Generate with AI
                                </Link>
                                <Link
                                    href="/seller/wizard/design?action=upload&fresh=true"
                                    className="w-full h-11 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload design file
                                </Link>
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {designs.map((d) => (
                                            <DesignCard key={d.id} design={d} />
                                        ))}

                                        {/* Quick "Add New" card in the grid if small number of designs */}
                                        {designs.length < 6 && (
                                            <Link
                                                href="/seller/wizard/design?fresh=true"
                                                className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl flex flex-col items-center justify-center min-h-[180px] transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                                                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-500 group-hover:text-blue-600">Create new</span>
                                            </Link>
                                        )}
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

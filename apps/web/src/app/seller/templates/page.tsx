import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import styles from "./EmptyState.module.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { CalendarDays, ChevronDown, MoreHorizontal, Plus, RefreshCw, Search } from "lucide-react";

type TemplateRow = {
    id: string;
    prompt_text: string | null;
    status: string | null;
    created_at: string;
    preview_url?: string | null;
};

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

    const templates = designRows as TemplateRow[];

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">My Templates</h1>
                        <Link
                            href="/seller/templates"
                            className="h-9 w-9 rounded-lg border dash-border dash-panel flex items-center justify-center hover:dash-panel-strong"
                            aria-label="Refresh"
                        >
                            <RefreshCw className="h-4 w-4 dash-muted" />
                        </Link>
                    </div>
                    <Button type="button" className="h-10 rounded-lg px-5 bg-[#2563eb] text-white text-sm font-semibold shadow">
                        <Plus className="mr-2 h-4 w-4" /> Create New Template
                    </Button>
                </header>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            placeholder="Search templates by title or tag..."
                            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
                        />
                    </div>
                    <button className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                        Product Type <ChevronDown className="h-4 w-4" />
                    </button>
                    <button className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                        Created Date <CalendarDays className="h-4 w-4" />
                    </button>
                    <button className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 flex items-center gap-2">
                        Sort by <ChevronDown className="h-4 w-4" />
                    </button>
                </div>

                {templates.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyContent}>
                            <h2 className={styles.emptyTitle}>No templates yet</h2>
                            <p className={styles.emptySubtitle}>
                                Create your first template to reuse across products.
                            </p>
                            <Button type="button" className={`${styles.emptyCta} h-10 rounded-lg bg-[#2563eb] px-5 text-sm font-semibold text-white`}>
                                Create now
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {templates.map((tpl) => (
                            <div key={tpl.id} className="rounded-lg border dash-border dash-panel overflow-hidden">
                                <div className="h-40 bg-slate-100 flex items-center justify-center">
                                    {tpl.preview_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={tpl.preview_url} alt="Template preview" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-14 w-14 rounded-md bg-slate-300" />
                                    )}
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                                                {tpl.prompt_text || "Untitled Template"}
                                            </p>
                                            <p className="text-xs text-slate-500">Design Template</p>
                                        </div>
                                        <Badge tone={statusTone(tpl.status)}>{formatStatus(tpl.status)}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>Edited {formatRelativeTime(tpl.created_at)}</span>
                                        <button className="h-7 w-7 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                                            <MoreHorizontal className="mx-auto h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function formatStatus(value: string | null) {
    if (!value) return "ACTIVE";
    return value.toUpperCase();
}

function statusTone(value: string | null) {
    if (!value) return "positive";
    const status = value.toUpperCase();
    if (status === "DRAFT") return "warning";
    if (status === "ACTIVE") return "positive";
    return "info";
}

function formatRelativeTime(value: string) {
    const date = new Date(value);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
}

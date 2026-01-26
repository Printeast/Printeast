import { getCreatorPortfolioData } from "../_data";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ImageIcon, LayoutGrid } from "lucide-react";

export default async function CreatorPortfolioPage() {
    const { userEmail, designs } = await getCreatorPortfolioData();

    return (
        <DashboardLayout user={{ email: userEmail, role: "CREATOR" }}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Portfolio</p>
                        <h1 className="text-3xl font-black text-white">Collections</h1>
                        <p className="text-slate-400 mt-1">Your latest designs from Supabase.</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-slate-200">
                            <LayoutGrid className="h-4 w-4" />
                            <h3 className="text-lg font-semibold">Designs</h3>
                        </div>
                        <span className="text-xs text-slate-400">{designs.length} items</span>
                    </div>
                    {designs.length === 0 ? (
                        <EmptyState title="No designs" subtitle="Create a design to see it here." />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {designs.map((d) => (
                                <div key={d.id} className="rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 p-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-xs text-slate-300">
                                        <Badge text={d.status || "-"} />
                                        <span>{formatDate(d.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white font-semibold">
                                        <ImageIcon className="h-4 w-4 text-slate-200" />
                                        {d.prompt_text ? truncate(d.prompt_text, 60) : "Untitled"}
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

function Badge({ text }: { text: string }) {
    return <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-100">{text}</span>;
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 text-slate-200 p-6">
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
    );
}

function formatDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncate(value: string, len: number) {
    return value.length > len ? `${value.slice(0, len)}…` : value;
}

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";
import { Bell, FileText, Headphones, MessageSquare } from "lucide-react";

export default async function SellerSupportPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const userId = userRes.user?.id || null;
    const tenantId = await resolveTenantId(supabase);

    const { data: notificationsData } = userId
        ? await supabase
            .from("notifications")
            .select("id,type,content,is_read,created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(20)
        : { data: null };
    const notifications = notificationsData || [];

    const { data: auditsData } = tenantId
        ? await supabase
            .from("audit_logs")
            .select("id,action,resource,created_at")
            .eq("tenant_id", tenantId)
            .order("created_at", { ascending: false })
            .limit(20)
        : { data: null };
    const audits = auditsData || [];

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }} fullBleed>
            {/* Full page with gradient background */}
            <div className="min-h-full w-full relative transition-colors duration-300" style={{
                background: 'linear-gradient(145deg, var(--background) 0%, var(--card) 60%, var(--accent) 100%)'
            }}>
                {/* Gradient mesh overlays */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-[0.15]"
                        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
                    <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full opacity-10 dark:opacity-[0.10]"
                        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
                </div>

                <div className="relative z-10 px-10 py-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Support</p>
                            <h1 className="text-[28px] font-bold text-foreground leading-tight">24/7 Support</h1>
                            <p className="text-sm text-muted-foreground mt-1">Notifications and audit activity scoped to your tenant.</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                            {notifications.length} Notices
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Open Ticket Card */}
                        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-base font-semibold text-foreground">Open a ticket</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Frontend-only CTA; backend can link to helpdesk.</p>
                            </div>
                            <div className="px-6 py-5 space-y-3">
                                <button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm">
                                    <MessageSquare className="w-4 h-4" />
                                    New ticket
                                </button>
                                <button className="w-full h-11 bg-accent border border-border text-foreground rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent/80 transition-all">
                                    <Headphones className="w-4 h-4" />
                                    Live chat
                                </button>
                            </div>
                        </div>

                        {/* Notifications Card */}
                        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-base font-semibold text-foreground">Notifications</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">From notifications table by user_id.</p>
                            </div>
                            <div className="px-6 py-5">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-3">
                                            <Bell className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground mb-1">No notifications</h3>
                                        <p className="text-xs text-muted-foreground">New alerts will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[280px] overflow-auto">
                                        {notifications.map((n) => (
                                            <div key={n.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border border-border/50">
                                                <div>
                                                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${n.is_read ? "bg-accent text-muted-foreground" : "bg-blue-50/10 text-blue-400 border border-blue-500/20"
                                                        }`}>
                                                        {n.type}
                                                    </span>
                                                    <p className="text-sm text-foreground mt-1">{n.content}</p>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{formatDate(n.created_at)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Activity Card */}
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-border">
                            <h2 className="text-base font-semibold text-foreground">Activity (audit logs)</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">From audit_logs by tenant_id.</p>
                        </div>
                        <div className="px-6 py-5">
                            {audits.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-3">
                                        <FileText className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-foreground mb-1">No activity yet</h3>
                                    <p className="text-xs text-muted-foreground">Recent changes will appear here.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {audits.map((a) => (
                                        <div key={a.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border border-border/50">
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{a.action}</p>
                                                <p className="text-xs text-muted-foreground">{a.resource}</p>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{formatDate(a.created_at)}</span>
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

function formatDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

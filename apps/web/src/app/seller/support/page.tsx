import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { resolveTenantId } from "../_data";

type NotificationRow = { id: string; type: string; content: string; is_read: boolean; created_at: string };
type AuditRow = { id: string; action: string; resource: string; created_at: string };

export default async function SellerSupportPage() {
    const supabase = await createClient();
    const { data: userRes } = await supabase.auth.getUser();
    const userEmail = userRes.user?.email || "seller";
    const userId = userRes.user?.id || null;
    const tenantId = await resolveTenantId(supabase);

    const { data: notifications = [] } = userId
        ? await supabase
              .from("notifications")
              .select("id,type,content,is_read,created_at")
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(20)
        : { data: [] };

    const { data: audits = [] } = tenantId
        ? await supabase
              .from("audit_logs")
              .select("id,action,resource,created_at")
              .eq("tenant_id", tenantId)
              .order("created_at", { ascending: false })
              .limit(20)
        : { data: [] };

    return (
        <DashboardLayout user={{ email: userEmail, role: "SELLER" }}>
            <div className="flex flex-col gap-6 dash-text">
                <header className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] dash-muted">Support</p>
                        <h1 className="text-3xl font-black">24/7 Support</h1>
                        <p className="dash-muted mt-1">Notifications and audit activity scoped to your tenant.</p>
                    </div>
                    <Badge tone="info">{notifications.length} Notices</Badge>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Open a ticket</CardTitle>
                            <p className="text-sm dash-muted">Frontend-only CTA; backend can link to helpdesk.</p>
                        </CardHeader>
                        <CardContent>
                            <button
                                type="button"
                                className="w-full rounded-xl bg-[linear-gradient(135deg,var(--dash-accent-start),var(--dash-accent-end))] text-white font-semibold px-4 py-2.5 shadow"
                            >
                                New ticket
                            </button>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <p className="text-sm dash-muted">From notifications table by user_id.</p>
                        </CardHeader>
                        <CardContent>
                            {notifications.length === 0 ? (
                                <EmptyState title="No notifications" subtitle="New alerts will appear here." />
                            ) : (
                                <ul className="space-y-2 text-sm max-h-[320px] overflow-auto pr-1">
                                    {notifications.map((n) => (
                                        <li key={n.id} className="rounded-xl border dash-border dash-panel p-3">
                                            <div className="flex items-center justify-between">
                                                <Badge tone={n.is_read ? "neutral" : "info"}>{n.type}</Badge>
                                                <span className="text-[11px] dash-muted">{formatDate(n.created_at)}</span>
                                            </div>
                                            <p className="mt-1 dash-text">{n.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Activity (audit logs)</CardTitle>
                        <p className="text-sm dash-muted">From audit_logs by tenant_id.</p>
                    </CardHeader>
                    <CardContent>
                        {audits.length === 0 ? (
                            <EmptyState title="No activity yet" subtitle="Recent changes will appear here." />
                        ) : (
                            <ul className="space-y-2 text-sm">
                                {audits.map((a) => (
                                    <li key={a.id} className="rounded-xl border dash-border dash-panel p-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold dash-text">{a.action}</p>
                                            <p className="text-xs dash-muted">{a.resource}</p>
                                        </div>
                                        <span className="text-[11px] dash-muted">{formatDate(a.created_at)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="rounded-2xl border border-dashed dash-border dash-panel p-6">
            <p className="font-semibold dash-text">{title}</p>
            <p className="text-sm dash-muted">{subtitle}</p>
        </div>
    );
}

function formatDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

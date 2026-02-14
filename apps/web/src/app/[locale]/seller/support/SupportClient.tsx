"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Bell, FileText, Headphones, MessageSquare } from "lucide-react";
import { Role } from "@repo/types";

interface SupportClientProps {
    userEmail: string;
    notifications: any[];
    audits: any[];
    role?: Role;
    pageTitle?: string;
    pageDescription?: string;
}

export function SupportClient({
    userEmail,
    notifications,
    audits,
    role = "SELLER",
    pageTitle = "24/7 Support",
    pageDescription = "Notifications and audit activity scoped to your account."
}: SupportClientProps) {
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
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Support</p>
                            <h1 className="text-[28px] font-bold text-foreground leading-tight">{pageTitle}</h1>
                            <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                            {notifications.length} Notices
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Open Ticket Card */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-base font-semibold text-slate-900">Need immediate help?</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Our team is available round the clock.</p>
                            </div>
                            <div className="px-6 py-8 space-y-4">
                                <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]">
                                    <MessageSquare className="w-4 h-4" />
                                    Open Support Ticket
                                </button>
                                <button className="w-full h-12 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]">
                                    <Headphones className="w-4 h-4" />
                                    Launch Live Chat
                                </button>
                                <div className="pt-4 text-center">
                                    <p className="text-[11px] text-slate-400 font-medium">Average response time: <span className="text-blue-600">~15 mins</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Notifications Card */}
                        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">System Notifications</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Alerts, updates and account status.</p>
                                </div>
                                <button className="text-[11px] font-bold text-blue-600 hover:underline">Mark all as read</button>
                            </div>
                            <div className="px-6 py-2 flex-1">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                                            <Bell className="w-6 h-6 text-slate-300" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800 mb-1">All caught up!</h3>
                                        <p className="text-xs text-slate-500">You don't have any new notifications at the moment.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1 max-h-[320px] overflow-auto custom-scrollbar py-4 pr-1">
                                        {notifications.map((n) => (
                                            <div key={n.id} className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${n.is_read ? 'hover:bg-slate-50' : 'bg-blue-50/30 border border-blue-50/50'}`}>
                                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.is_read ? 'bg-slate-300' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wide ${n.type === 'ALARM' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                                n.type === 'INFO' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                                    'bg-slate-100 text-slate-600 border border-slate-200'
                                                            }`}>
                                                            {n.type}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-slate-400">{formatDate(n.created_at)}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{n.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Activity Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-base font-semibold text-slate-900">Security & Audit Activity</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Real-time log of security-sensitive actions performed in your account.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Action</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Resource</th>
                                        <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {audits.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <FileText className="w-8 h-8 text-slate-200 mb-2" />
                                                    <p className="text-sm font-medium text-slate-400">No activity logs found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        audits.map((a) => (
                                            <tr key={a.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-900">{a.action}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <code className="text-[12px] font-mono bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-200/50">{a.resource}</code>
                                                </td>
                                                <td className="px-6 py-4 text-right text-xs font-semibold text-slate-400">
                                                    {formatFullDate(a.created_at)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
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

function formatFullDate(value?: string) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}

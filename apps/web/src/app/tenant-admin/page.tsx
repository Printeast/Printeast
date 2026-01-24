"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { ShieldCheck, Users2, Server, Activity } from "lucide-react";

const mockUser = getMockUser() || { email: "admin@printeast.test", role: "TENANT_ADMIN" as const };

export default function TenantAdminDashboard() {
    const pillars = [
        { title: "Access control", desc: "Roles, SSO, audit trails", icon: ShieldCheck },
        { title: "Teams", desc: "Invites, seats, billing visibility", icon: Users2 },
        { title: "Systems", desc: "Vendors, webhooks, observability", icon: Server },
    ];

    const status = [
        { label: "Services", value: "All green", note: "API · Queue · Storage" },
        { label: "Latency", value: "124ms", note: "p95 across regions" },
        { label: "Incidents", value: "0", note: "Past 30 days" },
    ];

    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Admin</p>
                        <h1 className="text-3xl font-black text-white">System Command</h1>
                        <p className="text-slate-400 mt-1">Manage roles, teams, and platform signals in one pane.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-semibold hover:bg-white/10 transition">Invite team</button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30">Create role</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {status.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                            <div className="mt-2 text-3xl font-black">{item.value}</div>
                            <p className="text-slate-300 text-sm mt-1">{item.note}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">RBAC</p>
                                <h3 className="text-xl font-bold">Team & permissions</h3>
                            </div>
                            <Activity className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {pillars.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="rounded-2xl bg-black/20 border border-white/5 p-4 flex flex-col gap-3">
                                        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{item.title}</p>
                                            <p className="text-sm text-slate-300">{item.desc}</p>
                                        </div>
                                        <button className="text-xs font-semibold text-primary-pink w-fit">Open</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Signals</p>
                                <h3 className="text-xl font-bold">Platform pulse</h3>
                            </div>
                            <ShieldCheck className="h-4 w-4 text-slate-300" />
                        </div>
                        <ul className="space-y-3 text-sm text-slate-200">
                            <li className="rounded-xl bg-black/20 border border-white/5 px-3 py-2">SSO propagation <span className="text-primary-orange font-semibold">OK</span></li>
                            <li className="rounded-xl bg-black/20 border border-white/5 px-3 py-2">Webhook delivery <span className="text-primary-orange font-semibold">99.8%</span></li>
                            <li className="rounded-xl bg-black/20 border border-white/5 px-3 py-2">Queue depth <span className="text-primary-orange font-semibold">Normal</span></li>
                        </ul>
                        <div className="mt-4 text-xs text-slate-400">Middleware redirects are handled in app middleware for role-based entry.</div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

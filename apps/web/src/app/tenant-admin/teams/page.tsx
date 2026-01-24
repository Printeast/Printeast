"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { Users2, Plus, Shield } from "lucide-react";

const mockUser = getMockUser() || { email: "admin@printeast.test", role: "TENANT_ADMIN" as const };

const team = [
    { name: "Avery Chen", role: "Owner", status: "Active" },
    { name: "Jamie Fox", role: "Designer", status: "Active" },
    { name: "Riya Patel", role: "Ops", status: "Invited" },
];

export default function TenantTeamsPage() {
    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Teams</p>
                        <h1 className="text-3xl font-black text-white">Access & Invites</h1>
                        <p className="text-slate-400 mt-1">Manage seats, roles, and pending invites.</p>
                    </div>
                    <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30 flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Invite member
                    </button>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Team roster</h3>
                        <Users2 className="h-4 w-4 text-slate-300" />
                    </div>
                    <div className="divide-y divide-white/10">
                        {team.map((member) => (
                            <div key={member.name} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-white font-semibold">{member.name}</p>
                                    <p className="text-xs text-slate-400">{member.role}</p>
                                </div>
                                <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs text-slate-200">{member.status}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Backend can manage invites, role assignments, and seat limits.</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4 flex items-center gap-3 text-sm text-slate-200">
                    <Shield className="h-5 w-5 text-primary-orange" />
                    Enforce role-based middleware here; wire SSO/SCIM endpoints when available.
                </div>
            </div>
        </DashboardLayout>
    );
}

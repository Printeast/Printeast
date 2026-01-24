"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getMockUser } from "@/lib/mock-auth";
import { Settings, Database, Link } from "lucide-react";

const mockUser = getMockUser() || { email: "admin@printeast.test", role: "TENANT_ADMIN" as const };

export default function TenantSettingsPage() {
    return (
        <DashboardLayout user={mockUser}>
            <div className="flex flex-col gap-8 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Settings</p>
                        <h1 className="text-3xl font-black text-white">Controls</h1>
                        <p className="text-slate-400 mt-1">Hook backend config here: vendors, webhooks, billing.</p>
                    </div>
                    <button className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-sm font-bold shadow-lg shadow-primary-orange/30 flex items-center gap-2">
                        <Settings className="h-4 w-4" /> Save profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-200">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vendors</p>
                        <p className="mt-2 font-semibold">Fulfillment integrations</p>
                        <p className="text-slate-300 mt-1">Connect Gelato/Printful or custom production.</p>
                        <button className="mt-3 text-xs font-semibold text-primary-pink">Configure</button>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Webhooks</p>
                        <p className="mt-2 font-semibold">Events & retries</p>
                        <p className="text-slate-300 mt-1">Delivery logs, secrets, replay.</p>
                        <button className="mt-3 text-xs font-semibold text-primary-pink">Manage</button>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Billing</p>
                        <p className="mt-2 font-semibold">Plan & seats</p>
                        <p className="text-slate-300 mt-1">Usage, seats, invoices.</p>
                        <button className="mt-3 text-xs font-semibold text-primary-pink">Open</button>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Connections</h3>
                        <Link className="h-4 w-4 text-slate-300" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Database</p>
                            <p className="font-semibold text-white mt-1">Primary cluster</p>
                            <p className="text-xs text-slate-400">Configure connection strings and replicas.</p>
                            <button className="mt-3 text-xs font-semibold text-primary-pink">Edit</button>
                        </div>
                        <div className="rounded-xl bg-black/20 border border-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Queue</p>
                            <p className="font-semibold text-white mt-1">Background jobs</p>
                            <p className="text-xs text-slate-400">Rate limits, retries, DLQs.</p>
                            <button className="mt-3 text-xs font-semibold text-primary-pink">Configure</button>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">Backend can wire live settings here; UI is ready for forms and toggles.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}

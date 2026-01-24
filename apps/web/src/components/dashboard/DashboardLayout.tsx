"use client";

import { Sidebar } from "./Sidebar";
import { Role } from "@repo/types";
import { Bell, CircleUser, LogOut, Search } from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: {
        email: string;
        role: Role;
    };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#0b0f1a] via-[#0c0f17] to-[#0a0c14] text-slate-50">
            <Sidebar role={user.role} />

            <div className="flex flex-1 flex-col">
                <header className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4 backdrop-blur" role="banner">
                    <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 w-80" role="search">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            aria-label="Search workspace"
                            className="w-full bg-transparent text-sm placeholder:text-slate-500 focus:outline-none"
                            placeholder="Search across workspace"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            className="relative h-10 w-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition"
                            aria-label="Notifications"
                            type="button"
                        >
                            <Bell className="mx-auto h-4 w-4 text-slate-200" />
                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-primary-orange"></span>
                        </button>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm">
                            <CircleUser className="h-5 w-5 text-slate-200" />
                            <div className="leading-tight">
                                <div className="text-xs uppercase tracking-wide text-slate-400">Signed in</div>
                                <div className="text-sm font-semibold text-white">{user.email}</div>
                            </div>
                            <button
                                aria-label="Logout"
                                className="ml-2 rounded-full bg-white/5 px-2 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
                                type="button"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    <div className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)] backdrop-blur">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

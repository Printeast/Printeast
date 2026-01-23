"use client";

import { Sidebar } from "./Sidebar";
import { Role } from "@repo/types";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: {
        email: string;
        role: Role;
    };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-base-bg font-sans">
            <Sidebar role={user.role} />

            <div className="flex flex-1 flex-col">
                <header className="flex h-20 items-center justify-between border-b border-base-border bg-white px-8">
                    <div className="text-sm font-bold text-text-muted">
                        {user.email}
                    </div>
                    <button className="rounded-xl border border-base-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:border-primary-pink hover:text-primary-pink transition-all">
                        Logout
                    </button>
                </header>

                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

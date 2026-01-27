"use client";

import { Sidebar } from "./Sidebar";
import { Role } from "@repo/types";
import { IconBell, IconMenu, IconSearch, IconUser } from "@/components/ui/icons";
import { useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: {
        email: string;
        role: Role;
    };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState<"system" | "light" | "dark">(() => {
        if (typeof window === "undefined") return "system";
        const stored = window.localStorage.getItem("dashboard-theme");
        if (stored === "light" || stored === "dark" || stored === "system") return stored;
        return "system";
    });
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

    // Respect prefers-reduced-motion for transitions where possible
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mq.matches) setCollapsed(false);
    }, []);

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = () => {
            const next = theme === "system" ? (media.matches ? "dark" : "light") : theme;
            setResolvedTheme(next);
        };
        apply();
        if (theme === "system") {
            media.addEventListener("change", apply);
            return () => media.removeEventListener("change", apply);
        }
    }, [theme]);

    useEffect(() => {
        window.localStorage.setItem("dashboard-theme", theme);
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.dashboardTheme = resolvedTheme;
        return () => {
            delete root.dataset.dashboardTheme;
        };
    }, [resolvedTheme]);

    return (
        <TooltipProvider>
            <div className="dashboard-shell flex min-h-screen" data-theme={resolvedTheme}>
                <Sidebar role={user.role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

                <div className="flex flex-1 flex-col">
                    <header className="flex items-center justify-between border-b dash-border dash-panel px-6 py-4 backdrop-blur" role="banner">
                        <div className="flex items-center gap-3">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                                        onClick={() => setCollapsed((c) => !c)}
                                        className="h-10 w-10 rounded-2xl border dash-border dash-panel hover:bg-[var(--dash-panel-strong)] transition flex items-center justify-center"
                                    >
                                        <IconMenu className="h-4 w-4 dash-muted-strong" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">{collapsed ? "Expand sidebar" : "Collapse sidebar"}</TooltipContent>
                            </Tooltip>
                            <div className="flex items-center gap-3 rounded-2xl dash-panel border dash-border px-3 py-2 text-sm w-80" role="search">
                                <IconSearch className="h-4 w-4 dash-muted" />
                                <input
                                    aria-label="Search workspace"
                                    className="w-full bg-transparent text-sm placeholder:text-[color:var(--dash-muted)] focus:outline-none"
                                    placeholder="Search across workspace"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div role="radiogroup" aria-label="Theme" className="flex items-center gap-1 rounded-2xl border dash-border dash-panel px-1 py-1">
                                {["system", "light", "dark"].map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        role="radio"
                                        aria-checked={theme === mode}
                                        onClick={() => setTheme(mode as "system" | "light" | "dark")}
                                        className={`rounded-xl px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${theme === mode
                                                ? "bg-[linear-gradient(135deg,var(--dash-accent-start),var(--dash-accent-end))] text-white shadow"
                                                : "text-[color:var(--dash-muted)] hover:text-[color:var(--dash-text)]"}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="relative h-10 w-10 rounded-2xl border dash-border dash-panel hover:bg-[var(--dash-panel-strong)] transition"
                                aria-label="Notifications"
                                type="button"
                            >
                                <IconBell className="mx-auto h-4 w-4 dash-muted-strong" />
                                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[var(--dash-accent-start)]"></span>
                            </button>
                            <div className="flex items-center gap-2 rounded-2xl border dash-border dash-panel px-3 py-2 text-sm">
                                <IconUser className="h-5 w-5 dash-muted-strong" />
                                <div className="leading-tight">
                                    <div className="text-xs uppercase tracking-wide dash-muted">Signed in</div>
                                    <div className="text-sm font-semibold dash-text">{user.email}</div>
                                </div>
                                <button
                                    aria-label="Logout"
                                    className="ml-2 rounded-xl dash-panel px-2 py-1 text-[11px] font-semibold text-[color:var(--dash-text)] hover:bg-[var(--dash-panel-strong)] transition"
                                    type="button"
                                >
                                    <span className="text-xs font-semibold">Exit</span>
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-6 md:p-8">
                        <div className="mx-auto w-full max-w-6xl space-y-6 rounded-3xl border dash-border dash-panel p-6 dash-shadow backdrop-blur">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}

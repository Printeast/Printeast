"use client";

import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { Role } from "@repo/types";
import { IconMenu, IconPlus, IconSearch, IconUser } from "@/components/ui/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronRight, CreditCard, FileText, LogOut, Settings, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: {
        email: string;
        role: Role;
    };
    fullBleed?: boolean;
}

export function DashboardLayout({ children, user, fullBleed = false }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
    const [themeReady, setThemeReady] = useState(false);
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
        const stored = window.localStorage.getItem("dashboard-theme");
        if (stored === "light" || stored === "dark" || stored === "system") {
            setTheme(stored);
        }
        setThemeReady(true);
    }, []);

    useEffect(() => {
        if (!themeReady) return;
        window.localStorage.setItem("dashboard-theme", theme);
    }, [theme, themeReady]);

    useEffect(() => {
        const root = document.documentElement;
        root.dataset.dashboardTheme = resolvedTheme;
        return () => {
            delete root.dataset.dashboardTheme;
        };
    }, [resolvedTheme]);

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <TooltipProvider>
            <div className="dashboard-shell flex min-h-screen" data-theme={resolvedTheme}>
                <Sidebar role={user.role} collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

                <div className={`flex flex-1 flex-col ${collapsed ? "ml-[78px]" : "ml-64"}`}>
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
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="flex h-10 w-10 items-center justify-center rounded-2xl border dash-border dash-panel text-sm font-semibold dash-text hover:bg-[var(--dash-panel-strong)] transition"
                                aria-pressed={resolvedTheme === "dark"}
                                aria-label="Toggle dark mode"
                            >
                                <span className="text-[color:var(--dash-text)]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 3a9 9 0 0 1 0 18V3z" fill="currentColor" stroke="none" />
                                    </svg>
                                </span>
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="rounded-xl border dash-border dash-panel-strong px-4 py-2 text-sm font-semibold dash-text hover:bg-[var(--dash-panel-strong)] transition"
                                    >
                                        Create Product
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-52">
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller/inventory?mode=single">Single Product</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller/inventory?mode=multiple">Multiple Product</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller/inventory?mode=bulk">Bulk Orders</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        className="relative flex h-10 w-10 items-center justify-center rounded-2xl border dash-border dash-panel hover:bg-[var(--dash-panel-strong)] transition"
                                        aria-label="Account"
                                    >
                                        <IconUser className="h-5 w-5 dash-muted-strong" />
                                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-slate-900 text-white">
                                            <IconPlus className="h-2.5 w-2.5" />
                                        </span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2">
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller/account" className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <User className="h-4 w-4" /> My Account
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller/billing" className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <CreditCard className="h-4 w-4" /> Billing
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller/subscription" className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" /> Subscription
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/seller/settings" className="flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Settings className="h-4 w-4" /> Settings
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-500 focus:text-red-600" asChild>
                                        <Link href="/auth/signout" className="flex items-center gap-2">
                                            <LogOut className="h-4 w-4" /> Sign Out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    <main className="flex-1 p-6 md:p-8">
                        <div
                            className={
                                fullBleed
                                    ? "mx-auto w-full max-w-6xl space-y-6"
                                    : "mx-auto w-full max-w-6xl space-y-6 rounded-3xl border dash-border dash-panel p-6 dash-shadow backdrop-blur"
                            }
                        >
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}

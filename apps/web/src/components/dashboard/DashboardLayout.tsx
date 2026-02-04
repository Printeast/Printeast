"use client";

import { Sidebar } from "./Sidebar";
import { Role } from "@repo/types";
import { Menu, Search, Moon, Bell, User, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: {
        email: string;
        role: Role;
    };
    fullBleed?: boolean; // Added support for fullBleed prop used in other files
}

export function DashboardLayout({ children, user, fullBleed }: DashboardLayoutProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // avoids hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="flex h-screen bg-background font-sans overflow-hidden text-foreground">
            <Sidebar role={user.role} />

            <div className="flex flex-1 flex-col min-h-0">
                <header className="h-[72px] flex items-center justify-between border-b border-border px-8 flex-shrink-0 z-10 relative transition-colors duration-300" style={{
                    background: 'linear-gradient(135deg, var(--background) 0%, var(--card) 50%, var(--accent) 100%)'
                }}>
                    <div className="flex items-center gap-4 flex-1">
                        <button className="p-2 -ml-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg">
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search across workspace"
                                className="h-10 w-full pl-10 pr-4 bg-background border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-accent text-muted-foreground transition-colors"
                        >
                            {mounted && (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
                        </button>

                        <Button className="h-10 rounded-lg border border-border bg-black text-white hover:bg-black/90 font-bold shadow-sm px-4">
                            Create Product
                        </Button>

                        <div className="w-px h-6 bg-border mx-1"></div>

                        <button className="w-9 h-9 rounded-lg bg-transparent flex items-center justify-center border border-border text-muted-foreground hover:text-foreground relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-background"></span>
                        </button>

                        {/* Profile Icon with Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white shadow-sm hover:scale-105 transition-transform overflow-hidden">
                                    <div className="w-full h-full flex items-center justify-center text-white font-black text-sm">
                                        {user.email?.[0]?.toUpperCase() || "S"}
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[240px] p-2 rounded-xl border-border bg-card">
                                <DropdownMenuLabel className="px-3 py-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-foreground truncate">{user.email}</span>
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{user.role}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-accent text-foreground transition-colors">
                                    <User className="w-4 h-4 opacity-50" />
                                    <span className="text-[13px] font-bold">Account Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-accent text-foreground transition-colors">
                                    <Bell className="w-4 h-4 opacity-50" />
                                    <span className="text-[13px] font-bold">Notifications</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-500/10 text-red-500 transition-colors">
                                    <div className="w-4 h-4" />
                                    <span className="text-[13px] font-black">LOGOUT</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className={`flex-1 overflow-y-auto overflow-x-hidden min-h-0 relative ${fullBleed ? 'p-0' : 'p-8'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}

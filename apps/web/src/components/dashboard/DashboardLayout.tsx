"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { ActionMenuButton } from "@/components/seller/ActionMenuButton";
import { Sidebar } from "./Sidebar";
import { Role } from "@repo/types";
import { Menu, Search, Bell, User, Plus, Contrast, Shirt, LayoutTemplate, Store } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AuthService } from "@/services/auth.service";
import { api } from "@/services/api.service";
import { useUserStore } from "@/lib/stores/user-store";

interface DashboardLayoutProps {
    children: React.ReactNode;
    user: {
        email: string;
        role: Role;
    };
    fullBleed?: boolean; // Added support for fullBleed prop used in other files
    hideHeader?: boolean;
}

export function DashboardLayout({ children, user, fullBleed, hideHeader }: DashboardLayoutProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { profile, setProfile } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();

    // extract locale from pathname (e.g., /en/seller/dashboard -> en) - Memoized
    const locale = useMemo(() => pathname.split('/')[1] || 'en', [pathname]);

    // Memoize role calculations to prevent recalculation on every render
    const dbRoles = useMemo(() => profile?.roles?.map((r: any) => r.role?.name) || [], [profile?.roles]);

    // primaryIdentityRole = The user's main account type (Identity)
    const primaryIdentityRole = useMemo(() => {
        return (profile?.onboardingData?.initialRole ||
            (dbRoles.includes('SELLER') ? 'SELLER' :
                dbRoles.includes('CREATOR') ? 'CREATOR' :
                    dbRoles.includes('CUSTOMER') ? 'CUSTOMER' :
                        profile ? 'CUSTOMER' : user.role)) as Role;
    }, [profile?.onboardingData?.initialRole, dbRoles, profile, user.role]);

    // currentContextRole = The actual dashboard the user is looking at right now
    const [currentContextRole, setCurrentContextRole] = useState<Role>(user.role || 'CUSTOMER');

    useEffect(() => {
        if (!pathname) return;

        const lowerPath = pathname.toLowerCase();
        let detectedRole: Role = 'CUSTOMER';

        if (lowerPath.includes('/seller')) detectedRole = 'SELLER';
        else if (lowerPath.includes('/creator')) detectedRole = 'CREATOR';
        else detectedRole = user.role || 'CUSTOMER';

        setCurrentContextRole(detectedRole);

    }, [pathname, user.role]);

    // avoids hydration mismatch - Optimized to only run once
    useEffect(() => {
        setMounted(true);
    }, []);

    // Separate effect for profile fetching to avoid dependencies on mounted
    useEffect(() => {
        if (!profile && mounted) {
            const fetchProfile = async () => {
                const res = await api.get<{ user: any }>("/auth/me");
                if (res.success && res.data) {
                    setProfile(res.data.user);
                }
            };
            fetchProfile();
        }
    }, [profile, setProfile, mounted]);

    // Memoize callbacks to prevent recreating on every render
    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme, setTheme]);

    const handleLogout = useCallback(async () => {
        try {
            const { success } = await AuthService.signOut();
            if (success) {
                router.push(`/${locale}/login`);
                router.refresh();
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [locale, router]);

    return (
        <div className="flex h-screen bg-background font-sans overflow-hidden text-foreground">
            <Sidebar role={currentContextRole} primaryRole={primaryIdentityRole} />

            <div className="flex flex-1 flex-col min-h-0">
                {!hideHeader && (
                    <header
                        className="h-[72px] flex items-center justify-between px-8 flex-shrink-0 z-20 relative transition-all duration-500 border-b border-white/10"
                        style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Animated Mesh Gradient Background for Header */}
                        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
                            <div className="absolute top-[-100%] left-[-20%] w-[140%] h-[300%] bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08)_0%,transparent_50%)] animate-[spin_30s_linear_infinite] will-change-transform" />
                        </div>

                        <div className="flex items-center gap-4 flex-1">
                            <button className="p-2.5 -ml-2 text-slate-500 hover:bg-slate-900/5 hover:text-slate-900 rounded-xl transition-all duration-300">
                                <Menu className="w-5 h-5" strokeWidth={2} />
                            </button>

                            <div className="w-px h-6 bg-slate-200 mx-1"></div>



                            <div className="relative max-w-sm w-full group hidden md:block">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="h-10 w-full pl-11 pr-4 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 hover:border-blue-500/30 hover:bg-blue-50/50 text-slate-500 hover:text-blue-500 transition-all duration-300 group"
                            >
                                <Contrast className={`w-5 h-5 transition-transform duration-500 ${mounted && theme === 'dark' ? 'rotate-180' : 'rotate-0'}`} />
                            </button>

                            <ActionMenuButton
                                label="Create Product"
                                options={[
                                    {
                                        icon: <Shirt className="w-5 h-5" />,
                                        title: "Single Product",
                                        description: "Select a product from catalog",
                                        href: `/${locale}/seller/wizard`,
                                    },
                                    {
                                        icon: <LayoutTemplate className="w-5 h-5" />,
                                        title: "Use a template",
                                        description: "Select a template to create products",
                                        href: `/${locale}/seller/templates`,
                                    },
                                    {
                                        icon: <Store className="w-5 h-5" />,
                                        title: "Select from store",
                                        description: "Copy products from another store",
                                        href: `/${locale}/seller/inventory`,
                                    },
                                ]}
                            />

                            <div className="w-px h-6 bg-slate-200 mx-1"></div>

                            <button className="w-10 h-10 rounded-xl bg-transparent flex items-center justify-center border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 relative group transition-all">
                                <Bell className="w-4 h-4 group-hover:shake" />
                                <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            {mounted && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="relative group p-[1px] rounded-[4px] bg-gradient-to-br from-blue-500/20 to-indigo-600/20 transition-all duration-300">
                                            <div className="w-[42px] h-[42px] rounded-[3px] bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/30 transition-colors shadow-sm">
                                                <User className="w-5 h-5 text-slate-800" strokeWidth={2} />
                                            </div>
                                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-[4px] bg-[#0f172a] border border-white flex items-center justify-center shadow-lg transition-transform">
                                                <Plus className="w-3 h-3 text-white" strokeWidth={3} />
                                            </div>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-[300px] p-2 rounded-[4px] border border-white/50 bg-white/40 backdrop-blur-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none" />

                                        <DropdownMenuLabel className="px-5 py-4 relative">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[14px] font-black text-slate-900 tracking-tight truncate">
                                                    {user.email}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-1.5 py-0.5 rounded-[2px] bg-[#0f172a] text-[9px] font-black text-white uppercase tracking-[0.15em]">
                                                        {(!mounted || !profile) ? '...' :
                                                            primaryIdentityRole === 'SELLER' ? 'SELLER DASHBOARD' :
                                                                primaryIdentityRole === 'CREATOR' ? 'CREATOR STUDIO' :
                                                                    'INDIVIDUAL DASHBOARD'}
                                                    </span>
                                                </div>
                                            </div>
                                        </DropdownMenuLabel>

                                        <DropdownMenuSeparator className="mx-3 bg-slate-900/10" />

                                        <div className="px-1.5 py-1.5 space-y-1">
                                            <DropdownMenuItem className="flex items-center gap-3.5 px-4 py-3 rounded-[2px] cursor-pointer hover:bg-white/40 text-slate-700 hover:text-slate-900 transition-all group border border-transparent hover:border-white/40 hover:shadow-xs">
                                                <div className="w-8 h-8 rounded-[4px] bg-white/50 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors border border-white/40">
                                                    <User className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" strokeWidth={2} />
                                                </div>
                                                <span className="text-[14px] font-bold">Profile Settings</span>
                                            </DropdownMenuItem>

                                            <DropdownMenuItem className="flex items-center gap-3.5 px-4 py-3 rounded-[2px] cursor-pointer hover:bg-white/40 text-slate-700 hover:text-slate-900 transition-all group border border-transparent hover:border-white/40 hover:shadow-xs">
                                                <div className="w-8 h-8 rounded-[4px] bg-white/50 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors border border-white/40">
                                                    <Bell className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" strokeWidth={2} />
                                                </div>
                                                <span className="text-[14px] font-bold">Notification Center</span>
                                            </DropdownMenuItem>
                                        </div>

                                        <DropdownMenuSeparator className="mx-3 bg-slate-900/10" />

                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="flex items-center justify-center py-4 px-4 rounded-[2px] cursor-pointer hover:bg-red-500/10 text-[#FF4D4D] transition-all mt-1 group border border-transparent hover:border-red-500/20"
                                        >
                                            <span className="text-[12px] font-black tracking-[0.2em] group-hover:scale-105 transition-transform">LOGOUT</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </header>
                )}

                <main className={`flex-1 overflow-y-auto overflow-x-hidden min-h-0 relative z-0 ${fullBleed ? 'p-0' : 'p-8'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}

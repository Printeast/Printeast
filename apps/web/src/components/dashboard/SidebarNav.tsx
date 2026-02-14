"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { AdminNavGroup } from "./nav.config";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

type SidebarNavProps = {
    groups: AdminNavGroup[];
    collapsed: boolean;
};

export function SidebarNav({ groups, collapsed }: SidebarNavProps) {
    const pathname = usePathname();
    const normalizedPath = useMemo(() => pathname.replace(/^\/[a-zA-Z]{2}/, "") || "/", [pathname]);
    const localePrefix = useMemo(() => {
        const match = pathname.match(/^\/(\w{2})(\/|$)/);
        return match ? match[1] : null;
    }, [pathname]);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
    const [openPopoverGroup, setOpenPopoverGroup] = useState<string | null>(null);
    const openTimer = useRef<NodeJS.Timeout | null>(null);
    const closeTimer = useRef<NodeJS.Timeout | null>(null);
    const OPEN_DELAY = 75;
    const CLOSE_DELAY = 120;

    useEffect(() => {
        const initial: Record<string, boolean> = {};
        groups.forEach((group) => {
            initial[group.title] = group.items.some((item) => isActive(item.href, normalizedPath));
        });
        setOpenGroups(initial);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groups.map((g) => g.title).join("|"), normalizedPath]);

    const toggleGroup = (title: string) => {
        setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const clearTimers = () => {
        if (openTimer.current) clearTimeout(openTimer.current);
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };

    const scheduleOpen = (title: string) => {
        clearTimers();
        openTimer.current = setTimeout(() => setOpenPopoverGroup(title), OPEN_DELAY);
    };

    const scheduleClose = () => {
        clearTimers();
        closeTimer.current = setTimeout(() => setOpenPopoverGroup(null), CLOSE_DELAY);
    };

    const openPopover = (title: string) => {
        clearTimers();
        setOpenPopoverGroup(title);
    };

    const togglePopover = (title: string) => {
        clearTimers();
        setOpenPopoverGroup((curr) => (curr === title ? null : title));
    };

    return (
        <>
            <style jsx global>{`
                aside ul, aside li {
                    list-style: none !important;
                    list-style-type: none !important;
                    padding-left: 0 !important;
                }
                aside ul::before, aside li::before {
                    content: none !important;
                }
            `}</style>
            {collapsed ? (
                <MotionConfig transition={{ duration: 0.16, ease: "easeOut" }}>
                    <div className="flex-1 overflow-y-auto px-1 py-4 space-y-3">
                        {groups.map((group) => {
                            const Icon = group.icon;
                            const isOpen = openPopoverGroup === group.title;
                            return (
                                <Popover
                                    key={group.title}
                                    open={isOpen}
                                    onOpenChange={(open) => (open ? openPopover(group.title) : scheduleClose())}
                                >
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            aria-label={group.title}
                                            className={`w-full flex items-center justify-center rounded-xl py-3.5 text-slate-600 hover:text-blue-700 hover:bg-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${isOpen ? "bg-white shadow-sm" : ""}`}
                                            onMouseEnter={() => scheduleOpen(group.title)}
                                            onMouseLeave={scheduleClose}
                                            onPointerEnter={() => scheduleOpen(group.title)}
                                            onPointerLeave={scheduleClose}
                                            onFocus={() => openPopover(group.title)}
                                            onClick={() => togglePopover(group.title)}
                                            onBlur={scheduleClose}
                                        >
                                            <Icon className="w-5 h-5" aria-hidden />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="right"
                                        align="start"
                                        sideOffset={4}
                                        onMouseEnter={() => scheduleOpen(group.title)}
                                        onMouseLeave={scheduleClose}
                                        onPointerEnter={() => scheduleOpen(group.title)}
                                        onPointerLeave={scheduleClose}
                                        onOpenAutoFocus={(e) => e.preventDefault()}
                                        className="w-72 p-0 shadow-xl border border-slate-200 rounded-xl bg-white focus-visible:outline-none focus-visible:ring-0 transform-gpu"
                                    >
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    key="flyout"
                                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                    className="p-3"
                                                >
                                                    <div className="flex items-center gap-2 mb-2 text-sm font-black uppercase tracking-[0.12em] text-slate-700">
                                                        <Icon className="w-4 h-4" aria-hidden />
                                                        <span>{group.title}</span>
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {group.items.map((item) => {
                                                            const active = isActive(item.href, normalizedPath);
                                                            return (
                                                                <motion.li
                                                                    layout
                                                                    key={item.href}
                                                                    transition={{ duration: 0.12, ease: "easeOut" }}
                                                                >
                                                                    <Link
                                                                        href={localePrefix ? `/${localePrefix}${item.href}` : item.href}
                                                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] font-semibold transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:text-blue-700 hover:bg-blue-50/70"}`}
                                                                    >
                                                                        <span>{item.label}</span>
                                                                    </Link>
                                                                </motion.li>
                                                            );
                                                        })}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </PopoverContent>
                                </Popover>
                            );
                        })}
                    </div>
                </MotionConfig>
            ) : (
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
                    {groups.map((group) => {
                        const Icon = group.icon;
                        const open = openGroups[group.title];
                        return (
                            <div key={group.title} className="rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => toggleGroup(group.title)}
                                    aria-expanded={open}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors rounded-xl"
                                >
                                    <Icon className="w-4 h-4 text-slate-500" aria-hidden />
                                    <span className="flex-1 text-left">{group.title}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : "rotate-0"}`} aria-hidden />
                                </button>
                                <div className={`${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"} overflow-hidden transition-all duration-300 px-1`}
                                    aria-hidden={!open}
                                >
                                    <ul className="py-1">
                                        {group.items.map((item) => {
                                            const active = isActive(item.href, normalizedPath);
                                            return (
                                                <li key={item.href}>
                                                    <Link
                                                        href={localePrefix ? `/${localePrefix}${item.href}` : item.href}
                                                        className={`relative flex items-center gap-2 px-4 py-2 text-[13px] font-semibold transition-colors rounded-lg ${active ? "text-blue-700 bg-blue-50" : "text-slate-700 hover:text-blue-700 hover:bg-slate-100"}`}
                                                    >
                                                        {active && <span className="absolute left-0 h-6 w-1 rounded-full bg-blue-600" aria-hidden />}
                                                        <span>{item.label}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

function isActive(href: string, path: string) {
    if (href === "/tenant-admin") return path === href || path === "";
    return path === href || path.startsWith(`${href}/`);
}

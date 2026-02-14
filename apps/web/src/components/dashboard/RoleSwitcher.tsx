"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Palette, User, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { Role } from "@repo/types";
import { usePathname } from "next/navigation";

interface DashboardSwitcherProps {
    userRole: Role;
    locale: string;
    compact?: boolean;
}

export function RoleSwitcher({ userRole, locale, compact = false }: DashboardSwitcherProps) {
    const pathname = usePathname();
    const lowerPath = (pathname || "").toLowerCase();

    // Ultimate reliability: Path > Prop
    const effectiveRole = lowerPath.includes('/seller') ? 'SELLER' :
        lowerPath.includes('/creator') ? 'CREATOR' :
            (userRole || 'CUSTOMER');

    const [isOpen, setIsOpen] = useState(false);

    const dashboards = [
        {
            role: "SELLER",
            name: "Seller Dashboard",
            href: `/${locale}/seller`,
            icon: Store,
            color: "bg-blue-500",
            desc: "Manage products & orders"
        },
        {
            role: "CREATOR",
            name: "Creator Studio",
            href: `/${locale}/creator`,
            icon: Palette,
            color: "bg-purple-500",
            desc: "Design assets & patterns"
        },
        {
            role: "CUSTOMER",
            name: "Individual",
            href: `/${locale}/customer`,
            icon: User,
            color: "bg-green-500",
            desc: "Personal account center"
        }
    ];

    const availableDashboards = dashboards.filter(d => d.role !== effectiveRole);

    return (
        <div className="relative z-50 flex items-center" onMouseLeave={() => setIsOpen(false)}>
            {/* Trigger Pill - Clean & Solid */}
            <motion.button
                layoutId="switcher-trigger"
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                className={compact
                    ? `relative z-50 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 group cursor-pointer overflow-hidden
                       ${isOpen
                        ? 'bg-slate-900 shadow-lg border border-slate-800'
                        : 'bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md'
                    }`
                    : `relative z-50 h-10 pl-1.5 pr-4 flex items-center gap-3 rounded-full transition-all duration-300 group cursor-pointer
                       ${isOpen
                        ? 'bg-slate-900 border border-slate-800'
                        : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
                    }`
                }
            >
                {compact ? (
                    <div className="relative z-10 w-7 h-7 flex items-center justify-center">
                        <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${isOpen ? 'bg-slate-800' : 'bg-slate-900'}`}></div>
                        <div className="relative z-10 text-white">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center relative overflow-hidden">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-start leading-none gap-0.5">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Printeast</span>
                            <span className={`text-[13px] font-bold tracking-tight whitespace-nowrap ${isOpen ? 'text-white' : 'text-slate-800'}`}>
                                {effectiveRole === 'SELLER' ? 'Seller Dashboard' :
                                    effectiveRole === 'CREATOR' ? 'Creator Studio' :
                                        'Individual Space'}
                            </span>
                        </div>
                        <ChevronsRight className={`w-3.5 h-3.5 transition-all duration-300 ${isOpen ? 'rotate-90 text-slate-400' : 'text-slate-400'}`} />
                    </>
                )}
            </motion.button>

            {/* Tree Branching Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -5, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
                        className="absolute top-0 left-[calc(100%+8px)] w-[300px] h-[300px] pointer-events-none z-[9999]"
                        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
                    >
                        <div className="absolute top-0 -left-[20px] w-[40px] h-full bg-transparent" />

                        {/* Connecting Lines (Roots) */}
                        <svg className="absolute top-0 left-[-20px] w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
                            {availableDashboards.map((dash, index) => {
                                const spacing = 48;
                                const cardHeightCenter = 24;
                                const fromY = 18;
                                const toY = (index * spacing) + cardHeightCenter;
                                const toX = 30 + (index * 6);

                                return (
                                    <motion.path
                                        key={`path-${dash.role}`}
                                        d={`M 0 ${fromY} C 15 ${fromY}, 15 ${toY}, ${toX} ${toY}`}
                                        fill="none"
                                        stroke="#cbd5e1"
                                        strokeWidth={1.5}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{
                                            pathLength: 1,
                                            opacity: 1,
                                            transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" }
                                        }}
                                        exit={{ pathLength: 0, opacity: 0, transition: { duration: 0.2 } }}
                                        strokeLinecap="round"
                                    />
                                );
                            })}
                        </svg>

                        {/* Nodes - Glassmorphism With Fixed Hover Reveal */}
                        <div className="absolute top-0 left-0 w-full h-full">
                            {availableDashboards.map((dash, index) => {
                                const top = (index * 48);
                                const left = 30 + (index * 6);

                                return (
                                    <motion.div
                                        key={dash.role}
                                        initial={{ opacity: 0, x: -15, scale: 0.9 }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            scale: 1,
                                            transition: { delay: index * 0.06, type: "spring", stiffness: 300, damping: 20 }
                                        }}
                                        exit={{ opacity: 0, x: -5, transition: { duration: 0.15 } }}
                                        className="absolute"
                                        style={{ top: `${top}px`, left: `${left}px` }}
                                    >
                                        <Link href={dash.href} className="block group/item relative">
                                            {/* Card Container - Glassmorphism with Horizontal Grid Animation */}
                                            <div className="inline-flex items-center p-1.5 rounded-xl border border-white/40 bg-white/60 backdrop-blur-md shadow-[0_4px_15px_-4px_rgba(0,0,0,0.05)] hover:bg-white/80 hover:border-blue-400/30 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden">

                                                {/* Icon Box - Fixed width */}
                                                <div className={`
                                                    w-9 h-9 rounded-[10px] flex-shrink-0 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover/item:scale-105 relative z-10
                                                    ${dash.color}
                                                `}>
                                                    <dash.icon size={15} strokeWidth={2.5} className="relative z-10" />
                                                </div>

                                                {/* Text Reveal - Grid Column Animation for Proper Width Collapse */}
                                                <div className="grid grid-cols-[0fr] group-hover/item:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
                                                    <div className="overflow-hidden">
                                                        <div className="pl-3 pr-4 whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 delay-75">
                                                            <div className="flex flex-col py-0.5">
                                                                <span className="text-[13px] font-bold text-slate-800 tracking-tight">
                                                                    {dash.name}
                                                                </span>
                                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                                                    {dash.desc}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Link } from "@/i18n/routing";
import { Role } from "@repo/types";

interface ResourcesClientProps {
    userEmail: string;
    supplierRows: any[];
    vendorRows: any[];
    role?: Role;
    pageTitle?: string;
    pageDescription?: string;
}

export function ResourcesClient({
    userEmail,
    supplierRows,
    vendorRows,
    role = "SELLER",
    pageTitle = "Resources",
    pageDescription = "Suppliers and vendors from the platform."
}: ResourcesClientProps) {
    const helpfulLinks = [
        { label: "Fulfillment SLA", href: "#" },
        { label: "Asset guidelines", href: "#" },
        { label: "API docs", href: "#" },
        { label: "Billing", href: "#" },
    ];

    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-8">
                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Resources</p>
                            <h1 className="text-[28px] font-bold text-foreground leading-tight">{pageTitle}</h1>
                            <p className="text-sm text-muted-foreground mt-1">{pageDescription}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20">
                            {supplierRows.length + vendorRows.length} entries
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Suppliers Card */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Suppliers</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Verified printing and material partners.</p>
                            </div>
                            <div className="px-6 py-5">
                                {supplierRows.length === 0 ? (
                                    <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-center">
                                        <p className="text-sm font-semibold text-slate-800">No suppliers available</p>
                                        <p className="text-xs text-slate-500 mt-1">Check back later for updated partner lists.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                                        {supplierRows.map((s) => (
                                            <div key={s.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-blue-100 hover:shadow-md transition-all">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                        {s.location || "Location N/A"}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 mt-0.5 italic">{s.contact_email}</p>
                                                </div>
                                                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-600 border border-blue-100 tracking-wide uppercase">
                                                    Partner
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Vendors Card */}
                        <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-base font-semibold text-slate-900">Connected Vendors</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Services integrated with your account.</p>
                            </div>
                            <div className="px-6 py-5">
                                {vendorRows.length === 0 ? (
                                    <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-center">
                                        <p className="text-sm font-semibold text-slate-800">No vendors found</p>
                                        <p className="text-xs text-slate-500 mt-1">Connect a vendor in your store settings to get started.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                                        {vendorRows.map((v) => (
                                            <div key={v.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-emerald-100 hover:shadow-md transition-all">
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-slate-900">{v.name}</p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium truncate">{v.location || "Remote"}</p>
                                                    <p className="text-[11px] text-emerald-600/70 mt-0.5 truncate font-mono">{v.api_endpoint || "API active"}</p>
                                                </div>
                                                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 tracking-wide uppercase flex-shrink-0 ml-3">
                                                    Active
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Helpful Links Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="text-base font-semibold text-slate-900">Helpful Documentation</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Everything you need to succeed on Printeast.</p>
                        </div>
                        <div className="px-6 py-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {helpfulLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="flex flex-col p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:bg-blue-50 transition-colors">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 mb-1">{link.label}</p>
                                        <p className="text-[11px] text-slate-500">Learn more &rarr;</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

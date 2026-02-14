"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CreditCard, DollarSign, Download, ExternalLink, Milestone, PiggyBank, Plus, Receipt, TrendingUp, Wallet } from "lucide-react";

interface EarningsClientProps {
    userEmail: string;
    balance: number;
    pendingPayout: number;
    lifetimeEarnings: number;
    payoutHistory: any[];
}

export function EarningsClient({
    userEmail,
    balance = 0,
    pendingPayout = 0,
    lifetimeEarnings = 0,
    payoutHistory = []
}: EarningsClientProps) {
    const bgSoft = "#F9F8F6";

    return (
        <DashboardLayout user={{ email: userEmail, role: "CREATOR" }} fullBleed>
            <div
                className="min-h-full w-full"
                style={{
                    background: `radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 35%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 35%), ${bgSoft}`,
                }}
            >
                <div className="relative z-10 px-10 py-10 max-w-[1200px] mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Earnings & Payouts</h1>
                            <p className="text-slate-500 font-medium mt-1">Track your royalties, manage bank accounts and view your payout history.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="h-11 px-6 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                            <button className="h-11 px-6 bg-[#2563eb] text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
                                <Wallet className="w-4 h-4" /> Request Payout
                            </button>
                        </div>
                    </div>

                    {/* High-level Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <PiggyBank className="w-16 h-16" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Available Balance</p>
                            <div className="flex items-baseline gap-1">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(balance)}</h2>
                                <span className="text-sm font-bold text-emerald-500 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> +12%
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-4 font-medium">Ready for withdrawal to your bank account.</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Milestone className="w-16 h-16" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pending Payouts</p>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(pendingPayout)}</h2>
                            <p className="text-[11px] text-slate-500 mt-4 font-medium">Earned royalties currently being processed by the clearing house.</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <DollarSign className="w-16 h-16" />
                            </div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Lifetime Earnings</p>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(lifetimeEarnings)}</h2>
                            <p className="text-[11px] text-slate-500 mt-4 font-medium">Total profit generated from your designs on Printeast.</p>
                        </div>
                    </div>

                    {/* Recent Activity & Payout Method */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                        {/* Payout History */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-900">Payout History</h3>
                                <Link href="#" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                    View full history <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Reference</th>
                                            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {payoutHistory.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <Receipt className="w-8 h-8 text-slate-200 mb-2" />
                                                        <p className="text-slate-400 font-medium">No payouts initiated yet.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            payoutHistory.map((p) => (
                                                <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                                    <td className="px-6 py-4 font-medium text-slate-700">{formatDate(p.date)}</td>
                                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.id.slice(0, 10)}...</td>
                                                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(p.amount)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Payout Method */}
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-4">Payout Method</h3>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl mb-6">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm text-slate-400">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Direct Deposit</p>
                                        <p className="text-xs text-slate-500">**** **** **** 4242</p>
                                    </div>
                                    <button className="ml-auto text-xs font-bold text-blue-600 hover:underline">Edit</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Minimum payout</span>
                                        <span className="font-bold text-slate-900">$50.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Next scheduled</span>
                                        <span className="font-bold text-slate-900">Oct 15, 2024</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Connection with Stripe is active
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1a1a24] rounded-2xl p-6 text-white relative overflow-hidden group">
                                <Plus className="absolute -bottom-4 -right-4 w-24 h-24 opacity-5 group-hover:rotate-12 transition-transform" />
                                <h3 className="font-bold mb-2">Grow your revenue</h3>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6">Learn how to optimize your designs for higher conversion rates and better commissions.</p>
                                <button className="w-full py-2.5 bg-white text-[#1a1a24] text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors">
                                    Read Artist Guide
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

import { Link } from "@/i18n/routing";

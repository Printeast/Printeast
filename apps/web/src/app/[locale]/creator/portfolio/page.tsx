"use client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PenTool } from "lucide-react";

export default function PortfolioPage() {
    return (
        <DashboardLayout user={{ email: "creator@printeast.com", role: "CREATOR" }}>
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">MY PORTFOLIO</h1>
                        <p className="text-slate-500 font-medium">Manage your public presence and showcased designs.</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-12 border-2 border-dashed border-slate-200 text-center space-y-6">
                    <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto transition-transform hover:scale-110">
                        <PenTool className="text-slate-300" size={32} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Portfolio Under Construction</h3>
                        <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                            We are currently refining the portfolio experience. Soon you&apos;ll be able to create a stunning public page to showcase your best work.
                        </p>
                    </div>
                    <div className="pt-4 flex justify-center gap-4">
                        <button className="h-11 px-6 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg">
                            Request Early Access
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

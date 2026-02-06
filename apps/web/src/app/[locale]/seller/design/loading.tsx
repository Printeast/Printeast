import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const MOCK_USER = { email: "loading...", role: "SELLER" as const };

export default function Loading() {
    return (
        <DashboardLayout user={MOCK_USER} fullBleed>
            <div className="min-h-full w-full bg-[#F9F8F6] px-10 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Start New Actions */}
                    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6 space-y-4 h-fit">
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-11 w-full rounded-lg" />
                            <Skeleton className="h-11 w-full rounded-lg" />
                        </div>
                    </div>

                    {/* Recent Designs Grid */}
                    <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-3">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-16" />
                                        <Skeleton className="h-4 w-12 rounded-full" />
                                    </div>
                                    <Skeleton className="h-24 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

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
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-9 w-24 rounded-lg" />
                        <Skeleton className="h-9 w-32 rounded-lg" />
                    </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-5 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-9 w-9 rounded-full" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mb-6">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
                    <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm p-6 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center py-2">
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
            </div>
        </DashboardLayout>
    );
}

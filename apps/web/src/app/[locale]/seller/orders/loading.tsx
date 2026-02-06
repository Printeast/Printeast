import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const MOCK_USER = { email: "loading...", role: "SELLER" as const };

export default function Loading() {
    return (
        <DashboardLayout user={MOCK_USER} fullBleed>
            <div className="min-h-full w-full bg-[#F9F8F6] px-10 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-7 w-7 rounded-md" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-9 w-24 rounded-lg" />
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center gap-3 mb-5">
                    <Skeleton className="h-11 flex-1 rounded-lg" />
                    <Skeleton className="h-11 w-40 rounded-lg" />
                    <Skeleton className="h-11 w-32 rounded-lg" />
                </div>

                {/* Filter Badges */}
                <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                {/* Orders Table */}
                <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 p-4 flex gap-4">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-24" />
                        ))}
                    </div>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-1 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

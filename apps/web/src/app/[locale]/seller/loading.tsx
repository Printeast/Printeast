import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

// Use a simplified mock user for the loading shell
const MOCK_USER = { email: "loading...", role: "SELLER" as const };

export default function Loading() {
    return (
        <DashboardLayout user={MOCK_USER} fullBleed>
            <div className="min-h-full w-full bg-slate-50/50 p-8">
                {/* Header Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-[200px] w-full rounded-2xl" />
                        <Skeleton className="h-[200px] w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

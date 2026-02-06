import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const MOCK_USER = { email: "loading...", role: "SELLER" as const };

export default function Loading() {
    return (
        <DashboardLayout user={MOCK_USER} fullBleed>
            <div className="min-h-full w-full bg-[#F9F8F6] px-10 py-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-10">
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-12 w-full rouded-lg" />
                        <div className="grid grid-cols-1 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200/60 space-y-4">
                                    <Skeleton className="h-[200px] w-full rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200/60 space-y-4">
                            <Skeleton className="h-6 w-32" />
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-2 w-2 rounded-full" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

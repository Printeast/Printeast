import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const MOCK_USER = { email: "loading...", role: "SELLER" as const };

export default function Loading() {
    return (
        <DashboardLayout user={MOCK_USER} fullBleed>
            <div className="min-h-full w-full bg-blue-50/50 relative">
                <div className="mx-auto max-w-[1180px] px-8 py-10 space-y-12">
                    {/* Header */}
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-96" />
                    </div>

                    {/* Seamless Integrations */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-10 w-10 rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-1 p-2 bg-white rounded-2xl border border-slate-200/60">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="p-6 space-y-4">
                                    <Skeleton className="h-14 w-14 rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-24" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* All Integrations Grid */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-60" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200/60">
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const MOCK_USER = { email: "loading...", role: "SELLER" as const };

export default function Loading() {
    return (
        <DashboardLayout user={MOCK_USER} fullBleed>
            <div className="min-h-full w-full bg-[#F9F8F6] relative">
                <div className="relative z-10 px-10 py-10 max-w-[1400px] mx-auto">
                    {/* Header */}
                    <div className="mb-10 space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-96 rounded-lg" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                        <Skeleton className="h-5 w-2/3 max-w-2xl" />
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200/60 p-8 flex flex-col space-y-6">
                                <div className="space-y-3">
                                    <Skeleton className="h-7 w-48" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                                <Skeleton className="h-[200px] w-full rounded-lg" />
                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-2 w-2 rounded-full" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

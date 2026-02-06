import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const MOCK_USER = { email: "loading...", role: "SELLER" as const };

export default function Loading() {
    return (
        <DashboardLayout user={MOCK_USER} fullBleed>
            <div className="min-h-full w-full bg-[#F9F8F6] px-10 py-10">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <Skeleton className="h-10 w-64 mx-auto" />
                        <Skeleton className="h-5 w-96 mx-auto" />
                    </div>

                    {/* Search Hero */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60 space-y-6">
                        <Skeleton className="h-14 w-full rounded-xl" />
                        <div className="flex justify-center gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    {/* Support Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200/60 text-center space-y-4 flex flex-col items-center">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-10 w-full rounded-lg mt-auto" />
                            </div>
                        ))}
                    </div>

                    {/* FAQ Mock */}
                    <div className="space-y-4 pt-8">
                        <Skeleton className="h-8 w-48" />
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

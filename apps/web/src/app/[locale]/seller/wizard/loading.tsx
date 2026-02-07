import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#F9F8F6]">
            {/* Sidebar Skeleton */}
            <aside className="w-64 bg-white border-r border-slate-200 p-4 space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="space-y-2">
                    {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full rounded-lg" />
                    ))}
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <main className="flex-1 p-8 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-4">
                    <Skeleton className="h-11 flex-1 rounded-xl" />
                    <Skeleton className="h-11 w-24 rounded-xl" />
                    <Skeleton className="h-11 w-24 rounded-xl" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-[380px] p-4 flex flex-col gap-4">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-8 w-20 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

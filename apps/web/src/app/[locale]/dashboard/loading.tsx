
export default function DashboardLoading() {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div className="h-10 w-48 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-10 w-32 bg-slate-100 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
                ))}
            </div>
            <div className="h-[400px] bg-slate-50 border border-slate-100 rounded-2xl animate-pulse w-full" />
        </div>
    )
}

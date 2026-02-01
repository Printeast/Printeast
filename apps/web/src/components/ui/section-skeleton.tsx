export const SectionSkeleton = ({ height = "h-[600px]" }: { height?: string }) => (
    <div className={`w-full ${height} bg-slate-50/50 animate-pulse rounded-3xl my-12 mx-auto max-w-7xl border border-slate-100/50`} />
)

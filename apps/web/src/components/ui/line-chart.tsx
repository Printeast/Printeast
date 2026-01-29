import { cn } from "@/lib/utils";

type ChartPoint = {
    label: string;
    value: number;
};

interface LineChartProps {
    data: ChartPoint[];
    className?: string;
    height?: number;
    ariaLabel?: string;
}

export function LineChart({ data, className, height = 160, ariaLabel = "line chart" }: LineChartProps) {
    if (!data.length) return null;
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    const points = data.map((d, i) => {
        const x = data.length === 1 ? 50 : (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxValue) * 70 - 10;
        return `${x},${y}`;
    });

    const linePath = `M ${points.join(" L ")}`;
    const areaPath = `${linePath} L 100,100 L 0,100 Z`;

    return (
        <div className={cn("w-full", className)} role="img" aria-label={ariaLabel}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" height={height} className="w-full">
                <defs>
                    <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="var(--dash-accent-start)" />
                        <stop offset="100%" stopColor="var(--dash-accent-end)" />
                    </linearGradient>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(255,146,88,0.35)" />
                        <stop offset="100%" stopColor="rgba(255,108,119,0.04)" />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#chartFill)" />
                <path d={linePath} fill="none" stroke="url(#chartLine)" strokeWidth="2.2" />
                {points.map((point, index) => {
                    const [x, y] = point.split(",").map(Number);
                    return <circle key={`${x}-${index}`} cx={x} cy={y} r="1.8" fill="var(--dash-accent-start)" />;
                })}
            </svg>
            <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] dash-muted">
                {data.map((d) => (
                    <span key={d.label}>{d.label}</span>
                ))}
            </div>
        </div>
    );
}

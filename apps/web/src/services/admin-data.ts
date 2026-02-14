// Admin data service stubs. Replace implementations with real API calls when backend is ready.

export type OverviewMetrics = {
    revenue: number;
    revenueDeltaPct: number;
    activeUsers: { total: number; sellers: number; artists: number; customers: number };
    orderVolume: number;
    orderDeltaPct: number;
    averageOrderValue: number;
};

export type ActivityItem = { title: string; desc: string; badge: string; time: string };
export type MapPoint = { lat: number; lng: number; intensity: number };
export type StatusBar = { apiStatus: string; dbStatus: string; hubResponseMs: number; version: string; build: string };

export async function getOverviewData(): Promise<{
    metrics: OverviewMetrics;
    activity: ActivityItem[];
    map: { points: MapPoint[]; topTerritory: string; dailyGrowthPct: number };
    status: StatusBar;
}> {
    return {
        metrics: {
            revenue: 4284590,
            revenueDeltaPct: 12.4,
            activeUsers: { total: 12842, sellers: 4210, artists: 5120, customers: 3512 },
            orderVolume: 8102,
            orderDeltaPct: 8.2,
            averageOrderValue: 84.5,
        },
        activity: [
            { title: "New Enterprise Seller Joined", desc: "Nordic Apparel Corp. completed vetting process.", badge: "New", time: "2 mins ago" },
            { title: "High-volume batch started", desc: "Production Batch #9241 (2,500 units) initiated in Berlin Hub.", badge: "Ops", time: "14 mins ago" },
            { title: "Security Audit Completed", desc: "Weekly platform integrity scan finished with 0 vulnerabilities.", badge: "Sec", time: "1 hour ago" },
            { title: "Featured Artist Selected", desc: "Seasonal Spotlight: Abstract Geometric Collection.", badge: "Art", time: "3 hours ago" },
        ],
        map: {
            points: [
                { lat: 37.77, lng: -122.41, intensity: 0.8 },
                { lat: 48.85, lng: 2.35, intensity: 0.6 },
                { lat: 52.52, lng: 13.4, intensity: 0.7 },
                { lat: 28.61, lng: 77.2, intensity: 0.9 },
                { lat: -33.86, lng: 151.2, intensity: 0.5 },
            ],
            topTerritory: "Asia-Pacific",
            dailyGrowthPct: 18,
        },
        status: { apiStatus: "Operational", dbStatus: "Optimal", hubResponseMs: 42, version: "4.2.0", build: "82401" },
    };
}

export type Incident = { id: string; title: string; service: string; detected: string; duration: string };
export type IncidentLog = { time: string; msg: string; service: string; error?: boolean };
export async function getAlertsData(): Promise<{
    metrics: { globalHealthPct: number; apiLatencyMs: number; errorRatePct: number; throughputPerS: number; dbConnections: number };
    urgent: Incident[];
    investigation: Incident[];
    logs: IncidentLog[];
}> {
    return {
        metrics: { globalHealthPct: 98.2, apiLatencyMs: 42, errorRatePct: 0.02, throughputPerS: 12400, dbConnections: 842 },
        urgent: [
            { id: "INC-8892-PA", title: "API Gateway Timeout — Production Cluster A", service: "API", detected: "4m ago", duration: "00:04:12" },
            { id: "INC-8895-CH", title: "Payment Gateway Failure — Stripe-Relay-01", service: "Checkout", detected: "22m ago", duration: "00:01:45" },
        ],
        investigation: [
            { id: "INC-8898-ST", title: "High Disk I/O Latency — Storage Node 04", service: "Storage", detected: "22m ago", duration: "00:22:30" },
        ],
        logs: [
            { time: "14:22:15.804", msg: "Worker pool resized +2 nodes", service: "eks-autoscale-manager" },
            { time: "14:18:42.891", msg: "DB connection timeout: primary-01", service: "psql-connector-agent", error: true },
            { time: "14:15:10.223", msg: "Config sync complete (v2.1.04)", service: "deploy-orchestrator" },
            { time: "14:10:02.115", msg: "SSL refresh: api.production.net", service: "cert-manager" },
        ],
    };
}

export type OrderRow = {
    id: string;
    seller: string;
    role: "artist" | "individual";
    contact: string;
    status: string;
    value: string;
    fee: string;
    placedAt: string; // ISO string
    source: string;
    provider: string;
};

export async function getOrders(): Promise<OrderRow[]> {
    return [
        {
            id: "ORD-93011",
            seller: "Vertex Merch Store",
            role: "artist",
            contact: "Jordan Rivera",
            status: "In Production",
            value: "$124.50",
            fee: "$18.67",
            placedAt: "2025-02-11T10:45:00Z",
            source: "Vertex",
            provider: "PrintX",
        },
        {
            id: "ORD-92877",
            seller: "Creative Hub",
            role: "individual",
            contact: "Alex Chen",
            status: "Shipped",
            value: "$45.00",
            fee: "$6.75",
            placedAt: "2024-11-05T09:12:00Z",
            source: "Creative",
            provider: "EuroPrint",
        },
        {
            id: "ORD-92533",
            seller: "Studio Noir",
            role: "artist",
            contact: "Morgan Blake",
            status: "Pending",
            value: "$210.20",
            fee: "$31.53",
            placedAt: "2024-06-23T16:30:00Z",
            source: "Studio",
            provider: "Textile",
        },
        {
            id: "ORD-91984",
            seller: "Elite Apparel",
            role: "artist",
            contact: "Taylor Swift",
            status: "Delivered",
            value: "$78.99",
            fee: "$11.85",
            placedAt: "2023-12-19T13:15:00Z",
            source: "Elite",
            provider: "PrintX",
        },
        {
            id: "ORD-91872",
            seller: "Urban Print Co.",
            role: "individual",
            contact: "Sam Wilson",
            status: "Cancelled",
            value: "$32.00",
            fee: "$4.80",
            placedAt: "2023-08-03T11:20:00Z",
            source: "Urban",
            provider: "EuroPrint",
        },
        {
            id: "ORD-93110",
            seller: "Galaxy Tees",
            role: "individual",
            contact: "Nina Patel",
            status: "In Production",
            value: "$189.40",
            fee: "$22.10",
            placedAt: "2025-03-08T08:05:00Z",
            source: "Galaxy",
            provider: "Textile",
        },
        {
            id: "ORD-92601",
            seller: "Canvas Collective",
            role: "artist",
            contact: "Leo Martinez",
            status: "Shipped",
            value: "$256.10",
            fee: "$34.22",
            placedAt: "2024-07-14T15:40:00Z",
            source: "Canvas",
            provider: "PrintX",
        },
    ];
}

export type SlaCard = { title: string; vendor: string; affected: string; time: string; tag: string };
export async function getSlaBreaches(): Promise<{ metrics: { total: number; critical: number; avgResolutionHrs: number; compliance: number }; cards: SlaCard[] }> {
    return {
        metrics: { total: 142, critical: 28, avgResolutionHrs: 4.2, compliance: 98.4 },
        cards: [
            { title: "Production Delay > 48h", vendor: "Global Print Solutions", affected: "54 Orders", time: "2h ago", tag: "CRITICAL" },
            { title: "Shipping Label Not Created", vendor: "EuroPrint Network", affected: "12 Orders", time: "5h ago", tag: "HIGH PRIORITY" },
            { title: "Stockout: Premium Tee Black XL", vendor: "Textile Hub Inc.", affected: "89 Orders", time: "1d ago", tag: "STANDARD" },
            { title: "API Handshake Failure", vendor: "DirectShip Logistics", affected: "412 Orders", time: "Just now", tag: "CRITICAL" },
            { title: "QC Rejection Rate > 15%", vendor: "Pacific Apparel Co.", affected: "24 Orders", time: "8h ago", tag: "HIGH PRIORITY" },
        ],
    };
}

export type ReprintRow = { id: string; reason: string; vendor: string; status: string };
export async function getReprints(): Promise<{ summary: { pending: number; processed24h: number; commonIssue: string; avgTurnaroundDays: number }; rows: ReprintRow[] }> {
    return {
        summary: { pending: 24, processed24h: 142, commonIssue: "Print Error", avgTurnaroundDays: 1.2 },
        rows: [
            { id: "ORD-90214", reason: "Damaged in Transit", vendor: "PrintX Global", status: "Awaiting Approval" },
            { id: "ORD-90198", reason: "Print Error (Blurry)", vendor: "LithoCo USA", status: "Pending Vendor Response" },
            { id: "ORD-90152", reason: "Wrong Item Sent", vendor: "PrintX Global", status: "In Production" },
            { id: "ORD-89945", reason: "Severe Fabric Defect", vendor: "TexStyle Solutions", status: "Vendor Disputed" },
        ],
    };
}

export type RefundRow = { id: string; customer: string; amount: string; reason: string; status: string };
export async function getRefunds(): Promise<{ summary: { pendingValue: number; avgProcessingHours: number; successRate: number }; rows: RefundRow[] }> {
    return {
        summary: { pendingValue: 12450.8, avgProcessingHours: 4.2, successRate: 99.1 },
        rows: [
            { id: "ORD-90231", customer: "Michael Chen", amount: "$145.00", reason: "Print quality - colors...", status: "Pending Review" },
            { id: "ORD-88452", customer: "Sarah Jenkins", amount: "$210.50", reason: "Damaged during...", status: "In Verification" },
            { id: "ORD-90510", customer: "Elena Rodriguez", amount: "$55.00", reason: "Late delivery - past...", status: "Pending Review" },
            { id: "ORD-89223", customer: "David Smith", amount: "$389.00", reason: "Duplicate order...", status: "Pending Review" },
            { id: "ORD-90667", customer: "Alice Wong", amount: "$92.40", reason: "Wrong size delivered...", status: "Pending Review" },
        ],
    };
}

export type HealthService = { name: string; tier: string; status: string };
export async function getHealthData(): Promise<{
    scorePct: number;
    scoreDeltaPct: number;
    metricsToday: { successfulOrders: number; failedPayments: number; newSignups: number; failRatePct: number; peakTime: string };
    services: HealthService[];
}> {
    return {
        scorePct: 98.4,
        scoreDeltaPct: 0.2,
        metricsToday: { successfulOrders: 1284, failedPayments: 12, newSignups: 452, failRatePct: 1.2, peakTime: "14:00 UTC" },
        services: [
            { name: "core-api.production.main", tier: "Core API", status: "Operational" },
            { name: "auth-service-01", tier: "Auth Service", status: "Operational" },
            { name: "rds-primary-cluster", tier: "DB Cluster", status: "Operational" },
            { name: "redis-cache-eu-1", tier: "Cache Layer", status: "Operational" },
            { name: "global-edge-network", tier: "CDN Edge", status: "Operational" },
            { name: "img-worker-04", tier: "Image Processing", status: "Operational" },
            { name: "elastic-node-prod", tier: "Search Index", status: "Operational" },
            { name: "rabbitmq-cluster", tier: "Message Queue", status: "Operational" },
        ],
    };
}

// Placeholder for bulk actions jobs/logs if needed later.
export type BulkActionJob = { jobId: string; action: string; targetCount: number; status: string; createdAt: string; finishedAt?: string };
export async function getBulkActionsJobs(): Promise<BulkActionJob[]> {
    return [
        { jobId: "BA-12014", action: "Bulk Update Status", targetCount: 186, status: "Completed", createdAt: "2025-02-11T10:15:00Z", finishedAt: "2025-02-11T10:18:00Z" },
        { jobId: "BA-12015", action: "Batch Export Invoices", targetCount: 72, status: "Completed", createdAt: "2025-02-10T18:40:00Z", finishedAt: "2025-02-10T18:41:30Z" },
        { jobId: "BA-12016", action: "Bulk Change Vendor", targetCount: 44, status: "In Progress", createdAt: "2025-02-12T07:05:00Z" },
        { jobId: "BA-12017", action: "Bulk Update Status", targetCount: 312, status: "Queued", createdAt: "2025-02-12T09:20:00Z" },
    ];
}

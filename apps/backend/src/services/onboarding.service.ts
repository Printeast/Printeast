import { prisma } from "@repo/database";
import { redis } from "../config/redis";

/**
 * BRUTAL PERFORMANCE ONBOARDING SERVICE
 * 
 * DESIGN PRINCIPLES:
 * 1. Single DB Roundtrip: All state fetched in one go.
 * 2. Atomic Role Update: Single nested statement.
 * 3. Pre-calculated Results: Frontend gets a ready-to-use object.
 */

const CACHE_TTL = 3600;
const CACHE_PREFIX = "onboard:v3:";

const ROLE_PATH_MAP: Record<string, string> = {
    "SELLER": "/seller",
    "CREATOR": "/creator",
    "CUSTOMER": "/customer",
    "ADMIN": "/admin"
};

interface OnboardResult {
    success: boolean;
    user: any;
    redirectTo: string;
    alreadyOnboarded: boolean;
    cached?: boolean;
}

/**
 * FASTEST PATH: Immediate Result from Cache
 */
export async function checkOnboardingStatus(userId: string): Promise<OnboardResult | null> {
    try {
        const cached = await redis.get(`${CACHE_PREFIX}full:${userId}`);
        if (cached) return { ...JSON.parse(cached), cached: true };
    } catch (e) {
        console.warn("[Onboard] Redis Fail:", e);
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            tenantId: true,
            roles: { select: { role: { select: { name: true } } } }
        }
    });

    if (!user) return null;
    const role = user.roles[0]?.role?.name;

    if (role && role !== "CUSTOMER" && role !== "PENDING") {
        const result: OnboardResult = {
            success: true,
            user: { id: user.id, tenantId: user.tenantId },
            redirectTo: ROLE_PATH_MAP[role] || "/dashboard",
            alreadyOnboarded: true,
            cached: false
        };
        redis.setex(`${CACHE_PREFIX}full:${userId}`, CACHE_TTL, JSON.stringify(result)).catch(() => { });
        return result;
    }

    return null;
}

/**
 * ATOMIC PERFORMANCE ONBOARDING
 * Single-query state fetch + Atomic setup.
 */
export async function performOnboarding(payload: {
    userId: string;
    role: "SELLER" | "CREATOR" | "CUSTOMER";
    businessName?: string;
    onboardingData?: Record<string, any>;
}): Promise<OnboardResult> {
    const { userId, role, businessName, onboardingData } = payload;

    // 1. Transaction with "One-Query" State Retrieval
    const finalState = await prisma.$transaction(async (tx) => {
        // INTELLIGENT FETCH: Get everything needed in one roundtrip
        const user = await tx.user.findUnique({
            where: { id: userId },
            include: {
                roles: { select: { role: { select: { name: true } } } },
                creatorProfile: { select: { id: true } },
                tenant: {
                    include: { vendors: { select: { id: true }, take: 1 } }
                }
            }
        });

        if (!user) throw new Error("User not found");

        const currentRole = user.roles[0]?.role?.name;

        // Safety: Already onboarded?
        if (currentRole && currentRole !== "CUSTOMER" && currentRole !== "PENDING") {
            return { user, role: currentRole, alreadyOnboarded: true };
        }

        // 2. ATOMIC UPDATES
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                roles: {
                    deleteMany: {},
                    create: { role: { connect: { name: role } } }
                },
                onboardingData: onboardingData || {},
            },
            include: { roles: { select: { role: { select: { name: true } } } } }
        });

        const tasks: Promise<any>[] = [];

        // Setup Creator (Atomic Upsert)
        if (role === "CREATOR" && !user.creatorProfile) {
            tasks.push(tx.creator.upsert({
                where: { userId },
                create: { userId },
                update: {}
            }));
        }

        // Setup Vendor (Intelligent check from first query result)
        if (role === "SELLER" && user.tenantId && (!user.tenant?.vendors || user.tenant.vendors.length === 0)) {
            tasks.push(tx.vendor.create({
                data: {
                    tenantId: user.tenantId,
                    name: businessName || `${user.email.split('@')[0]}'s Store`
                }
            }));
        }

        if (tasks.length > 0) await Promise.all(tasks);

        return { user: updatedUser, role, alreadyOnboarded: false };
    }, {
        maxWait: 5000,
        timeout: 10000
    });

    // 3. Post-Success: Construct and Cache
    const result: OnboardResult = {
        success: true,
        user: { id: finalState.user.id, tenantId: (finalState.user as any).tenantId },
        redirectTo: ROLE_PATH_MAP[finalState.role] || "/dashboard",
        alreadyOnboarded: finalState.alreadyOnboarded
    };

    await redis.setex(`${CACHE_PREFIX}full:${userId}`, CACHE_TTL, JSON.stringify(result));

    return result;
}

export async function invalidateUserCache(userId: string): Promise<void> {
    await redis.del(`${CACHE_PREFIX}full:${userId}`).catch(() => { });
}

export async function prewarmUserCache(userId: string): Promise<void> {
    await checkOnboardingStatus(userId);
}

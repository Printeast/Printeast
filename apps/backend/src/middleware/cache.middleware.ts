import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

/**
 * Higher-order function to cache GET responses/
 * @param durationInSeconds - How long to cache the data (default: 60s)
 */
export const cacheMiddleware = (durationInSeconds = 60) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        // 1. Construct a unique key
        // We include Tenant ID to ensure strict data isolation (Multi-tenancy)
        const tenantId = (req as any).tenantId || "public";
        const key = `cache:${tenantId}:${req.originalUrl}`;

        try {
            // 2. Check Redis
            const cachedData = await redis.get(key);

            if (cachedData) {
                console.log(`[Cache] HIT: ${key}`);
                return res.json(JSON.parse(cachedData));
            }

            console.log(`[Cache] MISS: ${key}`);

            // 3. Intercept the response to save it to Redis
            const originalSend = res.json;

            res.json = (body: any): Response<any, Record<string, any>> => {
                // Restore original method
                res.json = originalSend;

                // Store in Redis (Async)
                redis.set(key, JSON.stringify(body), "EX", durationInSeconds).catch((err) => {
                    console.error("[Cache] Write Error:", err);
                });

                // Send to client
                return originalSend.call(res, body);
            };

            next();
        } catch (err) {
            console.error("[Cache] Read Error:", err);
            // If cache fails, just proceed to DB (Fallback)
            next();
        }
    };
};

/**
 * Utility to manually invalidate cache (e.g., after an update)
 */
export const invalidateCache = async (pattern: string) => {
    const keys = await redis.keys(`cache:${pattern}*`);
    if (keys.length > 0) {
        await redis.del(keys);
    }
};

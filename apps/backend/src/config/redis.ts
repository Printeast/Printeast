import Redis from "ioredis";
import { env } from "./env";

// Shared Redis options ensures we can easily swap providers (Upstash/AWS ElastiCache)
const redisOptions = {
    maxRetriesPerRequest: null, // Critical for BullMQ
    enableReadyCheck: false,
};

// Main Data Cache Client
export const redis = new Redis(env.REDIS_URL, redisOptions);

redis.on("error", (err) => {
    console.error("[Redis] Data Client Error:", err);
});

redis.on("connect", () => {
    console.log("[Redis] Data Client Connected");
});

// Subscriber Client (for Pub/Sub events if needed)
export const redisSubscriber = new Redis(env.REDIS_URL, redisOptions);

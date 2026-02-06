import { Queue, QueueOptions } from "bullmq";
import { env } from "../config/env";
import IORedis from "ioredis";

// Reuse the connection config, but BullMQ needs its own connection instances
const connection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

connection.on("error", (err) => {
    console.error("[Redis] Queue Connection Error:", err);
});

const defaultOptions: QueueOptions = {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
        removeOnComplete: true, // Keep memory low
        removeOnFail: false,   // Keep failed jobs for debugging
    },
};

// Factory to create queues consistently
export const createQueue = (name: string) => {
    return new Queue(name, defaultOptions);
};

export const Queues = {
    // We will register specific queues here (e.g. 'orders', 'notifications')
    orders: createQueue("orders"),
    notifications: createQueue("notifications"),
    fulfillment: createQueue("fulfillment"),
};

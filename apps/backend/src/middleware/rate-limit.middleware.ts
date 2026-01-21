import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";
import { env } from "../config/env";

const redis = new Redis(env.REDIS_URL);

const isTest = env.NODE_ENV === "test";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isTest ? 0 : 5,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: isTest ? 0 : 100,
  skip: () => isTest,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
});

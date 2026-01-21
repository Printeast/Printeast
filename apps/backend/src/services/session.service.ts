import Redis from "ioredis";
import { env } from "../config/env";

const redis = new Redis(env.REDIS_URL);

export class SessionService {
  private static PREFIX = "session:";

  static async whitelistSession(
    userId: string,
    token: string,
    ttl: number = 604800,
  ) {
    await redis.set(`${this.PREFIX}${token}`, userId, "EX", ttl);
  }

  static async isSessionValid(token: string): Promise<boolean> {
    return !!(await redis.get(`${this.PREFIX}${token}`));
  }

  static async revokeSession(token: string) {
    await redis.del(`${this.PREFIX}${token}`);
  }
}

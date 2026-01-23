import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { env } from "../config/env";

const redis = new Redis(env.REDIS_URL);

type TokenPayload = { userId: string; role: string; tenantId?: string | null };

export class TokenService {
  static async generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Whitelist tokens in Redis
    await redis.set(`access_token:${accessToken}`, "valid", "EX", 15 * 60); // 15m
    await redis.set(`refresh_token:${refreshToken}`, "valid", "EX", 7 * 24 * 60 * 60); // 7d

    return {
      accessToken,
      refreshToken,
    };
  }

  static async verifyAccessToken(token: string) {
    try {
      const isValid = await redis.get(`access_token:${token}`);
      if (!isValid) return null;

      return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload & {
        iat: number;
        exp: number;
      };
    } catch {
      return null;
    }
  }

  static async verifyRefreshToken(token: string) {
    try {
      const isValid = await redis.get(`refresh_token:${token}`);
      if (!isValid) return null;

      return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload & {
        iat: number;
        exp: number;
      };
    } catch {
      return null;
    }
  }

  static async revokeToken(token: string, type: 'access' | 'refresh') {
    const key = type === 'access' ? `access_token:${token}` : `refresh_token:${token}`;
    await redis.del(key);
  }
}

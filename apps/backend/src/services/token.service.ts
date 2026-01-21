import jwt from "jsonwebtoken";
import { env } from "../config/env";

type TokenPayload = { userId: string; role: string };

export class TokenService {
  static generateTokens(payload: TokenPayload) {
    return {
      accessToken: jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
      }),
      refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
      }),
    };
  }

  static verifyAccessToken(token: string) {
    try {
      return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload & {
        iat: number;
        exp: number;
      };
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string) {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload & {
        iat: number;
        exp: number;
      };
    } catch {
      return null;
    }
  }
}

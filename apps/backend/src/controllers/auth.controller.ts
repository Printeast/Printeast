import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcrypt";
import { prisma } from "@repo/database";
import { RegisterSchema, LoginSchema } from "@repo/types";
import { TokenService } from "../services/token.service";
import { SessionService } from "../services/session.service";
import { AppError } from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { env } from "../config/env";

const COOKIE = "refreshToken";
const OPTS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 604800000,
};

export const register: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError("Invalid input", 400));

    const { email, password, role } = parsed.data;
    if (await prisma.user.findUnique({ where: { email } }))
      return next(new AppError("User exists", 409));

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 12),
        role: role,
      },
      select: { id: true, email: true, role: true },
    });

    const { accessToken, refreshToken } = TokenService.generateTokens({
      userId: user.id,
      role: user.role,
    });
    await SessionService.whitelistSession(user.id, refreshToken);

    res
      .cookie(COOKIE, refreshToken, OPTS)
      .status(201)
      .json({ success: true, data: { user, accessToken } });
  },
);

export const login: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError("Auth required", 400));

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return next(new AppError("Invalid", 401));

    const { accessToken, refreshToken } = TokenService.generateTokens({
      userId: user.id,
      role: user.role,
    });
    await SessionService.whitelistSession(user.id, refreshToken);

    res
      .cookie(COOKIE, refreshToken, OPTS)
      .status(200)
      .json({
        success: true,
        data: {
          user: { id: user.id, email: user.email, role: user.role },
          accessToken,
        },
      });
  },
);

export const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.cookies[COOKIE] || req.body[COOKIE];
    if (token) await SessionService.revokeSession(token);
    res.clearCookie(COOKIE).status(204).send();
  },
);

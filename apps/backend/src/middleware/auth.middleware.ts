import { Request, Response, NextFunction, RequestHandler } from "express";
import { TokenService } from "../services/token.service";
import { prisma } from "@repo/database";

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const protect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = TokenService.verifyAccessToken(token);
  if (!decoded) return res.status(401).json({ message: "Invalid token" });

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) return res.status(401).json({ message: "User not found" });

  (req as AuthRequest).user = { userId: user.id, role: user.role };
  return next();
};

export const authorize =
  (...roles: string[]): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user || !roles.includes(user.role))
      return res.status(403).json({ message: "Forbidden" });
    return next();
  };

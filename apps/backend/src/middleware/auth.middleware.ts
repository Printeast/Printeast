import { Request, Response, NextFunction, RequestHandler } from "express";
import { TokenService } from "../services/token.service";
import { prisma } from "@repo/database";

// We define our own Role in schema now, but @repo/types might still have the Enum. 
// Ideally we should use the string from DB.
// But for type safety in 'user' object, we cast to string or strict Role.
// If @repo/types is shared, it might need update, but we can treat role as string here.

import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env";

const supabase = createClient(env.SUPABASE_URL || "", env.SUPABASE_ANON_KEY || "");

export interface AuthRequest extends Request {
  user?: { userId: string; role: string; tenantId?: string | null };
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

  console.log(`[AuthMiddleware] Verifying token for: ${req.method} ${req.url}`);

  // 1. Try to verify via Supabase
  const { data: { user: sbUser }, error: sbError } = await supabase.auth.getUser(token);

  if (sbUser && sbUser.email) {
    console.log(`[AuthMiddleware] Supabase user found: ${sbUser.email}`);
    // Check if user exists in our DB, if not, create on the fly
    let user = await prisma.user.findFirst({
      where: { email: sbUser.email },
      include: { roles: { include: { role: true } } }
    }) as any;

    if (!user) {
      // Create user in our DB synced with Supabase
      user = await prisma.user.create({
        data: {
          id: sbUser.id, // Use same ID for consistency
          email: sbUser.email,
          status: "ACTIVE",
          roles: {
            create: {
              role: { connect: { name: "CUSTOMER" } }
            }
          }
        },
        include: { roles: { include: { role: true } } }
      });
    }

    const primaryRole = user?.roles?.[0]?.role?.name || "CUSTOMER";

    (req as AuthRequest).user = {
      userId: user!.id,
      role: primaryRole,
      tenantId: user!.tenantId
    };
    return next();
  }

  // 2. Fallback to local TokenService (for internal tokens/migration)
  const decoded = await TokenService.verifyAccessToken(token);
  if (!decoded) {
    const message = sbError ? `Supabase: ${sbError.message}` : "Invalid or expired token";
    return res.status(401).json({ message });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { roles: { include: { role: true } } }
  });
  if (!user) return res.status(401).json({ message: "User not found" });

  const primaryRole = user.roles[0]?.role.name || "CUSTOMER";

  (req as AuthRequest).user = {
    userId: user.id,
    role: primaryRole,
    tenantId: user.tenantId
  };
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

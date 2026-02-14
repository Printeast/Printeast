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
  user?: {
    userId: string;
    role: string; // Current effective role
    roles: string[]; // All assigned roles
    tenantId?: string | null
  };
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

    // Check email verification from Supabase
    const isEmailVerified = !!sbUser.email_confirmed_at;
    const targetStatus = isEmailVerified ? "ACTIVE" : "PENDING_VERIFICATION";

    // Check if user exists in our DB
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: sbUser.id },
          { email: sbUser.email }
        ]
      },
      include: { roles: { include: { role: true } } }
    }) as any;

    if (!user) {
      let userTenantId: string | null = null;
      const defaultTenant = await prisma.tenant.findFirst({ where: { slug: "printeast" } });
      userTenantId = defaultTenant?.id || null;

      user = await prisma.user.create({
        data: {
          id: sbUser.id,
          email: sbUser.email,
          status: targetStatus,
          tenantId: userTenantId,
          roles: {
            create: {
              role: { connect: { name: "CUSTOMER" } }
            }
          }
        },
        include: { roles: { include: { role: true } } }
      });
    } else {
      if (isEmailVerified && user.status === "PENDING_VERIFICATION") {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { status: "ACTIVE" },
          include: { roles: { include: { role: true } } }
        });
      }
    }

    const isDev = process.env.NODE_ENV !== "production";
    if (!isDev && (!isEmailVerified || user.status !== "ACTIVE")) {
      return res.status(403).json({
        message: "Email not verified. Please check your inbox.",
        code: "EMAIL_NOT_VERIFIED"
      });
    }

    // Determine Roles
    const roleNames = user.roles.map((ur: any) => ur.role.name);
    // Prioritize initialRole from onboardingData for the 'primary' role
    const onboardingData = user.onboardingData as any;
    const effectiveRole = onboardingData?.initialRole || roleNames[0] || "CUSTOMER";

    (req as AuthRequest).user = {
      userId: user!.id,
      role: effectiveRole,
      roles: roleNames,
      tenantId: user!.tenantId
    };
    return next();
  }

  // 2. Fallback to local TokenService
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

  const roleNames = user.roles.map((ur: any) => ur.role.name);
  const onboardingData = user.onboardingData as any;
  const effectiveRole = onboardingData?.initialRole || roleNames[0] || "CUSTOMER";

  (req as AuthRequest).user = {
    userId: user.id,
    role: effectiveRole,
    roles: roleNames,
    tenantId: user.tenantId
  };
  return next();
};


export const authorize =
  (...allowedRoles: string[]): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
      const user = (req as AuthRequest).user;
      if (!user || !user.roles.some(r => allowedRoles.includes(r)))
        return res.status(403).json({ message: "Forbidden" });
      return next();
    };

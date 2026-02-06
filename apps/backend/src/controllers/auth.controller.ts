import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import crypto from "crypto";
import { prisma } from "@repo/database";
import { MagicLinkRequestSchema, MagicLinkVerifySchema } from "@repo/types";
import { TokenService } from "../services/token.service";
import { AppError } from "../utils/app-error";
import { catchAsync } from "../utils/catch-async";
import { env } from "../config/env";
import { MailService } from "../services/mail.service";
import { getTenantId } from "../utils/async-context";

const COOKIE = "refreshToken";
const OPTS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 604800000,
};

/**
 * PHASE 0 MAGIC LINK FLOW
 * 1. Request Link (POST /auth/magic-link)
 * 2. Verify Link (GET /auth/verify?token=...)
 */

export const requestMagicLink: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = MagicLinkRequestSchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError("Email required", 400));

    const { email, role } = parsed.data;
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    let tenantId = getTenantId();

    // Log context for debugging
    console.log(`[Auth] Magic Link Request for ${email}. Tenant: ${tenantId || 'NONE'}`);

    if (!tenantId) {
      // Robust Fallback: Try to find the default tenant if none provided
      const defaultTenant = await prisma.tenant.findFirst({
        where: { slug: 'printeast' }
      });
      if (defaultTenant) {
        tenantId = defaultTenant.id;
        console.log(`[Auth] Falling back to default tenant: ${defaultTenant.name}`);
      } else {
        return next(new AppError("Tenant Context Required or Default Tenant Missing", 400));
      }
    }

    // Role handling: Default to CUSTOMER if not provided.
    const targetRoleName = role || "CUSTOMER";

    await prisma.user.upsert({
      where: {
        tenantId_email: { tenantId, email }
      },
      update: {
        magicLinkToken: token,
        magicLinkExpires: expires,
      },
      create: {
        email,
        tenantId,
        magicLinkToken: token,
        magicLinkExpires: expires,
        status: "PENDING_VERIFICATION",
        roles: {
          create: {
            role: {
              connect: { name: targetRoleName }
            }
          }
        }
      },
    });

    await MailService.sendMagicLink(email, token);

    res.status(200).json({
      success: true,
      message: "Check your email for the magic link"
    });
  }
);

export const verifyMagicLink: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsed = MagicLinkVerifySchema.safeParse(req.body);
    if (!parsed.success) return next(new AppError("Token required", 400));

    const { token } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { magicLinkToken: token },
      include: {
        roles: { include: { role: true } }
      }
    });

    if (!user || !user.magicLinkExpires || user.magicLinkExpires < new Date()) {
      return next(new AppError("Invalid or expired token", 401));
    }

    // Clear token and mark as verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        magicLinkToken: null,
        magicLinkExpires: null,
        status: "ACTIVE"
      },
      select: {
        id: true,
        email: true,
        status: true,
        roles: { include: { role: true } },
        tenantId: true
      }
    });

    const roleNames = updatedUser.roles.map((ur: any) => ur.role.name);
    const primaryRole = roleNames[0] || "CUSTOMER";

    const { accessToken, refreshToken } = await TokenService.generateTokens({
      userId: updatedUser.id,
      role: primaryRole,
      tenantId: updatedUser.tenantId
    });

    res
      .cookie(COOKIE, refreshToken, OPTS)
      .status(200)
      .json({
        success: true,
        data: { user: updatedUser, accessToken },
      });
  }
);

export const onboard: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { role, businessName, onboardingData } = req.body;
    const userId = (req as AuthRequest).user?.userId;

    if (!userId) return next(new AppError("User context required", 401));

    if (!role) return next(new AppError("Role required", 400));

    // 1. Security Check: Is the user already onboarded?
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } }
    });

    if (!currentUser) return next(new AppError("User not found", 404));

    const currentRole = currentUser.roles[0]?.role?.name || "CUSTOMER";

    // Allow re-onboarding if they are already the same role (idempotency)
    // or if they are still a CUSTOMER/PENDING.
    let skipRoleUpdate = false;
    if (currentRole === role) {
      skipRoleUpdate = true;
    } else if (currentRole !== "CUSTOMER" && currentRole !== "PENDING") {
      return next(new AppError("User already onboarded as " + currentRole, 403));
    }

    // 2. Validate Allowed Roles
    const ALLOWED_ONBOARD_ROLES = ["SELLER", "CREATOR", "CUSTOMER"];
    if (!ALLOWED_ONBOARD_ROLES.includes(role)) {
      return next(new AppError("Invalid role selection", 400));
    }

    // 3. Role Assignment
    if (!skipRoleUpdate) {
      await prisma.$transaction(async (tx: any) => {
        await tx.userRole.deleteMany({ where: { userId } });

        await tx.user.update({
          where: { id: userId },
          data: {
            roles: {
              create: {
                role: { connect: { name: role } }
              }
            },
            onboardingData: onboardingData || null
          },
          select: { id: true }
        });
      });
    } else {
      // Just update onboarding data if role is already correct
      await prisma.user.update({
        where: { id: userId },
        data: { onboardingData: onboardingData || null }
      });
    }

    // 3. Handle Role-Specific Data
    // We store the data if models exist. This ensures we capture the input.
    if (role === "CREATOR") {
      // Create an empty Creator profile if one doesn't exist
      const existing = await prisma.creator.findUnique({ where: { userId } });
      if (!existing) {
        await prisma.creator.create({
          data: { userId }
        });
      }
    } else if (role === "SELLER") {
      // For Phase 0, we ensure a Vendor (workspace) is created for sellers.
      // A seller MUST have a workspace to operate.
      const userWithTenant = await prisma.user.findUnique({
        where: { id: userId },
        select: { tenantId: true, email: true }
      });

      if (userWithTenant?.tenantId) {
        // Check if there's already a vendor for this tenant
        const existingVendor = await prisma.vendor.findFirst({
          where: { tenantId: userWithTenant.tenantId }
        });

        if (!existingVendor) {
          const workspaceName = businessName || `${userWithTenant.email.split('@')[0]}'s Store`;
          await prisma.vendor.create({
            data: {
              name: workspaceName,
              tenantId: userWithTenant.tenantId
            }
          });
          console.log(`[Auth] Created workspace: ${workspaceName} for tenant: ${userWithTenant.tenantId}`);
        }
      }
    }
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } }
      }
    });

    res.status(200).json({ success: true, data: { user: updatedUser } });
  }
);

export const logout: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token = req.cookies[COOKIE] || req.body[COOKIE];
    if (token) await TokenService.revokeToken(token, 'refresh');

    const authHeader = req.headers.authorization;
    if (authHeader) {
      const accessToken = authHeader.split(" ")[1];
      if (accessToken) await TokenService.revokeToken(accessToken, 'access');
    }

    res.clearCookie(COOKIE).status(204).send();
  },
);

export const getMe: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      tenantId: true,
      status: true,
      roles: { include: { role: true } }
    },
  });

  res.status(200).json({ success: true, data: { user } });
});

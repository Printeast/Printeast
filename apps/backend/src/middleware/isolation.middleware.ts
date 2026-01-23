import { Request, Response, NextFunction } from "express";
import { runWithTenant } from "../utils/async-context";

export const isolationMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    // 1. Extract Tenant ID from Header (x-tenant-id) or Subdomain
    // Priority: Header > Subdomain > User Session (if authenticated)
    // For "Headless API", explicit header is best practice.

    const tenantIdHeader = req.headers["x-tenant-id"];

    // Also support extracting from user if already authenticated by previous middleware (rare order, but possible)
    // or subdomain if we were doing strict domain mapping.
    // For this phase "Construction of Factory", we assume x-tenant-id or we fallback to allowing 'public' for some routes?
    // RFC says: "Strict discriminator-column isolation".

    // If we are strictly multi-tenant, we might require it.
    // However, some routes (like landing page logic, or super-admin) might not have it.

    let tenantId: string | undefined;

    if (typeof tenantIdHeader === "string") {
        tenantId = tenantIdHeader;
    }

    // If we have a tenantId, we run the rest of the stack in its context
    if (tenantId) {
        runWithTenant(tenantId, () => {
            next();
        });
    } else {
        // If no tenant context, we proceed. Prisma extension should decide if it blocks query or allows global access.
        // For robust security, we might default to blocking unless it's a specific route.
        next();
    }
};

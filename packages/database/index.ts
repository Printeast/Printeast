import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Re-export client and types explicitly to avoid CJS wildcard export warnings in Turbopack
export { PrismaClient } from "@prisma/client";
export type * from "@prisma/client";

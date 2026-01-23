import { z } from "zod";

// 1. AUTH SCHEMAS
export const RoleEnum = z.enum([
  "SUPER_ADMIN",
  "TENANT_ADMIN",
  "CREATOR",
  "SELLER",
  "VENDOR",
  "AFFILIATE",
  "CUSTOMER",
]);

export const RegisterSchema = z.object({
  email: z.string().email(),
  role: RoleEnum.default("CUSTOMER"),
  businessName: z.string().optional(),
});

export const MagicLinkRequestSchema = z.object({
  email: z.string().email(),
  role: RoleEnum.optional(),
  businessName: z.string().optional(),
});

export const MagicLinkVerifySchema = z.object({
  token: z.string(),
});


// 2. STORAGE SCHEMAS
export const UploadSignSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number().max(50 * 1024 * 1024),
});

// 3. ENV VALIDATION (Robustness)
export const ServerConfigSchema = z.object({
  PORT: z.string().default("4000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ALLOWED_ORIGINS: z.string().default("*"),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

// 4. STANDARDIZED API INTERFACES (RFC 6.1 Alignment)
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: unknown;
}

// 5. INFERRED TYPES
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type MagicLinkRequestInput = z.infer<typeof MagicLinkRequestSchema>;
export type MagicLinkVerifyInput = z.infer<typeof MagicLinkVerifySchema>;
export type UploadSignInput = z.infer<typeof UploadSignSchema>;
export type ServerConfig = z.infer<typeof ServerConfigSchema>;
export type Role = z.infer<typeof RoleEnum>;

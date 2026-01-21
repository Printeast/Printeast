import { z } from "zod";

// 1. AUTH SCHEMAS
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["USER", "CREATOR", "SELLER"]).default("USER"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
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
export type LoginInput = z.infer<typeof LoginSchema>;
export type UploadSignInput = z.infer<typeof UploadSignSchema>;
export type ServerConfig = z.infer<typeof ServerConfigSchema>;

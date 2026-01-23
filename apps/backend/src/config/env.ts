import { ServerConfigSchema } from "@repo/types";
import dotenv from "dotenv";

dotenv.config();

const parsed = ServerConfigSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

console.log(`[Config] Supabase URL: ${env.SUPABASE_URL ? 'LOADED' : 'MISSING'}`);
console.log(`[Config] Supabase Anon Key: ${env.SUPABASE_ANON_KEY ? 'LOADED' : 'MISSING'}`);

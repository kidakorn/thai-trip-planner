import "server-only";
import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  ADMIN_SECRET: z.string().min(1),
});

const _env = EnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
});

if (!_env.success) {
  console.error(
    "Missing required environment variables:",
    _env.error.flatten().fieldErrors
  );
  // Only throw in production to allow local dev with partial env
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables. Check your deployment config.");
  }
}

export const env = _env.success ? _env.data : ({} as z.infer<typeof EnvSchema>);

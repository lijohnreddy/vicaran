import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Helper to check if we need Google Cloud auth
const isCloudDeployment =
  process.env.ADK_URL?.includes("googleapis.com") ?? false;

export const env = createEnv({
  server: {
    // Drizzle
    DATABASE_URL: z.string().url(),

    // Supabase
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // ADK
    ADK_URL: z.string().url(),

    // Google AI - for Gemini 3 Pro
    GEMINI_API_KEY: z.string().min(1),

    // Google Cloud - required only for cloud deployment
    GOOGLE_SERVICE_ACCOUNT_KEY_BASE64: isCloudDeployment
      ? z.string().min(1)
      : z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    // Server variables
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GOOGLE_SERVICE_ACCOUNT_KEY_BASE64:
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64,
    ADK_URL: process.env.ADK_URL,

    // Client variables
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  // Skip validation during build so Vercel can build without all env vars
  // Validation still runs at runtime when routes are actually called
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === "build",
});

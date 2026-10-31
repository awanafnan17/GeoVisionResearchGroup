// Environment variable validation for Geo Vision Research Group
// Validates required env vars at startup using Zod v4
// Supports both local development and cloud serverless platforms (Netlify + Neon)

import { z } from "zod";

const envSchema = z.object({
  // Required in all environments
  DATABASE_URL: z
    .string({ error: "DATABASE_URL is required" })
    .min(1, "DATABASE_URL cannot be empty"),
  DIRECT_URL: z.string().optional(),
  NEXTAUTH_URL: z
    .string({ error: "NEXTAUTH_URL is required" })
    .url("NEXTAUTH_URL must be a valid URL"),
  NEXTAUTH_SECRET: z
    .string({ error: "NEXTAUTH_SECRET (or AUTH_SECRET) is required" })
    .min(32, "NEXTAUTH_SECRET (or AUTH_SECRET) must be at least 32 characters"),

  // Email notification addresses with safe fallbacks
  FROM_EMAIL: z
    .string()
    .email("FROM_EMAIL must be a valid email")
    .default("info@geovisionresearchgroup.com"),
  GEOSENTRY_EMAIL: z
    .string()
    .email("GEOSENTRY_EMAIL must be a valid email")
    .default("awanafnan17@gmail.com"),

  // Public vars with Netlify URL fallbacks
  NEXT_PUBLIC_APP_URL: z
    .string({ error: "NEXT_PUBLIC_APP_URL is required" })
    .url("NEXT_PUBLIC_APP_URL must be a valid URL"),
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .min(1, "NEXT_PUBLIC_APP_NAME cannot be empty")
    .default("Geo Vision Research Group"),

  // Optional vars with defaults
  RESEND_API_KEY: z.string().optional().default(""),
  UPLOADTHING_SECRET: z.string().optional().default(""),
  UPLOADTHING_APP_ID: z.string().optional().default(""),
  NEXT_PUBLIC_APP_TAGLINE: z
    .string()
    .optional()
    .default("International Geoscience Consultancy & Training"),
  NEXT_PUBLIC_GEOSENTRY_NAME: z.string().optional().default("GeoSentry"),
  NEXT_PUBLIC_GEOSENTRY_TAGLINE: z
    .string()
    .optional()
    .default("Geological Intelligence | Risk-Based Screening"),
});

export type Env = z.infer<typeof envSchema>;

function extractEmailAddress(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  const match = trimmed.match(/<([^>]+)>/);
  return (match ? match[1] : trimmed).trim();
}

function validateEnv(): Env {
  const normalizedInput = {
    ...process.env,
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || undefined,
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL ||
      process.env.AUTH_URL ||
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      "http://localhost:3000",
    NEXT_PUBLIC_APP_NAME:
      process.env.NEXT_PUBLIC_APP_NAME || "Geo Vision Research Group",
    FROM_EMAIL:
      extractEmailAddress(process.env.FROM_EMAIL) ||
      extractEmailAddress(process.env.ADMIN_NOTIFICATION_EMAIL) ||
      extractEmailAddress(process.env.EMAIL_FROM) ||
      "info@geovisionresearchgroup.com",
    GEOSENTRY_EMAIL:
      extractEmailAddress(process.env.GEOSENTRY_EMAIL) ||
      extractEmailAddress(process.env.GEOSENTRY_MANAGER_EMAIL) ||
      "awanafnan17@gmail.com",
  };

  const result = envSchema.safeParse(normalizedInput);

  if (!result.success) {
    const formatted = result.error.issues.map(
      (issue) => `  - ${issue.path.join(".")}: ${issue.message}`
    );

    const errorMessage = [
      "",
      "=".repeat(60),
      "ENVIRONMENT VALIDATION FAILED",
      "=".repeat(60),
      "The following environment variables are missing or invalid:",
      "",
      ...formatted,
      "",
      "Check your environment configuration and ensure all required vars are set.",
      "=".repeat(60),
      "",
    ].join("\n");

    console.error(errorMessage);
    throw new Error("Environment validation failed. See above for details.");
  }

  return result.data;
}

export const env = validateEnv();

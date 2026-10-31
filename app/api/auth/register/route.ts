import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { apiHandler } from "@/lib/api-handler";
import {
  ConflictError,
  ForbiddenError,
  RateLimitError,
} from "@/lib/api-error";
import {
  createRateLimiter,
  checkRateLimit,
  createAuditLog,
  isDemoPasswordBlocked,
  PREDICTABLE_DEMO_PASSWORDS,
} from "@/lib/security";
import { sanitizeHtml } from "@/lib/utils";

// 5 registrations per 15 minutes per IP
const registerLimiter = createRateLimiter(5, 15 * 60 * 1000);

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .trim(),
    email: z
      .string()
      .email("Please provide a valid email address")
      .max(200)
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .refine(
        (pwd) => !PREDICTABLE_DEMO_PASSWORDS.has(pwd) && !isDemoPasswordBlocked(pwd),
        "This password is too common or reserved. Please choose a stronger password."
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.literal(true, {
      message: "You must accept the Terms of Service and Privacy Policy",
    }),
    role: z.literal("STUDENT").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const POST = apiHandler(async (req, ctx) => {
  // 1. Rate limiting by IP
  if (!checkRateLimit(`register:${ctx.ip}`, registerLimiter)) {
    throw new RateLimitError(
      "Too many registration attempts. Please try again later."
    );
  }

  // 2. Parse raw body and guard against mass assignment & privilege escalation
  let rawBody: Record<string, unknown>;
  try {
    rawBody = (await req.json()) as Record<string, unknown>;
  } catch {
    throw new ForbiddenError("Invalid registration payload");
  }

  const hasMaliciousRole =
    "role" in rawBody &&
    typeof rawBody.role === "string" &&
    rawBody.role !== "STUDENT";

  const hasPrivilegedFields =
    "isAdmin" in rawBody ||
    "permissions" in rawBody ||
    "isSuperAdmin" in rawBody ||
    "roles" in rawBody ||
    "superuser" in rawBody;

  if (hasMaliciousRole || hasPrivilegedFields) {
    await createAuditLog({
      action: "CREATE",
      entity: "User",
      newValue: {
        securityViolation: "Privilege escalation blocked during registration",
        attemptedRole: rawBody.role,
        attemptedFields: Object.keys(rawBody).filter((k) =>
          ["role", "isAdmin", "permissions", "isSuperAdmin", "roles", "superuser"].includes(k)
        ),
      },
      ipAddress: ctx.ip,
      userAgent: ctx.userAgent,
    });

    throw new ForbiddenError(
      "Self-assignment of privileged roles is forbidden. Only student accounts can be registered publicly."
    );
  }

  // 3. Validate input with Zod
  const data = registerSchema.parse(rawBody);

  // 4. Sanitize full name
  const cleanName = sanitizeHtml(data.name).replace(/<[^>]*>/g, "").trim();
  const cleanEmail = data.email.trim().toLowerCase();

  // 5. Duplicate email check
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existingUser) {
    throw new ConflictError(
      "An account with this email address already exists. Please sign in or reset your password."
    );
  }

  // 6. Hash password with bcryptjs (rounds: 12)
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // 7. Persist new student user
  const newUser = await prisma.user.create({
    data: {
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "STUDENT",
      isActive: true,
      emailVerified: new Date(),
      loginAttempts: 0,
      lockedUntil: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  // 8. Audit logging
  await createAuditLog({
    userId: newUser.id,
    action: "CREATE",
    entity: "User",
    entityId: newUser.id,
    newValue: {
      name: newUser.name,
      email: newUser.email,
      role: "STUDENT",
      method: "public_registration",
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  // 9. Return HTTP 201 Created (never return password)
  return NextResponse.json(
    {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "STUDENT" as const,
      },
    },
    { status: 201 }
  );
});

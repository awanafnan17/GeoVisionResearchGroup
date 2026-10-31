import { z } from "zod";
import bcrypt from "bcryptjs";
import { apiHandler } from "@/lib/api-handler";
import { ValidationError, RateLimitError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  createAuditLog,
  createRateLimiter,
  hashToken,
  PREDICTABLE_DEMO_PASSWORDS,
} from "@/lib/security";

const resetPasswordLimiter = createRateLimiter(10, 60 * 60 * 1000);

const resetPasswordSchema = z.object({
  email: z.string().email("Valid email address is required").max(200).trim(),
  token: z.string().min(10, "Reset token is required").max(200).trim(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .refine(
      (val) => !PREDICTABLE_DEMO_PASSWORDS.has(val),
      "This password is a known demonstration credential and cannot be used."
    ),
});

export const POST = apiHandler(async (req, ctx) => {
  if (!checkRateLimit(`reset-password:${ctx.ip}`, resetPasswordLimiter)) {
    throw new RateLimitError("Too many password reset attempts. Please try again later.");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const { email, token, newPassword } = resetPasswordSchema.parse(body);

  const normalizedEmail = email.toLowerCase();
  const hashedToken = await hashToken(token);

  const verificationRecord = await prisma.verificationToken.findFirst({
    where: {
      identifier: normalizedEmail,
      token: hashedToken,
    },
  });

  if (!verificationRecord || verificationRecord.expires <= new Date()) {
    throw new ValidationError(
      "This password reset link is invalid or has expired. Please request a new reset link."
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, email: true, isActive: true },
  });

  if (!user || !user.isActive) {
    throw new ValidationError("Account is unavailable for password reset.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        loginAttempts: 0,
        lockedUntil: null,
      },
    }),
    prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    }),
  ]);

  void createAuditLog({
    userId: user.id,
    action: "UPDATE",
    entity: "User",
    entityId: user.id,
    newValue: { event: "password_reset_completed" },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({
    message: "Your password has been updated. You can now sign in with your new password.",
  });
});

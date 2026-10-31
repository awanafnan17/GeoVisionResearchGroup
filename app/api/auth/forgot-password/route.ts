import { z } from "zod";
import { apiHandler } from "@/lib/api-handler";
import { RateLimitError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  createAuditLog,
  createRateLimiter,
  generateSecureToken,
  hashToken,
} from "@/lib/security";
import { sendPasswordReset } from "@/lib/email";

const forgotPasswordLimiter = createRateLimiter(5, 60 * 60 * 1000);

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(200).trim(),
});

export const POST = apiHandler(async (req, ctx) => {
  if (!checkRateLimit(`forgot-password:${ctx.ip}`, forgotPasswordLimiter)) {
    throw new RateLimitError("Too many password reset requests. Please try again later.");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const { email } = forgotPasswordSchema.parse(body);

  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
    },
  });

  if (user && user.isActive) {
    const rawToken = generateSecureToken();
    const hashedToken = await hashToken(rawToken);
    const expires = new Date(Date.now() + 3600_000);

    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: hashedToken,
        expires,
      },
    });

    void createAuditLog({
      userId: user.id,
      action: "UPDATE",
      entity: "User",
      entityId: user.id,
      newValue: { event: "password_reset_requested" },
      ipAddress: ctx.ip,
      userAgent: ctx.userAgent,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    void sendPasswordReset({
      name: user.name ?? "User",
      email: user.email,
      resetUrl: `${appUrl}/forgot-password?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(user.email)}`,
    });
  }

  return successResponse({
    message: "If an account exists with this email, a password reset link has been sent.",
  });
});

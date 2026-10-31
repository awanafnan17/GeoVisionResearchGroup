import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { NotFoundError, ValidationError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120).trim().optional(),
  image: z.string().max(500).optional().nullable(),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(128)
    .optional(),
});

export const GET = apiHandler(async () => {
  const sessionUser = await requireSessionUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      expertProfile: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User profile not found");
  }

  return successResponse(user);
});

export const PATCH = apiHandler(async (req, ctx) => {
  const sessionUser = await requireSessionUser();
  const body = (await req.json()) as Record<string, unknown>;
  const data = updateProfileSchema.parse(body);

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if (!dbUser) {
    throw new NotFoundError("User not found");
  }

  const updateData: Prisma.UserUpdateInput = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.image !== undefined) {
    updateData.image = data.image;
  }

  if (data.newPassword) {
    if (!data.currentPassword) {
      throw new ValidationError("Current password is required to set a new password.");
    }
    if (!dbUser.password) {
      throw new ValidationError("Password authentication is not configured for this account.");
    }
    const matches = await bcrypt.compare(data.currentPassword, dbUser.password);
    if (!matches) {
      throw new ValidationError("Current password is incorrect.");
    }
    updateData.password = await bcrypt.hash(data.newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: dbUser.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  void createAuditLog({
    userId: dbUser.id,
    action: "UPDATE",
    entity: "User",
    entityId: dbUser.id,
    newValue: {
      name: updated.name,
      passwordChanged: Boolean(data.newPassword),
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(updated);
});

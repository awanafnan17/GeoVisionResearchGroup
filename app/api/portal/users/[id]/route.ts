import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog, PREDICTABLE_DEMO_PASSWORDS } from "@/lib/security";

const ROLE_VALUES = [
  "SUPERADMIN",
  "ADMIN",
  "GEOSENTRY_MANAGER",
  "EXPERT",
  "STUDENT",
] as const;

const updateUserSchema = z.object({
  name: z.string().min(2).max(120).trim().optional(),
  role: z.enum(ROLE_VALUES).optional(),
  isActive: z.boolean().optional(),
  unlock: z.boolean().optional(),
  loginAttempts: z.number().int().min(0).optional(),
  lockedUntil: z.null().optional(),
  password: z
    .string()
    .min(8)
    .max(128)
    .refine(
      (val) => !PREDICTABLE_DEMO_PASSWORDS.has(val),
      "Predictable demonstration passwords are not permitted."
    )
    .optional(),
});

function extractId(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  await requireSessionUser(["SUPERADMIN"]);
  const id = extractId(req);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isActive: true,
      loginAttempts: true,
      lockedUntil: true,
      lastLoginAt: true,
      lastLoginIp: true,
      createdAt: true,
      updatedAt: true,
      expertProfile: {
        select: {
          id: true,
          slug: true,
          fullName: true,
          designation: true,
          status: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return successResponse(user);
});

export const PATCH = apiHandler(async (req, ctx) => {
  const currentUser = await requireSessionUser(["SUPERADMIN"]);
  const id = extractId(req);

  const existing = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      loginAttempts: true,
      lockedUntil: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("User not found");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = updateUserSchema.parse(body);

  if (id === currentUser.id) {
    if (data.isActive === false) {
      throw new ForbiddenError("You cannot deactivate your own SuperAdmin account.");
    }
    if (data.role && data.role !== existing.role) {
      throw new ForbiddenError("You cannot change your own SuperAdmin role.");
    }
  }

  const updateData: Prisma.UserUpdateInput = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.role !== undefined) {
    updateData.role = data.role;
  }
  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }
  if (data.unlock || data.loginAttempts === 0 || data.lockedUntil === null) {
    updateData.loginAttempts = 0;
    updateData.lockedUntil = null;
  }
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
    updateData.loginAttempts = 0;
    updateData.lockedUntil = null;
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isActive: true,
      loginAttempts: true,
      lockedUntil: true,
      lastLoginAt: true,
      lastLoginIp: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const roleChanged = data.role !== undefined && data.role !== existing.role;

  void createAuditLog({
    userId: currentUser.id,
    action: roleChanged ? "ROLE_CHANGE" : "UPDATE",
    entity: "User",
    entityId: existing.id,
    oldValue: {
      role: existing.role,
      isActive: existing.isActive,
      name: existing.name,
    },
    newValue: {
      role: updated.role,
      isActive: updated.isActive,
      name: updated.name,
      unlocked: Boolean(data.unlock),
      passwordReset: Boolean(data.password),
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(updated);
});

export const DELETE = apiHandler(async (req, ctx) => {
  const currentUser = await requireSessionUser(["SUPERADMIN"]);
  const id = extractId(req);

  if (id === currentUser.id) {
    throw new ForbiddenError("You cannot delete your own SuperAdmin account.");
  }

  const existing = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true },
  });

  if (!existing) {
    throw new NotFoundError("User not found");
  }

  await prisma.user.delete({ where: { id } });

  void createAuditLog({
    userId: currentUser.id,
    action: "DELETE",
    entity: "User",
    entityId: id,
    oldValue: { email: existing.email, role: existing.role },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({ id, deleted: true });
});

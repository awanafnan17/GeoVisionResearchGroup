import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ConflictError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog, PREDICTABLE_DEMO_PASSWORDS } from "@/lib/security";
import { sendWelcomeEmail } from "@/lib/email";

const ROLE_VALUES = [
  "SUPERADMIN",
  "ADMIN",
  "GEOSENTRY_MANAGER",
  "EXPERT",
  "STUDENT",
] as const;

const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120).trim(),
  email: z.string().email("Valid email address is required").max(200).trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .refine(
      (val) => !PREDICTABLE_DEMO_PASSWORDS.has(val),
      "Predictable demonstration passwords are not permitted."
    ),
  role: z.enum(ROLE_VALUES).default("STUDENT"),
  isActive: z.boolean().optional().default(true),
});

export const GET = apiHandler(async () => {
  await requireSessionUser(["SUPERADMIN"]);

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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
      _count: {
        select: {
          enrollments: true,
          assignedLeads: true,
          geoSentryRequests: true,
        },
      },
    },
  });

  return successResponse(users);
});

export const POST = apiHandler(async (req, ctx) => {
  const currentUser = await requireSessionUser(["SUPERADMIN"]);
  const body = (await req.json()) as Record<string, unknown>;
  const data = createUserSchema.parse(body);

  const normalizedEmail = data.email.toLowerCase();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });

  if (existing) {
    throw new ConflictError("A user with this email address already exists.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const created = await prisma.user.create({
    data: {
      name: data.name,
      email: normalizedEmail,
      password: hashedPassword,
      role: data.role,
      isActive: data.isActive,
      createdById: currentUser.id,
    },
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
      createdAt: true,
      updatedAt: true,
    },
  });

  void createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    entity: "User",
    entityId: created.id,
    newValue: {
      email: created.email,
      name: created.name,
      role: created.role,
      isActive: created.isActive,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  void sendWelcomeEmail({
    name: created.name ?? "User",
    email: created.email,
    role: created.role,
  });

  return successResponse(created, 201);
});

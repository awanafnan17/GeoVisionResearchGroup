import bcrypt from "bcryptjs";
import { z } from "zod";
import type { Prisma, ProfileStatus } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ConflictError, ValidationError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const PROFILE_STATUS_VALUES = [
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
] as const;

const createExpertSchema = z.object({
  userId: z.string().min(1).trim().optional(),
  email: z.string().email().max(200).trim().optional(),
  password: z.string().min(8).max(128).optional(),
  slug: z.string().min(2).max(150).trim().optional(),
  fullName: z.string().min(2, "Full name is required").max(150).trim(),
  designation: z.string().min(2, "Designation is required").max(150).trim(),
  shortBio: z.string().min(10, "Short bio is required").max(2000).trim(),
  fullBio: z.string().max(15000).optional().nullable(),
  profilePhoto: z.string().max(500).optional().nullable(),
  cvFile: z.string().max(500).optional().nullable(),
  cvIsPublic: z.boolean().optional().default(true),
  phone: z.string().max(50).optional().nullable(),
  whatsapp: z.string().max(50).optional().nullable(),
  officeEmail: z.string().max(200).optional().nullable(),
  linkedin: z.string().max(300).optional().nullable(),
  twitter: z.string().max(300).optional().nullable(),
  researchgate: z.string().max(300).optional().nullable(),
  googleScholar: z.string().max(300).optional().nullable(),
  orcid: z.string().max(100).optional().nullable(),
  website: z.string().max(300).optional().nullable(),
  education: z.unknown().optional(),
  experience: z.unknown().optional(),
  publications: z.unknown().optional(),
  certifications: z.unknown().optional(),
  languages: z.unknown().optional(),
  awards: z.unknown().optional(),
  status: z.enum(PROFILE_STATUS_VALUES).optional().default("DRAFT"),
  isFeatured: z.boolean().optional().default(false),
  isGeoSentryFounder: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  specializationIds: z.array(z.string()).optional(),
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser([
    "SUPERADMIN",
    "ADMIN",
    "GEOSENTRY_MANAGER",
    "EXPERT",
  ]);

  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");

  const where: Prisma.ExpertProfileWhereInput = {};

  if (user.role === "EXPERT") {
    where.userId = user.id;
  } else if (
    statusParam &&
    statusParam !== "ALL" &&
    (PROFILE_STATUS_VALUES as readonly string[]).includes(statusParam)
  ) {
    where.status = statusParam as ProfileStatus;
  }

  const experts = await prisma.expertProfile.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
      specializations: {
        include: {
          specialization: true,
        },
      },
      _count: {
        select: {
          projects: true,
          leads: true,
        },
      },
    },
  });

  const sanitizedExperts =
    user.role === "GEOSENTRY_MANAGER"
      ? experts.map((exp) =>
          exp.userId === user.id
            ? exp
            : {
                ...exp,
                phone: null,
                whatsapp: null,
                officeEmail: null,
                cvFile: exp.cvIsPublic ? exp.cvFile : null,
              }
        )
      : experts;

  return successResponse(sanitizedExperts);
});

export const POST = apiHandler(async (req, ctx) => {
  const currentUser = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const body = (await req.json()) as Record<string, unknown>;
  const data = createExpertSchema.parse(body);

  let targetUserId = data.userId;

  if (!targetUserId) {
    if (!data.email) {
      throw new ValidationError("Either userId or email is required to create an expert profile.");
    }
    const normalizedEmail = data.email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { expertProfile: { select: { id: true } } },
    });

    if (existingUser) {
      if (existingUser.expertProfile) {
        throw new ConflictError("This user already has an expert profile.");
      }
      targetUserId = existingUser.id;
    } else {
      const fallbackRandomPassword = `${crypto.randomUUID()}Aa1!`;
      const hashedPassword = await bcrypt.hash(
        data.password ?? fallbackRandomPassword,
        12
      );
      const createdUser = await prisma.user.create({
        data: {
          name: data.fullName,
          email: normalizedEmail,
          password: hashedPassword,
          role: "EXPERT",
          isActive: true,
          createdById: currentUser.id,
        },
      });
      targetUserId = createdUser.id;
    }
  } else {
    const existingProfile = await prisma.expertProfile.findUnique({
      where: { userId: targetUserId },
      select: { id: true },
    });
    if (existingProfile) {
      throw new ConflictError("This user already has an expert profile.");
    }
  }

  let slug = data.slug ? slugify(data.slug) : slugify(data.fullName);
  const slugConflict = await prisma.expertProfile.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (slugConflict) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const created = await prisma.expertProfile.create({
    data: {
      userId: targetUserId,
      slug,
      fullName: data.fullName,
      designation: data.designation,
      shortBio: data.shortBio,
      fullBio: data.fullBio ?? null,
      profilePhoto: data.profilePhoto ?? null,
      cvFile: data.cvFile ?? null,
      cvIsPublic: data.cvIsPublic,
      phone: data.phone ?? null,
      whatsapp: data.whatsapp ?? null,
      officeEmail: data.officeEmail ?? null,
      linkedin: data.linkedin ?? null,
      twitter: data.twitter ?? null,
      researchgate: data.researchgate ?? null,
      googleScholar: data.googleScholar ?? null,
      orcid: data.orcid ?? null,
      website: data.website ?? null,
      education: (data.education ?? undefined) as Prisma.InputJsonValue | undefined,
      experience: (data.experience ?? undefined) as Prisma.InputJsonValue | undefined,
      publications: (data.publications ?? undefined) as Prisma.InputJsonValue | undefined,
      certifications: (data.certifications ?? undefined) as Prisma.InputJsonValue | undefined,
      languages: (data.languages ?? undefined) as Prisma.InputJsonValue | undefined,
      awards: (data.awards ?? undefined) as Prisma.InputJsonValue | undefined,
      status: data.status,
      isFeatured: data.isFeatured,
      isGeoSentryFounder: data.isGeoSentryFounder,
      sortOrder: data.sortOrder,
      city: data.city ?? null,
      country: data.country ?? null,
      metaTitle: data.metaTitle ?? null,
      metaDesc: data.metaDesc ?? null,
      specializations:
        data.specializationIds && data.specializationIds.length > 0
          ? {
              create: data.specializationIds.map((specId) => ({
                specializationId: specId,
              })),
            }
          : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
        },
      },
      specializations: {
        include: { specialization: true },
      },
    },
  });

  void createAuditLog({
    userId: currentUser.id,
    action: "CREATE",
    entity: "ExpertProfile",
    entityId: created.id,
    newValue: {
      fullName: created.fullName,
      slug: created.slug,
      status: created.status,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(created, 201);
});

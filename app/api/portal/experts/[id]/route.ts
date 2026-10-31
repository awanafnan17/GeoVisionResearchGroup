import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const PROFILE_STATUS_VALUES = [
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
] as const;

const updateExpertSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  fullName: z.string().min(2).max(150).trim().optional(),
  designation: z.string().min(2).max(150).trim().optional(),
  shortBio: z.string().min(10).max(2000).trim().optional(),
  fullBio: z.string().max(15000).optional().nullable(),
  profilePhoto: z.string().max(500).optional().nullable(),
  cvFile: z.string().max(500).optional().nullable(),
  cvIsPublic: z.boolean().optional(),
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
  status: z.enum(PROFILE_STATUS_VALUES).optional(),
  isFeatured: z.boolean().optional(),
  isGeoSentryFounder: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  city: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  specializationIds: z.array(z.string()).optional(),
});

function extractId(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser([
    "SUPERADMIN",
    "ADMIN",
    "GEOSENTRY_MANAGER",
    "EXPERT",
  ]);
  const rawId = extractId(req);

  const expert = await prisma.expertProfile.findFirst({
    where:
      rawId === "me"
        ? { userId: user.id }
        : {
            OR: [{ id: rawId }, { slug: rawId }, { userId: rawId }],
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
      projects: {
        include: { project: true },
      },
    },
  });

  if (!expert) {
    throw new NotFoundError("Expert profile not found");
  }

  if (user.role === "EXPERT" && expert.userId !== user.id) {
    throw new ForbiddenError("You can only view your own expert profile");
  }

  const sanitizedExpert =
    user.role === "GEOSENTRY_MANAGER" && expert.userId !== user.id
      ? {
          ...expert,
          phone: null,
          whatsapp: null,
          officeEmail: null,
          cvFile: expert.cvIsPublic ? expert.cvFile : null,
        }
      : expert;

  return successResponse(sanitizedExpert);
});

export const PATCH = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "EXPERT"]);
  const rawId = extractId(req);

  const existing = await prisma.expertProfile.findFirst({
    where:
      rawId === "me"
        ? { userId: user.id }
        : {
            OR: [{ id: rawId }, { slug: rawId }, { userId: rawId }],
          },
  });

  if (!existing) {
    throw new NotFoundError("Expert profile not found");
  }

  const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMIN";

  if (!isAdmin && existing.userId !== user.id) {
    throw new ForbiddenError("You can only update your own expert profile");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = updateExpertSchema.parse(body);

  if (!isAdmin) {
    if (data.status === "PUBLISHED") {
      throw new ForbiddenError(
        "Experts cannot publish their own profile directly. Submit for review instead."
      );
    }
    if (data.isFeatured !== undefined || data.isGeoSentryFounder !== undefined) {
      throw new ForbiddenError("Only administrators can modify featured status.");
    }
  }

  const updateData: Prisma.ExpertProfileUncheckedUpdateInput = {};

  if (data.slug !== undefined && isAdmin) updateData.slug = data.slug;
  if (data.fullName !== undefined) updateData.fullName = data.fullName;
  if (data.designation !== undefined) updateData.designation = data.designation;
  if (data.shortBio !== undefined) updateData.shortBio = data.shortBio;
  if (data.fullBio !== undefined) updateData.fullBio = data.fullBio;
  if (data.profilePhoto !== undefined) updateData.profilePhoto = data.profilePhoto;
  if (data.cvFile !== undefined) updateData.cvFile = data.cvFile;
  if (data.cvIsPublic !== undefined) updateData.cvIsPublic = data.cvIsPublic;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp;
  if (data.officeEmail !== undefined) updateData.officeEmail = data.officeEmail;
  if (data.linkedin !== undefined) updateData.linkedin = data.linkedin;
  if (data.twitter !== undefined) updateData.twitter = data.twitter;
  if (data.researchgate !== undefined) updateData.researchgate = data.researchgate;
  if (data.googleScholar !== undefined) updateData.googleScholar = data.googleScholar;
  if (data.orcid !== undefined) updateData.orcid = data.orcid;
  if (data.website !== undefined) updateData.website = data.website;
  if (data.education !== undefined) {
    updateData.education = data.education as Prisma.InputJsonValue;
  }
  if (data.experience !== undefined) {
    updateData.experience = data.experience as Prisma.InputJsonValue;
  }
  if (data.publications !== undefined) {
    updateData.publications = data.publications as Prisma.InputJsonValue;
  }
  if (data.certifications !== undefined) {
    updateData.certifications = data.certifications as Prisma.InputJsonValue;
  }
  if (data.languages !== undefined) {
    updateData.languages = data.languages as Prisma.InputJsonValue;
  }
  if (data.awards !== undefined) {
    updateData.awards = data.awards as Prisma.InputJsonValue;
  }
  if (data.city !== undefined) updateData.city = data.city;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDesc !== undefined) updateData.metaDesc = data.metaDesc;

  if (data.status !== undefined) {
    updateData.status = data.status;
  }
  if (isAdmin) {
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (data.isGeoSentryFounder !== undefined) {
      updateData.isGeoSentryFounder = data.isGeoSentryFounder;
    }
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
  }

  if (data.specializationIds !== undefined) {
    await prisma.expertSpecialization.deleteMany({
      where: { expertProfileId: existing.id },
    });
    if (data.specializationIds.length > 0) {
      await prisma.expertSpecialization.createMany({
        data: data.specializationIds.map((specializationId) => ({
          expertProfileId: existing.id,
          specializationId,
        })),
        skipDuplicates: true,
      });
    }
  }

  const updated = await prisma.expertProfile.update({
    where: { id: existing.id },
    data: updateData,
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

  const statusChanged = data.status !== undefined && data.status !== existing.status;

  void createAuditLog({
    userId: user.id,
    action: statusChanged ? "STATUS_CHANGE" : "UPDATE",
    entity: "ExpertProfile",
    entityId: existing.id,
    oldValue: {
      status: existing.status,
      isFeatured: existing.isFeatured,
      fullName: existing.fullName,
    },
    newValue: {
      status: updated.status,
      isFeatured: updated.isFeatured,
      fullName: updated.fullName,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(updated);
});

export const DELETE = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const rawId = extractId(req);

  const existing = await prisma.expertProfile.findFirst({
    where: { OR: [{ id: rawId }, { slug: rawId }] },
    select: { id: true, fullName: true, slug: true },
  });

  if (!existing) {
    throw new NotFoundError("Expert profile not found");
  }

  await prisma.expertProfile.delete({ where: { id: existing.id } });

  void createAuditLog({
    userId: user.id,
    action: "DELETE",
    entity: "ExpertProfile",
    entityId: existing.id,
    oldValue: { fullName: existing.fullName, slug: existing.slug },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({ id: existing.id, deleted: true });
});

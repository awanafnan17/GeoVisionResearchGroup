import { z } from "zod";
import type { Prisma, ProjectStatus } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const updateProjectSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  title: z.string().min(2).max(200).trim().optional(),
  client: z.string().max(150).trim().optional().nullable(),
  sector: z.string().max(120).trim().optional().nullable(),
  country: z.string().max(100).trim().optional().nullable(),
  city: z.string().max(100).trim().optional().nullable(),
  year: z.union([z.number(), z.string()]).optional().nullable(),
  duration: z.string().max(100).trim().optional().nullable(),
  description: z.string().min(10).max(5000).trim().optional(),
  fullContent: z.string().max(30000).optional().nullable(),
  objectives: z.string().max(10000).optional().nullable(),
  methodology: z.string().max(10000).optional().nullable(),
  results: z.string().max(10000).optional().nullable(),
  isConfidential: z.boolean().optional(),
  images: z.unknown().optional(),
  coverImage: z.string().max(500).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  serviceId: z.string().max(100).optional().nullable(),
  teamMemberIds: z.array(z.string()).optional(),
});

function normalizeProjectStatus(raw: string): ProjectStatus {
  if (raw === "PUBLISHED") return "PUBLISHED";
  return "DRAFT";
}

function extractId(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "EXPERT"]);
  const idOrSlug = extractId(req);

  const project = await prisma.project.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      service: true,
      teamMembers: {
        include: {
          expertProfile: {
            select: {
              id: true,
              fullName: true,
              designation: true,
              slug: true,
              userId: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  if (
    user.role === "EXPERT" &&
    !project.teamMembers.some((m) => m.expertProfile?.userId === user.id)
  ) {
    throw new ForbiddenError("You can only view portfolio projects where you are a team member");
  }

  return successResponse(project);
});

export const PATCH = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const idOrSlug = extractId(req);

  const existing = await prisma.project.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });

  if (!existing) {
    throw new NotFoundError("Project not found");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = updateProjectSchema.parse(body);

  const updateData: Prisma.ProjectUncheckedUpdateInput = {};

  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.client !== undefined) updateData.client = data.client;
  if (data.sector !== undefined) updateData.sector = data.sector;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.year !== undefined) {
    updateData.year =
      data.year === null || data.year === ""
        ? null
        : Number.parseInt(String(data.year), 10);
  }
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.fullContent !== undefined) updateData.fullContent = data.fullContent;
  if (data.objectives !== undefined) updateData.objectives = data.objectives;
  if (data.methodology !== undefined) updateData.methodology = data.methodology;
  if (data.results !== undefined) updateData.results = data.results;
  if (data.isConfidential !== undefined) {
    updateData.isConfidential = data.isConfidential;
  }
  if (data.images !== undefined) {
    updateData.images = data.images as Prisma.InputJsonValue;
  }
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.status !== undefined) {
    updateData.status = normalizeProjectStatus(data.status);
  }
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDesc !== undefined) updateData.metaDesc = data.metaDesc;
  if (data.serviceId !== undefined) {
    updateData.serviceId = data.serviceId || null;
  }

  if (data.teamMemberIds !== undefined) {
    await prisma.projectTeamMember.deleteMany({
      where: { projectId: existing.id },
    });
    if (data.teamMemberIds.length > 0) {
      await prisma.projectTeamMember.createMany({
        data: data.teamMemberIds.map((expertProfileId) => ({
          projectId: existing.id,
          expertProfileId,
        })),
        skipDuplicates: true,
      });
    }
  }

  const updated = await prisma.project.update({
    where: { id: existing.id },
    data: updateData,
    include: {
      service: true,
      teamMembers: {
        include: {
          expertProfile: {
            select: {
              id: true,
              fullName: true,
              designation: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  void createAuditLog({
    userId: user.id,
    action: "UPDATE",
    entity: "Project",
    entityId: existing.id,
    oldValue: { title: existing.title, status: existing.status },
    newValue: { title: updated.title, status: updated.status },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(updated);
});

export const DELETE = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const idOrSlug = extractId(req);

  const existing = await prisma.project.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    select: { id: true, title: true, slug: true },
  });

  if (!existing) {
    throw new NotFoundError("Project not found");
  }

  await prisma.project.delete({ where: { id: existing.id } });

  void createAuditLog({
    userId: user.id,
    action: "DELETE",
    entity: "Project",
    entityId: existing.id,
    oldValue: { title: existing.title, slug: existing.slug },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({ id: existing.id, deleted: true });
});

import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { NotFoundError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const updateServiceSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  title: z.string().min(2).max(200).trim().optional(),
  tagline: z.string().max(300).trim().optional().nullable(),
  description: z.string().min(10).max(5000).trim().optional(),
  fullContent: z.string().max(30000).optional().nullable(),
  icon: z.string().max(100).trim().optional().nullable(),
  heroImage: z.string().max(500).trim().optional().nullable(),
  coverImage: z.string().max(500).trim().optional().nullable(),
  methodology: z.string().max(15000).optional().nullable(),
  deliverables: z.unknown().optional(),
  tools: z.unknown().optional(),
  faqs: z.unknown().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
  specializationId: z.string().max(100).optional().nullable(),
});

function extractId(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  await requireSessionUser();
  const idOrSlug = extractId(req);

  const service = await prisma.service.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      specialization: true,
      projects: true,
    },
  });

  if (!service) {
    throw new NotFoundError("Service not found");
  }

  return successResponse(service);
});

export const PATCH = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const idOrSlug = extractId(req);

  const existing = await prisma.service.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });

  if (!existing) {
    throw new NotFoundError("Service not found");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = updateServiceSchema.parse(body);

  const updateData: Prisma.ServiceUncheckedUpdateInput = {};

  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.tagline !== undefined) updateData.tagline = data.tagline;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.fullContent !== undefined) updateData.fullContent = data.fullContent;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.heroImage !== undefined) updateData.heroImage = data.heroImage;
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.methodology !== undefined) updateData.methodology = data.methodology;
  if (data.deliverables !== undefined) {
    updateData.deliverables = data.deliverables as Prisma.InputJsonValue;
  }
  if (data.tools !== undefined) {
    updateData.tools = data.tools as Prisma.InputJsonValue;
  }
  if (data.faqs !== undefined) {
    updateData.faqs = data.faqs as Prisma.InputJsonValue;
  }
  if (data.isPublished !== undefined) updateData.isPublished = data.isPublished;
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDesc !== undefined) updateData.metaDesc = data.metaDesc;
  if (data.keywords !== undefined) updateData.keywords = data.keywords;
  if (data.specializationId !== undefined) {
    updateData.specializationId = data.specializationId || null;
  }

  const updated = await prisma.service.update({
    where: { id: existing.id },
    data: updateData,
    include: { specialization: true },
  });

  void createAuditLog({
    userId: user.id,
    action: "UPDATE",
    entity: "Service",
    entityId: existing.id,
    oldValue: {
      title: existing.title,
      isPublished: existing.isPublished,
    },
    newValue: {
      title: updated.title,
      isPublished: updated.isPublished,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(updated);
});

export const DELETE = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const idOrSlug = extractId(req);

  const existing = await prisma.service.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    select: { id: true, title: true, slug: true },
  });

  if (!existing) {
    throw new NotFoundError("Service not found");
  }

  await prisma.service.delete({ where: { id: existing.id } });

  void createAuditLog({
    userId: user.id,
    action: "DELETE",
    entity: "Service",
    entityId: existing.id,
    oldValue: { title: existing.title, slug: existing.slug },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({ id: existing.id, deleted: true });
});

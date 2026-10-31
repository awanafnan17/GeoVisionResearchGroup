import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const createServiceSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  title: z.string().min(2, "Title is required").max(200).trim(),
  tagline: z.string().max(300).trim().optional().nullable(),
  description: z.string().min(10, "Description is required").max(5000).trim(),
  fullContent: z.string().max(30000).optional().nullable(),
  icon: z.string().max(100).trim().optional().nullable(),
  heroImage: z.string().max(500).trim().optional().nullable(),
  coverImage: z.string().max(500).trim().optional().nullable(),
  methodology: z.string().max(15000).optional().nullable(),
  deliverables: z.unknown().optional(),
  tools: z.unknown().optional(),
  faqs: z.unknown().optional(),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
  specializationId: z.string().max(100).optional().nullable(),
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const GET = apiHandler(async () => {
  await requireSessionUser();

  const services = await prisma.service.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      specialization: true,
      _count: {
        select: {
          projects: true,
          leads: true,
        },
      },
    },
  });

  return successResponse(services);
});

export const POST = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const body = (await req.json()) as Record<string, unknown>;
  const data = createServiceSchema.parse(body);

  let slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const existing = await prisma.service.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const created = await prisma.service.create({
    data: {
      slug,
      title: data.title,
      tagline: data.tagline || null,
      description: data.description,
      fullContent: data.fullContent || null,
      icon: data.icon || null,
      heroImage: data.heroImage || null,
      coverImage: data.coverImage || null,
      methodology: data.methodology || null,
      deliverables: (data.deliverables ?? undefined) as Prisma.InputJsonValue | undefined,
      tools: (data.tools ?? undefined) as Prisma.InputJsonValue | undefined,
      faqs: (data.faqs ?? undefined) as Prisma.InputJsonValue | undefined,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
      sortOrder: data.sortOrder,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
      keywords: data.keywords || null,
      specializationId: data.specializationId || null,
    },
    include: {
      specialization: true,
    },
  });

  void createAuditLog({
    userId: user.id,
    action: "CREATE",
    entity: "Service",
    entityId: created.id,
    newValue: {
      title: created.title,
      slug: created.slug,
      isPublished: created.isPublished,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(created, 201);
});

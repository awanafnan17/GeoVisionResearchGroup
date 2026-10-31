import { z } from "zod";
import type { Prisma, ProjectStatus } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const createProjectSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  title: z.string().min(2, "Title is required").max(200).trim(),
  client: z.string().max(150).trim().optional().nullable(),
  sector: z.string().max(120).trim().optional().nullable(),
  country: z.string().max(100).trim().optional().nullable(),
  city: z.string().max(100).trim().optional().nullable(),
  year: z.union([z.number(), z.string()]).optional().nullable(),
  duration: z.string().max(100).trim().optional().nullable(),
  description: z.string().min(10, "Description is required").max(5000).trim(),
  fullContent: z.string().max(30000).optional().nullable(),
  objectives: z.string().max(10000).optional().nullable(),
  methodology: z.string().max(10000).optional().nullable(),
  results: z.string().max(10000).optional().nullable(),
  isConfidential: z.boolean().optional().default(false),
  images: z.unknown().optional(),
  coverImage: z.string().max(500).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("DRAFT"),
  isFeatured: z.boolean().optional().default(false),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  serviceId: z.string().max(100).optional().nullable(),
  teamMemberIds: z.array(z.string()).optional(),
});

function normalizeProjectStatus(raw?: string): ProjectStatus {
  if (raw === "PUBLISHED") return "PUBLISHED";
  return "DRAFT";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const GET = apiHandler(async () => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "EXPERT"]);

  const where: Prisma.ProjectWhereInput = {};

  if (user.role === "EXPERT") {
    where.teamMembers = {
      some: {
        expertProfile: {
          userId: user.id,
        },
      },
    };
  }

  const projects = await prisma.project.findMany({
    where,
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    include: {
      service: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
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

  return successResponse(projects);
});

export const POST = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const body = (await req.json()) as Record<string, unknown>;
  const data = createProjectSchema.parse(body);

  let slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const existing = await prisma.project.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const parsedYear =
    data.year !== undefined && data.year !== null && data.year !== ""
      ? Number.parseInt(String(data.year), 10)
      : null;

  const created = await prisma.project.create({
    data: {
      slug,
      title: data.title,
      client: data.client || null,
      sector: data.sector || null,
      country: data.country || null,
      city: data.city || null,
      year: parsedYear !== null && !Number.isNaN(parsedYear) ? parsedYear : null,
      duration: data.duration || null,
      description: data.description,
      fullContent: data.fullContent || null,
      objectives: data.objectives || null,
      methodology: data.methodology || null,
      results: data.results || null,
      isConfidential: data.isConfidential,
      images: (data.images ?? undefined) as Prisma.InputJsonValue | undefined,
      coverImage: data.coverImage || null,
      status: normalizeProjectStatus(data.status),
      isFeatured: data.isFeatured,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
      serviceId: data.serviceId || null,
      teamMembers:
        data.teamMemberIds && data.teamMemberIds.length > 0
          ? {
              create: data.teamMemberIds.map((expertProfileId) => ({
                expertProfileId,
              })),
            }
          : undefined,
    },
    include: {
      service: {
        select: { id: true, title: true, slug: true },
      },
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
    action: "CREATE",
    entity: "Project",
    entityId: created.id,
    newValue: {
      title: created.title,
      slug: created.slug,
      status: created.status,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(created, 201);
});

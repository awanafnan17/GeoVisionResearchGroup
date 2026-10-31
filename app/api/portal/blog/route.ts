import { z } from "zod";
import type { BlogStatus, Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const BLOG_STATUS_VALUES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

const createBlogSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  title: z.string().min(2, "Title is required").max(200).trim(),
  excerpt: z.string().max(1000).trim().optional().nullable(),
  content: z.string().min(20, "Article content is required").max(50000).trim(),
  coverImage: z.string().max(500).optional().nullable(),
  status: z.enum(BLOG_STATUS_VALUES).optional().default("DRAFT"),
  isFeatured: z.boolean().optional().default(false),
  readTime: z.string().max(50).optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const GET = apiHandler(async (req) => {
  await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");

  const where: Prisma.BlogPostWhereInput = {};
  if (
    statusParam &&
    statusParam !== "ALL" &&
    (BLOG_STATUS_VALUES as readonly string[]).includes(statusParam)
  ) {
    where.status = statusParam as BlogStatus;
  }

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return successResponse(posts);
});

export const POST = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const body = (await req.json()) as Record<string, unknown>;
  const data = createBlogSchema.parse(body);

  let slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const existing = await prisma.blogPost.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const wordCount = data.content.split(/\s+/).filter(Boolean).length;
  const computedReadTime =
    data.readTime || `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const created = await prisma.blogPost.create({
    data: {
      slug,
      title: data.title,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImage: data.coverImage || null,
      status: data.status,
      isFeatured: data.isFeatured,
      readTime: computedReadTime,
      authorId: user.id,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
      keywords: data.keywords || null,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  void createAuditLog({
    userId: user.id,
    action: "CREATE",
    entity: "BlogPost",
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

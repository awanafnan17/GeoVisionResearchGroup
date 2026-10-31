import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { NotFoundError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const BLOG_STATUS_VALUES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

const updateBlogSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  title: z.string().min(2).max(200).trim().optional(),
  excerpt: z.string().max(1000).trim().optional().nullable(),
  content: z.string().min(20).max(50000).trim().optional(),
  coverImage: z.string().max(500).optional().nullable(),
  status: z.enum(BLOG_STATUS_VALUES).optional(),
  isFeatured: z.boolean().optional(),
  readTime: z.string().max(50).optional().nullable(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
});

function extractId(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const idOrSlug = extractId(req);

  const post = await prisma.blogPost.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!post) {
    throw new NotFoundError("Blog post not found");
  }

  return successResponse(post);
});

export const PATCH = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const idOrSlug = extractId(req);

  const existing = await prisma.blogPost.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });

  if (!existing) {
    throw new NotFoundError("Blog post not found");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = updateBlogSchema.parse(body);

  const updateData: Prisma.BlogPostUncheckedUpdateInput = {};

  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === "PUBLISHED" && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }
  if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
  if (data.readTime !== undefined) updateData.readTime = data.readTime;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDesc !== undefined) updateData.metaDesc = data.metaDesc;
  if (data.keywords !== undefined) updateData.keywords = data.keywords;

  const updated = await prisma.blogPost.update({
    where: { id: existing.id },
    data: updateData,
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  void createAuditLog({
    userId: user.id,
    action: data.status && data.status !== existing.status ? "STATUS_CHANGE" : "UPDATE",
    entity: "BlogPost",
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

  const existing = await prisma.blogPost.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    select: { id: true, title: true, slug: true },
  });

  if (!existing) {
    throw new NotFoundError("Blog post not found");
  }

  await prisma.blogPost.delete({ where: { id: existing.id } });

  void createAuditLog({
    userId: user.id,
    action: "DELETE",
    entity: "BlogPost",
    entityId: existing.id,
    oldValue: { title: existing.title, slug: existing.slug },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({ id: existing.id, deleted: true });
});

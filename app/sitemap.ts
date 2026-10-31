import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://geovisionresearchgroup.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/team`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/portfolio`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/geosentry`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${baseUrl}/geosentry/framework`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/geosentry/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/geosentry/request`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/geosentry/track`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/geosentry/sample-report`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/publications`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  let services: { slug: string; updatedAt: Date }[] = [];
  let experts: { slug: string; updatedAt: Date }[] = [];
  let courses: { slug: string; updatedAt: Date }[] = [];
  let projects: { slug: string; updatedAt: Date }[] = [];
  let blogPosts: { slug: string; updatedAt: Date; publishedAt: Date | null }[] = [];

  try {
    [services, experts, courses, projects, blogPosts] = await Promise.all([
      prisma.service.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.expertProfile.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.course.findMany({
        where: { status: { in: ["PUBLISHED", "ONGOING", "UPCOMING"] } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
    ]);
  } catch {
    // A source-only build may not have a database. Static routes remain useful,
    // while content routes are added automatically once PostgreSQL is available.
  }

  return [
    ...staticRoutes,
    ...services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...experts.map((e) => ({
      url: `${baseUrl}/team/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...courses.map((c) => ({
      url: `${baseUrl}/courses/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...projects.map((p) => ({
      url: `${baseUrl}/portfolio/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...blogPosts.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.publishedAt ?? b.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}

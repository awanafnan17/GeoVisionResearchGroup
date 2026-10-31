import { z } from "zod";
import type { CourseMode, CourseStatus, Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const COURSE_STATUS_VALUES = [
  "DRAFT",
  "PUBLISHED",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
] as const;

const createCourseSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  title: z.string().min(2, "Title is required").max(200).trim(),
  tagline: z.string().max(300).trim().optional().nullable(),
  description: z.string().min(10, "Description is required").max(5000).trim(),
  fullContent: z.string().max(30000).optional().nullable(),
  thumbnail: z.string().max(500).optional().nullable(),
  coverImage: z.string().max(500).optional().nullable(),
  instructorId: z.string().max(100).optional(),
  mode: z.enum(["ONLINE", "ONSITE", "IN_PERSON", "HYBRID"]).default("ONLINE"),
  status: z.enum(COURSE_STATUS_VALUES).optional().default("DRAFT"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  durationText: z.string().max(120).optional().nullable(),
  schedule: z.string().max(250).optional().nullable(),
  fee: z.union([z.number(), z.string()]).optional().nullable(),
  currency: z.string().max(10).optional().default("USD"),
  earlyBirdFee: z.union([z.number(), z.string()]).optional().nullable(),
  earlyBirdDeadline: z.string().optional().nullable(),
  maxSeats: z.union([z.number(), z.string()]).optional().nullable(),
  minSeats: z.union([z.number(), z.string()]).optional().nullable(),
  prerequisites: z.string().max(5000).optional().nullable(),
  targetAudience: z.string().max(5000).optional().nullable(),
  syllabus: z.unknown().optional(),
  learningOutcomes: z.unknown().optional(),
  includes: z.unknown().optional(),
  location: z.string().max(200).optional().nullable(),
  certificate: z.boolean().optional().default(true),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
  specializationId: z.string().max(100).optional().nullable(),
});

function normalizeCourseMode(raw: string): CourseMode {
  if (raw === "IN_PERSON" || raw === "ONSITE") return "ONSITE";
  if (raw === "HYBRID") return "HYBRID";
  return "ONLINE";
}

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
    "EXPERT",
    "STUDENT",
  ]);

  if (user.role === "STUDENT") {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        OR: [
          { userId: user.id },
          { guestEmail: { equals: user.email, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, name: true, email: true },
            },
            specialization: true,
          },
        },
        payment: true,
      },
    });

    const formattedEnrollments = enrollments.map((enrollment) => ({
      ...enrollment,
      course: {
        ...enrollment.course,
        fee: enrollment.course.fee ? Number(enrollment.course.fee) : null,
        earlyBirdFee: enrollment.course.earlyBirdFee
          ? Number(enrollment.course.earlyBirdFee)
          : null,
      },
      payment: enrollment.payment
        ? {
            ...enrollment.payment,
            amount: Number(enrollment.payment.amount),
          }
        : null,
    }));

    return successResponse(formattedEnrollments);
  }

  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");

  const where: Prisma.CourseWhereInput = {};
  if (
    statusParam &&
    statusParam !== "ALL" &&
    (COURSE_STATUS_VALUES as readonly string[]).includes(statusParam)
  ) {
    where.status = statusParam as CourseStatus;
  }

  const courses = await prisma.course.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      instructor: {
        select: { id: true, name: true, email: true },
      },
      specialization: true,
      enrollments: {
        orderBy: { createdAt: "desc" },
        include: {
          payment: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  const formatted = courses.map((course) => {
    const canSeeEnrollments =
      user.role === "SUPERADMIN" ||
      user.role === "ADMIN" ||
      (user.role === "EXPERT" && course.instructorId === user.id);

    return {
      ...course,
      fee: course.fee ? Number(course.fee) : null,
      earlyBirdFee: course.earlyBirdFee ? Number(course.earlyBirdFee) : null,
      enrollments: canSeeEnrollments
        ? course.enrollments.map((e) => ({
            ...e,
            payment: e.payment
              ? {
                  ...e.payment,
                  amount: Number(e.payment.amount),
                  ...(user.role === "EXPERT"
                    ? { receiptImage: null, bankReference: null }
                    : {}),
                }
              : null,
          }))
        : [],
    };
  });

  return successResponse(formatted);
});

export const POST = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const body = (await req.json()) as Record<string, unknown>;
  const data = createCourseSchema.parse(body);

  let slug = data.slug ? slugify(data.slug) : slugify(data.title);
  const existing = await prisma.course.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const parsedFee =
    data.fee !== undefined && data.fee !== null && data.fee !== ""
      ? Number(data.fee)
      : null;

  const parsedEarlyBird =
    data.earlyBirdFee !== undefined &&
    data.earlyBirdFee !== null &&
    data.earlyBirdFee !== ""
      ? Number(data.earlyBirdFee)
      : null;

  const parsedMaxSeats =
    data.maxSeats !== undefined && data.maxSeats !== null && data.maxSeats !== ""
      ? Number.parseInt(String(data.maxSeats), 10)
      : null;

  const parsedMinSeats =
    data.minSeats !== undefined && data.minSeats !== null && data.minSeats !== ""
      ? Number.parseInt(String(data.minSeats), 10)
      : null;

  const created = await prisma.course.create({
    data: {
      slug,
      title: data.title,
      tagline: data.tagline || null,
      description: data.description,
      fullContent: data.fullContent || null,
      thumbnail: data.thumbnail || null,
      coverImage: data.coverImage || null,
      instructorId: data.instructorId || user.id,
      mode: normalizeCourseMode(data.mode),
      status: data.status,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      durationText: data.durationText || null,
      schedule: data.schedule || null,
      fee: parsedFee !== null && !Number.isNaN(parsedFee) ? parsedFee : null,
      currency: data.currency || "USD",
      earlyBirdFee:
        parsedEarlyBird !== null && !Number.isNaN(parsedEarlyBird)
          ? parsedEarlyBird
          : null,
      earlyBirdDeadline: data.earlyBirdDeadline
        ? new Date(data.earlyBirdDeadline)
        : null,
      maxSeats:
        parsedMaxSeats !== null && !Number.isNaN(parsedMaxSeats)
          ? parsedMaxSeats
          : null,
      minSeats:
        parsedMinSeats !== null && !Number.isNaN(parsedMinSeats)
          ? parsedMinSeats
          : null,
      prerequisites: data.prerequisites || null,
      targetAudience: data.targetAudience || null,
      syllabus: (data.syllabus ?? undefined) as Prisma.InputJsonValue | undefined,
      learningOutcomes: (data.learningOutcomes ?? undefined) as
        | Prisma.InputJsonValue
        | undefined,
      includes: (data.includes ?? undefined) as Prisma.InputJsonValue | undefined,
      location: data.location || null,
      certificate: data.certificate,
      metaTitle: data.metaTitle || null,
      metaDesc: data.metaDesc || null,
      keywords: data.keywords || null,
      specializationId: data.specializationId || null,
    },
    include: {
      instructor: {
        select: { id: true, name: true, email: true },
      },
      specialization: true,
      _count: {
        select: { enrollments: true },
      },
    },
  });

  void createAuditLog({
    userId: user.id,
    action: "CREATE",
    entity: "Course",
    entityId: created.id,
    newValue: {
      title: created.title,
      slug: created.slug,
      status: created.status,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(
    {
      ...created,
      fee: created.fee ? Number(created.fee) : null,
      earlyBirdFee: created.earlyBirdFee ? Number(created.earlyBirdFee) : null,
    },
    201
  );
});

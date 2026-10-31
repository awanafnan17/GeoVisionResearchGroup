import { z } from "zod";
import type { CourseMode, Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { NotFoundError } from "@/lib/api-error";
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

const ENROLLMENT_STATUS_VALUES = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
] as const;

const updateCourseSchema = z.object({
  slug: z.string().min(2).max(150).trim().optional(),
  title: z.string().min(2).max(200).trim().optional(),
  tagline: z.string().max(300).trim().optional().nullable(),
  description: z.string().min(10).max(5000).trim().optional(),
  fullContent: z.string().max(30000).optional().nullable(),
  thumbnail: z.string().max(500).optional().nullable(),
  coverImage: z.string().max(500).optional().nullable(),
  instructorId: z.string().max(100).optional(),
  mode: z.enum(["ONLINE", "ONSITE", "IN_PERSON", "HYBRID"]).optional(),
  status: z.enum(COURSE_STATUS_VALUES).optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  durationText: z.string().max(120).optional().nullable(),
  schedule: z.string().max(250).optional().nullable(),
  fee: z.union([z.number(), z.string()]).optional().nullable(),
  currency: z.string().max(10).optional(),
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
  certificate: z.boolean().optional(),
  metaTitle: z.string().max(200).optional().nullable(),
  metaDesc: z.string().max(500).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
  specializationId: z.string().max(100).optional().nullable(),
  enrollmentId: z.string().optional(),
  enrollmentStatus: z.enum(ENROLLMENT_STATUS_VALUES).optional(),
});

function normalizeCourseMode(raw: string): CourseMode {
  if (raw === "IN_PERSON" || raw === "ONSITE") return "ONSITE";
  if (raw === "HYBRID") return "HYBRID";
  return "ONLINE";
}

function extractId(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "EXPERT", "STUDENT"]);
  const idOrSlug = extractId(req);

  const course = await prisma.course.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
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
        select: { enrollments: true },
      },
    },
  });

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  const scopedEnrollments =
    user.role === "STUDENT"
      ? course.enrollments.filter(
          (e) =>
            e.userId === user.id ||
            e.guestEmail?.toLowerCase() === user.email.toLowerCase()
        )
      : user.role === "EXPERT"
        ? course.instructorId === user.id
          ? course.enrollments
          : []
        : course.enrollments;

  return successResponse({
    ...course,
    fee: course.fee ? Number(course.fee) : null,
    earlyBirdFee: course.earlyBirdFee ? Number(course.earlyBirdFee) : null,
    enrollments: scopedEnrollments.map((e) => ({
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
    })),
  });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const idOrSlug = extractId(req);

  const existing = await prisma.course.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
  });

  if (!existing) {
    throw new NotFoundError("Course not found");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = updateCourseSchema.parse(body);

  if (data.enrollmentId && data.enrollmentStatus) {
    await prisma.enrollment.updateMany({
      where: { id: data.enrollmentId, courseId: existing.id },
      data: { status: data.enrollmentStatus },
    });
  }

  const updateData: Prisma.CourseUncheckedUpdateInput = {};

  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.tagline !== undefined) updateData.tagline = data.tagline;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.fullContent !== undefined) updateData.fullContent = data.fullContent;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.instructorId !== undefined) updateData.instructorId = data.instructorId;
  if (data.mode !== undefined) updateData.mode = normalizeCourseMode(data.mode);
  if (data.status !== undefined) updateData.status = data.status;
  if (data.startDate !== undefined) {
    updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  }
  if (data.endDate !== undefined) {
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  }
  if (data.durationText !== undefined) updateData.durationText = data.durationText;
  if (data.schedule !== undefined) updateData.schedule = data.schedule;
  if (data.fee !== undefined) {
    updateData.fee =
      data.fee === null || data.fee === "" ? null : Number(data.fee);
  }
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.earlyBirdFee !== undefined) {
    updateData.earlyBirdFee =
      data.earlyBirdFee === null || data.earlyBirdFee === ""
        ? null
        : Number(data.earlyBirdFee);
  }
  if (data.earlyBirdDeadline !== undefined) {
    updateData.earlyBirdDeadline = data.earlyBirdDeadline
      ? new Date(data.earlyBirdDeadline)
      : null;
  }
  if (data.maxSeats !== undefined) {
    updateData.maxSeats =
      data.maxSeats === null || data.maxSeats === ""
        ? null
        : Number.parseInt(String(data.maxSeats), 10);
  }
  if (data.minSeats !== undefined) {
    updateData.minSeats =
      data.minSeats === null || data.minSeats === ""
        ? null
        : Number.parseInt(String(data.minSeats), 10);
  }
  if (data.prerequisites !== undefined) {
    updateData.prerequisites = data.prerequisites;
  }
  if (data.targetAudience !== undefined) {
    updateData.targetAudience = data.targetAudience;
  }
  if (data.syllabus !== undefined) {
    updateData.syllabus = data.syllabus as Prisma.InputJsonValue;
  }
  if (data.learningOutcomes !== undefined) {
    updateData.learningOutcomes = data.learningOutcomes as Prisma.InputJsonValue;
  }
  if (data.includes !== undefined) {
    updateData.includes = data.includes as Prisma.InputJsonValue;
  }
  if (data.location !== undefined) updateData.location = data.location;
  if (data.certificate !== undefined) updateData.certificate = data.certificate;
  if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
  if (data.metaDesc !== undefined) updateData.metaDesc = data.metaDesc;
  if (data.keywords !== undefined) updateData.keywords = data.keywords;
  if (data.specializationId !== undefined) {
    updateData.specializationId = data.specializationId || null;
  }

  const updated = await prisma.course.update({
    where: { id: existing.id },
    data: updateData,
    include: {
      instructor: {
        select: { id: true, name: true, email: true },
      },
      specialization: true,
      enrollments: {
        orderBy: { createdAt: "desc" },
        include: { payment: true },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });

  void createAuditLog({
    userId: user.id,
    action: data.status && data.status !== existing.status ? "STATUS_CHANGE" : "UPDATE",
    entity: "Course",
    entityId: existing.id,
    oldValue: { title: existing.title, status: existing.status },
    newValue: { title: updated.title, status: updated.status },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({
    ...updated,
    fee: updated.fee ? Number(updated.fee) : null,
    earlyBirdFee: updated.earlyBirdFee ? Number(updated.earlyBirdFee) : null,
    enrollments: updated.enrollments.map((e) => ({
      ...e,
      payment: e.payment
        ? {
            ...e.payment,
            amount: Number(e.payment.amount),
          }
        : null,
    })),
  });
});

export const DELETE = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const idOrSlug = extractId(req);

  const existing = await prisma.course.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    select: { id: true, title: true, slug: true },
  });

  if (!existing) {
    throw new NotFoundError("Course not found");
  }

  await prisma.course.delete({ where: { id: existing.id } });

  void createAuditLog({
    userId: user.id,
    action: "DELETE",
    entity: "Course",
    entityId: existing.id,
    oldValue: { title: existing.title, slug: existing.slug },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({ id: existing.id, deleted: true });
});

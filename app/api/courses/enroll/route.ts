import { z } from "zod";
import type { EnrollmentStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ConflictError, NotFoundError, RateLimitError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  createAuditLog,
  createRateLimiter,
} from "@/lib/security";
import { sendEnrollmentConfirmation } from "@/lib/email";

const enrollLimiter = createRateLimiter(10, 60 * 60 * 1000);

const enrollSchema = z
  .object({
    courseId: z.string().min(1, "Course ID is required").trim(),
    studentName: z.string().min(2).max(120).trim().optional(),
    name: z.string().min(2).max(120).trim().optional(),
    studentEmail: z.string().email().max(200).trim().optional(),
    email: z.string().email().max(200).trim().optional(),
    studentPhone: z.string().max(40).trim().optional().nullable(),
    phone: z.string().max(40).trim().optional().nullable(),
    organization: z.string().max(150).trim().optional().nullable(),
    country: z.string().max(100).trim().optional().nullable(),
    paymentMethod: z
      .enum(["STRIPE", "PAYPAL", "BANK_TRANSFER", "OTHER", "FREE", "CORPORATE_INVOICE"])
      .optional()
      .default("BANK_TRANSFER"),
    bankReference: z.string().max(150).trim().optional().nullable(),
    notes: z.string().max(2000).trim().optional().nullable(),
  })
  .refine((val) => Boolean(val.studentName || val.name), {
    message: "Student name is required",
    path: ["studentName"],
  })
  .refine((val) => Boolean(val.studentEmail || val.email), {
    message: "Student email is required",
    path: ["studentEmail"],
  });

async function generateInvoiceNumberInTx(
  tx: Prisma.TransactionClient,
  attemptOffset = 0
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;

  const recentPayments = await tx.payment.findMany({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { createdAt: "desc" },
    take: 25,
    select: { invoiceNumber: true },
  });

  let maxNum = 0;
  for (const p of recentPayments) {
    const suffix = p.invoiceNumber.slice(prefix.length);
    if (/^\d{4}$/.test(suffix)) {
      const parsed = Number.parseInt(suffix, 10);
      if (parsed > maxNum) maxNum = parsed;
    }
  }

  const nextNum = maxNum + 1 + attemptOffset;
  const candidate = `${prefix}${nextNum.toString().padStart(4, "0")}`;
  const exists = await tx.payment.findUnique({
    where: { invoiceNumber: candidate },
    select: { id: true },
  });

  if (!exists) {
    return candidate;
  }

  const randomFour = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomFour}`;
}

export const POST = apiHandler(async (req, ctx) => {
  if (!checkRateLimit(`enroll:${ctx.ip}`, enrollLimiter)) {
    throw new RateLimitError("Too many enrollment attempts. Please try again later.");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = enrollSchema.parse(body);

  const studentName = (data.studentName ?? data.name ?? "").trim();
  const studentEmail = (data.studentEmail ?? data.email ?? "").trim().toLowerCase();
  const studentPhone = (data.studentPhone ?? data.phone ?? "")?.trim() || null;

  const session = await auth();
  const sessionUser = session?.user as { id?: string; email?: string } | undefined;
  const userId =
    sessionUser?.id && sessionUser.email?.toLowerCase() === studentEmail
      ? sessionUser.id
      : null;

  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: data.courseId }, { slug: data.courseId }],
      status: { in: ["PUBLISHED", "ONGOING", "UPCOMING"] },
    },
  });

  if (!course) {
    throw new NotFoundError("Course not found or is not currently open for enrollment.");
  }

  // Calculate effective fee deterministically
  const baseFee = course.fee ? Number(course.fee) : 0;
  let effectiveFee = baseFee;

  if (!course.fee || baseFee === 0) {
    effectiveFee = 0;
  } else if (
    course.earlyBirdFee !== null &&
    course.earlyBirdDeadline !== null &&
    new Date() <= new Date(course.earlyBirdDeadline)
  ) {
    effectiveFee = Number(course.earlyBirdFee);
  }

  const isFreeEnrollment = effectiveFee <= 0;
  const enrollmentStatus: EnrollmentStatus = isFreeEnrollment ? "CONFIRMED" : "PENDING";
  const paymentStatus: PaymentStatus = isFreeEnrollment ? "PAID" : "PENDING";
  const method: PaymentMethod = isFreeEnrollment
    ? "OTHER"
    : data.paymentMethod === "STRIPE" ||
        data.paymentMethod === "PAYPAL" ||
        data.paymentMethod === "BANK_TRANSFER"
      ? data.paymentMethod
      : data.paymentMethod === "CORPORATE_INVOICE"
        ? "BANK_TRANSFER"
        : "OTHER";

  const combinedNotes =
    data.paymentMethod === "CORPORATE_INVOICE"
      ? `[Corporate Sponsor Invoice Requested] ${data.notes ?? ""}`.trim()
      : data.notes || null;

  let enrollmentResult: {
    enrollment: { id: string; status: EnrollmentStatus };
    payment: { invoiceNumber: string; status: PaymentStatus };
  } | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      enrollmentResult = await prisma.$transaction(async (tx) => {
        if (course.maxSeats && course.maxSeats > 0) {
          const activeEnrollments = await tx.enrollment.count({
            where: {
              courseId: course.id,
              status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
            },
          });

          if (activeEnrollments >= course.maxSeats) {
            throw new ConflictError(
              "This course cohort has reached maximum seat capacity."
            );
          }
        }

        const duplicateConditions: Array<Record<string, unknown>> = [
          { guestEmail: { equals: studentEmail, mode: "insensitive" } },
        ];
        if (userId) {
          duplicateConditions.push({ userId });
        }

        const existingEnrollment = await tx.enrollment.findFirst({
          where: {
            courseId: course.id,
            status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
            OR: duplicateConditions,
          },
          select: { id: true },
        });

        if (existingEnrollment) {
          throw new ConflictError(
            "An active enrollment already exists for this email address in this course."
          );
        }

        const invoiceNumber = await generateInvoiceNumberInTx(tx, attempt);

        const createdEnrollment = await tx.enrollment.create({
          data: {
            courseId: course.id,
            userId,
            guestName: studentName,
            guestEmail: studentEmail,
            guestPhone: studentPhone,
            guestOrganization: data.organization || null,
            guestCountry: data.country || null,
            status: enrollmentStatus,
            notes: combinedNotes,
          },
        });

        const createdPayment = await tx.payment.create({
          data: {
            enrollmentId: createdEnrollment.id,
            invoiceNumber,
            amount: effectiveFee,
            currency: course.currency,
            status: paymentStatus,
            method,
            bankReference: data.bankReference || null,
            paidAt: isFreeEnrollment ? new Date() : null,
          },
        });

        return { enrollment: createdEnrollment, payment: createdPayment };
      });
      break;
    } catch (err) {
      if (err instanceof ConflictError || attempt === 2) {
        throw err;
      }
    }
  }

  if (!enrollmentResult) {
    throw new ConflictError("Unable to complete enrollment at this time. Please retry.");
  }

  const { enrollment, payment } = enrollmentResult;

  void createAuditLog({
    userId: userId ?? undefined,
    action: "CREATE",
    entity: "Enrollment",
    entityId: enrollment.id,
    newValue: {
      courseId: course.id,
      courseTitle: course.title,
      studentEmail,
      invoiceNumber: payment.invoiceNumber,
      amount: effectiveFee,
      currency: course.currency,
      status: enrollment.status,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  void sendEnrollmentConfirmation({
    studentName,
    studentEmail,
    courseName: course.title,
    startDate: course.startDate ? course.startDate.toISOString().split("T")[0] : undefined,
    fee: isFreeEnrollment ? "Free" : `${course.currency} ${effectiveFee.toFixed(2)}`,
  });

  return successResponse(
    {
      enrollmentId: enrollment.id,
      invoiceNumber: payment.invoiceNumber,
      status: enrollment.status,
      paymentStatus: payment.status,
      amount: effectiveFee,
      currency: course.currency,
    },
    201
  );
});

import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const PAYMENT_STATUS_VALUES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "MANUAL_REVIEW",
] as const;

const PAYMENT_METHOD_VALUES = [
  "STRIPE",
  "PAYPAL",
  "BANK_TRANSFER",
  "OTHER",
] as const;

const updatePaymentSchema = z.object({
  status: z.enum(PAYMENT_STATUS_VALUES).optional(),
  method: z.enum(PAYMENT_METHOD_VALUES).optional(),
  bankReference: z.string().max(200).trim().optional().nullable(),
  receiptImage: z.string().max(500).trim().optional().nullable(),
  notes: z.string().max(3000).trim().optional().nullable(),
});

function extractId(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "STUDENT"]);
  const idOrInvoice = extractId(req);

  const payment = await prisma.payment.findFirst({
    where: {
      OR: [{ id: idOrInvoice }, { invoiceNumber: idOrInvoice }],
    },
    include: {
      enrollment: {
        include: {
          course: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  if (!payment) {
    throw new NotFoundError("Payment record not found");
  }

  if (
    user.role === "STUDENT" &&
    payment.enrollment.userId !== user.id &&
    payment.enrollment.guestEmail?.toLowerCase() !== user.email.toLowerCase()
  ) {
    throw new ForbiddenError("You can only view your own payment records");
  }

  return successResponse({
    ...payment,
    amount: Number(payment.amount),
    enrollment: {
      ...payment.enrollment,
      course: {
        ...payment.enrollment.course,
        fee: payment.enrollment.course.fee
          ? Number(payment.enrollment.course.fee)
          : null,
        earlyBirdFee: payment.enrollment.course.earlyBirdFee
          ? Number(payment.enrollment.course.earlyBirdFee)
          : null,
      },
    },
  });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "STUDENT"]);
  const idOrInvoice = extractId(req);

  const existing = await prisma.payment.findFirst({
    where: {
      OR: [{ id: idOrInvoice }, { invoiceNumber: idOrInvoice }],
    },
    include: {
      enrollment: true,
    },
  });

  if (!existing) {
    throw new NotFoundError("Payment record not found");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = updatePaymentSchema.parse(body);

  const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMIN";

  if (!isAdmin) {
    const ownsEnrollment =
      existing.enrollment.userId === user.id ||
      existing.enrollment.guestEmail?.toLowerCase() === user.email.toLowerCase();

    if (!ownsEnrollment) {
      throw new ForbiddenError("You can only update your own payment records");
    }

    if (existing.status !== "PENDING" && existing.status !== "MANUAL_REVIEW") {
      throw new ForbiddenError("This payment can no longer be modified");
    }

    const updatedStudentPayment = await prisma.payment.update({
      where: { id: existing.id },
      data: {
        bankReference:
          data.bankReference !== undefined
            ? data.bankReference
            : existing.bankReference,
        receiptImage:
          data.receiptImage !== undefined
            ? data.receiptImage
            : existing.receiptImage,
        notes: data.notes !== undefined ? data.notes : existing.notes,
      },
      include: {
        enrollment: {
          include: { course: true },
        },
      },
    });

    void createAuditLog({
      userId: user.id,
      action: "UPDATE",
      entity: "Payment",
      entityId: existing.id,
      newValue: {
        bankReference: updatedStudentPayment.bankReference,
      },
      ipAddress: ctx.ip,
      userAgent: ctx.userAgent,
    });

    return successResponse({
      ...updatedStudentPayment,
      amount: Number(updatedStudentPayment.amount),
    });
  }

  const updateData: Prisma.PaymentUncheckedUpdateInput = {};

  if (data.method !== undefined) updateData.method = data.method;
  if (data.bankReference !== undefined) {
    updateData.bankReference = data.bankReference;
  }
  if (data.receiptImage !== undefined) updateData.receiptImage = data.receiptImage;
  if (data.notes !== undefined) updateData.notes = data.notes;

  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === "PAID" || data.status === "REFUNDED" || data.status === "FAILED") {
      updateData.verifiedBy = user.email;
      updateData.verifiedAt = new Date();
    } else {
      updateData.verifiedBy = null;
      updateData.verifiedAt = null;
    }
    if (data.status === "PAID" && !existing.paidAt) {
      updateData.paidAt = new Date();
    } else if (data.status === "PENDING" || data.status === "MANUAL_REVIEW") {
      updateData.paidAt = null;
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const paymentRecord = await tx.payment.update({
      where: { id: existing.id },
      data: updateData,
      include: {
        enrollment: {
          include: {
            course: true,
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (data.status === "PAID") {
      await tx.enrollment.update({
        where: { id: existing.enrollmentId },
        data: { status: "CONFIRMED" },
      });
      paymentRecord.enrollment.status = "CONFIRMED";
    } else if (data.status === "REFUNDED" || data.status === "FAILED") {
      await tx.enrollment.update({
        where: { id: existing.enrollmentId },
        data: { status: "CANCELLED" },
      });
      paymentRecord.enrollment.status = "CANCELLED";
    } else if (data.status === "PENDING" || data.status === "MANUAL_REVIEW") {
      await tx.enrollment.update({
        where: { id: existing.enrollmentId },
        data: { status: "PENDING" },
      });
      paymentRecord.enrollment.status = "PENDING";
    }

    return paymentRecord;
  });

  void createAuditLog({
    userId: user.id,
    action: data.status && data.status !== existing.status ? "STATUS_CHANGE" : "UPDATE",
    entity: "Payment",
    entityId: existing.id,
    oldValue: {
      status: existing.status,
      bankReference: existing.bankReference,
    },
    newValue: {
      status: updated.status,
      verifiedBy: updated.verifiedBy,
      bankReference: updated.bankReference,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({
    ...updated,
    amount: Number(updated.amount),
    enrollment: {
      ...updated.enrollment,
      course: {
        ...updated.enrollment.course,
        fee: updated.enrollment.course.fee
          ? Number(updated.enrollment.course.fee)
          : null,
        earlyBirdFee: updated.enrollment.course.earlyBirdFee
          ? Number(updated.enrollment.course.earlyBirdFee)
          : null,
      },
    },
  });
});

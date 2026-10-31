import type { PaymentStatus, Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const PAYMENT_STATUS_VALUES = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "MANUAL_REVIEW",
] as const;

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "STUDENT"]);
  const url = new URL(req.url);
  const statusParam = url.searchParams.get("status");

  const where: Prisma.PaymentWhereInput = {};

  if (user.role === "STUDENT") {
    where.enrollment = {
      OR: [
        { userId: user.id },
        { guestEmail: { equals: user.email, mode: "insensitive" } },
      ],
    };
  }

  if (
    statusParam &&
    statusParam !== "ALL" &&
    (PAYMENT_STATUS_VALUES as readonly string[]).includes(statusParam)
  ) {
    where.status = statusParam as PaymentStatus;
  }

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      enrollment: {
        include: {
          course: {
            select: {
              id: true,
              slug: true,
              title: true,
              mode: true,
              startDate: true,
              endDate: true,
              fee: true,
              currency: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const formatted = payments.map((payment) => ({
    ...payment,
    amount: Number(payment.amount),
    enrollment: {
      ...payment.enrollment,
      course: {
        ...payment.enrollment.course,
        fee: payment.enrollment.course.fee
          ? Number(payment.enrollment.course.fee)
          : null,
      },
    },
  }));

  return successResponse(formatted);
});

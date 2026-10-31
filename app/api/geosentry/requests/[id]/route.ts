import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";
import {
  sendGeoSentryReportDelivered,
  sendGeoSentryStatusUpdate,
} from "@/lib/email";

const GEOSENTRY_STATUS_VALUES = [
  "SUBMITTED",
  "RECEIVED",
  "REVIEWING",
  "AWAITING_INFO",
  "IN_PROGRESS",
  "QUALITY_CHECK",
  "COMPLETED",
  "DELIVERED",
  "REVISION_REQUESTED",
  "ON_HOLD",
  "CANCELLED",
  "REFUNDED",
] as const;

const GEOSENTRY_VERDICT_VALUES = ["GO", "NO_GO", "CONDITIONAL", "PENDING"] as const;
const GEOSENTRY_PRIORITY_VALUES = ["STANDARD", "RUSH"] as const;

const patchSchema = z.object({
  status: z.enum(GEOSENTRY_STATUS_VALUES).optional(),
  priority: z.enum(GEOSENTRY_PRIORITY_VALUES).optional(),
  verdict: z.enum(GEOSENTRY_VERDICT_VALUES).optional(),
  geologicalScore: z
    .number()
    .int()
    .min(0, "Geological score must be between 0 and 40")
    .max(40, "Geological score cannot exceed 40")
    .optional()
    .nullable(),
  jurisdictionScore: z
    .number()
    .int()
    .min(0, "Jurisdiction score must be between 0 and 40")
    .max(40, "Jurisdiction score cannot exceed 40")
    .optional()
    .nullable(),
  operatorScore: z
    .number()
    .int()
    .min(0, "Operator score must be between 0 and 20")
    .max(20, "Operator score cannot exceed 20")
    .optional()
    .nullable(),
  quotedPrice: z.union([z.number(), z.string()]).optional().nullable(),
  quotedCurrency: z.string().max(10).trim().optional(),
  invoiceFile: z.string().max(500).trim().optional().nullable(),
  assignedToId: z.string().max(100).trim().optional().nullable(),
  internalNotes: z.string().max(10000).optional().nullable(),
  clientNotes: z.string().max(10000).optional().nullable(),
  reportFile: z.string().max(500).trim().optional().nullable(),
  reportSummary: z.string().max(10000).optional().nullable(),
  isRead: z.boolean().optional(),
  statusNote: z.string().max(2000).trim().optional(),
  newNote: z
    .object({
      content: z.string().min(1).max(3000).trim(),
      isInternal: z.boolean().optional().default(true),
    })
    .optional(),
});

function extractIdFromUrl(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser(["GEOSENTRY_MANAGER", "SUPERADMIN", "EXPERT"]);
  const idOrRef = extractIdFromUrl(req);

  const isManager = user.role === "GEOSENTRY_MANAGER";

  const record = await prisma.geoSentryRequest.findFirst({
    where: {
      OR: [{ id: idOrRef }, { referenceNumber: idOrRef.toUpperCase() }],
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
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
      statusNotes: {
        where: isManager ? undefined : { isInternal: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!record) {
    throw new NotFoundError("GeoSentry screening request not found");
  }

  if (user.role === "EXPERT" && record.assignedToId !== user.id) {
    throw new ForbiddenError("You do not have access to this GeoSentry screening request");
  }

  return successResponse({
    ...record,
    targetSizeHectares: record.targetSizeHectares
      ? Number(record.targetSizeHectares)
      : null,
    quotedPrice: record.quotedPrice ? Number(record.quotedPrice) : null,
    internalNotes: isManager
      ? record.internalNotes
      : "[Restricted to GeoSentry Manager]",
    ipAddress: isManager ? record.ipAddress : null,
  });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["GEOSENTRY_MANAGER", "EXPERT"]);
  const idOrRef = extractIdFromUrl(req);

  const existing = await prisma.geoSentryRequest.findFirst({
    where: {
      OR: [{ id: idOrRef }, { referenceNumber: idOrRef.toUpperCase() }],
    },
  });

  if (!existing) {
    throw new NotFoundError("GeoSentry screening request not found");
  }

  const isManager = user.role === "GEOSENTRY_MANAGER";

  if (!isManager && existing.assignedToId !== user.id) {
    throw new ForbiddenError("You can only update GeoSentry requests assigned to you");
  }

  const rawBody = (await req.json()) as Record<string, unknown>;
  const data = patchSchema.parse(rawBody);

  const updateData: Prisma.GeoSentryRequestUncheckedUpdateInput = {};

  // Compute 100-point weighted scores when any score is provided
  const hasScoreUpdate =
    data.geologicalScore !== undefined ||
    data.jurisdictionScore !== undefined ||
    data.operatorScore !== undefined;

  if (hasScoreUpdate) {
    const geo =
      data.geologicalScore !== undefined
        ? data.geologicalScore
        : existing.geologicalScore;
    const jur =
      data.jurisdictionScore !== undefined
        ? data.jurisdictionScore
        : existing.jurisdictionScore;
    const op =
      data.operatorScore !== undefined
        ? data.operatorScore
        : existing.operatorScore;

    updateData.geologicalScore = geo;
    updateData.jurisdictionScore = jur;
    updateData.operatorScore = op;

    if (geo === null && jur === null && op === null) {
      updateData.overallScore = null;
    } else {
      updateData.overallScore = (geo ?? 0) + (jur ?? 0) + (op ?? 0);
    }
  }

  if (isManager) {
    if (data.verdict !== undefined) {
      updateData.verdict = data.verdict;
    }
    if (data.reportSummary !== undefined) {
      updateData.reportSummary = data.reportSummary;
    }
    if (data.clientNotes !== undefined) {
      updateData.clientNotes = data.clientNotes;
    }
    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }
    if (data.quotedPrice !== undefined) {
      if (data.quotedPrice === null || data.quotedPrice === "") {
        updateData.quotedPrice = null;
      } else {
        const num = Number(data.quotedPrice);
        if (!Number.isNaN(num)) {
          updateData.quotedPrice = num;
        }
      }
    }
    if (data.quotedCurrency !== undefined) {
      updateData.quotedCurrency = data.quotedCurrency;
    }
    if (data.invoiceFile !== undefined) {
      updateData.invoiceFile = data.invoiceFile || null;
    }
    if (data.assignedToId !== undefined) {
      updateData.assignedToId = data.assignedToId || null;
    }
    if (data.internalNotes !== undefined) {
      updateData.internalNotes = data.internalNotes;
    }
    if (data.reportFile !== undefined) {
      updateData.reportFile = data.reportFile || null;
    }
    if (data.isRead !== undefined) {
      updateData.isRead = data.isRead;
    }

    if (data.status !== undefined && data.status !== existing.status) {
      updateData.status = data.status;
      const historyArray = Array.isArray(existing.statusHistory)
        ? [...(existing.statusHistory as Array<Record<string, unknown>>)]
        : [];
      historyArray.push({
        status: data.status,
        timestamp: new Date().toISOString(),
        note:
          data.statusNote ??
          `Status updated to ${data.status} by ${user.name || user.email}`,
      });
      updateData.statusHistory = historyArray as Prisma.InputJsonValue;

      if (data.status === "DELIVERED" && !existing.deliveredAt) {
        updateData.deliveredAt = new Date();
      }
    }
  }

  const updated = await prisma.geoSentryRequest.update({
    where: { id: existing.id },
    data: updateData,
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
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
      statusNotes: {
        where: isManager ? undefined : { isInternal: false },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (data.newNote) {
    await prisma.geoSentryNote.create({
      data: {
        requestId: existing.id,
        content: data.newNote.content,
        isInternal: isManager ? (data.newNote.isInternal ?? true) : false,
        createdBy: user.name || user.email,
      },
    });
  } else if (!isManager && data.statusNote) {
    await prisma.geoSentryNote.create({
      data: {
        requestId: existing.id,
        content: data.statusNote,
        isInternal: false,
        createdBy: user.name || user.email,
      },
    });
  }

  const statusChanged = isManager && data.status && data.status !== existing.status;

  void createAuditLog({
    userId: user.id,
    action: statusChanged ? "STATUS_CHANGE" : "UPDATE",
    entity: "GeoSentryRequest",
    entityId: existing.id,
    oldValue: {
      status: existing.status,
      verdict: existing.verdict,
      overallScore: existing.overallScore,
      assignedToId: existing.assignedToId,
    },
    newValue: {
      status: updated.status,
      verdict: updated.verdict,
      overallScore: updated.overallScore,
      assignedToId: updated.assignedToId,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  if (statusChanged && data.status) {
    void sendGeoSentryStatusUpdate({
      clientName: updated.clientName,
      clientEmail: updated.clientEmail,
      referenceNumber: updated.referenceNumber,
      status: data.status,
      note: data.statusNote,
    });

    if (data.status === "DELIVERED") {
      void sendGeoSentryReportDelivered({
        clientName: updated.clientName,
        clientEmail: updated.clientEmail,
        referenceNumber: updated.referenceNumber,
        targetName: updated.targetName,
        verdict: updated.verdict,
        score: updated.overallScore ?? 0,
      });
    }
  }

  const refreshedNotes = await prisma.geoSentryNote.findMany({
    where: {
      requestId: existing.id,
      ...(isManager ? {} : { isInternal: false }),
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse({
    ...updated,
    statusNotes: refreshedNotes,
    targetSizeHectares: updated.targetSizeHectares
      ? Number(updated.targetSizeHectares)
      : null,
    quotedPrice: updated.quotedPrice ? Number(updated.quotedPrice) : null,
    internalNotes: isManager
      ? updated.internalNotes
      : "[Restricted to GeoSentry Manager]",
    ipAddress: isManager ? updated.ipAddress : null,
  });
});

export const DELETE = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["GEOSENTRY_MANAGER"]);
  const idOrRef = extractIdFromUrl(req);

  const existing = await prisma.geoSentryRequest.findFirst({
    where: {
      OR: [{ id: idOrRef }, { referenceNumber: idOrRef.toUpperCase() }],
    },
    select: { id: true, referenceNumber: true, targetName: true },
  });

  if (!existing) {
    throw new NotFoundError("GeoSentry request not found.");
  }

  await prisma.geoSentryRequest.delete({
    where: { id: existing.id },
  });

  void createAuditLog({
    userId: user.id,
    action: "DELETE",
    entity: "GeoSentryRequest",
    entityId: existing.id,
    oldValue: {
      referenceNumber: existing.referenceNumber,
      targetName: existing.targetName,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({ deleted: true, id: existing.id });
});

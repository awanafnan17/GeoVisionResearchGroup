import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ForbiddenError, NotFoundError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const LEAD_STATUS_VALUES = [
  "NEW",
  "CONTACTED",
  "IN_DISCUSSION",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
  "CLOSED",
] as const;

const updateLeadSchema = z.object({
  status: z.enum(LEAD_STATUS_VALUES).optional(),
  assignedToId: z.string().max(100).optional().nullable(),
  expertProfileId: z.string().max(100).optional().nullable(),
  isRead: z.boolean().optional(),
  newNote: z
    .union([
      z.string().min(1).max(3000).trim(),
      z.object({ content: z.string().min(1).max(3000).trim() }),
    ])
    .optional(),
});

function extractId(req: Request): string {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean);
  return decodeURIComponent(segments[segments.length - 1] ?? "");
}

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "EXPERT"]);
  const id = extractId(req);

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      expertProfile: {
        select: {
          id: true,
          fullName: true,
          designation: true,
          slug: true,
          userId: true,
        },
      },
      service: {
        select: { id: true, title: true, slug: true },
      },
      notes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!lead) {
    throw new NotFoundError("Lead not found");
  }

  if (
    user.role === "EXPERT" &&
    lead.assignedToId !== user.id &&
    lead.expertProfile?.userId !== user.id
  ) {
    throw new ForbiddenError("You can only view leads assigned to you");
  }

  return successResponse(lead);
});

export const PATCH = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN", "EXPERT"]);
  const id = extractId(req);

  const existing = await prisma.lead.findUnique({
    where: { id },
    include: {
      expertProfile: {
        select: { userId: true },
      },
    },
  });

  if (!existing) {
    throw new NotFoundError("Lead not found");
  }

  const isAdmin = user.role === "SUPERADMIN" || user.role === "ADMIN";

  if (
    !isAdmin &&
    existing.assignedToId !== user.id &&
    existing.expertProfile?.userId !== user.id
  ) {
    throw new ForbiddenError("You can only update leads assigned to you");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = updateLeadSchema.parse(body);

  const updateData: Prisma.LeadUncheckedUpdateInput = {};

  if (data.status !== undefined) {
    updateData.status = data.status;
  }
  if (data.isRead !== undefined) {
    updateData.isRead = data.isRead;
  }

  if (isAdmin) {
    if (data.assignedToId !== undefined) {
      updateData.assignedToId = data.assignedToId || null;
    }
    if (data.expertProfileId !== undefined) {
      updateData.expertProfileId = data.expertProfileId || null;
      if (data.assignedToId === undefined) {
        if (data.expertProfileId) {
          const expert = await prisma.expertProfile.findUnique({
            where: { id: data.expertProfileId },
            select: { userId: true },
          });
          updateData.assignedToId = expert ? expert.userId : null;
        } else {
          updateData.assignedToId = null;
        }
      }
    }
  }

  if (data.newNote) {
    const noteContent =
      typeof data.newNote === "string" ? data.newNote : data.newNote.content;
    await prisma.leadNote.create({
      data: {
        leadId: existing.id,
        content: noteContent,
        createdBy: user.name || user.email,
      },
    });
  }

  const updated = await prisma.lead.update({
    where: { id: existing.id },
    data: updateData,
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      expertProfile: {
        select: {
          id: true,
          fullName: true,
          designation: true,
          slug: true,
          userId: true,
        },
      },
      service: {
        select: { id: true, title: true, slug: true },
      },
      notes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  void createAuditLog({
    userId: user.id,
    action: data.status && data.status !== existing.status ? "STATUS_CHANGE" : "UPDATE",
    entity: "Lead",
    entityId: existing.id,
    oldValue: {
      status: existing.status,
      assignedToId: existing.assignedToId,
      isRead: existing.isRead,
    },
    newValue: {
      status: updated.status,
      assignedToId: updated.assignedToId,
      isRead: updated.isRead,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse(updated);
});

export const DELETE = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["SUPERADMIN", "ADMIN"]);
  const id = extractId(req);

  const existing = await prisma.lead.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });

  if (!existing) {
    throw new NotFoundError("Lead not found");
  }

  await prisma.lead.delete({ where: { id } });

  void createAuditLog({
    userId: user.id,
    action: "DELETE",
    entity: "Lead",
    entityId: id,
    oldValue: { name: existing.name, email: existing.email },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  return successResponse({ id, deleted: true });
});

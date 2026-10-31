import type { AuditAction, Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const AUDIT_ACTION_VALUES = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "LOGIN_FAILED",
  "FILE_DOWNLOAD",
  "FILE_UPLOAD",
  "ROLE_CHANGE",
  "STATUS_CHANGE",
  "VIEW_SENSITIVE",
] as const;

export const GET = apiHandler(async (req) => {
  await requireSessionUser(["SUPERADMIN"]);

  const url = new URL(req.url);
  const actionParam = url.searchParams.get("action");
  const entityParam = url.searchParams.get("entity");

  const where: Prisma.AuditLogWhereInput = {};

  if (
    actionParam &&
    actionParam !== "ALL" &&
    (AUDIT_ACTION_VALUES as readonly string[]).includes(actionParam)
  ) {
    where.action = actionParam as AuditAction;
  }

  if (entityParam && entityParam !== "ALL") {
    where.entity = entityParam;
  }

  const logs = await prisma.auditLog.findMany({
    where,
    take: 200,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return successResponse(logs);
});

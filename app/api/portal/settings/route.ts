import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { ForbiddenError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";

const settingItemSchema = z.object({
  key: z.string().min(1).max(150).trim(),
  value: z.string().max(10000),
  type: z.string().max(50).optional().default("text"),
  group: z.string().max(80).optional().nullable(),
  label: z.string().max(200).optional().nullable(),
});

const batchSettingsSchema = z.union([
  z.object({
    settings: z.array(settingItemSchema),
  }),
  settingItemSchema,
]);

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser([
    "SUPERADMIN",
    "ADMIN",
    "GEOSENTRY_MANAGER",
  ]);
  const url = new URL(req.url);
  const groupParam = url.searchParams.get("group");

  const where: Prisma.SiteSettingWhereInput = {};

  if (user.role === "GEOSENTRY_MANAGER") {
    where.group = "geosentry";
  } else if (groupParam) {
    where.group = groupParam;
  }

  const settings = await prisma.siteSetting.findMany({
    where,
    orderBy: [{ group: "asc" }, { key: "asc" }],
  });

  return successResponse(settings);
});

async function handleSaveSettings(req: Request, ip: string, userAgent: string) {
  const user = await requireSessionUser(["SUPERADMIN", "GEOSENTRY_MANAGER"]);
  const body = (await req.json()) as Record<string, unknown>;
  const parsed = batchSettingsSchema.parse(body);

  const items = "settings" in parsed ? parsed.settings : [parsed];

  const isGeoSentryManager = user.role === "GEOSENTRY_MANAGER";

  for (const item of items) {
    if (isGeoSentryManager) {
      const effectiveGroup = item.group ?? "geosentry";
      if (effectiveGroup !== "geosentry" && !item.key.startsWith("geosentry_")) {
        throw new ForbiddenError(
          "GeoSentry Manager can only modify GeoSentry configuration settings."
        );
      }
    }
  }

  const results = await prisma.$transaction(
    items.map((item) =>
      prisma.siteSetting.upsert({
        where: { key: item.key },
        update: {
          value: item.value,
          ...(item.group !== undefined ? { group: item.group } : {}),
          ...(item.label !== undefined ? { label: item.label } : {}),
          ...(item.type !== undefined ? { type: item.type } : {}),
        },
        create: {
          key: item.key,
          value: item.value,
          type: item.type ?? "text",
          group:
            item.group ??
            (isGeoSentryManager || item.key.startsWith("geosentry_")
              ? "geosentry"
              : "general"),
          label: item.label ?? item.key,
        },
      })
    )
  );

  void createAuditLog({
    userId: user.id,
    action: "UPDATE",
    entity: "SiteSetting",
    newValue: {
      keys: items.map((i) => i.key),
      count: items.length,
    },
    ipAddress: ip,
    userAgent,
  });

  return successResponse(results);
}

export const PUT = apiHandler(async (req, ctx) =>
  handleSaveSettings(req, ctx.ip, ctx.userAgent)
);

export const PATCH = apiHandler(async (req, ctx) =>
  handleSaveSettings(req, ctx.ip, ctx.userAgent)
);

export const POST = apiHandler(async (req, ctx) =>
  handleSaveSettings(req, ctx.ip, ctx.userAgent)
);

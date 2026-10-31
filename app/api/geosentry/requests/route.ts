import { z } from "zod";
import type {
  DepositType,
  GeoSentryPriority,
  GeoSentryStatus,
  GeoSentryVerdict,
  Prisma,
} from "@prisma/client";
import { requireSessionUser } from "@/lib/auth";
import { apiHandler } from "@/lib/api-handler";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security";
import { sendGeoSentryRequestReceived } from "@/lib/email";
import { generateUniqueReferenceNumber } from "@/app/api/geosentry/submit/route";

const DEPOSIT_TYPE_VALUES = [
  "PORPHYRY",
  "VMS",
  "EPITHERMAL_HIGH_SULPHIDATION",
  "EPITHERMAL_LOW_SULPHIDATION",
  "OROGENIC_GOLD",
  "OPHIOLITE_HOSTED",
  "IOCG",
  "SKARN",
  "SEDEX",
  "CARLIN_TYPE",
  "PODIFORM_CHROMITE",
  "NICKEL_LATERITE",
  "LATERITE_SAPROLITE",
  "PEGMATITE_LITHIUM_REE",
  "BIF_IRON",
  "PLACER_GOLD",
  "MANGANESE",
  "PHOSPHATE",
  "BAUXITE",
  "MVT_LEAD_ZINC",
  "INTRUSION_RELATED",
  "VOLCANIC_HOSTED",
  "SEDIMENT_HOSTED",
  "OTHER",
] as const;

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

const managerCreateSchema = z.object({
  clientName: z.string().min(2).max(120).trim(),
  clientEmail: z.string().email().max(200).trim(),
  clientPhone: z.string().max(40).trim().optional().nullable(),
  clientOrganization: z.string().max(150).trim().optional().nullable(),
  clientCountry: z.string().max(100).trim().optional().nullable(),
  clientWebsite: z.string().max(250).trim().optional().nullable(),
  clientLinkedIn: z.string().max(250).trim().optional().nullable(),
  targetName: z.string().min(2).max(150).trim(),
  targetCountry: z.string().min(2).max(100).trim(),
  targetRegion: z.string().max(120).trim().optional().nullable(),
  targetCoordinates: z.string().max(100).trim().optional().nullable(),
  depositType: z.enum(DEPOSIT_TYPE_VALUES),
  commodityFocus: z.string().min(1).max(200).trim(),
  commodities: z.array(z.string()).optional().nullable(),
  targetSizeHectares: z.union([z.number(), z.string()]).optional().nullable(),
  existingData: z.string().max(3000).trim().optional().nullable(),
  projectDescription: z.string().min(10).max(5000).trim(),
  specificConcerns: z.string().max(3000).trim().optional().nullable(),
  keyQuestions: z.string().max(3000).trim().optional().nullable(),
  additionalContext: z.string().max(3000).trim().optional().nullable(),
  budget: z.string().max(80).trim().optional().nullable(),
  currency: z.string().max(10).trim().optional().default("USD"),
  timeline: z.string().max(100).trim().optional().nullable(),
  priority: z.enum(GEOSENTRY_PRIORITY_VALUES).optional().default("STANDARD"),
  quotedPrice: z.union([z.number(), z.string()]).optional().nullable(),
  quotedCurrency: z.string().max(10).trim().optional().default("USD"),
  status: z.enum(GEOSENTRY_STATUS_VALUES).optional().default("RECEIVED"),
  internalNotes: z.string().max(5000).trim().optional().nullable(),
  clientNotes: z.string().max(5000).trim().optional().nullable(),
  assignedToId: z.string().max(100).trim().optional().nullable(),
});

export const GET = apiHandler(async (req) => {
  const user = await requireSessionUser(["GEOSENTRY_MANAGER", "SUPERADMIN", "EXPERT"]);
  const url = new URL(req.url);

  const statusParam = url.searchParams.get("status")?.trim();
  const verdictParam = url.searchParams.get("verdict")?.trim();
  const priorityParam = url.searchParams.get("priority")?.trim();
  const searchParam = url.searchParams.get("search")?.trim();

  const where: Prisma.GeoSentryRequestWhereInput = {};

  if (user.role === "EXPERT") {
    where.assignedToId = user.id;
  }

  if (
    statusParam &&
    statusParam !== "ALL" &&
    (GEOSENTRY_STATUS_VALUES as readonly string[]).includes(statusParam)
  ) {
    where.status = statusParam as GeoSentryStatus;
  }

  if (
    verdictParam &&
    verdictParam !== "ALL" &&
    (GEOSENTRY_VERDICT_VALUES as readonly string[]).includes(verdictParam)
  ) {
    where.verdict = verdictParam as GeoSentryVerdict;
  }

  if (
    priorityParam &&
    priorityParam !== "ALL" &&
    (GEOSENTRY_PRIORITY_VALUES as readonly string[]).includes(priorityParam)
  ) {
    where.priority = priorityParam as GeoSentryPriority;
  }

  if (searchParam) {
    where.OR = [
      { referenceNumber: { contains: searchParam, mode: "insensitive" } },
      { clientName: { contains: searchParam, mode: "insensitive" } },
      { clientEmail: { contains: searchParam, mode: "insensitive" } },
      { clientOrganization: { contains: searchParam, mode: "insensitive" } },
      { targetName: { contains: searchParam, mode: "insensitive" } },
      { targetCountry: { contains: searchParam, mode: "insensitive" } },
      { commodityFocus: { contains: searchParam, mode: "insensitive" } },
    ];
  }

  const isManager = user.role === "GEOSENTRY_MANAGER";

  const requests = await prisma.geoSentryRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
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

  const formatted = requests.map((item) => ({
    ...item,
    targetSizeHectares: item.targetSizeHectares ? Number(item.targetSizeHectares) : null,
    quotedPrice: item.quotedPrice ? Number(item.quotedPrice) : null,
    internalNotes: isManager
      ? item.internalNotes
      : "[Restricted to GeoSentry Manager]",
    ipAddress: isManager ? item.ipAddress : null,
  }));

  return successResponse(formatted);
});

export const POST = apiHandler(async (req, ctx) => {
  const user = await requireSessionUser(["GEOSENTRY_MANAGER"]);
  const body = (await req.json()) as Record<string, unknown>;
  const data = managerCreateSchema.parse(body);

  const referenceNumber = await generateUniqueReferenceNumber();
  const nowIso = new Date().toISOString();

  const parsedSize =
    data.targetSizeHectares !== undefined &&
    data.targetSizeHectares !== null &&
    data.targetSizeHectares !== ""
      ? Number(data.targetSizeHectares)
      : null;

  const parsedQuote =
    data.quotedPrice !== undefined &&
    data.quotedPrice !== null &&
    data.quotedPrice !== ""
      ? Number(data.quotedPrice)
      : null;

  const created = await prisma.geoSentryRequest.create({
    data: {
      referenceNumber,
      clientName: data.clientName,
      clientEmail: data.clientEmail.toLowerCase(),
      clientPhone: data.clientPhone || null,
      clientOrganization: data.clientOrganization || null,
      clientCountry: data.clientCountry || null,
      clientWebsite: data.clientWebsite || null,
      clientLinkedIn: data.clientLinkedIn || null,
      targetName: data.targetName,
      targetCountry: data.targetCountry,
      targetRegion: data.targetRegion || null,
      targetCoordinates: data.targetCoordinates || null,
      depositType: data.depositType as DepositType,
      commodityFocus: data.commodityFocus,
      commodities: data.commodities ?? undefined,
      targetSizeHectares:
        parsedSize !== null && !Number.isNaN(parsedSize) ? parsedSize : null,
      existingData: data.existingData || null,
      projectDescription: data.projectDescription,
      specificConcerns: data.specificConcerns || null,
      keyQuestions: data.keyQuestions || null,
      additionalContext: data.additionalContext || null,
      budget: data.budget || null,
      currency: data.currency || "USD",
      timeline: data.timeline || null,
      priority: data.priority,
      quotedPrice:
        parsedQuote !== null && !Number.isNaN(parsedQuote) ? parsedQuote : null,
      quotedCurrency: data.quotedCurrency || "USD",
      status: data.status,
      internalNotes: data.internalNotes || null,
      clientNotes: data.clientNotes || null,
      assignedToId: data.assignedToId || null,
      verdict: "PENDING",
      source: "manager_portal",
      isRead: true,
      ipAddress: ctx.ip,
      statusHistory: [
        {
          status: data.status,
          timestamp: nowIso,
          note: `Logged directly by ${user.name || user.email}`,
        },
      ],
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
      statusNotes: true,
    },
  });

  void createAuditLog({
    userId: user.id,
    action: "CREATE",
    entity: "GeoSentryRequest",
    entityId: created.id,
    newValue: {
      referenceNumber: created.referenceNumber,
      targetName: created.targetName,
      targetCountry: created.targetCountry,
      status: created.status,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  void sendGeoSentryRequestReceived({
    clientName: created.clientName,
    clientEmail: created.clientEmail,
    referenceNumber: created.referenceNumber,
    targetName: created.targetName,
    targetCountry: created.targetCountry,
    depositType: created.depositType,
  });

  return successResponse(
    {
      ...created,
      targetSizeHectares: created.targetSizeHectares
        ? Number(created.targetSizeHectares)
        : null,
      quotedPrice: created.quotedPrice ? Number(created.quotedPrice) : null,
    },
    201
  );
});

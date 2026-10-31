import { z } from "zod";
import { apiHandler } from "@/lib/api-handler";
import { RateLimitError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { geoSentryLimiter, checkRateLimit, getClientIp, createAuditLog } from "@/lib/security";
import { sendGeoSentryRequestReceived } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

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

const submitSchema = z.object({
  // Step 1 - Contact
  clientName: z.string().min(2).max(100).trim(),
  clientEmail: z.string().email().max(200).trim(),
  clientPhone: z.string().max(40).trim().optional().default(""),
  clientOrganization: z.string().max(150).trim().optional().default(""),
  clientCountry: z.string().max(80).trim().optional().default(""),

  // Step 2 - Target
  targetName: z.string().min(2).max(150).trim(),
  targetCountry: z.string().min(2).max(80).trim(),
  targetRegion: z.string().max(120).trim().optional().default(""),
  targetCoordinates: z.string().max(80).trim().optional().default(""),
  depositType: z.enum(DEPOSIT_TYPE_VALUES),
  commodityFocus: z.string().min(1).max(200).trim(),

  // Step 3 - Context
  budget: z.string().max(50).optional().default(""),
  timeline: z.string().max(80).optional().default(""),
  priority: z.enum(["STANDARD", "RUSH"]).optional().default("STANDARD"),
  projectDescription: z.string().min(20).max(3000).trim(),
  specificConcerns: z.string().max(2000).trim().optional().default(""),
  keyQuestions: z.string().max(2000).trim().optional().default(""),
});

export async function generateUniqueReferenceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `GS-${year}-`;

  const latest = await prisma.geoSentryRequest.findFirst({
    where: { referenceNumber: { startsWith: prefix } },
    orderBy: { referenceNumber: "desc" },
    select: { referenceNumber: true },
  });

  let nextNum = 1;
  if (latest?.referenceNumber) {
    const suffix = latest.referenceNumber.slice(prefix.length);
    const parsed = Number.parseInt(suffix, 10);
    if (!Number.isNaN(parsed) && parsed >= 1) {
      nextNum = parsed + 1;
    }
  }

  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `${prefix}${(nextNum + attempt).toString().padStart(4, "0")}`;
    const exists = await prisma.geoSentryRequest.findUnique({
      where: { referenceNumber: candidate },
      select: { id: true },
    });
    if (!exists) {
      return candidate;
    }
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${Date.now().toString().slice(-4)}${randomSuffix}`;
}

export const POST = apiHandler(async (req: Request) => {
  const ip = getClientIp(req);
  if (!checkRateLimit(`geosentry-submit:${ip}`, geoSentryLimiter)) {
    throw new RateLimitError(
      "Too many screening requests. Please try again later."
    );
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = submitSchema.parse(body);

  let createdRequest: { id: string; referenceNumber: string } | null = null;
  const nowIso = new Date().toISOString();

  for (let attempt = 0; attempt < 3; attempt++) {
    const referenceNumber = await generateUniqueReferenceNumber();
    try {
      createdRequest = await prisma.geoSentryRequest.create({
        data: {
          referenceNumber,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          clientPhone: data.clientPhone || null,
          clientOrganization: data.clientOrganization || null,
          clientCountry: data.clientCountry || null,
          targetName: data.targetName,
          targetCountry: data.targetCountry,
          targetRegion: data.targetRegion || null,
          targetCoordinates: data.targetCoordinates || null,
          depositType: data.depositType,
          commodityFocus: data.commodityFocus,
          projectDescription: data.projectDescription,
          specificConcerns: data.specificConcerns || null,
          keyQuestions: data.keyQuestions || null,
          budget: data.budget || null,
          timeline: data.timeline || null,
          priority: data.priority === "RUSH" ? "RUSH" : "STANDARD",
          status: "SUBMITTED",
          verdict: "PENDING",
          statusHistory: [
            {
              status: "SUBMITTED",
              timestamp: nowIso,
              note: "Screening request submitted via GeoSentry public portal",
            },
          ],
          ipAddress: ip,
          source: "website",
        },
        select: { id: true, referenceNumber: true },
      });
      break;
    } catch (err) {
      if (attempt === 2) throw err;
    }
  }

  const referenceNumber = createdRequest?.referenceNumber ?? (await generateUniqueReferenceNumber());

  logger.info("GeoSentry screening request submitted", {
    referenceNumber,
    targetCountry: data.targetCountry,
    depositType: data.depositType,
    priority: data.priority,
    ip,
  });

  await createAuditLog({
    action: "CREATE",
    entity: "GeoSentryRequest",
    entityId: createdRequest?.id ?? referenceNumber,
    newValue: {
      referenceNumber,
      targetName: data.targetName,
      targetCountry: data.targetCountry,
      depositType: data.depositType,
      priority: data.priority,
    },
    ipAddress: ip,
  });

  void sendGeoSentryRequestReceived({
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    referenceNumber,
    targetName: data.targetName,
    targetCountry: data.targetCountry,
    depositType: data.depositType,
  });

  return successResponse(
    {
      referenceNumber,
      message: "Your screening request has been submitted successfully.",
    },
    201
  );
});

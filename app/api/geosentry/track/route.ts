import { z } from "zod";
import { apiHandler } from "@/lib/api-handler";
import { NotFoundError, RateLimitError, ValidationError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, createRateLimiter } from "@/lib/security";

const trackLimiter = createRateLimiter(25, 60 * 60 * 1000);

const trackSchema = z.object({
  referenceNumber: z.string().min(3, "Reference number is required").max(50).trim(),
  clientEmail: z.string().email("Valid email address is required").max(200).trim(),
});

async function lookupGeoSentryTracking(
  referenceNumber: string,
  clientEmail: string,
  ip: string
) {
  if (!checkRateLimit(`geosentry-track:${ip}`, trackLimiter)) {
    throw new RateLimitError("Too many status tracking lookups. Please try again later.");
  }

  const parsed = trackSchema.safeParse({
    referenceNumber,
    clientEmail,
  });

  if (!parsed.success) {
    throw new ValidationError("Please provide both a valid reference number and client email.");
  }

  const reqRecord = await prisma.geoSentryRequest.findFirst({
    where: {
      referenceNumber: parsed.data.referenceNumber.toUpperCase(),
      clientEmail: {
        equals: parsed.data.clientEmail,
        mode: "insensitive",
      },
    },
    include: {
      statusNotes: {
        where: { isInternal: false },
        orderBy: { createdAt: "desc" },
      },
      assignedTo: {
        select: {
          name: true,
          expertProfile: {
            select: {
              fullName: true,
              designation: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!reqRecord) {
    throw new NotFoundError(
      "No GeoSentry screening request found matching that reference number and email address."
    );
  }

  const assignedReviewer =
    reqRecord.assignedTo?.expertProfile ??
    (reqRecord.assignedTo
      ? {
          fullName: reqRecord.assignedTo.name ?? "GeoSentry Analyst",
          designation: "Screening Specialist",
          slug: null,
        }
      : null);

  return {
    id: reqRecord.id,
    referenceNumber: reqRecord.referenceNumber,
    status: reqRecord.status,
    priority: reqRecord.priority,
    targetName: reqRecord.targetName,
    targetCountry: reqRecord.targetCountry,
    targetRegion: reqRecord.targetRegion,
    commodityFocus: reqRecord.commodityFocus,
    commodities: reqRecord.commodities,
    depositType: reqRecord.depositType,
    createdAt: reqRecord.createdAt,
    updatedAt: reqRecord.updatedAt,
    quotedPrice: reqRecord.quotedPrice ? Number(reqRecord.quotedPrice) : null,
    quotedCurrency: reqRecord.quotedCurrency,
    invoiceFile: reqRecord.invoiceFile,
    geologicalScore: reqRecord.geologicalScore,
    jurisdictionScore: reqRecord.jurisdictionScore,
    operatorScore: reqRecord.operatorScore,
    overallScore: reqRecord.overallScore,
    verdict: reqRecord.verdict,
    reportFile: reqRecord.status === "DELIVERED" ? reqRecord.reportFile : null,
    reportSummary: reqRecord.status === "DELIVERED" ? reqRecord.reportSummary : null,
    deliveredAt: reqRecord.deliveredAt,
    clientNotes: reqRecord.clientNotes,
    statusHistory: reqRecord.statusHistory,
    assignedReviewer,
    notes: reqRecord.statusNotes,
    publicNotes: reqRecord.statusNotes,
  };
}

export const GET = apiHandler(async (req, ctx) => {
  const url = new URL(req.url);
  const ref =
    url.searchParams.get("ref") ??
    url.searchParams.get("referenceNumber") ??
    "";
  const email =
    url.searchParams.get("email") ??
    url.searchParams.get("clientEmail") ??
    "";

  const result = await lookupGeoSentryTracking(ref, email, ctx.ip);
  return successResponse(result);
});

export const POST = apiHandler(async (req, ctx) => {
  const body = (await req.json()) as Record<string, unknown>;
  const ref = String(body.referenceNumber ?? body.ref ?? "");
  const email = String(body.clientEmail ?? body.email ?? "");

  const result = await lookupGeoSentryTracking(ref, email, ctx.ip);
  return successResponse(result);
});

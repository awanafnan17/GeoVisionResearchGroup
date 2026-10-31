import { NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api-handler";
import { ForbiddenError, NotFoundError, RateLimitError } from "@/lib/api-error";
import { getExpertCvFile, incrementCvDownload } from "@/lib/public-data";
import {
  createRateLimiter,
  checkRateLimit,
  getClientIp,
  createAuditLog,
} from "@/lib/security";

// Rate limiter: 10 CV downloads per IP per hour
const cvDownloadLimiter = createRateLimiter(10, 60 * 60 * 1000);

// Validate the id param
const idSchema = z.string().min(1);

export const GET = apiHandler(async (req: Request) => {
  // Extract id from URL path
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const rawId = segments[segments.length - 1] ?? "";

  // Validate id
  const parseResult = idSchema.safeParse(rawId);
  if (!parseResult.success) {
    throw new NotFoundError("Expert not found");
  }
  const id = parseResult.data;

  // Rate limit by IP
  const ip = getClientIp(req);
  if (!checkRateLimit(`cv-download:${ip}`, cvDownloadLimiter)) {
    throw new RateLimitError("Too many download requests. Please try again later.");
  }

  // Fetch CV file path (only cvFile and cvIsPublic, no private fields)
  const expert = await getExpertCvFile(id);

  if (!expert) {
    throw new NotFoundError("Expert not found");
  }

  if (!expert.cvIsPublic || !expert.cvFile) {
    throw new NotFoundError("CV is not available for download");
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(expert.cvFile, req.url);
  } catch {
    throw new NotFoundError("CV file URL is invalid");
  }

  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    throw new ForbiddenError("Unsupported CV file protocol");
  }

  const allowedHosts = [
    "utfs.io",
    "uploadthing.com",
    "res.cloudinary.com",
    url.hostname,
  ];
  if (!allowedHosts.includes(targetUrl.hostname)) {
    throw new ForbiddenError("External CV redirect domain is not permitted");
  }

  // Increment download count and log audit event (fire-and-forget)
  void incrementCvDownload(id);
  void createAuditLog({
    action: "FILE_DOWNLOAD",
    entity: "ExpertProfile",
    entityId: id,
    ipAddress: ip,
  });

  // Redirect to the resolved file URL
  return NextResponse.redirect(targetUrl, { status: 302 });
});

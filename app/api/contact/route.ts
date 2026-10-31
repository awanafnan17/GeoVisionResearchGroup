import { z } from "zod";
import type { LeadType } from "@prisma/client";
import { apiHandler } from "@/lib/api-handler";
import { RateLimitError } from "@/lib/api-error";
import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  contactFormLimiter,
  createAuditLog,
} from "@/lib/security";
import { sendContactEmail, sendLeadNotification } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120).trim(),
  email: z.string().email("Please enter a valid email address").max(200).trim(),
  phone: z.string().max(40).trim().optional().nullable(),
  organization: z.string().max(150).trim().optional().nullable(),
  country: z.string().max(100).trim().optional().nullable(),
  type: z.string().max(60).trim().optional().nullable(),
  subject: z.string().max(200).trim().optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000).trim(),
  serviceId: z.string().max(100).trim().optional().nullable(),
  expertProfileId: z.string().max(100).trim().optional().nullable(),
  projectLocation: z.string().max(200).trim().optional().nullable(),
  projectTimeline: z.string().max(120).trim().optional().nullable(),
  projectBudget: z.string().max(120).trim().optional().nullable(),
  projectType: z.string().max(120).trim().optional().nullable(),
  source: z.string().max(100).trim().optional().nullable(),
  honeypot: z.string().max(200).optional().nullable(),
});

function resolveLeadType(rawType?: string | null): LeadType {
  if (!rawType) return "GENERAL_INQUIRY";
  const upper = rawType.toUpperCase().trim();
  if (
    upper === "GENERAL_INQUIRY" ||
    upper === "PROJECT_INQUIRY" ||
    upper === "EXPERT_CONTACT" ||
    upper === "COURSE_INQUIRY"
  ) {
    return upper;
  }
  if (upper === "SERVICE_INQUIRY") {
    return "PROJECT_INQUIRY";
  }
  if (
    upper === "CONTACT_FORM" ||
    upper === "CONSULTATION_REQUEST" ||
    upper === "PARTNERSHIP"
  ) {
    return "GENERAL_INQUIRY";
  }
  return "GENERAL_INQUIRY";
}

export const POST = apiHandler(async (req, ctx) => {
  if (!checkRateLimit(`contact:${ctx.ip}`, contactFormLimiter)) {
    throw new RateLimitError("Too many inquiries submitted. Please try again later.");
  }

  const body = (await req.json()) as Record<string, unknown>;
  const data = contactSchema.parse(body);

  // Honeypot check: silently accept bot submissions without persisting
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return successResponse(
      {
        id: "accepted",
        message: "Your inquiry has been submitted. Our team will respond within 24 to 48 hours.",
      },
      200
    );
  }

  const leadType = resolveLeadType(data.type);

  let validExpertProfileId: string | null = null;
  let assignedToId: string | null = null;

  if (data.expertProfileId) {
    const expert = await prisma.expertProfile.findUnique({
      where: { id: data.expertProfileId },
      select: { id: true, userId: true },
    });
    if (expert) {
      validExpertProfileId = expert.id;
      assignedToId = expert.userId;
    }
  }

  let validServiceId: string | null = null;
  if (data.serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      select: { id: true },
    });
    if (service) {
      validServiceId = service.id;
    }
  }

  const lead = await prisma.lead.create({
    data: {
      type: leadType,
      status: "NEW",
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      organization: data.organization || null,
      country: data.country || null,
      subject: data.subject || "Website Inquiry",
      message: data.message,
      projectLocation: data.projectLocation || null,
      projectTimeline: data.projectTimeline || null,
      projectBudget: data.projectBudget || null,
      projectType: data.projectType || null,
      expertProfileId: validExpertProfileId,
      assignedToId,
      serviceId: validServiceId,
      source: data.source || "website",
    },
    select: { id: true, type: true, subject: true },
  });

  void createAuditLog({
    action: "CREATE",
    entity: "Lead",
    entityId: lead.id,
    newValue: {
      type: lead.type,
      email: data.email.toLowerCase(),
      subject: lead.subject,
    },
    ipAddress: ctx.ip,
    userAgent: ctx.userAgent,
  });

  void sendContactEmail({
    name: data.name,
    email: data.email,
    phone: data.phone ?? undefined,
    organization: data.organization ?? undefined,
    subject: data.subject || "Website Inquiry",
    message: data.message,
  });

  void sendLeadNotification({
    name: data.name,
    email: data.email,
    type: lead.type,
    subject: data.subject ?? undefined,
    message: data.message,
  });

  return successResponse(
    {
      id: lead.id,
      message: "Your inquiry has been submitted. Our team will respond within 24 to 48 hours.",
    },
    201
  );
});

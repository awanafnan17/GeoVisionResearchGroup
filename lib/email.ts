import { Resend } from "resend";
import { logger } from "@/lib/logger";

const rawApiKey = process.env.RESEND_API_KEY ?? "";
const hasConfiguredResend =
  Boolean(rawApiKey) && rawApiKey !== "re_xxx" && !rawApiKey.startsWith("re_placeholder");

const resend = hasConfiguredResend ? new Resend(rawApiKey) : null;
const FROM = process.env.FROM_EMAIL ?? "info@geovisionresearchgroup.com";
const GEOSENTRY_EMAIL = process.env.GEOSENTRY_EMAIL ?? "awanafnan17@gmail.com";
const APP_NAME = "Geo Vision Research Group";
const GS_NAME = "GeoSentry";

type EmailResult = { success: boolean; error?: string; simulated?: boolean };

export function escapeHtml(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function dispatchEmail(payload: {
  from: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  const cleanSubject = payload.subject.replace(/[\r\n]+/g, " ").trim();
  if (!resend) {
    logger.info("Simulated email dispatch (RESEND_API_KEY not configured for live send)", {
      to: payload.to,
      subject: cleanSubject,
    });
    return { success: true, simulated: true };
  }

  try {
    await resend.emails.send({
      ...payload,
      subject: cleanSubject,
    });
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.warn("Email delivery failed", { subject: cleanSubject, error: message });
    return { success: false, error: message };
  }
}

// Shared HTML wrapper
function emailWrapper(title: string, body: string, isGeoSentry = false): string {
  const bg = isGeoSentry ? "#1B2A4A" : "#0B1929";
  const accent = isGeoSentry ? "#C8A951" : "#C9A84C";
  const brand = isGeoSentry ? GS_NAME : APP_NAME;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:${bg};font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
<div style="text-align:center;margin-bottom:30px;">
<h1 style="color:${accent};font-size:24px;margin:0;">${escapeHtml(brand)}</h1>
</div>
<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:30px;">
<h2 style="color:#F8FAFC;font-size:20px;margin-top:0;">${escapeHtml(title)}</h2>
${body}
</div>
<div style="text-align:center;margin-top:30px;color:#64748B;font-size:12px;">
<p>&copy; ${new Date().getFullYear()} ${escapeHtml(brand)}. All rights reserved.</p>
</div></div></body></html>`;
}

export type ContactEmailData = {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(data: ContactEmailData): Promise<EmailResult> {
  return dispatchEmail({
    from: `${APP_NAME} <${FROM}>`,
    to: [FROM],
    replyTo: data.email,
    subject: `New Contact: ${data.subject}`,
    html: emailWrapper(
      "New Contact Inquiry",
      `
        <p style="color:#E2E8F0;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p style="color:#E2E8F0;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        ${data.phone ? `<p style="color:#E2E8F0;"><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
        ${data.organization ? `<p style="color:#E2E8F0;"><strong>Organization:</strong> ${escapeHtml(data.organization)}</p>` : ""}
        <p style="color:#E2E8F0;"><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:15px;margin-top:15px;">
        <p style="color:#F8FAFC;white-space:pre-wrap;">${escapeHtml(data.message)}</p></div>`
    ),
  });
}

export type EnrollmentEmailData = {
  studentName: string;
  studentEmail: string;
  courseName: string;
  startDate?: string;
  fee?: string;
};

export async function sendEnrollmentConfirmation(
  data: EnrollmentEmailData
): Promise<EmailResult> {
  return dispatchEmail({
    from: `${APP_NAME} <${FROM}>`,
    to: [data.studentEmail],
    subject: `Enrollment Received: ${data.courseName}`,
    html: emailWrapper(
      "Course Enrollment Summary",
      `
        <p style="color:#E2E8F0;">Dear ${escapeHtml(data.studentName)},</p>
        <p style="color:#E2E8F0;">Your enrollment request in <strong style="color:#C9A84C;">${escapeHtml(data.courseName)}</strong> has been recorded.</p>
        ${data.startDate ? `<p style="color:#E2E8F0;"><strong>Start Date:</strong> ${escapeHtml(data.startDate)}</p>` : ""}
        ${data.fee ? `<p style="color:#E2E8F0;"><strong>Fee:</strong> ${escapeHtml(data.fee)}</p>` : ""}
        <p style="color:#E2E8F0;">We will share further onboarding details shortly.</p>`
    ),
  });
}

export type LeadEmailData = {
  name: string;
  email: string;
  type: string;
  subject?: string;
  message: string;
};

export async function sendLeadNotification(data: LeadEmailData): Promise<EmailResult> {
  return dispatchEmail({
    from: `${APP_NAME} <${FROM}>`,
    to: [FROM],
    subject: `New Lead [${data.type}]: ${data.subject ?? data.name}`,
    html: emailWrapper(
      "New Lead Received",
      `
        <p style="color:#E2E8F0;"><strong>Type:</strong> ${escapeHtml(data.type)}</p>
        <p style="color:#E2E8F0;"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p style="color:#E2E8F0;"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:15px;margin-top:15px;">
        <p style="color:#F8FAFC;">${escapeHtml(data.message)}</p></div>`
    ),
  });
}

export type WelcomeEmailData = { name: string; email: string; role: string };

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResult> {
  const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login`;
  return dispatchEmail({
    from: `${APP_NAME} <${FROM}>`,
    to: [data.email],
    subject: `Welcome to ${APP_NAME}`,
    html: emailWrapper(
      "Welcome!",
      `
        <p style="color:#E2E8F0;">Dear ${escapeHtml(data.name)},</p>
        <p style="color:#E2E8F0;">Welcome to ${escapeHtml(APP_NAME)}. Your account has been created with role: <strong style="color:#C9A84C;">${escapeHtml(data.role)}</strong>.</p>
        <p style="color:#E2E8F0;">Log in at <a href="${escapeHtml(loginUrl)}" style="color:#2E6DB4;">${escapeHtml(loginUrl)}</a></p>`
    ),
  });
}

export type PasswordResetData = { name: string; email: string; resetUrl: string };

export async function sendPasswordReset(data: PasswordResetData): Promise<EmailResult> {
  return dispatchEmail({
    from: `${APP_NAME} <${FROM}>`,
    to: [data.email],
    subject: "Password Reset Request",
    html: emailWrapper(
      "Password Reset",
      `
        <p style="color:#E2E8F0;">Dear ${escapeHtml(data.name)},</p>
        <p style="color:#E2E8F0;">Click below to reset your password. This link expires in 1 hour.</p>
        <div style="text-align:center;margin:25px 0;">
        <a href="${escapeHtml(data.resetUrl)}" style="background:#C9A84C;color:#0B1929;padding:12px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
        </div>`
    ),
  });
}

export type GeoSentryEmailData = {
  clientName: string;
  clientEmail: string;
  referenceNumber: string;
  targetName: string;
  targetCountry: string;
  depositType: string;
};

export async function sendGeoSentryRequestReceived(
  data: GeoSentryEmailData
): Promise<EmailResult> {
  await dispatchEmail({
    from: `${GS_NAME} <${FROM}>`,
    to: [GEOSENTRY_EMAIL],
    subject: `New GeoSentry Request: ${data.referenceNumber}`,
    html: emailWrapper(
      "New Screening Request",
      `
        <p style="color:#E2E8F0;"><strong>Reference:</strong> ${escapeHtml(data.referenceNumber)}</p>
        <p style="color:#E2E8F0;"><strong>Client:</strong> ${escapeHtml(data.clientName)} (${escapeHtml(data.clientEmail)})</p>
        <p style="color:#E2E8F0;"><strong>Target:</strong> ${escapeHtml(data.targetName)}, ${escapeHtml(data.targetCountry)}</p>
        <p style="color:#E2E8F0;"><strong>Deposit Type:</strong> ${escapeHtml(data.depositType)}</p>`,
      true
    ),
  });

  return dispatchEmail({
    from: `${GS_NAME} <${FROM}>`,
    to: [data.clientEmail],
    subject: `Screening Request Received - ${data.referenceNumber}`,
    html: emailWrapper(
      "Request Received",
      `
        <p style="color:#E2E8F0;">Dear ${escapeHtml(data.clientName)},</p>
        <p style="color:#E2E8F0;">Your screening request <strong style="color:#C8A951;">${escapeHtml(data.referenceNumber)}</strong> for <strong>${escapeHtml(data.targetName)}</strong> has been received.</p>
        <p style="color:#E2E8F0;">We will review your submission and respond within 24 hours with a quote and timeline.</p>`,
      true
    ),
  });
}

export type GeoSentryStatusData = {
  clientName: string;
  clientEmail: string;
  referenceNumber: string;
  status: string;
  note?: string;
};

export async function sendGeoSentryStatusUpdate(
  data: GeoSentryStatusData
): Promise<EmailResult> {
  await dispatchEmail({
    from: `${GS_NAME} <${FROM}>`,
    to: [GEOSENTRY_EMAIL],
    subject: `GeoSentry Status Update: ${data.referenceNumber} -> ${data.status}`,
    html: emailWrapper(
      "Status Update",
      `
        <p style="color:#E2E8F0;"><strong>Reference:</strong> ${escapeHtml(data.referenceNumber)}</p>
        <p style="color:#E2E8F0;"><strong>New Status:</strong> ${escapeHtml(data.status)}</p>
        ${data.note ? `<p style="color:#E2E8F0;"><strong>Note:</strong> ${escapeHtml(data.note)}</p>` : ""}`,
      true
    ),
  });

  if (data.status === "AWAITING_INFO") {
    return dispatchEmail({
      from: `${GS_NAME} <${FROM}>`,
      to: [data.clientEmail],
      subject: `Update on Your Screening - ${data.referenceNumber}`,
      html: emailWrapper(
        "Request Update",
        `
          <p style="color:#E2E8F0;">Dear ${escapeHtml(data.clientName)},</p>
          <p style="color:#E2E8F0;">Your request <strong style="color:#C8A951;">${escapeHtml(data.referenceNumber)}</strong> status: <strong>${escapeHtml(data.status)}</strong></p>
          ${data.note ? `<p style="color:#E2E8F0;">${escapeHtml(data.note)}</p>` : ""}`,
        true
      ),
    });
  }

  return { success: true };
}

export type GeoSentryDeliveryData = {
  clientName: string;
  clientEmail: string;
  referenceNumber: string;
  targetName: string;
  verdict: string;
  score: number;
};

export async function sendGeoSentryReportDelivered(
  data: GeoSentryDeliveryData
): Promise<EmailResult> {
  return dispatchEmail({
    from: `${GS_NAME} <${FROM}>`,
    to: [data.clientEmail],
    subject: `Screening Report Ready - ${data.referenceNumber}`,
    html: emailWrapper(
      "Your Report is Ready",
      `
        <p style="color:#E2E8F0;">Dear ${escapeHtml(data.clientName)},</p>
        <p style="color:#E2E8F0;">The screening report for <strong style="color:#C8A951;">${escapeHtml(data.targetName)}</strong> is complete.</p>
        <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
        <p style="color:#C8A951;font-size:28px;font-weight:bold;margin:0;">${escapeHtml(data.score)}/100</p>
        <p style="color:#F5F5F0;font-size:16px;margin:5px 0 0;">Verdict: <strong>${escapeHtml(data.verdict)}</strong></p>
        </div>
        <p style="color:#E2E8F0;">Please contact us or use the GeoSentry Status Tracker for report delivery details.</p>`,
      true
    ),
  });
}

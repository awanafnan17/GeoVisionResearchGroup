import { prisma } from "@/lib/prisma";
import { SECURITY_CONFIG } from "@/lib/constants";
import type { AuditAction } from "@prisma/client";

// ═══════════════════════════════════════════════════════════
// In-Memory Rate Limiter (Dev - plug in Redis for production)
// ═══════════════════════════════════════════════════════════
// PRODUCTION NOTE: Replace Map-based store with Redis using
// rate-limiter-flexible's RateLimiterRedis for distributed rate limiting.

type RateLimitEntry = { count: number; resetAt: number };
type RateLimiter = { maxRequests: number; windowMs: number; store: Map<string, RateLimitEntry> };

export function createRateLimiter(maxRequests: number, windowMs: number): RateLimiter {
  return { maxRequests, windowMs, store: new Map() };
}

export function checkRateLimit(key: string, limiter: RateLimiter): boolean {
  const now = Date.now();

  // Evict expired entries when store grows large to prevent memory exhaustion
  if (limiter.store.size > 500) {
    for (const [k, v] of limiter.store.entries()) {
      if (now > v.resetAt) {
        limiter.store.delete(k);
      }
    }
    if (limiter.store.size >= 2000) {
      const oldestKey = limiter.store.keys().next().value;
      if (oldestKey) {
        limiter.store.delete(oldestKey);
      }
    }
  }

  const entry = limiter.store.get(key);

  if (!entry || now > entry.resetAt) {
    limiter.store.set(key, { count: 1, resetAt: now + limiter.windowMs });
    return true; // allowed
  }

  if (entry.count >= limiter.maxRequests) {
    return false; // blocked
  }

  entry.count++;
  return true; // allowed
}

// Pre-configured limiters
export const contactFormLimiter = createRateLimiter(
  SECURITY_CONFIG.RATE_LIMIT_CONTACT_PER_HOUR,
  60 * 60 * 1000
);
export const loginLimiter = createRateLimiter(
  SECURITY_CONFIG.RATE_LIMIT_LOGIN_PER_15MIN,
  15 * 60 * 1000
);
export const geoSentryLimiter = createRateLimiter(
  SECURITY_CONFIG.RATE_LIMIT_GEOSENTRY_PER_HOUR,
  60 * 60 * 1000
);
export const apiLimiter = createRateLimiter(
  SECURITY_CONFIG.RATE_LIMIT_API_PER_MINUTE,
  60 * 1000
);

// ═══════════════════════════════════════════════════════════
// IP Extraction
// ═══════════════════════════════════════════════════════════

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "127.0.0.1";
}

// ═══════════════════════════════════════════════════════════
// Security Headers
// ═══════════════════════════════════════════════════════════

export function getSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy":
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: blob: https://utfs.io https://uploadthing.com https://images.unsplash.com https://randomuser.me https://res.cloudinary.com https://lh3.googleusercontent.com; " +
      "connect-src 'self' https://uploadthing.com https://utfs.io; " +
      "frame-ancestors 'none';",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-DNS-Prefetch-Control": "on",
  };
}

// ═══════════════════════════════════════════════════════════
// File Validation
// ═══════════════════════════════════════════════════════════
// VIRUS SCAN NOTE: Integrate ClamAV or a cloud-based scanning
// service (e.g., VirusTotal API) at the validateFileUpload step
// before storing the file.

export function validateFileType(file: File, allowed: string[]): boolean {
  return allowed.includes(file.type);
}

export function validateFileSize(file: File, maxMb: number): boolean {
  return file.size <= maxMb * 1024 * 1024;
}

export function validatePdfFile(file: File): boolean {
  return (
    validateFileType(file, SECURITY_CONFIG.ALLOWED_CV_TYPES) &&
    validateFileSize(file, SECURITY_CONFIG.CV_MAX_SIZE_MB)
  );
}

export function validateImageFile(file: File): boolean {
  return (
    validateFileType(file, SECURITY_CONFIG.ALLOWED_IMAGE_TYPES as unknown as string[]) &&
    validateFileSize(file, SECURITY_CONFIG.IMAGE_MAX_SIZE_MB)
  );
}

// ═══════════════════════════════════════════════════════════
// Token Utilities
// ═══════════════════════════════════════════════════════════

export function generateSecureToken(): string {
  return crypto.randomUUID();
}

export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ═══════════════════════════════════════════════════════════
// Cloud / Production Demo Credential Guards
// ═══════════════════════════════════════════════════════════

export const PREDICTABLE_DEMO_PASSWORDS = new Set([
  "GeoVision@2024!",
  "Admin@2024!",
  "GeoSentry@2024!",
  "Expert@2024!",
  "Student@2024!",
  "Demo@2024!",
  "GeoVision@2026!",
]);

export function isLocalDatabaseUrl(rawUrl?: string): boolean {
  if (!rawUrl) return false;
  try {
    const parsed = new URL(rawUrl);
    return (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "::1"
    );
  } catch {
    return false;
  }
}

export function isDemoPasswordBlocked(password: string): boolean {
  if (!PREDICTABLE_DEMO_PASSWORDS.has(password)) return false;
  const isLocal = isLocalDatabaseUrl(process.env.DATABASE_URL);
  if (!isLocal || process.env.BLOCK_DEMO_PASSWORDS === "true") {
    return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════
// Audit Logging
// ═══════════════════════════════════════════════════════════

export type AuditLogData = {
  userId?: string;
  action: AuditAction;
  entity?: string;
  entityId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
};

export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId ?? null,
        action: data.action,
        entity: data.entity ?? null,
        entityId: data.entityId ?? null,
        oldValue: (data.oldValue ?? undefined) as unknown as undefined,
        newValue: (data.newValue ?? undefined) as unknown as undefined,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
      },
    });
  } catch (error) {
    console.error("[AUDIT LOG ERROR]", error);
  }
}

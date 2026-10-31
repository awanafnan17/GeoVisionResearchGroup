import { createAuditLog, type AuditLogData } from "@/lib/security";

/**
 * Server-side audit logging helper.
 * Use in server actions and API routes.
 */
export async function logAction(data: AuditLogData): Promise<void> {
  await createAuditLog(data);
}

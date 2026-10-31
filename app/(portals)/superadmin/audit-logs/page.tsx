"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  type PortalAuditLog,
} from "@/components/portals/shared/portal-api";
import { RefreshCw, Shield } from "lucide-react";

const AUDIT_ACTIONS = [
  "ALL",
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGIN_FAILED",
  "ROLE_CHANGE",
  "STATUS_CHANGE",
  "FILE_DOWNLOAD",
];

export default function SuperAdminAuditLogsPage() {
  const [logs, setLogs] = useState<PortalAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState("ALL");
  const [entityFilter, setEntityFilter] = useState("ALL");

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== "ALL") params.set("action", actionFilter);
      if (entityFilter !== "ALL") params.set("entity", entityFilter);
      const qs = params.toString();
      const res = await portalFetch(`/api/portal/audit-logs${qs ? `?${qs}` : ""}`);
      setLogs(extractArray<PortalAuditLog>(res, ["logs", "auditLogs"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load security audit logs");
    } finally {
      setIsLoading(false);
    }
  }, [actionFilter, entityFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadLogs();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadLogs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security & Activity Audit Logs"
        subtitle="Immutable trail of authentication events, role changes, and administrative mutations"
        action={
          <Button variant="secondary" size="sm" onClick={() => void loadLogs()} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh Logs
          </Button>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-geo-slate">Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-none border border-white/10 bg-[#0D1F35] px-3 py-1.5 text-xs text-geo-white"
          >
            {AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-geo-slate">Entity:</span>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="rounded-none border border-white/10 bg-[#0D1F35] px-3 py-1.5 text-xs text-geo-white"
          >
            <option value="ALL">All Entities</option>
            <option value="User">User</option>
            <option value="ExpertProfile">ExpertProfile</option>
            <option value="GeoSentryRequest">GeoSentryRequest</option>
            <option value="Payment">Payment</option>
            <option value="Course">Course</option>
            <option value="Service">Service</option>
            <option value="Lead">Lead</option>
            <option value="SiteSetting">SiteSetting</option>
          </select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" color="gold" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <Shield className="h-10 w-10 text-geo-slate/30 mb-2" />
              <p className="text-sm text-geo-slate">No audit events match the selected filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Timestamp</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Actor</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Entity</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Details</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-xs text-geo-slate whitespace-nowrap">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-geo-white">
                          {log.user?.name || log.user?.email || "System"}
                        </p>
                        {log.user?.role && (
                          <span className="text-[10px] text-geo-gold uppercase">{log.user.role}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            log.action === "DELETE" || log.action === "LOGIN_FAILED"
                              ? "danger"
                              : log.action === "CREATE"
                                ? "success"
                                : "info"
                          }
                          size="sm"
                        >
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-geo-white">
                        {log.entity || "Platform"} {log.entityId ? `(#${log.entityId.slice(-6)})` : ""}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-geo-slate max-w-xs truncate">
                        {log.newValue ? JSON.stringify(log.newValue) : "Recorded"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-geo-slate">
                        {log.ipAddress || "Internal"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

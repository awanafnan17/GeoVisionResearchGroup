"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { StatsGrid } from "@/components/portals/shared/StatsGrid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge, getGeoSentryStatusVariant } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateShort, getDepositTypeLabel } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  getVerdictBadgeVariant,
  type PortalGeoSentryRequest,
} from "@/components/portals/shared/portal-api";
import { Lock } from "lucide-react";

export default function SuperAdminGeoSentryReadOnlyPage() {
  const [requests, setRequests] = useState<PortalGeoSentryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/geosentry/requests");
      setRequests(extractArray<PortalGeoSentryRequest>(res, ["requests"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GeoSentry overview");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOverview();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadOverview]);

  const summary = useMemo(() => {
    const total = requests.length;
    const active = requests.filter((r) => r.status !== "DELIVERED" && r.status !== "CANCELLED").length;
    const delivered = requests.filter((r) => r.status === "DELIVERED").length;
    const scored = requests.filter((r) => r.overallScore != null);
    const avgScore =
      scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + (r.overallScore ?? 0), 0) / scored.length)
        : 0;
    return { total, active, delivered, avgScore };
  }, [requests]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="GeoSentry Pipeline (Read-Only Executive View)"
        subtitle="Executive visibility into GeoSentry screening volume, 100-point risk scores, and verdicts"
      />

      <Alert
        variant="info"
        title="Governance Separation Policy"
        message="Operational scoring, commercial quotes, and confidential manager notes are managed exclusively by the GeoSentry Manager."
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}

      <StatsGrid
        columns={4}
        stats={[
          { title: "Total Requests", value: summary.total, icon: "Search", color: "gold" },
          { title: "Active Screenings", value: summary.active, icon: "Clock", color: "blue" },
          { title: "Delivered Reports", value: summary.delivered, icon: "CheckCircle", color: "green" },
          { title: "Avg Risk Score", value: summary.avgScore > 0 ? `${summary.avgScore}/100` : "N/A", icon: "Target", color: "gold" },
        ]}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>GeoSentry Screening Ledger</CardTitle>
            <CardDescription>Read-only summary of all submitted desktop screening requests</CardDescription>
          </div>
          <Badge variant="gold" size="sm">
            <Lock className="h-3 w-3 mr-1" />
            Read-Only View
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" color="gold" />
            </div>
          ) : requests.length === 0 ? (
            <div className="py-12 text-center text-sm text-geo-slate">No GeoSentry screening requests recorded.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Reference</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Client</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Target & Country</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Deposit Model</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">100-Pt Score</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Verdict</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3.5 font-mono text-xs font-semibold text-geo-gold">
                        {req.referenceNumber}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-geo-white">{req.clientName}</p>
                        <p className="text-xs text-geo-slate">{req.clientOrganization || req.clientEmail}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-geo-white">{req.targetName}</p>
                        <p className="text-xs text-geo-slate">{req.targetCountry} | {req.commodityFocus}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant="default" size="sm">
                          {getDepositTypeLabel(req.depositType)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-geo-white">
                        {req.overallScore != null ? (
                          <span>
                            {req.overallScore}/100 ({req.geologicalScore ?? 0}/{req.jurisdictionScore ?? 0}/{req.operatorScore ?? 0})
                          </span>
                        ) : (
                          <span className="text-geo-slate">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={getVerdictBadgeVariant(req.verdict)} size="sm">
                          {req.verdict.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={getGeoSentryStatusVariant(req.status)} size="sm" dot>
                          {req.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-geo-slate">
                        {formatDateShort(req.createdAt)}
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

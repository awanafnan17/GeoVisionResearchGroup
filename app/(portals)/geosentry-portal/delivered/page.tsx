"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge, getGeoSentryStatusVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate, getDepositTypeLabel } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  getVerdictBadgeVariant,
  type PortalGeoSentryRequest,
} from "@/components/portals/shared/portal-api";
import { CheckCircle, ExternalLink, ArrowRight, FileText } from "lucide-react";

export default function GeoSentryDeliveredPage() {
  const [requests, setRequests] = useState<PortalGeoSentryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDelivered = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/geosentry/requests");
      const all = extractArray<PortalGeoSentryRequest>(res, ["requests"]);
      setRequests(all);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load delivered GeoSentry reports");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDelivered();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadDelivered]);

  const deliveredReports = useMemo(
    () => requests.filter((r) => r.status === "DELIVERED" || r.status === "COMPLETED"),
    [requests]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivered Screening Reports"
        subtitle="Completed and delivered 100-point GeoSentry desktop risk assessments"
      />

      {error && <Alert variant="error" title="Load Error" message={error} onClose={() => setError(null)} />}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="gold" />
        </div>
      ) : deliveredReports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="h-10 w-10 text-geo-slate/30 mb-3" />
            <h3 className="text-base font-semibold text-geo-white mb-1">No delivered reports yet</h3>
            <p className="text-xs text-geo-slate max-w-md mb-4">
              Once screening requests reach COMPLETED or DELIVERED status, their score breakdowns and executive dossiers appear here.
            </p>
            <Link href="/geosentry-portal/requests">
              <Button variant="outline" size="sm">
                Go to Active Pipeline
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliveredReports.map((req) => (
            <Card key={req.id} hoverable>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-geo-gold">{req.referenceNumber}</span>
                    <Badge variant={getGeoSentryStatusVariant(req.status)} size="sm" dot>
                      {req.status}
                    </Badge>
                    <Badge variant={getVerdictBadgeVariant(req.verdict)} size="sm">
                      {req.verdict.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{req.targetName}</CardTitle>
                  <p className="text-xs text-geo-slate mt-0.5">
                    {req.clientName} ({req.clientOrganization || req.clientEmail}) | {req.targetCountry}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-bold font-mono text-geo-gold">
                    {req.overallScore ?? 0}
                  </span>
                  <span className="text-xs text-geo-slate block">/ 100 pts</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 p-3 rounded-none bg-[#0D1F35] border border-white/[0.06] text-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-geo-slate block">Geology</span>
                    <span className="font-mono text-sm font-semibold text-geo-white">
                      {req.geologicalScore ?? 0}/40
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-geo-slate block">Jurisdiction</span>
                    <span className="font-mono text-sm font-semibold text-geo-white">
                      {req.jurisdictionScore ?? 0}/40
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-geo-slate block">Operator</span>
                    <span className="font-mono text-sm font-semibold text-geo-white">
                      {req.operatorScore ?? 0}/20
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-geo-slate">
                  <Badge variant="default" size="sm">
                    {getDepositTypeLabel(req.depositType)}
                  </Badge>
                  <span>Commodity: {req.commodityFocus}</span>
                  {req.deliveredAt && <span>| Delivered {formatDate(req.deliveredAt)}</span>}
                </div>

                {req.reportSummary && (
                  <p className="text-xs text-geo-slate-light leading-relaxed line-clamp-3 bg-white/[0.02] p-3 rounded-none border border-white/[0.04]">
                    {req.reportSummary}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  {req.reportFile ? (
                    <a
                      href={req.reportFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-geo-gold hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Download Dossier PDF
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-geo-slate">No external PDF URL attached</span>
                  )}

                  <Link href={`/geosentry-portal/requests/${req.id}`}>
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                      Open Workbench
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

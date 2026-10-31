"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { StatsGrid } from "@/components/portals/shared/StatsGrid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge, getGeoSentryStatusVariant } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { getDepositTypeLabel } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  getVerdictBadgeVariant,
  type PortalGeoSentryRequest,
} from "@/components/portals/shared/portal-api";

export default function GeoSentryAnalyticsPage() {
  const [requests, setRequests] = useState<PortalGeoSentryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/geosentry/requests");
      setRequests(extractArray<PortalGeoSentryRequest>(res, ["requests"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load GeoSentry analytics data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadAnalytics();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadAnalytics]);

  const metrics = useMemo(() => {
    const total = requests.length;
    const scored = requests.filter((r) => r.overallScore != null);
    const avgOverall =
      scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + (r.overallScore ?? 0), 0) / scored.length)
        : 0;
    const avgGeo =
      scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + (r.geologicalScore ?? 0), 0) / scored.length)
        : 0;
    const avgJur =
      scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + (r.jurisdictionScore ?? 0), 0) / scored.length)
        : 0;
    const avgOp =
      scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + (r.operatorScore ?? 0), 0) / scored.length)
        : 0;

    const byVerdict: Record<string, number> = { GO: 0, CONDITIONAL: 0, NO_GO: 0, PENDING: 0 };
    const byStatus: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    const byDeposit: Record<string, number> = {};

    for (const r of requests) {
      byVerdict[r.verdict] = (byVerdict[r.verdict] ?? 0) + 1;
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
      byCountry[r.targetCountry] = (byCountry[r.targetCountry] ?? 0) + 1;
      byDeposit[r.depositType] = (byDeposit[r.depositType] ?? 0) + 1;
    }

    return {
      total,
      scoredCount: scored.length,
      avgOverall,
      avgGeo,
      avgJur,
      avgOp,
      byVerdict,
      byStatus: Object.entries(byStatus).sort((a, b) => b[1] - a[1]),
      byCountry: Object.entries(byCountry).sort((a, b) => b[1] - a[1]),
      byDeposit: Object.entries(byDeposit).sort((a, b) => b[1] - a[1]),
    };
  }, [requests]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="GeoSentry Intelligence Analytics"
        subtitle="Portfolio-wide scoring distributions, verdict ratios, and target jurisdiction breakdowns"
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}

      <StatsGrid
        columns={4}
        stats={[
          { title: "Total Screenings", value: metrics.total, icon: "Search", color: "gold" },
          { title: "Avg Overall Score", value: `${metrics.avgOverall}/100`, subtitle: `${metrics.scoredCount} scored`, icon: "Target", color: "gold" },
          { title: "GO Verdicts", value: metrics.byVerdict.GO ?? 0, icon: "CheckCircle", color: "green" },
          { title: "NO GO / Conditional", value: (metrics.byVerdict.NO_GO ?? 0) + (metrics.byVerdict.CONDITIONAL ?? 0), icon: "AlertCircle", color: "red" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average 100-Point Component Scores</CardTitle>
            <CardDescription>Mean performance across all scored exploration targets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-geo-white font-medium">Geological Assessment (Max 40)</span>
                <span className="font-mono text-geo-gold">{metrics.avgGeo} / 40</span>
              </div>
              <div className="h-2 rounded-none bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-geo-gold rounded-none"
                  style={{ width: `${Math.min(100, (metrics.avgGeo / 40) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-geo-white font-medium">Jurisdiction and ESG (Max 40)</span>
                <span className="font-mono text-geo-gold">{metrics.avgJur} / 40</span>
              </div>
              <div className="h-2 rounded-none bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-none"
                  style={{ width: `${Math.min(100, (metrics.avgJur / 40) * 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-geo-white font-medium">Operator Quality (Max 20)</span>
                <span className="font-mono text-geo-gold">{metrics.avgOp} / 20</span>
              </div>
              <div className="h-2 rounded-none bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-none"
                  style={{ width: `${Math.min(100, (metrics.avgOp / 20) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verdict Distribution</CardTitle>
            <CardDescription>Go, Conditional, No-Go, and Pending screening decisions</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {(["GO", "CONDITIONAL", "NO_GO", "PENDING"] as const).map((v) => {
              const count = metrics.byVerdict[v] ?? 0;
              const pct = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
              return (
                <div key={v} className="p-4 rounded-none bg-[#0D1F35] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={getVerdictBadgeVariant(v)} size="sm">
                      {v.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs font-mono text-geo-slate">{pct}%</span>
                  </div>
                  <p className="text-2xl font-bold font-mono text-geo-white">{count}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {metrics.byStatus.length === 0 ? (
              <p className="text-xs text-geo-slate">No status data yet</p>
            ) : (
              metrics.byStatus.map(([st, count]) => (
                <div key={st} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <Badge variant={getGeoSentryStatusVariant(st)} size="sm" dot>
                    {st.replace(/_/g, " ")}
                  </Badge>
                  <span className="font-mono text-xs text-geo-white">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deposit Models Screened</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {metrics.byDeposit.length === 0 ? (
              <p className="text-xs text-geo-slate">No deposit data yet</p>
            ) : (
              metrics.byDeposit.map(([dep, count]) => (
                <div key={dep} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-geo-white">{getDepositTypeLabel(dep)}</span>
                  <span className="font-mono text-xs text-geo-gold">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Jurisdictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {metrics.byCountry.length === 0 ? (
              <p className="text-xs text-geo-slate">No country data yet</p>
            ) : (
              metrics.byCountry.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-geo-white">{country}</span>
                  <span className="font-mono text-xs text-geo-gold">{count}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

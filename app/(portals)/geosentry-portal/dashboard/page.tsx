import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { StatsGrid } from "@/components/portals/shared/StatsGrid";
import { Badge, getGeoSentryStatusVariant } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Search, FileText, Plus, BarChart2 } from "lucide-react";

const DEPOSIT_LABELS: Record<string, string> = {
  PORPHYRY: "Porphyry",
  VMS: "VMS",
  EPITHERMAL_HIGH_SULPHIDATION: "Epithermal HS",
  EPITHERMAL_LOW_SULPHIDATION: "Epithermal LS",
  OROGENIC_GOLD: "Orogenic Gold",
  OPHIOLITE_HOSTED: "Ophiolite-Hosted",
  IOCG: "IOCG",
  SKARN: "Skarn",
  SEDEX: "SEDEX",
  CARLIN_TYPE: "Carlin-Type",
  PODIFORM_CHROMITE: "Podiform Chromite",
  NICKEL_LATERITE: "Nickel Laterite",
  LATERITE_SAPROLITE: "Laterite/Saprolite",
  PEGMATITE_LITHIUM_REE: "Pegmatite Li/REE",
  BIF_IRON: "BIF Iron",
  PLACER_GOLD: "Placer Gold",
  MANGANESE: "Manganese",
  PHOSPHATE: "Phosphate",
  BAUXITE: "Bauxite",
  MVT_LEAD_ZINC: "MVT Pb-Zn",
  INTRUSION_RELATED: "Intrusion-Related",
  VOLCANIC_HOSTED: "Volcanic-Hosted",
  SEDIMENT_HOSTED: "Sediment-Hosted",
  OTHER: "Other",
};

export default async function GeoSentryDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/staff/login?callbackUrl=/geosentry-portal/dashboard");
  const user = session.user as { name?: string; role: string };
  if (user.role !== "GEOSENTRY_MANAGER") redirect("/unauthorized");

  const [
    newRequests,
    inProgressCount,
    deliveredCount,
    recentRequests,
    allScores,
    depositBreakdown,
  ] = await Promise.all([
    prisma.geoSentryRequest.count({ where: { status: "SUBMITTED" } }),
    prisma.geoSentryRequest.count({ where: { status: "IN_PROGRESS" } }),
    prisma.geoSentryRequest.count({ where: { status: "DELIVERED" } }),
    prisma.geoSentryRequest.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceNumber: true,
        clientName: true,
        targetName: true,
        targetCountry: true,
        depositType: true,
        priority: true,
        status: true,
        overallScore: true,
        createdAt: true,
      },
    }),
    prisma.geoSentryRequest.findMany({
      where: { overallScore: { not: null } },
      select: { overallScore: true },
    }),
    prisma.geoSentryRequest.groupBy({
      by: ["depositType"],
      _count: { depositType: true },
      orderBy: { _count: { depositType: "desc" } },
      take: 5,
    }),
  ]);

  const avgScore =
    allScores.length > 0
      ? Math.round(
          allScores.reduce((sum, r) => sum + (r.overallScore ?? 0), 0) /
            allScores.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* GeoSentry Institutional Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-[#09101B] border border-gs-gold/30">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 bg-gs-gold" />
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-gs-gold">
            GEOSENTRY • SCREENING INTELLIGENCE DESK
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-geo-slate-light">
          PROTOCOL: 100-PT RISK-WEIGHTED MINERAL EVALUATION
        </span>
      </div>

      <PageHeader
        eyebrow="GEOSENTRY INTELLIGENCE DESK • CLEARANCE GS-MGR"
        meta="CAPITAL-ALLOCATION SCREENING"
        title="Geological Risk & Screening Ledger"
        subtitle={`ANALYST DESK: ${user.name ?? "Manager"} • DESKTOP SCREENING & GO/NO-GO VERDICT ENGINE`}
        action={
          <Link href="/geosentry-portal/new-request">
            <Button variant="default" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Log New Request
            </Button>
          </Link>
        }
      />

      <StatsGrid
        columns={4}
        stats={[
          {
            code: "GS 01",
            title: "New Requests",
            value: newRequests,
            subtitle: "Awaiting triage",
            icon: "AlertCircle",
            color: newRequests > 0 ? "red" : "gold",
            trend: newRequests > 0 ? "up" : "neutral",
            trendValue: newRequests > 0 ? `${newRequests} pending` : "0 pending",
          },
          {
            code: "GS 02",
            title: "In Progress",
            value: inProgressCount,
            subtitle: "Active technical scoring",
            icon: "Clock",
            color: "blue",
          },
          {
            code: "GS 03",
            title: "Delivered",
            value: deliveredCount,
            subtitle: "Issued Go/No-Go dossiers",
            icon: "CheckCircle",
            color: "green",
          },
          {
            code: "GS 04",
            title: "Avg Score",
            value: avgScore > 0 ? `${avgScore}/100` : "N/A",
            subtitle: "100-pt composite index",
            icon: "Target",
            color: "gold",
          },
        ]}
      />

      {/* Recent Screening Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-gs-gold mb-0.5">
              LEDGER 01 — ACTIVE SCREENING DOSSIERS
            </span>
            <CardTitle>Recent Screening Requests</CardTitle>
          </div>
          <Link href="/geosentry-portal/requests">
            <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-10 w-10 border border-gs-gold/30 bg-gs-gold/10 flex items-center justify-center mb-3">
                <Search className="h-4 w-4 text-gs-gold" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                No screening requests yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0B1320] border-b border-white/10">
                    <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                      Reference
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                      Target
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                      Deposit Type
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                      Priority
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                      Score
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.025] transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-gs-gold font-semibold tabular-nums">
                          {req.referenceNumber}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-geo-white font-medium">{req.targetName}</p>
                          <p className="font-mono text-[11px] text-geo-slate uppercase tracking-[0.1em]">
                            {req.targetCountry}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant="default" size="sm">
                          {DEPOSIT_LABELS[req.depositType] ?? req.depositType}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={req.priority === "RUSH" ? "danger" : "slate"}
                          size="sm"
                        >
                          {req.priority}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-geo-white tabular-nums">
                          {req.overallScore != null ? `${req.overallScore}/100` : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={getGeoSentryStatusVariant(req.status)}
                          size="sm"
                          dot
                        >
                          {req.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-geo-slate-light tabular-nums">
                        {formatDate(req.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Model Breakdown & Protocol Specification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-gs-gold mb-0.5">
                MATRIX 02 — GEOLOGICAL CLASSIFICATION
              </span>
              <CardTitle>Top Deposit Types</CardTitle>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-geo-slate">
              BY DOSSIER VOLUME
            </span>
          </CardHeader>
          <CardContent>
            {depositBreakdown.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                No deposit classification data yet
              </div>
            ) : (
              <div className="space-y-4">
                {depositBreakdown.map((d, idx) => {
                  const maxCount = depositBreakdown[0]._count.depositType;
                  const pct =
                    maxCount > 0 ? (d._count.depositType / maxCount) * 100 : 0;
                  return (
                    <div key={d.depositType} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] text-gs-gold tabular-nums">
                            0{idx + 1}
                          </span>
                          <span className="text-sm font-medium text-geo-white">
                            {DEPOSIT_LABELS[d.depositType] ?? d.depositType}
                          </span>
                        </div>
                        <span className="font-mono text-xs text-geo-slate-light tabular-nums">
                          {d._count.depositType} DOSSIERS
                        </span>
                      </div>
                      <div className="h-2 rounded-none bg-[#0B1320] border border-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-none bg-gs-gold transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="bordered" className="border-gs-gold/30 bg-[#09101B]">
          <CardHeader>
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-gs-gold mb-0.5">
              SPECIFICATION 03
            </span>
            <CardTitle>About GeoSentry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-geo-slate-light leading-relaxed font-sans">
              Desktop geological screening service. 100-point scoring framework
              across geological merit, jurisdictional risk, and operator
              capability. Delivers structured Go/No-Go verdicts for junior
              exploration companies and mining investors.
            </p>
            <div className="border-t border-white/10 pt-3 space-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-geo-slate">
              <div className="flex justify-between">
                <span>GEOLOGICAL MERIT</span>
                <span className="text-geo-white tabular-nums">40 PTS</span>
              </div>
              <div className="flex justify-between">
                <span>ALTERATION & GEOPHYSICS</span>
                <span className="text-geo-white tabular-nums">35 PTS</span>
              </div>
              <div className="flex justify-between">
                <span>JURISDICTION & ACCESS</span>
                <span className="text-geo-white tabular-nums">25 PTS</span>
              </div>
            </div>
            <div className="pt-2">
              <Link href="/geosentry">
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ArrowRight className="h-3 w-3" />}
                >
                  Public Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-gs-gold mb-0.5">
              DISPATCH 04 — ANALYST WORKFLOWS
            </span>
            <CardTitle>Quick Actions</CardTitle>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate">
            DESK OPERATIONS
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/geosentry-portal/requests">
              <Button variant="outline" size="sm" leftIcon={<Search className="h-3.5 w-3.5" />}>
                View All Requests
              </Button>
            </Link>
            <Link href="/geosentry-portal/new-request">
              <Button variant="outline" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                Log New Request
              </Button>
            </Link>
            <Link href="/geosentry-portal/delivered">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileText className="h-3.5 w-3.5" />}
              >
                Delivered Reports
              </Button>
            </Link>
            <Link href="/geosentry-portal/analytics">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<BarChart2 className="h-3.5 w-3.5" />}
              >
                Screening Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

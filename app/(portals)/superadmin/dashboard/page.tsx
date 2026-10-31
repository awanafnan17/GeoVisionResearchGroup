import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { StatsGrid } from "@/components/portals/shared/StatsGrid";
import { Badge, getLeadStatusVariant, getGeoSentryStatusVariant } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Shield, Users, UserCheck, GraduationCap, MessageSquare, Search, Settings } from "lucide-react";

export default async function SuperAdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/staff/login?callbackUrl=/superadmin/dashboard");
  const user = session.user as { name?: string; role: string };
  if (user.role !== "SUPERADMIN") redirect("/unauthorized");

  const [
    expertCount,
    serviceCount,
    courseCount,
    leadCount,
    newLeadCount,
    enrollmentCount,
    geoSentryCount,
    recentLeads,
    recentGeoSentry,
  ] = await Promise.all([
    prisma.expertProfile.count({ where: { status: "PUBLISHED" } }),
    prisma.service.count({ where: { isPublished: true } }),
    prisma.course.count({
      where: { status: { in: ["PUBLISHED", "ONGOING", "UPCOMING"] } },
    }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.enrollment.count(),
    prisma.geoSentryRequest.count(),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, type: true, status: true, createdAt: true },
    }),
    prisma.geoSentryRequest.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceNumber: true,
        targetName: true,
        targetCountry: true,
        depositType: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="EXECUTIVE COMMAND CENTER • SUPERADMIN"
        meta="SYSTEM GOVERNANCE"
        title="Institutional Command & Governance"
        subtitle={`ACTIVE OPERATOR: ${user.name ?? "Super Admin"} • GLOBAL PRACTICE & GEOSENTRY OVERSIGHT`}
        action={
          <div className="flex items-center gap-2">
            <Link href="/superadmin/audit-logs">
              <Button variant="secondary" size="sm" leftIcon={<Shield className="h-3.5 w-3.5" />}>
                Audit Ledger
              </Button>
            </Link>
            <Link href="/superadmin/users">
              <Button variant="default" size="sm" leftIcon={<Users className="h-3.5 w-3.5" />}>
                Manage Access
              </Button>
            </Link>
          </div>
        }
      />

      {/* Primary Executive KPIs */}
      <StatsGrid
        columns={4}
        stats={[
          {
            code: "EXEC 01",
            title: "Total Experts",
            value: expertCount,
            subtitle: "Published profiles",
            icon: "UserCheck",
            color: "gold",
          },
          {
            code: "EXEC 02",
            title: "Active Services",
            value: serviceCount,
            subtitle: "Advisory capabilities",
            icon: "Briefcase",
            color: "blue",
          },
          {
            code: "EXEC 03",
            title: "New Leads",
            value: newLeadCount,
            subtitle: "Require attention",
            icon: "MessageSquare",
            color: "gold",
            trend: newLeadCount > 0 ? "up" : "neutral",
            trendValue: newLeadCount > 0 ? `${newLeadCount} new` : "0 new",
          },
          {
            code: "EXEC 04",
            title: "GeoSentry Requests",
            value: geoSentryCount,
            subtitle: "Screening dossiers",
            icon: "Search",
            color: "blue",
          },
        ]}
      />

      {/* Secondary Operational KPIs */}
      <StatsGrid
        columns={3}
        stats={[
          {
            code: "ACAD 05",
            title: "Total Courses",
            value: courseCount,
            subtitle: "Active & upcoming seminars",
            icon: "GraduationCap",
            color: "gold",
          },
          {
            code: "ACAD 06",
            title: "Enrollments",
            value: enrollmentCount,
            subtitle: "Registered scholars",
            icon: "Users",
            color: "blue",
          },
          {
            code: "COMM 07",
            title: "Total Leads",
            value: leadCount,
            subtitle: "Cumulative inquiries",
            icon: "Inbox",
            color: "gold",
          },
        ]}
      />

      {/* Two-Column Executive Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads - 2/3 width */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
                COMMERCIAL & RESEARCH INTAKE
              </span>
              <CardTitle>Recent Leads</CardTitle>
            </div>
            <Link href="/superadmin/leads">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                No leads recorded in ledger
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0B1320] border-b border-white/10">
                      <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                        Name
                      </th>
                      <th className="text-left px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-geo-slate-light">
                        Type
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
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/[0.025] transition-colors">
                        <td className="px-5 py-3.5 text-geo-white font-medium">{lead.name}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant="default" size="sm">
                            {lead.type.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={getLeadStatusVariant(lead.status)} size="sm" dot>
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-geo-slate-light tabular-nums">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent GeoSentry - 1/3 width */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
                SCREENING DESK
              </span>
              <CardTitle>GeoSentry Requests</CardTitle>
            </div>
            <Link href="/superadmin/geosentry">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
                View
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentGeoSentry.length === 0 ? (
              <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                No screening requests yet
              </div>
            ) : (
              <div className="divide-y divide-white/[0.07]">
                {recentGeoSentry.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 hover:bg-white/[0.025] transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-geo-gold tabular-nums">
                        {req.referenceNumber}
                      </span>
                      <Badge variant={getGeoSentryStatusVariant(req.status)} size="sm" dot>
                        {req.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-geo-white font-medium">{req.targetName}</p>
                    <div className="flex items-center justify-between pt-1 font-mono text-[11px] text-geo-slate-light uppercase tracking-[0.1em]">
                      <span>
                        {req.targetCountry} &bull; {req.depositType.replace(/_/g, " ")}
                      </span>
                      <span className="text-geo-slate tabular-nums">{formatDate(req.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Institutional Rapid Dispatch Matrix */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
              SYSTEM CONTROLS
            </span>
            <CardTitle>Quick Actions</CardTitle>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate">
            DIRECT MODULE ROUTING
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/superadmin/experts">
              <Button variant="outline" size="sm" leftIcon={<UserCheck className="h-3.5 w-3.5" />}>
                Add Expert
              </Button>
            </Link>
            <Link href="/superadmin/courses">
              <Button variant="outline" size="sm" leftIcon={<GraduationCap className="h-3.5 w-3.5" />}>
                Add Course
              </Button>
            </Link>
            <Link href="/superadmin/leads">
              <Button variant="outline" size="sm" leftIcon={<MessageSquare className="h-3.5 w-3.5" />}>
                View All Leads
              </Button>
            </Link>
            <Link href="/superadmin/geosentry">
              <Button variant="outline" size="sm" leftIcon={<Search className="h-3.5 w-3.5" />}>
                View GeoSentry Requests
              </Button>
            </Link>
            <Link href="/superadmin/settings">
              <Button variant="outline" size="sm" leftIcon={<Settings className="h-3.5 w-3.5" />}>
                Site Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

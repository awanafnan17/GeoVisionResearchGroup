import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { StatsGrid } from "@/components/portals/shared/StatsGrid";
import { Badge, getLeadStatusVariant } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, UserCheck, GraduationCap, Briefcase, MessageSquare } from "lucide-react";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/staff/login?callbackUrl=/admin/dashboard");
  const user = session.user as { name?: string; role: string };
  if (user.role !== "ADMIN") redirect("/unauthorized");

  const [
    expertCount,
    pendingExpertCount,
    courseCount,
    newLeadCount,
    recentLeads,
    pendingProfiles,
  ] = await Promise.all([
    prisma.expertProfile.count({ where: { status: "PUBLISHED" } }),
    prisma.expertProfile.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.course.count({
      where: { status: { in: ["PUBLISHED", "ONGOING", "UPCOMING"] } },
    }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, type: true, status: true, createdAt: true },
    }),
    prisma.expertProfile.findMany({
      where: { status: "PENDING_REVIEW" },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, designation: true, createdAt: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="OPERATIONS & CONTENT LEDGER • ADMIN"
        meta="PRACTICE MANAGEMENT"
        title="Editorial & Practice Operations"
        subtitle={`ACTIVE OPERATOR: ${user.name ?? "Admin"} • DIRECTORY VERIFICATION & INQUIRY DESK`}
        action={
          <Link href="/admin/leads">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Open Inquiry Queue
            </Button>
          </Link>
        }
      />

      <StatsGrid
        columns={4}
        stats={[
          {
            code: "OPS 01",
            title: "Published Experts",
            value: expertCount,
            subtitle: "Active directory dossiers",
            icon: "UserCheck",
            color: "gold",
          },
          {
            code: "OPS 02",
            title: "Pending Review",
            value: pendingExpertCount,
            subtitle: "Editorial sign-off",
            icon: "Clock",
            color: "blue",
            trend: pendingExpertCount > 0 ? "up" : "neutral",
            trendValue: pendingExpertCount > 0 ? `${pendingExpertCount} pending` : "0 pending",
          },
          {
            code: "OPS 03",
            title: "New Leads",
            value: newLeadCount,
            subtitle: "Unassigned inquiries",
            icon: "MessageSquare",
            color: "gold",
          },
          {
            code: "OPS 04",
            title: "Active Courses",
            value: courseCount,
            subtitle: "Published training catalog",
            icon: "GraduationCap",
            color: "blue",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
                LEDGER 01 — INTAKE STREAM
              </span>
              <CardTitle>Recent Leads</CardTitle>
            </div>
            <Link href="/admin/leads">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                No leads recorded yet
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
                        <td className="px-5 py-3.5">
                          <p className="text-geo-white font-medium">{lead.name}</p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-geo-slate mt-0.5">
                            {lead.type.replace(/_/g, " ")}
                          </p>
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

        {/* Pending Expert Profiles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
                LEDGER 02 — DIRECTORY AUDIT
              </span>
              <CardTitle>Profiles Awaiting Review</CardTitle>
            </div>
            <Link href="/admin/experts">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="h-3 w-3" />}>
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {pendingProfiles.length === 0 ? (
              <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                All expert profiles verified — 0 pending
              </div>
            ) : (
              <div className="divide-y divide-white/[0.07]">
                {pendingProfiles.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.025] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-geo-white">{p.fullName}</p>
                      <p className="font-mono text-[11px] text-geo-slate-light mt-0.5">
                        {p.designation}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-geo-slate tabular-nums">
                        {formatDate(p.createdAt)}
                      </span>
                      <Badge variant="warning" size="sm" dot>
                        Review
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
              DISPATCH 03 — EDITORIAL CONTROLS
            </span>
            <CardTitle>Quick Actions</CardTitle>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-geo-slate">
            OPERATIONS SHORTCUTS
          </span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/experts">
              <Button variant="outline" size="sm" leftIcon={<UserCheck className="h-3.5 w-3.5" />}>
                Add Expert Profile
              </Button>
            </Link>
            <Link href="/admin/courses">
              <Button variant="outline" size="sm" leftIcon={<GraduationCap className="h-3.5 w-3.5" />}>
                Add Course
              </Button>
            </Link>
            <Link href="/admin/services">
              <Button variant="outline" size="sm" leftIcon={<Briefcase className="h-3.5 w-3.5" />}>
                Add Service
              </Button>
            </Link>
            <Link href="/admin/leads">
              <Button variant="outline" size="sm" leftIcon={<MessageSquare className="h-3.5 w-3.5" />}>
                View All Leads
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

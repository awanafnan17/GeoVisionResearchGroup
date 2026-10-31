import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { StatsGrid } from "@/components/portals/shared/StatsGrid";
import { Alert } from "@/components/ui/Alert";
import { Badge, getLeadStatusVariant } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { UserPlus, Check, X, ArrowRight, User } from "lucide-react";

export default async function ExpertDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { id: string; name?: string; role: string };
  if (user.role !== "EXPERT") redirect("/unauthorized");

  const profile = await prisma.expertProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      fullName: true,
      designation: true,
      shortBio: true,
      profilePhoto: true,
      cvFile: true,
      profileViews: true,
      cvDownloads: true,
      status: true,
      linkedin: true,
      education: true,
      experience: true,
      publications: true,
      specializations: { select: { id: true } },
    },
  });

  const assignedLeadCount = await prisma.lead.count({
    where: { assignedToId: user.id },
  });
  const recentLeads = await prisma.lead.findMany({
    where: { assignedToId: user.id },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, type: true, status: true, createdAt: true },
  });

  const checks = profile
    ? [
        {
          label: "Basic Info (name, designation, bio)",
          done: !!(profile.fullName && profile.designation && profile.shortBio),
        },
        { label: "Profile Photo", done: !!profile.profilePhoto },
        { label: "CV Uploaded", done: !!profile.cvFile },
        {
          label: "Specializations Added",
          done: profile.specializations.length > 0,
        },
        {
          label: "Publications Added",
          done:
            Array.isArray(profile.publications) &&
            (profile.publications as unknown[]).length > 0,
        },
        {
          label: "Education History",
          done:
            Array.isArray(profile.education) &&
            (profile.education as unknown[]).length > 0,
        },
        { label: "Social Links", done: !!profile.linkedin },
      ]
    : [];
  const completedCount = checks.filter((c) => c.done).length;
  const completionPct =
    checks.length > 0 ? Math.round((completedCount / checks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="PRINCIPAL INVESTIGATOR WORKSPACE • EXPERT"
        meta={profile?.status ? `DOSSIER: ${profile.status}` : "RESEARCH FELLOWSHIP"}
        title="Research Dossier & Advisory Desk"
        subtitle={`INVESTIGATOR: ${profile?.fullName ?? user.name ?? "Expert"}${
          profile?.designation ? ` • ${profile.designation.toUpperCase()}` : ""
        }`}
        action={
          <Link href="/expert/profile">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<User className="h-3.5 w-3.5" />}
            >
              Manage Dossier
            </Button>
          </Link>
        }
      />

      {!profile && (
        <Card variant="bordered" className="border-geo-gold/40 bg-[#09101B]">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <div className="h-12 w-12 rounded-none border border-geo-gold/40 bg-geo-gold/10 flex items-center justify-center mb-4">
              <UserPlus className="h-5 w-5 text-geo-gold" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold mb-1">
              ONBOARDING REQUIRED • DOSSIER INITIALIZATION
            </span>
            <h3 className="text-xl font-heading font-normal text-geo-white mb-2">
              Complete Your Investigator Profile
            </h3>
            <p className="text-xs font-sans text-geo-slate-light mb-5 max-w-md leading-relaxed">
              Initialize your academic and technical dossier to be indexed in the
              Geo Vision Research Group directory and receive assigned advisory
              inquiries.
            </p>
            <Link href="/expert/profile">
              <Button>Set Up Profile</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {profile && profile.status === "DRAFT" && (
        <Alert
          variant="warning"
          title="Profile in Draft"
          message="Your profile is not yet visible. Submit it for review when ready."
        />
      )}
      {profile && profile.status === "PENDING_REVIEW" && (
        <Alert
          variant="info"
          title="Under Review"
          message="Your profile has been submitted and is currently being reviewed by the admin team."
        />
      )}
      {profile && profile.status === "PUBLISHED" && (
        <Alert
          variant="success"
          title="Profile Live"
          message="Your profile is published and visible on the platform."
        />
      )}

      {profile && (
        <StatsGrid
          columns={3}
          stats={[
            {
              code: "PI 01",
              title: "Profile Views",
              value: profile.profileViews,
              subtitle: "Institutional directory impressions",
              icon: "Eye",
              color: "gold",
            },
            {
              code: "PI 02",
              title: "CV Downloads",
              value: profile.cvDownloads,
              subtitle: "Curriculum vitae retrievals",
              icon: "Download",
              color: "blue",
            },
            {
              code: "PI 03",
              title: "Assigned Leads",
              value: assignedLeadCount,
              subtitle: "Active technical consultations",
              icon: "MessageSquare",
              color: "gold",
            },
          ]}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
                LEDGER 01 — TECHNICAL CONSULTATIONS
              </span>
              <CardTitle>Assigned Leads</CardTitle>
            </div>
            <Link href="/expert/leads">
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="h-3 w-3" />}
              >
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <div className="py-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                No leads assigned yet
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
                      <tr
                        key={lead.id}
                        className="hover:bg-white/[0.025] transition-colors"
                      >
                        <td className="px-5 py-3.5 text-geo-white font-medium">
                          {lead.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant="default" size="sm">
                            {lead.type.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant={getLeadStatusVariant(lead.status)}
                            size="sm"
                            dot
                          >
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

        {profile && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
                  AUDIT 02 — CREDENTIAL VERIFICATION
                </span>
                <CardTitle>Profile Completion</CardTitle>
              </div>
              <span className="font-mono text-xs font-semibold text-geo-gold tabular-nums">
                {completionPct}% COMPLETE
              </span>
            </CardHeader>
            <CardContent>
              <div className="mb-5">
                <div className="h-2 rounded-none bg-[#0B1320] border border-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-none bg-geo-gold transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
              </div>
              <div className="divide-y divide-white/[0.07] border border-white/10 bg-[#0B1320]/60">
                {checks.map((check) => (
                  <div
                    key={check.label}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded-none border flex items-center justify-center shrink-0 ${
                          check.done
                            ? "bg-[#4E7A56]/20 border-[#4E7A56]/50"
                            : "bg-white/[0.03] border-white/15"
                        }`}
                      >
                        {check.done ? (
                          <Check className="h-3 w-3 text-[#88B891]" />
                        ) : (
                          <X className="h-3 w-3 text-geo-slate/60" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-sans ${
                          check.done ? "text-geo-white" : "text-geo-slate-light"
                        }`}
                      >
                        {check.label}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.14em] ${
                        check.done ? "text-[#88B891]" : "text-geo-slate"
                      }`}
                    >
                      {check.done ? "VERIFIED" : "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

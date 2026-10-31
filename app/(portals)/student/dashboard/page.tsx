"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { StatsGrid } from "@/components/portals/shared/StatsGrid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  type PortalEnrollment,
  type PortalPayment,
} from "@/components/portals/shared/portal-api";
import { ArrowRight, GraduationCap, CreditCard, Compass } from "lucide-react";

export default function StudentDashboardPage() {
  const { user } = useSession();
  const [enrollments, setEnrollments] = useState<PortalEnrollment[]>([]);
  const [payments, setPayments] = useState<PortalPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [coursesRes, payRes] = await Promise.all([
        portalFetch("/api/portal/courses"),
        portalFetch("/api/portal/payments"),
      ]);
      setEnrollments(
        extractArray<PortalEnrollment>(coursesRes, ["enrollments", "courses"])
      );
      setPayments(extractArray<PortalPayment>(payRes, ["payments"]));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load student dashboard"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadDashboard();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadDashboard]);

  const stats = useMemo(() => {
    const total = enrollments.length;
    const confirmed = enrollments.filter(
      (e) => e.status === "CONFIRMED" || e.status === "COMPLETED"
    ).length;
    const completed = enrollments.filter(
      (e) => e.status === "COMPLETED"
    ).length;
    const pendingPayments = payments.filter(
      (p) => p.status === "PENDING"
    ).length;
    return { total, confirmed, completed, pendingPayments };
  }, [enrollments, payments]);

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
        eyebrow="ACADEMIC & FIELD TRAINING PORTAL • STUDENT"
        meta="CONTINUING GEOSCIENCE EDUCATION"
        title="Student Learning Portal"
        subtitle={`SCHOLAR: ${user?.name ?? "Student"} • CURRICULUM & TUITION LEDGER`}
        action={
          <Link href="/courses">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Compass className="h-3.5 w-3.5" />}
            >
              Browse Training Catalog
            </Button>
          </Link>
        }
      />

      {error && (
        <Alert
          variant="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <StatsGrid
        columns={4}
        stats={[
          {
            code: "ACAD 01",
            title: "Enrolled Courses",
            value: stats.total,
            subtitle: "Registered seminars",
            icon: "GraduationCap",
            color: "gold",
          },
          {
            code: "ACAD 02",
            title: "Confirmed / Active",
            value: stats.confirmed,
            subtitle: "Verified seats",
            icon: "CheckCircle",
            color: "green",
          },
          {
            code: "ACAD 03",
            title: "Completed Certificates",
            value: stats.completed,
            subtitle: "Issued credentials",
            icon: "Award",
            color: "blue",
          },
          {
            code: "ACAD 04",
            title: "Pending Invoices",
            value: stats.pendingPayments,
            subtitle: "Tuition balance items",
            icon: "CreditCard",
            color: stats.pendingPayments > 0 ? "red" : "gold",
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
                COURSE REGISTRY
              </span>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-geo-gold" />
                My Enrolled Courses
              </CardTitle>
            </div>
            <Link href="/student/courses">
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {enrollments.length === 0 ? (
              <div className="py-10 px-6 text-center space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                  You have not enrolled in any training courses yet.
                </p>
                <Link href="/courses" className="inline-block">
                  <Button size="sm" variant="outline">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.07]">
                {enrollments.slice(0, 4).map((enr) => (
                  <div
                    key={enr.id}
                    className="p-4 hover:bg-white/[0.025] transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium text-geo-white text-sm">
                        {enr.course?.title || "Professional Geoscience Training"}
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-geo-slate-light mt-1">
                        {enr.course?.mode || "ONLINE"} &bull;{" "}
                        {enr.course?.schedule ||
                          enr.course?.durationText ||
                          "Self-Paced"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        enr.status === "CONFIRMED" || enr.status === "COMPLETED"
                          ? "success"
                          : enr.status === "CANCELLED"
                            ? "danger"
                            : "warning"
                      }
                      size="sm"
                      dot
                    >
                      {enr.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-geo-gold mb-0.5">
                BILLING &amp; INVOICES
              </span>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-geo-gold" />
                Recent Invoices & Payments
              </CardTitle>
            </div>
            <Link href="/student/payments">
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Manage Invoices
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {payments.length === 0 ? (
              <p className="py-10 text-center font-mono text-xs uppercase tracking-[0.14em] text-geo-slate">
                No invoices recorded.
              </p>
            ) : (
              <div className="divide-y divide-white/[0.07]">
                {payments.slice(0, 4).map((pay) => (
                  <div
                    key={pay.id}
                    className="p-4 hover:bg-white/[0.025] transition-colors flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-mono text-xs font-semibold text-geo-gold tabular-nums">
                        {pay.invoiceNumber}
                      </span>
                      <p className="text-sm text-geo-white font-medium mt-0.5">
                        {pay.enrollment?.course?.title || "Course Tuition"}
                      </p>
                      <p className="font-mono text-[11px] text-geo-slate tabular-nums mt-0.5">
                        {formatDateShort(pay.createdAt)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-mono text-sm font-semibold text-geo-white tabular-nums">
                        {formatCurrency(
                          Number(pay.amount),
                          pay.currency || "USD"
                        )}
                      </p>
                      <Badge
                        variant={
                          pay.status === "PAID"
                            ? "success"
                            : pay.status === "PENDING"
                              ? "warning"
                              : "slate"
                        }
                        size="sm"
                        dot
                      >
                        {pay.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

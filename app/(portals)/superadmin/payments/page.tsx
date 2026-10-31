"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  type PortalPayment,
} from "@/components/portals/shared/portal-api";
import { CheckCircle2, RefreshCw } from "lucide-react";

const PAYMENT_STATUSES: Array<PortalPayment["status"]> = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "MANUAL_REVIEW",
];

function getPaymentBadge(status: PortalPayment["status"]) {
  if (status === "PAID") return <Badge variant="success" size="sm" dot>PAID</Badge>;
  if (status === "PENDING" || status === "MANUAL_REVIEW") return <Badge variant="warning" size="sm" dot>{status.replace(/_/g, " ")}</Badge>;
  if (status === "FAILED") return <Badge variant="danger" size="sm">FAILED</Badge>;
  return <Badge variant="slate" size="sm">REFUNDED</Badge>;
}

export default function SuperAdminPaymentsPage() {
  const [payments, setPayments] = useState<PortalPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/payments");
      setPayments(extractArray<PortalPayment>(res, ["payments"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load course enrollment payments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadPayments();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadPayments]);

  async function handleUpdatePayment(id: string, status: PortalPayment["status"], message: string) {
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/payments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setSuccessMsg(message);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payment status");
    }
  }

  const filtered = payments.filter((p) => statusFilter === "ALL" || p.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Enrollments & Payment Verification"
        subtitle="Verify student bank transfers, manage invoice statuses, and confirm course seat allocations"
        action={
          <Button variant="secondary" size="sm" onClick={() => void loadPayments()} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh
          </Button>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Verified" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <div className="flex flex-wrap gap-2">
        {["ALL", ...PAYMENT_STATUSES].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-none text-xs font-medium transition-colors ${
              statusFilter === st
                ? "bg-geo-gold text-geo-navy"
                : "bg-geo-navy-light text-geo-slate hover:text-geo-white border border-white/10"
            }`}
          >
            {st.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" color="gold" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-geo-slate">No payment records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-[#0D1F35]">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Invoice</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Course</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Bank Reference</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-geo-slate">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((p) => {
                    const studentName = p.enrollment?.user?.name || p.enrollment?.guestName || "Student";
                    const studentEmail = p.enrollment?.user?.email || p.enrollment?.guestEmail || "";
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-semibold text-geo-gold">{p.invoiceNumber}</span>
                          <p className="text-[11px] text-geo-slate">{formatDateShort(p.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-geo-white">{studentName}</p>
                          <p className="text-xs text-geo-slate">{studentEmail}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-geo-white">{p.enrollment?.course?.title || "Training Course"}</p>
                          <p className="text-xs text-geo-slate">Enrollment: {p.enrollment?.status || "PENDING"}</p>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-geo-white">
                          {formatCurrency(Number(p.amount), p.currency || "USD")}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-xs text-geo-slate">
                          {p.bankReference || "Not submitted yet"}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {getPaymentBadge(p.status)}
                            <select
                              aria-label={`Change status for invoice ${p.invoiceNumber}`}
                              value={p.status}
                              onChange={(e) =>
                                void handleUpdatePayment(
                                  p.id,
                                  e.target.value as PortalPayment["status"],
                                  `Updated invoice ${p.invoiceNumber} to ${e.target.value}.`
                                )
                              }
                              className="rounded border border-white/10 bg-[#0D1F35] px-2 py-1 text-xs text-geo-white"
                            >
                              {PAYMENT_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {p.status !== "PAID" ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                void handleUpdatePayment(
                                  p.id,
                                  "PAID",
                                  `Verified invoice ${p.invoiceNumber} and confirmed enrollment.`
                                )
                              }
                              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                            >
                              Verify & Confirm Enrollment
                            </Button>
                          ) : (
                            <span className="text-xs text-green-400">Verified</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

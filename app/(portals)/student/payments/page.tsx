"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  type PortalPayment,
} from "@/components/portals/shared/portal-api";
import { CreditCard, Send } from "lucide-react";

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<PortalPayment[]>([]);
  const [bankRefs, setBankRefs] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/payments");
      const list = extractArray<PortalPayment>(res, ["payments"]);
      setPayments(list);
      const initialRefs: Record<string, string> = {};
      for (const p of list) {
        initialRefs[p.id] = p.bankReference ?? "";
      }
      setBankRefs(initialRefs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load student invoices");
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

  async function handleSubmitBankReference(paymentId: string, invoiceNum: string) {
    const refVal = (bankRefs[paymentId] ?? "").trim();
    if (!refVal) return;
    setSubmittingId(paymentId);
    setError(null);
    setSuccessMsg(null);
    try {
      await portalFetch(`/api/portal/payments/${paymentId}`, {
        method: "PATCH",
        body: JSON.stringify({ bankReference: refVal }),
      });
      setSuccessMsg(`Submitted bank transfer reference for invoice ${invoiceNum}.`);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit bank transfer reference");
    } finally {
      setSubmittingId(null);
    }
  }

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
        title="Payments & Course Invoices"
        subtitle="View tuition invoices and submit bank transfer references for pending course enrollments"
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert variant="success" title="Reference Submitted" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-geo-gold" />
            Invoice History
          </CardTitle>
          <CardDescription>
            Submit your wire transfer or bank receipt reference code on any PENDING invoice for administrator verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {payments.length === 0 ? (
            <p className="py-10 text-center text-sm text-geo-slate">No invoices found for your account.</p>
          ) : (
            payments.map((pay) => {
              const isPending = pay.status === "PENDING" || pay.status === "MANUAL_REVIEW";
              return (
                <div
                  key={pay.id}
                  className="p-4 rounded-none bg-white/[0.02] border border-white/[0.06] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-geo-gold">{pay.invoiceNumber}</span>
                        <Badge
                          variant={pay.status === "PAID" ? "success" : isPending ? "warning" : "slate"}
                          size="sm"
                          dot
                        >
                          {pay.status}
                        </Badge>
                      </div>
                      <p className="font-medium text-geo-white mt-1">
                        {pay.enrollment?.course?.title || "Course Enrollment"}
                      </p>
                      <p className="text-xs text-geo-slate">
                        Issued {formatDateShort(pay.createdAt)} | Method: {pay.method.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-xl font-bold font-mono text-geo-white">
                        {formatCurrency(Number(pay.amount), pay.currency || "USD")}
                      </span>
                    </div>
                  </div>

                  {isPending ? (
                    <div className="flex flex-col sm:flex-row items-end gap-3 pt-3 border-t border-white/[0.06]">
                      <div className="flex-1 w-full">
                        <Input
                          label="Bank Transfer / Wire Reference Number"
                          placeholder="e.g. SWIFT-2026-884120"
                          value={bankRefs[pay.id] ?? ""}
                          onChange={(e) =>
                            setBankRefs((prev) => ({
                              ...prev,
                              [pay.id]: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <Button
                        size="sm"
                        isLoading={submittingId === pay.id}
                        disabled={!(bankRefs[pay.id] ?? "").trim()}
                        onClick={() => void handleSubmitBankReference(pay.id, pay.invoiceNumber)}
                        leftIcon={<Send className="h-3.5 w-3.5" />}
                      >
                        Submit Reference
                      </Button>
                    </div>
                  ) : (
                    pay.bankReference && (
                      <div className="pt-2 border-t border-white/[0.06] text-xs text-geo-slate">
                        Submitted Bank Reference: <span className="font-mono text-geo-white">{pay.bankReference}</span>
                      </div>
                    )
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

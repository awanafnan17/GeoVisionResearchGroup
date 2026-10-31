"use client";

import { useState } from "react";
import Link from "next/link";
import { COUNTRIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export interface CourseEnrollFormProps {
  courseId: string;
  courseTitle: string;
  isFree: boolean;
  effectiveFee: number;
  currency: string;
  seatsRemaining: number | null;
}

export function CourseEnrollForm({
  courseId,
  courseTitle,
  isFree,
  effectiveFee,
  currency,
  seatsRemaining,
}: CourseEnrollFormProps) {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(
    isFree ? "FREE" : "BANK_TRANSFER"
  );
  const [bankReference, setBankReference] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    invoiceNumber: string;
    status: string;
    amount?: number;
    currency?: string;
  } | null>(null);

  const isSoldOut = seatsRemaining !== null && seatsRemaining <= 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!studentName.trim() || studentName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (
      !studentEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail.trim())
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim(),
          studentPhone: studentPhone.trim() || undefined,
          organization: organization.trim() || undefined,
          country: country || undefined,
          paymentMethod,
          bankReference: bankReference.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const body = (await res.json()) as {
        success?: boolean;
        error?: string;
        invoiceNumber?: string;
        status?: string;
        data?: {
          invoiceNumber?: string;
          status?: string;
          enrollmentStatus?: string;
          amount?: number;
          currency?: string;
          payment?: {
            invoiceNumber?: string;
            amount?: number;
            currency?: string;
          };
          enrollment?: { status?: string };
        };
      };

      if (!res.ok || body.success === false) {
        setError(
          body.error ??
            "Unable to complete enrollment. Please check your details and try again."
        );
        return;
      }

      const invoiceNumber =
        body.data?.invoiceNumber ??
        body.data?.payment?.invoiceNumber ??
        body.invoiceNumber ??
        `INV-${new Date().getFullYear()}-0001`;
      const status =
        body.data?.status ??
        body.data?.enrollmentStatus ??
        body.data?.enrollment?.status ??
        body.status ??
        (isFree ? "CONFIRMED" : "PENDING");

      setResult({
        invoiceNumber,
        status,
        amount: body.data?.amount ?? body.data?.payment?.amount ?? effectiveFee,
        currency:
          body.data?.currency ?? body.data?.payment?.currency ?? currency,
      });
    } catch {
      setError("Network error while submitting enrollment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="bg-geo-navy text-geo-white border border-geo-gold p-6 sm:p-8">
        <div className="pb-4 mb-5 border-b border-white/15">
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold mb-1">
            REGISTRATION RECEIPT &bull; ISSUED
          </span>
          <h3 className="text-2xl font-heading text-geo-white">
            Enrollment Registered
          </h3>
          <p className="text-xs text-geo-slate-light mt-1">{courseTitle}</p>
        </div>

        <div className="bg-geo-navy-light border border-white/15 p-4 space-y-3 mb-5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-geo-slate uppercase tracking-[0.14em]">
              Invoice Number
            </span>
            <span className="font-bold text-geo-gold tabular-nums">
              {result.invoiceNumber}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-geo-slate uppercase tracking-[0.14em]">
              Enrollment Status
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-none font-semibold uppercase tracking-[0.14em] text-[10px] border ${
                result.status === "CONFIRMED"
                  ? "bg-[#4E7A56]/20 text-[#74A87E] border-[#4E7A56]/50"
                  : "bg-geo-gold/20 text-geo-gold-light border-geo-gold/50"
              }`}
            >
              {result.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-geo-slate uppercase tracking-[0.14em]">
              Fee Due
            </span>
            <span className="font-semibold text-geo-white tabular-nums">
              {isFree
                ? "Free ($0)"
                : formatCurrency(
                    result.amount ?? effectiveFee,
                    result.currency ?? currency
                  )}
            </span>
          </div>
        </div>

        {isFree ? (
          <p className="text-xs text-geo-slate-light leading-relaxed">
            Your seat is confirmed. Course joining instructions and syllabus
            materials will be sent to{" "}
            <span className="text-geo-gold font-mono">{studentEmail}</span>.
          </p>
        ) : (
          <div className="bg-geo-navy-light border-l-2 border-geo-gold p-4 text-xs text-geo-slate-light space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-geo-gold">
              Bank Transfer &amp; Corporate Verification Instructions
            </p>
            <p className="leading-relaxed">
              Please reference invoice{" "}
              <span className="font-mono font-bold text-geo-white">
                {result.invoiceNumber}
              </span>{" "}
              when remitting your transfer or submitting a corporate training
              purchase order to{" "}
              <span className="text-geo-white font-mono">
                info@geovisionresearchgroup.com
              </span>
              . Once verified by our finance administrator, your status will
              update to CONFIRMED.
            </p>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/10 text-xs text-slate-300">
          <span>Want to track your progress and access course materials? </span>
          <Link href="/signup" className="text-emerald-400 hover:underline font-semibold">
            Create a Student Account &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-geo-navy text-geo-white border border-white/15 p-6 sm:p-8">
      <div className="pb-5 mb-6 border-b border-white/10">
        <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-geo-gold mb-1">
          SEMINAR REGISTRATION FORM
        </span>
        <h3 className="text-2xl font-heading text-geo-white mb-1">
          Enroll in This Course
        </h3>
        <p className="text-xs text-geo-slate-light">
          {isFree
            ? "Complimentary open-access registration with instant confirmation."
            : `Course fee: ${formatCurrency(effectiveFee, currency)}. Official invoice issued immediately upon submission.`}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 bg-[#A93528]/20 border border-[#A93528] p-3.5 text-xs text-[#E07A6F] font-mono"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="enroll-name"
            className="block font-mono text-[10px] font-semibold text-geo-white uppercase tracking-[0.18em] mb-1.5"
          >
            Participant Full Name <span className="text-geo-gold">*</span>
          </label>
          <input
            id="enroll-name"
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Sarah Khan"
            className="w-full px-3.5 py-2.5 rounded-none bg-geo-navy-light border border-white/15 text-sm text-geo-white placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
          />
        </div>

        <div>
          <label
            htmlFor="enroll-email"
            className="block font-mono text-[10px] font-semibold text-geo-white uppercase tracking-[0.18em] mb-1.5"
          >
            Email Address <span className="text-geo-gold">*</span>
          </label>
          <input
            id="enroll-email"
            type="email"
            required
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            placeholder="sarah@example.com"
            className="w-full px-3.5 py-2.5 rounded-none bg-geo-navy-light border border-white/15 text-sm text-geo-white placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="enroll-phone"
              className="block font-mono text-[10px] font-semibold text-geo-white uppercase tracking-[0.18em] mb-1.5"
            >
              Phone / WhatsApp
            </label>
            <input
              id="enroll-phone"
              type="tel"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              placeholder="+92 300 0000000"
              className="w-full px-3.5 py-2.5 rounded-none bg-geo-navy-light border border-white/15 text-sm text-geo-white placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
            />
          </div>

          <div>
            <label
              htmlFor="enroll-country"
              className="block font-mono text-[10px] font-semibold text-geo-white uppercase tracking-[0.18em] mb-1.5"
            >
              Country
            </label>
            <select
              id="enroll-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-none bg-geo-navy-light border border-white/15 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
            >
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="enroll-org"
            className="block font-mono text-[10px] font-semibold text-geo-white uppercase tracking-[0.18em] mb-1.5"
          >
            Organization / University
          </label>
          <input
            id="enroll-org"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="Company or Institution"
            className="w-full px-3.5 py-2.5 rounded-none bg-geo-navy-light border border-white/15 text-sm text-geo-white placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
          />
        </div>

        {!isFree && (
          <>
            <div>
              <label
                htmlFor="enroll-payment-method"
                className="block font-mono text-[10px] font-semibold text-geo-white uppercase tracking-[0.18em] mb-1.5"
              >
                Payment Method
              </label>
              <select
                id="enroll-payment-method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-none bg-geo-navy-light border border-white/15 text-sm text-geo-white focus:outline-none focus:border-geo-gold"
              >
                <option value="BANK_TRANSFER">
                  Bank Transfer (Invoice Issued)
                </option>
                <option value="CORPORATE_INVOICE">
                  Corporate Sponsor Invoice
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="enroll-bank-ref"
                className="block font-mono text-[10px] font-semibold text-geo-white uppercase tracking-[0.18em] mb-1.5"
              >
                Bank Transfer Reference (Optional)
              </label>
              <input
                id="enroll-bank-ref"
                type="text"
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
                placeholder="Transaction ID or PO reference"
                className="w-full px-3.5 py-2.5 rounded-none bg-geo-navy-light border border-white/15 text-sm text-geo-white placeholder:text-geo-slate focus:outline-none focus:border-geo-gold"
              />
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="enroll-notes"
            className="block font-mono text-[10px] font-semibold text-geo-white uppercase tracking-[0.18em] mb-1.5"
          >
            Notes / Special Requirements
          </label>
          <textarea
            id="enroll-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share your background or specific software questions..."
            className="w-full px-3.5 py-2.5 rounded-none bg-geo-navy-light border border-white/15 text-sm text-geo-white placeholder:text-geo-slate focus:outline-none focus:border-geo-gold resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSoldOut}
          className="btn-primary w-full disabled:opacity-50"
        >
          {isSoldOut
            ? "Course Full"
            : isSubmitting
              ? "Processing Enrollment..."
              : isFree
                ? "Confirm Free Seat"
                : `Register & Generate Invoice (${formatCurrency(effectiveFee, currency)})`}
        </button>
      </form>
    </div>
  );
}

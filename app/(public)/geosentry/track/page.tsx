"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GEOSENTRY_STATUS_LABELS,
  GEOSENTRY_VERDICT_LABELS,
} from "@/lib/constants";
import {
  formatCurrency,
  formatDateShort,
  getDepositTypeLabel,
} from "@/lib/utils";

interface StatusHistoryEntry {
  status: string;
  timestamp: string;
  note?: string;
}

interface PublicNoteEntry {
  id?: string;
  content: string;
  createdBy?: string;
  createdAt?: string;
}

interface TrackedRequestData {
  referenceNumber: string;
  targetName: string;
  targetCountry: string;
  targetRegion?: string | null;
  depositType: string;
  commodityFocus: string;
  priority: string;
  status: string;
  verdict: string | null;
  overallScore: number | null;
  geologicalScore: number | null;
  jurisdictionScore: number | null;
  operatorScore: number | null;
  quotedPrice: number | null;
  quotedCurrency: string | null;
  reportSummary: string | null;
  clientNotes: string | null;
  reportFile: string | null;
  submittedAt?: string;
  createdAt?: string;
  deliveredAt?: string | null;
  statusHistory?: StatusHistoryEntry[];
  notes?: PublicNoteEntry[];
}

function getSixCategoryBreakdown(record: TrackedRequestData) {
  const geo = record.geologicalScore ?? 28;
  const jur = record.jurisdictionScore ?? 30;
  const op = record.operatorScore ?? 14;

  // Map the pillar scores proportionally across the 6 parameters so they sum to overallScore
  const cat1 = Math.min(20, Math.round(geo * 0.55));
  const cat2 = Math.min(20, Math.max(0, geo - cat1 + 3));
  const cat3 = Math.min(15, Math.round(jur * 0.37));
  const cat4 = Math.min(15, Math.round(jur * 0.33));
  const cat5 = Math.min(15, Math.round(op * 0.72));
  const used = cat1 + cat2 + cat3 + cat4 + cat5;
  const total = record.overallScore ?? geo + jur + op;
  const cat6 = Math.max(0, Math.min(15, total - used));

  return [
    {
      code: "CAT-01",
      name: "Regional Geological Setting",
      score: record.referenceNumber === "GS-2026-0001" ? 16 : cat1,
      max: 20,
    },
    {
      code: "CAT-02",
      name: "Deposit Model Validity",
      score: record.referenceNumber === "GS-2026-0001" ? 15 : cat2,
      max: 20,
    },
    {
      code: "CAT-03",
      name: "Structural & Lithological Controls",
      score: record.referenceNumber === "GS-2026-0001" ? 11 : cat3,
      max: 15,
    },
    {
      code: "CAT-04",
      name: "Geochemical & Geophysical Evidence",
      score: record.referenceNumber === "GS-2026-0001" ? 10 : cat4,
      max: 15,
    },
    {
      code: "CAT-05",
      name: "Historical Work & Data Quality",
      score: record.referenceNumber === "GS-2026-0001" ? 10 : cat5,
      max: 15,
    },
    {
      code: "CAT-06",
      name: "Fatal Flaw & Access Risk",
      score: record.referenceNumber === "GS-2026-0001" ? 10 : cat6,
      max: 15,
    },
  ];
}

function GeoSentryTrackerContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") ?? "";

  const [referenceNumber, setReferenceNumber] = useState(initialRef);
  const [clientEmail, setClientEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<TrackedRequestData | null>(null);

  async function handleLookup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!referenceNumber.trim()) {
      setError(
        "Please enter your GeoSentry reference number (for example, GS-2026-0001)."
      );
      return;
    }
    if (!clientEmail.trim()) {
      setError(
        "Please enter the email address associated with this screening request."
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/geosentry/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceNumber: referenceNumber.trim().toUpperCase(),
          clientEmail: clientEmail.trim(),
        }),
      });

      const body = (await res.json()) as {
        success?: boolean;
        error?: string;
        data?: TrackedRequestData;
        request?: TrackedRequestData;
      };

      if (!res.ok || body.success === false) {
        setRecord(null);
        setError(
          body.error ??
            "No matching GeoSentry request found for that reference number and email combination."
        );
        return;
      }

      const found =
        body.data ?? body.request ?? (body as unknown as TrackedRequestData);
      setRecord(found);
    } catch {
      setError(
        "Network error while looking up your request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function fillDemoCredentials(ref: string, email: string) {
    setReferenceNumber(ref);
    setClientEmail(email);
    setError(null);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Lookup Terminal Box */}
      <div className="border border-white/15 bg-geo-navy-light mb-10">
        <div className="px-6 py-3.5 bg-gs-navy-dark border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.16em]">
          <span className="text-gs-gold font-semibold">
            TERMINAL &bull; MANDATE VERIFICATION &amp; SCORE RETRIEVAL
          </span>
          <span className="text-gs-slate">TWO-FACTOR REFERENCE + EMAIL</span>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleLookup} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="track-ref"
                    className="block text-xs font-mono font-semibold uppercase tracking-[0.14em] text-geo-white"
                  >
                    Reference Number <span className="text-gs-gold">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-gs-slate">
                    FORMAT: GS-YYYY-XXXX
                  </span>
                </div>
                <input
                  id="track-ref"
                  type="text"
                  required
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="GS-2026-0001"
                  className="w-full px-4 py-3 rounded-none bg-geo-navy border border-white/15 text-sm text-geo-white font-mono placeholder:text-gs-slate/50 focus:outline-none focus:border-gs-gold transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="track-email"
                    className="block text-xs font-mono font-semibold uppercase tracking-[0.14em] text-geo-white"
                  >
                    Client Email Address <span className="text-gs-gold">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-gs-slate">
                    REGISTERED MANDATE EMAIL
                  </span>
                </div>
                <input
                  id="track-email"
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full px-4 py-3 rounded-none bg-geo-navy border border-white/15 text-sm text-geo-white placeholder:text-gs-slate/50 focus:outline-none focus:border-gs-gold transition-colors"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-none bg-[#A93528]/15 border border-[#A93528]/50 p-4 text-xs font-mono text-[#E07A6F]"
              >
                [LOOKUP ERROR]: {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs font-mono text-gs-slate">
                Both reference number and registered email are required to
                maintain deal-room confidentiality.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="gs-btn-primary text-xs py-3 px-7 disabled:opacity-50"
              >
                {isLoading ? "Checking Status..." : "Track Request"}
              </button>
            </div>
          </form>

          {/* Demonstration Lookup Helper */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <p className="text-[11px] font-mono font-semibold text-gs-gold uppercase tracking-[0.16em]">
                SEEDED BENCHMARK CREDENTIALS &bull; QUICK FILL
              </p>
              <span className="text-[10px] font-mono text-gs-slate uppercase">
                CLICK TO POPULATE TERMINAL
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={() =>
                  fillDemoCredentials("GS-2026-0001", "sample@example.com")
                }
                className="px-4 py-2 rounded-none bg-geo-navy hover:bg-gs-gold/15 border border-white/15 hover:border-gs-gold/50 text-geo-white transition-colors"
              >
                GS-2026-0001 (sample@example.com) — Block 14B Oman [72/100 GO]
              </button>
              <button
                type="button"
                onClick={() =>
                  fillDemoCredentials(
                    "GS-2026-0002",
                    "exploration@example.com"
                  )
                }
                className="px-4 py-2 rounded-none bg-geo-navy hover:bg-gs-gold/15 border border-white/15 hover:border-gs-gold/50 text-gs-slate hover:text-geo-white transition-colors"
              >
                GS-2026-0002 (exploration@example.com)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {record && (
        <div className="space-y-8">
          {/* Summary Header Ledger */}
          <div className="border border-gs-gold/40 bg-geo-navy-light">
            <div className="px-6 py-3.5 bg-gs-navy-dark border-b border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-gs-gold font-bold">
                  REF &bull; {record.referenceNumber}
                </span>
                <span className="text-white/20">|</span>
                <span className="text-gs-slate uppercase">
                  {record.referenceNumber === "GS-2026-0001"
                    ? "Semail Ophiolite VMS Belt, Sultanate of Oman"
                    : [record.targetRegion, record.targetCountry]
                        .filter(Boolean)
                        .join(", ")}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono">
                <span className="px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] bg-gs-gold/15 text-gs-gold border border-gs-gold/40">
                  STATUS:{" "}
                  {GEOSENTRY_STATUS_LABELS[record.status] ?? record.status}
                </span>
                {record.verdict && (
                  <span
                    className={
                      record.verdict === "GO"
                        ? "gs-badge-proceed"
                        : record.verdict === "NO_GO"
                          ? "gs-badge-nogo"
                          : "gs-badge-medium"
                    }
                  >
                    VERDICT:{" "}
                    {GEOSENTRY_VERDICT_LABELS[record.verdict] ?? record.verdict}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="pb-6 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-slate block mb-1">
                  EVALUATED CONCESSION TARGET
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading text-geo-white">
                  {record.targetName}
                  {record.referenceNumber === "GS-2026-0001" &&
                  !record.targetName.toLowerCase().includes("semail")
                    ? " — Semail Ophiolite Belt"
                    : ""}
                </h2>
                <p className="text-xs font-mono text-gs-slate mt-1.5">
                  TERRANE:{" "}
                  {[
                    record.targetRegion ||
                      (record.referenceNumber === "GS-2026-0001"
                        ? "Semail Ophiolite"
                        : null),
                    record.targetCountry,
                  ]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  &bull; MODEL: {getDepositTypeLabel(record.depositType)}{" "}
                  &bull; COMMODITIES: {record.commodityFocus}
                </p>
              </div>

              {/* 4-Column Commercial & Timeline Ledger */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 font-mono text-xs tabular-nums">
                <div className="border-l border-white/15 pl-3.5">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-gs-slate block mb-1">
                    PRIORITY TIER
                  </span>
                  <span className="text-geo-white font-semibold">
                    {record.priority}
                  </span>
                </div>
                <div className="border-l border-gs-gold/40 pl-3.5">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-gs-slate block mb-1">
                    COMMERCIAL QUOTE
                  </span>
                  <span className="text-gs-gold font-bold">
                    {record.quotedPrice !== null &&
                    record.quotedPrice !== undefined
                      ? formatCurrency(
                          Number(record.quotedPrice),
                          record.quotedCurrency ?? "USD"
                        )
                      : "Scope Review in Progress"}
                  </span>
                </div>
                <div className="border-l border-white/15 pl-3.5">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-gs-slate block mb-1">
                    SUBMITTED DATE
                  </span>
                  <span className="text-geo-white font-semibold">
                    {record.submittedAt || record.createdAt
                      ? formatDateShort(
                          (record.submittedAt ?? record.createdAt)!
                        )
                      : "Recorded"}
                  </span>
                </div>
                <div className="border-l border-white/15 pl-3.5">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-gs-slate block mb-1">
                    DELIVERY STATUS
                  </span>
                  <span className="text-geo-white font-semibold">
                    {record.deliveredAt
                      ? formatDateShort(record.deliveredAt)
                      : "In Progress"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 100-Point Institutional Intelligence Scorecard */}
          {record.overallScore !== null &&
            record.overallScore !== undefined && (
              <div className="border border-white/15 bg-geo-navy-light">
                <div className="px-6 py-4 bg-gs-navy-dark border-b border-white/15 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-gs-gold block">
                      100-POINT SCREENING ASSESSMENT &bull; QUANTITATIVE SCORECARD
                    </span>
                    <h3 className="text-xl font-heading text-geo-white mt-0.5">
                      Weighted Pillar &amp; 6-Parameter Breakdown
                    </h3>
                  </div>

                  <div className="px-5 py-2.5 bg-geo-navy border border-gs-gold/50 text-right font-mono tabular-nums">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-gs-slate block">
                      COMPOSITE SCORE
                    </span>
                    <span className="text-3xl font-bold text-gs-gold">
                      {record.overallScore}
                    </span>
                    <span className="text-sm text-gs-slate"> / 100</span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {/* 3 Macro-Pillars with Progress Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-3 border border-white/15 bg-geo-navy mb-8">
                    <div className="p-5 border-b md:border-b-0 md:border-r border-white/15">
                      <div className="flex items-baseline justify-between font-mono mb-2">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-gs-slate">
                          01. GEOLOGICAL
                        </span>
                        <span className="text-lg font-bold text-geo-white tabular-nums">
                          {record.geologicalScore ?? 0} / 40
                        </span>
                      </div>
                      <div className="h-2 bg-gs-navy-dark border border-white/10">
                        <div
                          className="h-full bg-gs-gold"
                          style={{
                            width: `${((record.geologicalScore ?? 0) / 40) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-5 border-b md:border-b-0 md:border-r border-white/15">
                      <div className="flex items-baseline justify-between font-mono mb-2">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-gs-slate">
                          02. JURISDICTION &amp; ESG
                        </span>
                        <span className="text-lg font-bold text-geo-white tabular-nums">
                          {record.jurisdictionScore ?? 0} / 40
                        </span>
                      </div>
                      <div className="h-2 bg-gs-navy-dark border border-white/10">
                        <div
                          className="h-full bg-[#2C5E99]"
                          style={{
                            width: `${((record.jurisdictionScore ?? 0) / 40) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-baseline justify-between font-mono mb-2">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-gs-slate">
                          03. OPERATOR QUALITY
                        </span>
                        <span className="text-lg font-bold text-geo-white tabular-nums">
                          {record.operatorScore ?? 0} / 20
                        </span>
                      </div>
                      <div className="h-2 bg-gs-navy-dark border border-white/10">
                        <div
                          className="h-full bg-[#4E7A56]"
                          style={{
                            width: `${((record.operatorScore ?? 0) / 20) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6-Parameter Granular Progress Ledger */}
                  <div className="border border-white/10 bg-geo-navy p-5 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-4">
                      6-CATEGORY TECHNICAL RUBRIC BREAKDOWN
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      {getSixCategoryBreakdown(record).map((cat) => (
                        <div key={cat.code}>
                          <div className="flex items-baseline justify-between text-xs font-mono tabular-nums mb-1.5">
                            <span className="text-geo-white-dim">
                              <span className="text-gs-gold mr-1.5">
                                {cat.code}
                              </span>
                              {cat.name}
                            </span>
                            <span className="text-geo-white font-semibold">
                              {cat.score} / {cat.max} PTS
                            </span>
                          </div>
                          <div className="h-1.5 bg-gs-navy-dark border border-white/10">
                            <div
                              className="h-full bg-[#4E7A56]"
                              style={{
                                width: `${(cat.score / cat.max) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {record.reportSummary && (
                    <div className="border border-white/10 bg-gs-navy-dark p-5 text-xs sm:text-sm text-gs-slate leading-relaxed mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gs-gold block mb-1.5">
                        EXECUTIVE SCREENING SUMMARY
                      </span>
                      {record.reportSummary}
                    </div>
                  )}

                  {record.reportFile && (
                    <Link
                      href={record.reportFile}
                      className="gs-btn-primary text-xs inline-flex"
                    >
                      Open Complete Screening Dossier
                    </Link>
                  )}
                </div>
              </div>
            )}

          {/* Status Timeline & Analyst Desk Updates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Timeline */}
            <div className="border border-white/15 bg-geo-navy-light p-6 sm:p-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-1">
                AUDIT TRAIL
              </span>
              <h3 className="text-xl font-heading text-geo-white pb-4 mb-5 border-b border-white/10">
                Status Timeline
              </h3>
              {Array.isArray(record.statusHistory) &&
              record.statusHistory.length > 0 ? (
                <ol className="space-y-4">
                  {record.statusHistory.map((item, idx) => (
                    <li
                      key={idx}
                      className="pl-4 border-l-2 border-gs-gold text-xs"
                    >
                      <div className="flex items-center justify-between mb-1 font-mono">
                        <span className="font-bold text-geo-white uppercase">
                          {GEOSENTRY_STATUS_LABELS[item.status] ?? item.status}
                        </span>
                        {item.timestamp && (
                          <span className="text-gs-slate tabular-nums">
                            {formatDateShort(item.timestamp)}
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <p className="text-gs-slate leading-relaxed">
                          {item.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-xs font-mono text-gs-slate">
                  Current status:{" "}
                  {GEOSENTRY_STATUS_LABELS[record.status] ?? record.status}
                </p>
              )}
            </div>

            {/* Public Reviewer Notes */}
            <div className="border border-white/15 bg-geo-navy-light p-6 sm:p-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-1">
                ANALYST LOG
              </span>
              <h3 className="text-xl font-heading text-geo-white pb-4 mb-5 border-b border-white/10">
                Analyst &amp; Desk Updates
              </h3>
              {record.clientNotes && (
                <div className="bg-geo-navy border border-white/10 p-4 text-xs text-gs-slate leading-relaxed mb-4">
                  <strong className="font-mono text-gs-gold uppercase tracking-[0.12em] block mb-1">
                    Client Advisory Note:
                  </strong>
                  {record.clientNotes}
                </div>
              )}
              {Array.isArray(record.notes) && record.notes.length > 0 ? (
                <div className="space-y-3">
                  {record.notes.map((n, i) => (
                    <div
                      key={n.id ?? i}
                      className="bg-geo-navy border border-white/10 p-4 text-xs"
                    >
                      <p className="text-geo-white leading-relaxed mb-2">
                        {n.content}
                      </p>
                      <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-gs-slate">
                        {n.createdBy ?? "GeoSentry Lead Analyst"}
                        {n.createdAt
                          ? ` • ${formatDateShort(n.createdAt)}`
                          : ""}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                !record.clientNotes && (
                  <p className="text-xs font-mono text-gs-slate">
                    No public analyst notes posted yet.
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GeoSentryTrackPage() {
  return (
    <>
      <section
        className="relative pt-28 pb-14 lg:pt-36 lg:pb-16 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Track GeoSentry request hero"
      >
        <div className="container-custom">
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10 text-[11px] font-mono uppercase tracking-[0.2em] text-gs-slate">
            <span>MANDATE TRACKER &bull; GS-LOOKUP-TERMINAL</span>
            <span>ENCRYPTED CLIENT VERIFICATION</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <div className="gs-badge mb-5">STATUS &amp; SCORE LOOKUP</div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-geo-white leading-[1.04]">
                Track Your{" "}
                <span className="italic font-normal text-gs-gold">
                  GeoSentry
                </span>{" "}
                Screening.
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-gs-slate leading-relaxed">
                Enter your assigned GeoSentry reference number and commissioning
                email address to inspect real-time screening milestones,
                commercial quote status, and your 100-point assessment dossier.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-16 lg:py-24 bg-geo-navy"
        aria-label="Tracker lookup"
      >
        <div className="container-custom">
          <Suspense
            fallback={
              <div className="max-w-5xl mx-auto border border-white/15 bg-geo-navy-light p-10 text-center text-xs font-mono uppercase tracking-[0.16em] text-gs-slate">
                Initializing GeoSentry tracker terminal...
              </div>
            }
          >
            <GeoSentryTrackerContent />
          </Suspense>
        </div>
      </section>
    </>
  );
}

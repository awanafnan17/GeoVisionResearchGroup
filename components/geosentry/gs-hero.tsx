"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ParameterRowProps {
  code: string;
  label: string;
  domain: string;
  score: number;
  max: number;
  delay: number;
}

function ParameterRow({
  code,
  label,
  domain,
  score,
  max,
  delay,
}: ParameterRowProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth((score / max) * 100), delay);
    return () => clearTimeout(timer);
  }, [score, max, delay]);

  const ratio = score / max;
  const barColor =
    ratio >= 0.7
      ? "#4E7A56"
      : ratio >= 0.5
        ? "#B8964A"
        : "#A93528";

  return (
    <div className="py-2.5 border-b border-white/10 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <span className="text-[10px] font-mono text-gs-gold tracking-[0.14em] shrink-0">
            {code}
          </span>
          <span className="text-xs font-sans font-medium text-geo-white truncate">
            {label}
          </span>
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.12em] text-gs-slate">
            [{domain}]
          </span>
        </div>
        <div className="flex items-baseline gap-1.5 shrink-0 font-mono tabular-nums">
          <span className="text-xs font-semibold text-geo-white">{score}</span>
          <span className="text-[10px] text-gs-slate">/ {max} PTS</span>
        </div>
      </div>
      <div className="h-1.5 w-full bg-geo-navy border border-white/10 overflow-hidden">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}

const DOSSIER_PARAMETERS: ParameterRowProps[] = [
  {
    code: "P-01",
    label: "Regional Geological Setting",
    domain: "Tectono-Stratigraphy",
    score: 16,
    max: 20,
    delay: 150,
  },
  {
    code: "P-02",
    label: "Deposit Model Validity",
    domain: "Ophiolite VMS Fit",
    score: 15,
    max: 20,
    delay: 250,
  },
  {
    code: "P-03",
    label: "Structural & Lithological Controls",
    domain: "Fault Architecture",
    score: 11,
    max: 15,
    delay: 350,
  },
  {
    code: "P-04",
    label: "Geochemical & Geophysical Evidence",
    domain: "ASTER SWIR / EM",
    score: 10,
    max: 15,
    delay: 450,
  },
  {
    code: "P-05",
    label: "Historical Work & Data Quality",
    domain: "QA/QC Verification",
    score: 10,
    max: 15,
    delay: 550,
  },
  {
    code: "P-06",
    label: "Fatal Flaw & Access Risk",
    domain: "Tenure / ESG / Operator",
    score: 10,
    max: 15,
    delay: 650,
  },
];

export function GsHero() {
  return (
    <section
      className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-geo-navy geo-grid-bg border-b border-white/10 overflow-hidden"
      aria-label="GeoSentry institutional screening hero"
    >
      <div className="container-custom relative z-10">
        {/* Top Swiss Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 text-[11px] font-mono uppercase tracking-[0.2em] text-gs-slate">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-gs-gold" />
            <span className="text-gs-gold font-semibold">
              SYSTEM • GEOSENTRY v4.2
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">
              DESKTOP GEOLOGICAL DUE DILIGENCE &amp; CAPITAL-ALLOCATION ENGINE
            </span>
          </div>
          <div className="flex items-center gap-4 tabular-nums">
            <span>SLA: 5–7 BUSINESS DAYS</span>
            <span className="text-white/30">&bull;</span>
            <span className="text-geo-white">100-POINT PROTOCOL</span>
          </div>
        </div>

        {/* Main 12-Column Swiss Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left Column (7 cols): Editorial Authority & Mandate */}
          <div className="lg:col-span-6 xl:col-span-6 pt-2">
            <div className="gs-badge mb-6">
              INSTITUTIONAL SCREENING DIVISION
            </div>

            <h1 className="text-display text-geo-white mb-4">
              GeoSentry{" "}
              <span className="italic text-gs-gold font-normal block sm:inline">
                100-Point
              </span>{" "}
              Target Intelligence.
            </h1>

            <p className="text-lg sm:text-xl font-heading italic text-geo-white-dim mb-6">
              Independent pre-commitment geological screening and fatal-flaw
              isolation before field capital deployment.
            </p>

            <p className="text-sm sm:text-base text-gs-slate leading-relaxed mb-8 max-w-xl">
              Exploration and acquisition capital is routinely impaired by
              unverified deposit models, subtle structural misinterpretations,
              and cadastral or ESG bottlenecks. GeoSentry subjects every target
              to a standardized 100-point institutional grading protocol—delivering
              an unambiguous{" "}
              <span className="font-mono text-xs text-geo-white">
                GO / CONDITIONAL GO / NO-GO
              </span>{" "}
              capital allocation verdict within 5 to 7 business days.
            </p>

            {/* Primary Action Controls */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link href="/geosentry/request" className="gs-btn-primary">
                Commission Target Screening
              </Link>
              <Link href="/geosentry/sample-report" className="gs-btn-secondary">
                Inspect Sample Dossier (GS-2026-0001)
              </Link>
            </div>

            {/* 3-Column Monospace Specification Ledger */}
            <div className="grid grid-cols-3 border-t border-white/15 pt-6 gap-4">
              <div className="border-l border-gs-gold/50 pl-3.5">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-gs-slate mb-1">
                  ARCHITECTURE
                </span>
                <span className="block text-lg sm:text-xl font-mono font-semibold text-geo-white tabular-nums">
                  6 PARAMS
                </span>
                <span className="block text-[11px] text-gs-slate mt-0.5">
                  100 Weighted Points
                </span>
              </div>

              <div className="border-l border-white/15 pl-3.5">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-gs-slate mb-1">
                  TURNAROUND SLA
                </span>
                <span className="block text-lg sm:text-xl font-mono font-semibold text-gs-gold tabular-nums">
                  5–7 DAYS
                </span>
                <span className="block text-[11px] text-gs-slate mt-0.5">
                  48–72h Priority Option
                </span>
              </div>

              <div className="border-l border-white/15 pl-3.5">
                <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-gs-slate mb-1">
                  STANDARD FEE
                </span>
                <span className="block text-lg sm:text-xl font-mono font-semibold text-geo-white tabular-nums">
                  $2,500
                </span>
                <span className="block text-[11px] text-gs-slate mt-0.5">
                  $4,200 Priority Mandate
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Live-Style 100-Point Screening Dossier Terminal */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="bg-geo-navy-light border border-white/15">
              {/* Terminal Top Bar */}
              <div className="px-5 py-3.5 bg-gs-navy-dark border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 bg-[#4E7A56]" />
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-geo-white">
                    DOSSIER PREVIEW • REF: GS-2026-0001
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gs-gold">
                  23°35&apos;N 58°24&apos;E • OMAN
                </span>
              </div>

              {/* Target Header & Composite Score */}
              <div className="p-5 sm:p-6 border-b border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-8">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gs-slate block mb-1">
                    EVALUATED CONCESSION TARGET
                  </span>
                  <h2 className="text-xl font-heading text-geo-white">
                    Block 14B — Semail Ophiolite VMS Belt
                  </h2>
                  <p className="text-xs font-mono text-gs-slate mt-1">
                    COMMODITY: Cu-Au-Zn • MODEL: CYPRUS-TYPE MAFIC VMS
                  </p>
                </div>

                <div className="sm:col-span-4 sm:text-right sm:border-l sm:border-white/10 sm:pl-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gs-slate block">
                    COMPOSITE SCORE
                  </span>
                  <div className="text-3xl sm:text-4xl font-mono font-bold text-gs-gold tabular-nums">
                    72{" "}
                    <span className="text-sm font-normal text-gs-slate">
                      / 100
                    </span>
                  </div>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-[0.16em] bg-[#2D6A4F]/20 text-[#68B68E] border border-[#2D6A4F]/50">
                    VERDICT: GO
                  </span>
                </div>
              </div>

              {/* 3 Macro-Pillar Summary Strip */}
              <div className="grid grid-cols-3 border-b border-white/10 bg-geo-navy/50 text-xs font-mono tabular-nums">
                <div className="p-3 border-r border-white/10">
                  <span className="block text-[10px] text-gs-slate uppercase">
                    GEOLOGICAL
                  </span>
                  <span className="text-sm font-semibold text-geo-white">
                    28 / 40 PTS
                  </span>
                </div>
                <div className="p-3 border-r border-white/10">
                  <span className="block text-[10px] text-gs-slate uppercase">
                    JURISDICTION &amp; ESG
                  </span>
                  <span className="text-sm font-semibold text-geo-white">
                    30 / 40 PTS
                  </span>
                </div>
                <div className="p-3">
                  <span className="block text-[10px] text-gs-slate uppercase">
                    OPERATOR
                  </span>
                  <span className="text-sm font-semibold text-geo-white">
                    14 / 20 PTS
                  </span>
                </div>
              </div>

              {/* 6-Parameter Technical Breakdown */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold">
                    6-PARAMETER TECHNICAL WEIGHTING LEDGER
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-gs-slate">
                    MAX 100 PTS
                  </span>
                </div>

                <div>
                  {DOSSIER_PARAMETERS.map((param) => (
                    <ParameterRow key={param.code} {...param} />
                  ))}
                </div>

                {/* Decision Thresholds Bar */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-gs-slate mb-2">
                    <span>DECISION THRESHOLD GATES</span>
                    <span>TURNAROUND SLA: 5–7 BUSINESS DAYS</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono tabular-nums">
                    <div className="px-2.5 py-1.5 bg-[#2D6A4F]/15 border border-[#2D6A4F]/40 text-[#68B68E]">
                      <span className="block font-semibold">70–100 PTS</span>
                      <span className="text-[9px] uppercase">GO • PROCEED</span>
                    </div>
                    <div className="px-2.5 py-1.5 bg-gs-gold/10 border border-gs-gold/35 text-geo-gold-light">
                      <span className="block font-semibold">45–69 PTS</span>
                      <span className="text-[9px] uppercase">
                        CONDITIONAL GO
                      </span>
                    </div>
                    <div className="px-2.5 py-1.5 bg-[#9B2226]/15 border border-[#9B2226]/40 text-[#E57373]">
                      <span className="block font-semibold">0–44 PTS</span>
                      <span className="text-[9px] uppercase">
                        NO-GO • REJECT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terminal Footer Links */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                  <Link
                    href="/geosentry/framework"
                    className="text-gs-gold hover:text-geo-gold-light uppercase tracking-[0.14em]"
                  >
                    [INSPECT 100-PT RUBRIC &rarr;]
                  </Link>
                  <Link
                    href="/geosentry/track"
                    className="text-gs-slate hover:text-geo-white uppercase tracking-[0.14em]"
                  >
                    [LIVE TRACKER: GS-2026-0001]
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

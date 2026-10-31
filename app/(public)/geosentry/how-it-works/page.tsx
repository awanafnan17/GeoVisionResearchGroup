import type { Metadata } from "next";
import Link from "next/link";
import { GsSolution } from "@/components/geosentry/gs-solution";
import { GsProcess } from "@/components/geosentry/gs-process";

export const metadata: Metadata = {
  title: "How GeoSentry Works | Geo Vision Research Group",
  description:
    "Learn about the GeoSentry 5-stage structured screening protocol. From data room intake through multi-spectral evaluation to final GO/NO-GO verdict delivery.",
  keywords: [
    "geological screening process",
    "mining due diligence",
    "exploration risk assessment",
    "desktop geological study",
  ],
};

const DOSSIER_DELIVERABLES = [
  {
    code: "DEL 01",
    title: "Composite 100-Point Scorecard",
    spec: "QUANTITATIVE EXECUTIVE SHEET",
    desc: "Consolidated 0–100 rating with explicit calibration against the 70+ GO, 45–69 CONDITIONAL GO, and 0–44 NO-GO capital allocation thresholds.",
  },
  {
    code: "DEL 02",
    title: "6-Parameter & 3-Pillar Breakdown",
    spec: "GRANULAR WEIGHTED LEDGER",
    desc: "Line-by-line scoring across Regional Setting (20), Deposit Model (20), Structural Controls (15), Spectral/Geochem (15), Historical QA/QC (15), and Access/Fatal Flaw (15).",
  },
  {
    code: "DEL 03",
    title: "Multi-Spectral Alteration Synthesis",
    spec: "ASTER / SENTINEL-2 SWIR-VNIR",
    desc: "Processed hydrothermal alteration anomaly maps isolating Al-OH (phyllic/argillic), Mg-OH (chloritic/propylitic), and gossanous iron-oxide footprints.",
  },
  {
    code: "DEL 04",
    title: "Red-Flag & Fatal-Flaw Register",
    spec: "RISK & MITIGATION MATRIX",
    desc: "Categorized severity matrix (LOW / MEDIUM / HIGH) isolating unverified historical assays, cadastral overlaps, watershed buffers, or structural discontinuities.",
  },
  {
    code: "DEL 05",
    title: "Staged Phase-1 Verification Workplan",
    spec: "PRE-DRILLING CAPITAL GATE",
    desc: "Practical 4-to-8 week field verification program (spectrometry, twin channel sampling, ground geophysics) with indicative cost allocations before drilling.",
  },
  {
    code: "DEL 06",
    title: "Encrypted Tracker & Signed PDF Dossier",
    spec: "ARCHIVAL BOARD REPORT",
    desc: "Permanent reference record (GS-YYYY-XXXX) accessible via the online tracker alongside a board-ready PDF technical dossier signed by two senior geologists.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="How it works hero"
      >
        <div className="container-custom">
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 text-[11px] font-mono uppercase tracking-[0.2em] text-gs-slate">
            <span>OPERATIONAL PROTOCOL &bull; GS-SOP-05</span>
            <span>TURNAROUND: 5–7 BUSINESS DAYS (48–72H PRIORITY)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="gs-badge mb-6">OPERATIONAL METHODOLOGY</div>
              <h1 className="text-display text-geo-white">
                How{" "}
                <span className="italic font-normal text-gs-gold">
                  GeoSentry
                </span>{" "}
                Works.
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-gs-slate leading-relaxed mb-6">
                A repeatable, five-stage desktop due-diligence protocol designed
                for exploration directors, mining private equity deal rooms, and
                concession acquisition teams.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/geosentry/request"
                  className="gs-btn-primary text-xs py-3 px-6"
                >
                  Commission Screening
                </Link>
                <Link
                  href="/geosentry/sample-report"
                  className="gs-btn-secondary text-xs py-3 px-6"
                >
                  Inspect Sample Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Stage Protocol Ledger */}
      <GsSolution />

      {/* SLA & Milestone Timeline */}
      <GsProcess />

      {/* Warm Alabaster Stone Section: Deliverable Specifications */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Deliverable specifications"
      >
        <div className="container-custom">
          <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-geo-slate mb-10">
            <span className="text-geo-ink font-semibold">
              DELIVERABLE SPECIFICATIONS
            </span>
            <span className="h-px flex-1 bg-geo-stone-border" />
            <span className="tabular-nums">06 MANDATORY ARTIFACTS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
            <div className="lg:col-span-6">
              <h2 className="text-headline text-geo-ink">
                What Every{" "}
                <span className="italic font-normal text-geo-gold-dark">
                  Screening Dossier
                </span>{" "}
                Contains.
              </h2>
            </div>
            <div className="lg:col-span-6 flex items-end">
              <p className="text-sm sm:text-base text-geo-charcoal leading-relaxed">
                Each completed engagement delivers a comprehensive, board-ready
                technical package engineered to support immediate capital
                allocation or concession relinquishment decisions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-geo-stone-border bg-white/75">
            {DOSSIER_DELIVERABLES.map((item) => (
              <div
                key={item.code}
                className="p-7 border-r border-b border-geo-stone-border flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-geo-stone-border/70">
                    <span className="text-[11px] font-mono font-semibold text-geo-gold-dark uppercase tracking-[0.16em]">
                      {item.code}
                    </span>
                    <span className="text-[10px] font-mono text-geo-slate uppercase tracking-[0.12em]">
                      {item.spec}
                    </span>
                  </div>
                  <h3 className="text-xl font-heading text-geo-ink mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-geo-charcoal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="py-20 bg-geo-navy border-t border-white/10"
        aria-label="Call to action"
      >
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-1">
              INITIATE MANDATE
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading text-geo-white">
              Ready to Commission a 5-Stage Target Screening?
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/geosentry/request" className="gs-btn-primary">
              Request Screening
            </Link>
            <Link href="/geosentry/framework" className="gs-btn-secondary">
              Review 100-Point Rubric
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

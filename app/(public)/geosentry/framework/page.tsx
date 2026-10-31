import type { Metadata } from "next";
import Link from "next/link";
import { GsFrameworkVisual } from "@/components/geosentry/gs-framework-visual";
import { GsDepositTypes } from "@/components/geosentry/gs-deposit-types";

export const metadata: Metadata = {
  title: "100-Point Scoring Framework | GeoSentry",
  description:
    "The GeoSentry 100-point geological scoring framework: 6 weighted technical parameters across Geological Assessment (40 pts), Jurisdiction & ESG (40 pts), and Operator Quality (20 pts).",
  keywords: [
    "geological scoring framework",
    "mining risk scoring",
    "mineral exploration assessment",
    "100 point geological framework",
  ],
};

const RUBRIC_CALIBRATION_TABLE = [
  {
    code: "CAT-01",
    parameter: "Regional Geological Setting",
    maxPts: "20 PTS",
    bandLow: "0–7 PTS • Barren cratonic/basin interior without known metallogenic events.",
    bandMid: "8–14 PTS • Permissive greenstone, arc, or ophiolite belt; regional occurrences.",
    bandHigh: "15–20 PTS • Proven tier-1 metallogenic belt along strike from major mines.",
  },
  {
    code: "CAT-02",
    parameter: "Deposit Model Validity",
    maxPts: "20 PTS",
    bandLow: "0–7 PTS • Genetic model contradicts observed lithology or preservation depth.",
    bandMid: "8–14 PTS • Plausible lithostratigraphic host; partial analogue match.",
    bandHigh: "15–20 PTS • Diagnostic host stratigraphy, intrusive/volcanic contact, and trap.",
  },
  {
    code: "CAT-03",
    parameter: "Structural & Lithological Controls",
    maxPts: "15 PTS",
    bandLow: "0–5 PTS • Unfaulted monotonous sequence or post-mineral fault dismemberment.",
    bandMid: "6–10 PTS • Regional shear or fault corridor present; limited kinematic detail.",
    bandHigh: "11–15 PTS • Dilational fault intersections, fold hinges, or rheologic traps mapped.",
  },
  {
    code: "CAT-04",
    parameter: "Geochemical & Geophysical Evidence",
    maxPts: "15 PTS",
    bandLow: "0–5 PTS • Background pathfinder geochemistry; no spectral or geophysical anomaly.",
    bandMid: "6–10 PTS • Single-layer ASTER SWIR alteration or reconnaissance rock-chip highs.",
    bandHigh: "11–15 PTS • Coincident multi-spectral SWIR/VNIR zonation, soil/rock & EM/IP target.",
  },
  {
    code: "CAT-05",
    parameter: "Historical Work & Data Quality",
    maxPts: "15 PTS",
    bandLow: "0–5 PTS • Unverifiable artisanal notes or missing laboratory assay certificates.",
    bandMid: "6–10 PTS • Documented legacy trench/drill data requiring twin QA/QC verification.",
    bandHigh: "11–15 PTS • Accredited ISO lab certificates, full CRM/blank QA/QC, seasoned team.",
  },
  {
    code: "CAT-06",
    parameter: "Fatal Flaw & Access Risk",
    maxPts: "15 PTS",
    bandLow: "0–5 PTS • Overlapping claim dispute, IUCN reserve overlap, or security embargo.",
    bandMid: "6–10 PTS • Valid tenure; seasonal access or standard watershed buffer management.",
    bandHigh: "11–15 PTS • Clear cadastral registry title, established mining code, highway/port access.",
  },
];

export default function FrameworkPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Framework specification hero"
      >
        <div className="container-custom">
          {/* Top Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/10 text-[11px] font-mono uppercase tracking-[0.2em] text-gs-slate">
            <span>SPECIFICATION &bull; GS-RUBRIC-100</span>
            <span>6 TECHNICAL PARAMETERS &bull; 3 INSTITUTIONAL PILLARS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="gs-badge mb-6">GRADING ARCHITECTURE</div>
              <h1 className="text-display text-geo-white">
                100-Point{" "}
                <span className="italic font-normal text-gs-gold px-1.5">
                  Assessment
                </span>{" "}
                Framework.
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-gs-slate leading-relaxed mb-6">
                Every mineral concession evaluated by GeoSentry is graded against
                a standardized 100-point quantitative rubric—eliminating
                subjective promotional bias prior to field capital commitment.
              </p>
              <div className="grid grid-cols-3 border-t border-white/15 pt-4 gap-3 font-mono text-xs tabular-nums">
                <div>
                  <span className="block text-[10px] text-gs-slate">GO GATE</span>
                  <span className="font-bold text-[#68B68E]">70–100 PTS</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gs-slate">
                    CONDITIONAL
                  </span>
                  <span className="font-bold text-geo-gold-light">
                    45–69 PTS
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-gs-slate">
                    NO-GO GATE
                  </span>
                  <span className="font-bold text-[#E57373]">0–44 PTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Category & 3-Pillar Interactive Specification */}
      <GsFrameworkVisual hideHeader />

      {/* Warm Alabaster Stone Section: Quantitative Rubric Calibration Table */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Quantitative rubric calibration bands"
      >
        <div className="container-custom">
          <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-geo-slate mb-10">
            <span className="text-geo-ink font-semibold">
              TABLE 2.1 — SCORING BAND CALIBRATION SPECIFICATION
            </span>
            <span className="h-px flex-1 bg-geo-stone-border" />
            <span className="tabular-nums">PEER-REVIEWED GRADING BANDS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-6">
              <h2 className="text-headline text-geo-ink">
                Standardized{" "}
                <span className="italic font-normal text-geo-gold-dark">
                  Scoring Bands
                </span>{" "}
                Across All Six Categories.
              </h2>
            </div>
            <div className="lg:col-span-6 flex items-end">
              <p className="text-sm sm:text-base text-geo-charcoal leading-relaxed">
                To ensure repeatability across different analysts and commodity
                cycles, each of the six categories is anchored by explicit low,
                moderate, and high geological threshold criteria.
              </p>
            </div>
          </div>

          <div className="border border-geo-stone-border bg-white/80 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-geo-stone-border bg-geo-stone-muted text-[11px] font-mono uppercase tracking-[0.16em] text-geo-ink">
                  <th className="py-4 px-5 w-1/5">Category &amp; Weight</th>
                  <th className="py-4 px-5 w-1/4 border-l border-geo-stone-border text-[#A93528]">
                    Deficient Band (Low)
                  </th>
                  <th className="py-4 px-5 w-1/4 border-l border-geo-stone-border text-geo-gold-dark">
                    Conditional Band (Moderate)
                  </th>
                  <th className="py-4 px-5 w-3/10 border-l border-geo-stone-border text-[#2D6A4F]">
                    Optimal Band (High Merit)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-geo-stone-border text-xs">
                {RUBRIC_CALIBRATION_TABLE.map((row) => (
                  <tr key={row.code} className="align-top">
                    <td className="py-4 px-5">
                      <span className="block font-mono text-[10px] text-geo-gold-dark font-semibold uppercase tracking-[0.14em]">
                        {`${row.code} • MAX ${row.maxPts}`}
                      </span>
                      <span className="font-sans font-bold text-sm text-geo-ink mt-0.5 block">
                        {row.parameter}
                      </span>
                    </td>
                    <td className="py-4 px-5 border-l border-geo-stone-border text-geo-slate leading-relaxed">
                      {row.bandLow}
                    </td>
                    <td className="py-4 px-5 border-l border-geo-stone-border text-geo-charcoal leading-relaxed">
                      {row.bandMid}
                    </td>
                    <td className="py-4 px-5 border-l border-geo-stone-border text-geo-ink font-medium leading-relaxed bg-[#4E7A56]/[0.05]">
                      {row.bandHigh}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Deposit Types Matrix */}
      <GsDepositTypes />

      {/* Bottom CTA */}
      <section
        className="py-20 bg-geo-navy border-t border-white/10"
        aria-label="Apply framework call to action"
      >
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-1">
              COMMISSIONING DESK
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading text-geo-white">
              Apply the 100-Point Framework to Your Concession Target
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link href="/geosentry/request" className="gs-btn-primary">
              Request Screening
            </Link>
            <Link href="/geosentry/sample-report" className="gs-btn-secondary">
              View Sample Dossier
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

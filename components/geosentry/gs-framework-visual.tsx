"use client";

import Link from "next/link";

interface SixCategoryItem {
  code: string;
  name: string;
  weight: number;
  pillar: string;
  color: string;
  criteria: string[];
  fatalFlawTrigger: string;
}

const SIX_CATEGORY_SPEC: SixCategoryItem[] = [
  {
    code: "CAT-01",
    name: "Regional Geological Setting",
    weight: 20,
    pillar: "Geological Assessment",
    color: "#B8964A",
    criteria: [
      "Metallogenic belt fertility and tectonic terrane classification",
      "Proximity and strike continuity to documented tier-1/tier-2 deposits",
      "Crustal-scale fault architecture and permissive host stratigraphy",
    ],
    fatalFlawTrigger:
      "Target situated in cratonic or basin interior lacking documented mineralization events.",
  },
  {
    code: "CAT-02",
    name: "Deposit Model Validity",
    weight: 20,
    pillar: "Geological Assessment",
    color: "#D2B46E",
    criteria: [
      "Genetic deposit model coherence against global USGS/Cox-Singer analogues",
      "Host rock permeability, rheologic contrast, and chemical trap effectiveness",
      "Preservation level (erosional depth vs. target mineralization horizon)",
    ],
    fatalFlawTrigger:
      "Proposed deposit model incompatible with observed host lithology or metamorphic grade.",
  },
  {
    code: "CAT-03",
    name: "Structural & Lithological Controls",
    weight: 15,
    pillar: "Geological / Technical",
    color: "#2C5E99",
    criteria: [
      "Dilational fault intersections, fold hinges, and shear-zone kinematics",
      "Intrusive contact aureoles, volcanic domes, or stratigraphic unconformities",
      "DEM/ALOS PALSAR lineament density and structural trap continuity",
    ],
    fatalFlawTrigger:
      "Post-mineral faulting dismembering or down-dropping the primary target horizon beyond economic depth.",
  },
  {
    code: "CAT-04",
    name: "Geochemical & Geophysical Evidence",
    weight: 15,
    pillar: "Technical / Verification",
    color: "#4E7A56",
    criteria: [
      "ASTER/Sentinel-2 SWIR/VNIR hydrothermal alteration zonation (Al-OH, Mg-OH, FeOx)",
      "Coincident rock-chip, stream-sediment, or soil pathfinder anomalies",
      "Airborne/ground magnetic, gravity, EM, or IP chargeability target signatures",
    ],
    fatalFlawTrigger:
      "Complete absence of hydrothermal alteration or pathfinder anomaly across exposed target bedrock.",
  },
  {
    code: "CAT-05",
    name: "Historical Work & Data Quality",
    weight: 15,
    pillar: "Operator & Data Integrity",
    color: "#74A87E",
    criteria: [
      "Verification of historical trench, channel, and drillhole collar coordinates",
      "Laboratory accreditation, assay certificates, and CRM/blank/duplicate QA/QC",
      "Realism of operator Phase-1 exploration budget and technical team track record",
    ],
    fatalFlawTrigger:
      "Unverifiable historical grades, missing assay certificates, or materially flawed sampling protocol.",
  },
  {
    code: "CAT-06",
    name: "Fatal Flaw & Access Risk",
    weight: 15,
    pillar: "Jurisdiction & ESG",
    color: "#8F7130",
    criteria: [
      "Cadastral license standing, mineral code stability, and security of tenure",
      "Overlap with IUCN protected reserves, critical watersheds, or urban buffers",
      "Topographic accessibility, road/power infrastructure, and surface rights consent",
    ],
    fatalFlawTrigger:
      "Overlapping third-party claims, statutory environmental exclusion zone, or active security embargo.",
  },
];

const THREE_MACRO_PILLARS = [
  {
    code: "PILLAR I",
    title: "Geological Assessment",
    points: 40,
    share: "40%",
    summary:
      "Tectonic belt fertility, deposit model validity, multi-spectral alteration footprint, and structural controls.",
  },
  {
    code: "PILLAR II",
    title: "Jurisdiction and ESG",
    points: 40,
    share: "40%",
    summary:
      "Cadastral license standing, mining code security, environmental buffer compliance, and infrastructure access.",
  },
  {
    code: "PILLAR III",
    title: "Operator Quality",
    points: 20,
    share: "20%",
    summary:
      "Technical team track record, historical data QA/QC integrity, and Phase-1 exploration workplan realism.",
  },
];

export function GsFrameworkVisual({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  return (
    <section
      className="section-padding bg-geo-navy-light border-b border-white/10"
      aria-label="100-Point Assessment Framework"
    >
      <div className="container-custom">
        {!hideHeader && (
          <>
            <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-gs-slate mb-10">
              <span className="text-gs-gold font-semibold">
                GRADING SPECIFICATION
              </span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="tabular-nums">100-POINT WEIGHTED RUBRIC</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-headline text-geo-white">
                  The{" "}
                  <span className="italic font-normal text-gs-gold">
                    100-Point
                  </span>{" "}
                  Assessment Architecture.
                </h2>
              </div>
              <div className="lg:col-span-6 flex flex-col justify-end">
                <p className="text-sm sm:text-base text-gs-slate leading-relaxed">
                  Every target is graded across six granular technical categories
                  (20 + 20 + 15 + 15 + 15 + 15 = 100 points) consolidated into
                  three institutional reporting pillars (40 / 40 / 20).
                </p>
              </div>
            </div>
          </>
        )}

        {/* Horizontal Stacked 100-Point Allocation Bar */}
        <div className="border border-white/15 bg-geo-navy p-6 sm:p-8 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-geo-white">
              COMPOSITE WEIGHT DISTRIBUTION • 100 POINTS TOTAL
            </span>
            <span className="text-xs font-mono text-gs-gold tabular-nums">
              20 + 20 + 15 + 15 + 15 + 15 = 100 PTS
            </span>
          </div>

          {/* Stacked Bar */}
          <div className="h-7 w-full bg-gs-navy-dark border border-white/15 flex overflow-hidden mb-4">
            {SIX_CATEGORY_SPEC.map((cat) => (
              <div
                key={cat.code}
                style={{
                  width: `${cat.weight}%`,
                  backgroundColor: cat.color,
                }}
                className="h-full border-r border-geo-navy last:border-r-0 flex items-center justify-center text-[10px] font-mono font-bold text-geo-navy tabular-nums"
                title={`${cat.name}: ${cat.weight} PTS`}
              >
                {cat.weight}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {SIX_CATEGORY_SPEC.map((cat) => (
              <div key={cat.code} className="flex items-start gap-2">
                <span
                  className="w-2.5 h-2.5 mt-1 shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <div>
                  <span className="block text-[10px] font-mono font-semibold text-geo-white tabular-nums">
                    {`${cat.code} • ${cat.weight} PTS`}
                  </span>
                  <span className="block text-[11px] text-gs-slate leading-tight">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6-Category Detailed Grading Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/15 mb-12">
          {SIX_CATEGORY_SPEC.map((cat) => (
            <div
              key={cat.code}
              className="p-6 sm:p-8 border-r border-b border-white/15 bg-geo-navy flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-1">
                      {`${cat.code} • ${cat.pillar}`}
                    </span>
                    <h3 className="text-xl font-heading text-geo-white">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="text-right font-mono tabular-nums shrink-0 px-3 py-1.5 bg-geo-navy-light border border-gs-gold/40">
                    <span className="text-xl font-bold text-gs-gold">
                      {cat.weight}
                    </span>
                    <span className="text-[10px] text-gs-slate block uppercase">
                      MAX PTS
                    </span>
                  </div>
                </div>

                {/* Progress Proportion Indicator */}
                <div className="mb-5">
                  <div className="flex justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-gs-slate mb-1.5 tabular-nums">
                    <span>CATEGORY WEIGHT SHARE</span>
                    <span>{cat.weight}% OF COMPOSITE SCORE</span>
                  </div>
                  <div className="h-1.5 w-full bg-gs-navy-dark border border-white/10">
                    <div
                      className="h-full"
                      style={{
                        width: `${(cat.weight / 20) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {cat.criteria.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-geo-white-dim leading-relaxed"
                    >
                      <span className="text-gs-gold font-mono text-xs mt-0.5">
                        &mdash;
                      </span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-gs-slate">
                <span className="font-mono font-semibold uppercase tracking-[0.12em] text-[#E07A6F] mr-1.5">
                  [FATAL FLAW TRIGGER]:
                </span>
                <span>{cat.fatalFlawTrigger}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3 Institutional Reporting Pillars + Decision Thresholds */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 3 Macro-Pillars (7 cols) */}
          <div className="lg:col-span-7 border border-white/15 bg-geo-navy p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-gs-gold">
                EXECUTIVE ROLL-UP • 3 INSTITUTIONAL PILLARS
              </span>
              <span className="text-xs font-mono text-gs-slate tabular-nums">
                40 / 40 / 20 SPLIT
              </span>
            </div>

            <div className="space-y-5">
              {THREE_MACRO_PILLARS.map((p) => (
                <div
                  key={p.code}
                  className="p-4 border border-white/10 bg-geo-navy-light/60"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-[10px] font-mono text-gs-gold uppercase tracking-[0.16em] mr-2">
                        {p.code}
                      </span>
                      <span className="text-sm font-semibold text-geo-white">
                        {p.title}
                      </span>
                    </div>
                    <span className="text-sm font-mono font-bold text-gs-gold tabular-nums">
                      {p.points} / 100 PTS ({p.share})
                    </span>
                  </div>
                  <p className="text-xs text-gs-slate leading-relaxed">
                    {p.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Threshold Gates (5 cols) */}
          <div className="lg:col-span-5 border border-gs-gold/35 bg-gs-navy-dark p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-gs-gold block pb-4 mb-6 border-b border-white/10">
                CAPITAL ALLOCATION DECISION GATES
              </span>

              <div className="space-y-4">
                <div className="p-4 border border-[#2D6A4F]/50 bg-[#2D6A4F]/10">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#68B68E]">
                      GO • PROCEED TO FIELDWORK
                    </span>
                    <span className="text-sm font-bold text-[#68B68E] tabular-nums">
                      70–100 PTS
                    </span>
                  </div>
                  <p className="text-xs text-gs-slate leading-relaxed">
                    Strong geological fertility, coherent deposit model, clear
                    tenure, and no fatal flaws. Authorize Phase-1 field budget.
                  </p>
                </div>

                <div className="p-4 border border-gs-gold/45 bg-gs-gold/10">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-geo-gold-light">
                      CONDITIONAL GO • DATA GATE
                    </span>
                    <span className="text-sm font-bold text-geo-gold-light tabular-nums">
                      45–69 PTS
                    </span>
                  </div>
                  <p className="text-xs text-gs-slate leading-relaxed">
                    Prospective geological setting but requires targeted QA/QC
                    verification, spectral ground-truthing, or tenure curing
                    before major commitment.
                  </p>
                </div>

                <div className="p-4 border border-[#9B2226]/50 bg-[#9B2226]/10">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#E57373]">
                      NO-GO • REJECT OR RELINQUISH
                    </span>
                    <span className="text-sm font-bold text-[#E57373] tabular-nums">
                      0–44 PTS
                    </span>
                  </div>
                  <p className="text-xs text-gs-slate leading-relaxed">
                    Unfavorable deposit model, barren alteration signature, or
                    unmitigable jurisdictional/ESG fatal flaw. Preserve capital.
                  </p>
                </div>
              </div>
            </div>

            {!hideHeader && (
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <Link
                  href="/geosentry/framework"
                  className="text-gs-gold hover:text-geo-gold-light uppercase tracking-[0.14em]"
                >
                  Full Grading Rubric &rarr;
                </Link>
                <Link
                  href="/geosentry/sample-report"
                  className="text-gs-slate hover:text-geo-white uppercase tracking-[0.14em]"
                >
                  Sample Report (72/100)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

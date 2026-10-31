import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sample 100-Point Screening Report | GeoSentry",
  description:
    "Review a complete demonstration GeoSentry 100-point desktop geological screening dossier (Ref: GS-2026-0001, Block 14B Semail Ophiolite, Oman) showing 6-parameter and 3-pillar scoring for a 72/100 GO verdict.",
};

const SIX_PARAMETER_LEDGER = [
  {
    code: "CAT-01",
    parameter: "Regional Geological Setting",
    pillar: "Geological Assessment",
    score: 16,
    max: 20,
    status: "FAVORABLE",
    rationale:
      "Concession lies within the northern Semail Ophiolite crustal sequence, directly along strike from documented Cyprus-type VMS Cu-Au occurrences (Lasail, Aarja, Bayda).",
  },
  {
    code: "CAT-02",
    parameter: "Deposit Model Validity",
    pillar: "Geological Assessment",
    score: 15,
    max: 20,
    status: "VALIDATED",
    rationale:
      "Mapped sheeted dike complex to extrusive pillow basalt contact (Geotimes–Lasail volcanic horizon) matches classic ophiolite-hosted volcanogenic massive sulfide stratigraphic traps.",
  },
  {
    code: "CAT-03",
    parameter: "Structural & Lithological Controls",
    pillar: "Geological / Technical",
    score: 11,
    max: 15,
    status: "FAVORABLE",
    rationale:
      "High syn-volcanic NW-trending normal fault density and cross-fault intersections mapped via ALOS PALSAR DEM; localized feeder-pipe stockwork geometry preserved.",
  },
  {
    code: "CAT-04",
    parameter: "Geochemical & Geophysical Evidence",
    pillar: "Technical / Verification",
    score: 10,
    max: 15,
    status: "MODERATE-HIGH",
    rationale:
      "ASTER SWIR/VNIR band-ratio processing isolates a 1.8 km × 1.1 km chlorite-epidote and gossanous iron-oxide footprint coincident with legacy Cu-Au rock-chip anomalies.",
  },
  {
    code: "CAT-05",
    parameter: "Historical Work & Data Quality",
    pillar: "Operator & Data Integrity",
    score: 10,
    max: 15,
    status: "CONDITIONAL",
    rationale:
      "Legacy 1990s trenching confirms surface copper-gold oxide mineralization, but missing laboratory CRM certificates require twin channel sampling prior to resource modeling.",
  },
  {
    code: "CAT-06",
    parameter: "Fatal Flaw & Access Risk",
    pillar: "Jurisdiction & ESG",
    score: 10,
    max: 15,
    status: "CLEAR",
    rationale:
      "Verified Omani cadastral registry standing with zero nature-reserve overlaps; graded track access within 14 km of paved national highway and port logistics.",
  },
] as const;

const PILLAR_BREAKDOWN = [
  {
    code: "PILLAR 01",
    title: "1. Geological Assessment",
    score: 28,
    max: 40,
    summary:
      "Favorable Semail Ophiolite volcanic stratigraphy with sheeted dike and extrusive basalt contact zones hosting VMS Cu-Au-Zn prospectivity.",
    subCriteria: [
      {
        name: "Tectonic & Metallogenic Belt Setting",
        score: "8 / 10",
        detail:
          "Target lies within the Semail Ophiolite crustal sequence in northern Oman, along strike from documented Cyprus-type VMS copper-gold deposits.",
      },
      {
        name: "Deposit Model & Host Lithology Fit",
        score: "7 / 10",
        detail:
          "Mapped Geotimes and Lasail volcanic contacts match classic ophiolite-hosted volcanogenic massive sulfide stratigraphic horizons.",
      },
      {
        name: "Multi-Spectral Alteration Footprint (ASTER / Sentinel-2)",
        score: "7 / 10",
        detail:
          "Coincident chloritic-epidote and gossanous iron-oxide SWIR/VNIR anomalies identified along NW-trending fault corridors.",
      },
      {
        name: "Structural Preparation & Historical Geochemistry",
        score: "6 / 10",
        detail:
          "High syn-volcanic normal fault density; legacy reconnaissance rock-chip Cu-Au anomalies present, requiring modern ground EM follow-up.",
      },
    ],
  },
  {
    code: "PILLAR 02",
    title: "2. Jurisdiction and ESG",
    score: 30,
    max: 40,
    summary:
      "Established Omani mining code, clear cadastral standing, and paved highway proximity, with standard wadi buffer management required.",
    subCriteria: [
      {
        name: "Cadastral Standing & Licence Security",
        score: "8 / 10",
        detail:
          "Block 14B concession boundaries verified in registry with clear mineral tenure rules and no overlapping third-party claims.",
      },
      {
        name: "Environmental & Protected Area Buffers",
        score: "7 / 10",
        detail:
          "Zero overlap with nature reserves; ephemeral wadi drainage buffers require standard baseline hydrochemical monitoring.",
      },
      {
        name: "Community & Social Licence Context",
        score: "7 / 10",
        detail:
          "Low population density within core target area; established local consultation framework prior to ground geophysics.",
      },
      {
        name: "Infrastructure, Logistics & Security",
        score: "8 / 10",
        detail:
          "Direct graded track access to national highway network, port facilities, and reliable regional power and logistics.",
      },
    ],
  },
  {
    code: "PILLAR 03",
    title: "3. Operator Quality",
    score: 14,
    max: 20,
    summary:
      "Experienced regional exploration team with an appropriate staged geophysics and mapping workplan prior to scout drilling.",
    subCriteria: [
      {
        name: "Technical Team Track Record",
        score: "7 / 10",
        detail:
          "Lead exploration geologists have direct experience in ophiolite-hosted VMS Cu-Au systems and international reporting standards.",
      },
      {
        name: "Workplan Realism & Capital Allocation",
        score: "7 / 10",
        detail:
          "Proposed Phase-1 geological mapping and time-domain electromagnetic (TDEM) survey is well aligned with target geometry.",
      },
    ],
  },
] as const;

const RED_FLAGS_AND_RISKS = [
  {
    id: "RF-01",
    severity: "MEDIUM",
    category: "Data Quality & QA/QC",
    finding: "Incomplete Historical Assay QA/QC Certificates (1996 Trench Campaign)",
    mitigation:
      "Do not rely on historical trench grades for resource modeling until twin channel sampling with certified reference materials (CRMs) and field duplicates is completed.",
  },
  {
    id: "RF-02",
    severity: "MEDIUM",
    category: "Hydrogeology & ESG",
    finding: "Arid Wadi Basin Process Water & Ephemeral Drainage Buffer",
    mitigation:
      "Include a desktop fracture-aquifer hydrogeological study and baseline wadi sediment sampling during Phase-1 field reconnaissance.",
  },
  {
    id: "RF-03",
    severity: "LOW",
    category: "Spectral Interpretation",
    finding: "Distinguishing Supergene Weathering Clays from Hypogene Alteration",
    mitigation:
      "Validate ASTER SWIR Al-OH/Mg-OH anomalies using portable shortwave infrared (TerraSpec / Halo) field spectrometer checks across gossan outcrops.",
  },
] as const;

const PHASE_1_BUDGET = [
  {
    stage: "STAGE 1A • WEEKS 1–2",
    activity: "1:5,000 Litho-Structural Mapping & Portable SWIR Spectrometry",
    deliverable: "Verified Geotimes–Lasail volcanic contact & alteration map",
    allocation: "$38,000",
  },
  {
    stage: "STAGE 1B • WEEKS 3–4",
    activity: "Twin Channel Sampling Across Legacy Trenches (ISO Lab + CRM QA/QC)",
    deliverable: "Certified multi-element ICP-MS & fire-assay database",
    allocation: "$42,000",
  },
  {
    stage: "STAGE 2 • WEEKS 5–8",
    activity: "Ground Magnetics & Fixed-Loop Time-Domain EM (TDEM) Survey",
    deliverable: "3D conductive massive-sulfide plate models for drill targeting",
    allocation: "$85,000",
  },
  {
    stage: "CONTINGENCY & ESG",
    activity: "Wadi Hydrochemical Baseline & Community Consultation Protocol",
    deliverable: "Environmental baseline dossier for drill permit application",
    allocation: "$20,000",
  },
] as const;

export default function GeoSentrySampleReportPage() {
  return (
    <>
      {/* Dark Obsidian Dossier Header */}
      <section
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-geo-navy geo-grid-bg border-b border-white/10"
        aria-label="Sample screening report header"
      >
        <div className="container-custom">
          {/* Top Classification Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10 text-[11px] font-mono uppercase tracking-[0.2em] text-gs-slate">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-gs-gold" />
              <span className="text-gs-gold font-semibold">
                REF: GS-2026-0001 &bull; BLOCK 14B SEMAIL OPHIOLITE, OMAN
              </span>
            </div>
            <div className="flex items-center gap-4 tabular-nums">
              <span>23°35&apos;N 58°24&apos;E</span>
              <span className="text-white/30">&bull;</span>
              <span className="text-geo-white">SCALE 1:25,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
            <div className="lg:col-span-8">
              <div className="gs-badge mb-5">
                DEMONSTRATION SCREENING DOSSIER &bull; PUBLIC ARCHIVE
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-geo-white leading-[1.04]">
                GeoSentry{" "}
                <span className="italic font-normal text-gs-gold">
                  100-Point
                </span>{" "}
                Target Screening Report.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-gs-slate block mb-1">
                DOCUMENT CLASSIFICATION
              </span>
              <span className="text-xs font-mono text-geo-white block">
                PRE-COMMITMENT DESKTOP DUE DILIGENCE
              </span>
              <span className="text-xs font-mono text-gs-gold block mt-1">
                ISSUED BY GEO VISION RESEARCH GROUP
              </span>
            </div>
          </div>

          {/* Executive Verdict Banner */}
          <div className="border border-gs-gold/45 bg-geo-navy-light p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 lg:border-r border-white/15 lg:pr-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-slate block mb-1">
                COMPOSITE SCREENING SCORE
              </span>
              <div className="flex items-baseline gap-3 mb-3 font-mono tabular-nums">
                <span className="text-5xl sm:text-6xl font-bold text-gs-gold">
                  72
                </span>
                <span className="text-xl text-gs-slate">/ 100 PTS</span>
              </div>
              <span className="gs-badge-proceed">
                VERDICT: GO — PROCEED TO PHASE-1
              </span>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono tabular-nums">
              <div className="p-4 bg-geo-navy border border-white/10">
                <span className="text-[10px] uppercase tracking-[0.16em] text-gs-slate block mb-1">
                  01. GEOLOGICAL ASSESSMENT
                </span>
                <span className="text-2xl font-bold text-geo-white">
                  28 / 40
                </span>
                <span className="block text-[11px] text-[#68B68E] mt-1">
                  Favorable VMS Horizon
                </span>
              </div>

              <div className="p-4 bg-geo-navy border border-white/10">
                <span className="text-[10px] uppercase tracking-[0.16em] text-gs-slate block mb-1">
                  02. JURISDICTION &amp; ESG
                </span>
                <span className="text-2xl font-bold text-geo-white">
                  30 / 40
                </span>
                <span className="block text-[11px] text-[#68B68E] mt-1">
                  Clear Cadastral Title
                </span>
              </div>

              <div className="p-4 bg-geo-navy border border-white/10">
                <span className="text-[10px] uppercase tracking-[0.16em] text-gs-slate block mb-1">
                  03. OPERATOR QUALITY
                </span>
                <span className="text-2xl font-bold text-geo-white">
                  14 / 20
                </span>
                <span className="block text-[11px] text-[#68B68E] mt-1">
                  Staged TDEM Workplan
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Warm Alabaster Stone Dossier Sheet: Executive Summary & 6-Parameter Ledger */}
      <section
        className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
        aria-label="Executive dossier sheet and 6-parameter breakdown"
      >
        <div className="container-custom">
          <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-geo-slate mb-10">
            <span className="text-geo-ink font-semibold">
              EXECUTIVE DOSSIER &amp; 6-PARAMETER GRADING SHEET
            </span>
            <span className="h-px flex-1 bg-geo-stone-border" />
            <span className="tabular-nums">REF: GS-2026-0001</span>
          </div>

          {/* Printed Dossier Metadata Sheet */}
          <div className="border border-geo-stone-border bg-white/80 mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-geo-stone-border text-xs font-mono">
              <div className="p-4 border-b sm:border-b-0 border-r border-geo-stone-border">
                <span className="block text-[10px] text-geo-slate uppercase">
                  TARGET CONCESSION
                </span>
                <span className="font-bold text-geo-ink">
                  Block 14B VMS Concession
                </span>
              </div>
              <div className="p-4 border-b sm:border-b-0 sm:border-r border-geo-stone-border">
                <span className="block text-[10px] text-geo-slate uppercase">
                  METALLOGENIC BELT
                </span>
                <span className="font-bold text-geo-ink">
                  Semail Ophiolite, Oman
                </span>
              </div>
              <div className="p-4 border-r border-geo-stone-border">
                <span className="block text-[10px] text-geo-slate uppercase">
                  DEPOSIT MODEL
                </span>
                <span className="font-bold text-geo-ink">
                  Cyprus-Type Mafic VMS (Cu-Au)
                </span>
              </div>
              <div className="p-4">
                <span className="block text-[10px] text-geo-slate uppercase">
                  DECISION VERDICT
                </span>
                <span className="font-bold text-[#2D6A4F]">
                  72 / 100 — PROCEED / GO
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-heading text-geo-ink mb-3">
                Executive Determination Summary
              </h2>
              <p className="text-sm sm:text-base text-geo-charcoal leading-relaxed">
                Target{" "}
                <strong>
                  Block 14B, Semail Ophiolite VMS Concession, Sultanate of Oman
                  (Ref: GS-2026-0001)
                </strong>{" "}
                achieves a composite score of <strong>72 / 100</strong>,
                exceeding the 70-point institutional threshold for a{" "}
                <strong>GO</strong> capital allocation verdict. Multi-spectral
                ASTER SWIR/VNIR re-processing and structural lineament mapping
                confirm an intact Geotimes–Lasail volcanic contact zone with
                coincident chlorite-epidote and gossanous iron-oxide alteration.
                Phase-1 capital commitment ($185,000 USD) is recommended to
                complete twin channel QA/QC sampling and ground TDEM surveying
                prior to scout core drilling.
              </p>
            </div>
          </div>

          {/* 6-Parameter Tabular Breakdown */}
          <div className="border border-geo-stone-border bg-white/90 overflow-x-auto">
            <div className="px-6 py-4 bg-geo-stone-muted border-b border-geo-stone-border flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-geo-ink">
                TABLE 1.1 &bull; 6-PARAMETER TECHNICAL SCORING LEDGER (100 POINTS)
              </span>
              <span className="text-xs font-mono font-bold text-[#2D6A4F] tabular-nums">
                COMPOSITE: 72 / 100 PTS
              </span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-geo-stone-border bg-geo-stone/70 text-[11px] font-mono uppercase tracking-[0.15em] text-geo-slate">
                  <th className="py-3.5 px-5">Code</th>
                  <th className="py-3.5 px-5 border-l border-geo-stone-border">
                    Technical Parameter
                  </th>
                  <th className="py-3.5 px-5 border-l border-geo-stone-border">
                    Score
                  </th>
                  <th className="py-3.5 px-5 border-l border-geo-stone-border">
                    Determination Rationale
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-geo-stone-border text-xs sm:text-sm">
                {SIX_PARAMETER_LEDGER.map((row) => (
                  <tr key={row.code} className="align-top">
                    <td className="py-4 px-5 font-mono text-xs font-semibold text-geo-gold-dark whitespace-nowrap">
                      {row.code}
                    </td>
                    <td className="py-4 px-5 border-l border-geo-stone-border">
                      <span className="font-bold text-geo-ink block">
                        {row.parameter}
                      </span>
                      <span className="text-[11px] font-mono text-geo-slate">
                        {row.pillar}
                      </span>
                    </td>
                    <td className="py-4 px-5 border-l border-geo-stone-border font-mono tabular-nums whitespace-nowrap">
                      <span className="text-base font-bold text-geo-ink">
                        {row.score}
                      </span>
                      <span className="text-xs text-geo-slate">
                        {" "}
                        / {row.max} PTS
                      </span>
                      <span className="block text-[10px] text-[#2D6A4F] font-semibold mt-0.5">
                        [{row.status}]
                      </span>
                    </td>
                    <td className="py-4 px-5 border-l border-geo-stone-border text-geo-charcoal leading-relaxed">
                      {row.rationale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Dark Navy Section: 3-Pillar Sub-Criteria, Red-Flag Register & Phase-1 Budget */}
      <section
        className="section-padding bg-geo-navy border-b border-white/10"
        aria-label="3-pillar sub-scores, risk matrix, and Phase-1 budget"
      >
        <div className="container-custom space-y-16">
          {/* 3-Pillar Sub-Criteria */}
          <div>
            <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-gs-slate mb-8">
              <span className="text-gs-gold font-semibold">
                THREE-PILLAR SUB-CRITERIA AUDIT
              </span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="tabular-nums">28/40 + 30/40 + 14/20 = 72/100</span>
            </div>

            <div className="space-y-6">
              {PILLAR_BREAKDOWN.map((pillar) => (
                <div
                  key={pillar.title}
                  className="border border-white/15 bg-geo-navy-light p-6 sm:p-8"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-1">
                        {pillar.code}
                      </span>
                      <h3 className="text-2xl font-heading text-geo-white">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-gs-slate mt-1">
                        {pillar.summary}
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-geo-navy border border-gs-gold/40 text-base font-mono font-bold text-gs-gold tabular-nums">
                      {pillar.score} / {pillar.max} PTS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pillar.subCriteria.map((sc) => (
                      <div
                        key={sc.name}
                        className="bg-geo-navy border border-white/10 p-4"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-geo-white">
                            {sc.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-gs-gold tabular-nums shrink-0">
                            {sc.score}
                          </span>
                        </div>
                        <p className="text-xs text-gs-slate leading-relaxed">
                          {sc.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Red-Flag Register */}
          <div>
            <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-gs-slate mb-8">
              <span className="text-gs-gold font-semibold">
                TECHNICAL RED-FLAG &amp; RISK REGISTER
              </span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="tabular-nums">0 FATAL FLAWS &bull; 3 MITIGATIONS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/15">
              {RED_FLAGS_AND_RISKS.map((item) => (
                <div
                  key={item.id}
                  className="p-6 sm:p-7 border-r border-b border-white/15 bg-geo-navy-light flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10">
                      <span className="text-xs font-mono font-semibold text-gs-gold">
                        {`${item.id} • ${item.category}`}
                      </span>
                      <span
                        className={
                          item.severity === "MEDIUM"
                            ? "gs-badge-medium"
                            : "gs-badge-low"
                        }
                      >
                        {item.severity} RISK
                      </span>
                    </div>
                    <h3 className="text-lg font-heading text-geo-white mb-3">
                      {item.finding}
                    </h3>
                  </div>
                  <p className="text-xs text-gs-slate leading-relaxed pt-3 border-t border-white/10">
                    <strong className="font-mono text-geo-white uppercase text-[10px] block mb-1">
                      REQUIRED MITIGATION PROTOCOL:
                    </strong>
                    {item.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Phase-1 Verification Budget */}
          <div>
            <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-gs-slate mb-8">
              <span className="text-gs-gold font-semibold">
                RECOMMENDED PHASE-1 VERIFICATION BUDGET (PRE-DRILLING)
              </span>
              <span className="h-px flex-1 bg-white/10" />
              <span className="tabular-nums">INDICATIVE CAPEX: $185,000 USD</span>
            </div>

            <div className="border border-gs-gold/40 bg-geo-navy-light overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/15 bg-gs-navy-dark text-[11px] font-mono uppercase tracking-[0.16em] text-gs-slate">
                    <th className="py-3.5 px-6">Execution Window</th>
                    <th className="py-3.5 px-6 border-l border-white/10">
                      Technical Work Package
                    </th>
                    <th className="py-3.5 px-6 border-l border-white/10">
                      Decision Gate Artifact
                    </th>
                    <th className="py-3.5 px-6 border-l border-white/10 text-right">
                      Est. Allocation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                  {PHASE_1_BUDGET.map((row) => (
                    <tr key={row.stage}>
                      <td className="py-4 px-6 font-mono text-xs text-gs-gold font-semibold whitespace-nowrap">
                        {row.stage}
                      </td>
                      <td className="py-4 px-6 border-l border-white/10 text-geo-white font-medium">
                        {row.activity}
                      </td>
                      <td className="py-4 px-6 border-l border-white/10 text-gs-slate">
                        {row.deliverable}
                      </td>
                      <td className="py-4 px-6 border-l border-white/10 text-right font-mono font-bold text-geo-white tabular-nums">
                        {row.allocation}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gs-navy-dark font-mono">
                    <td
                      colSpan={3}
                      className="py-4 px-6 text-xs uppercase tracking-[0.16em] text-gs-gold font-semibold"
                    >
                      TOTAL RECOMMENDED PHASE-1 PRE-DRILLING VERIFICATION BUDGET
                    </td>
                    <td className="py-4 px-6 border-l border-white/10 text-right text-base font-bold text-gs-gold tabular-nums">
                      $185,000 USD
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regulatory Disclosure & Bottom CTA */}
          <div className="border border-white/15 bg-gs-navy-dark p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-1">
                METHODOLOGY &amp; REGULATORY DISCLOSURE
              </span>
              <p className="text-xs text-gs-slate leading-relaxed">
                This document is a demonstration sample of a GeoSentry 100-Point
                Desktop Geological Screening Report. GeoSentry assessments are
                early-stage desktop due diligence studies based on satellite
                remote sensing, open-file geological records, cadastral
                registries, and client-supplied technical data. It does not
                constitute a statutory NI 43-101, JORC, or SAMREC Technical
                Report.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/geosentry/request" className="gs-btn-primary text-xs">
                Commission Target Screening
              </Link>
              <Link href="/geosentry/track" className="gs-btn-secondary text-xs">
                Track Existing Mandate
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

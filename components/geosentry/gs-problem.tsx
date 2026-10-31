const ATTRITION_METRICS = [
  {
    index: "METRIC 01",
    value: "$50K–$250K+",
    unit: "PRE-SCREENING EXPOSURE",
    title: "Premature Field Capital Commitment",
    description:
      "Direct cost of helicopter mobilization, reconnaissance camp setup, and scout trenching before basic deposit model or structural controls are verified on desktop.",
  },
  {
    index: "METRIC 02",
    value: "68%",
    unit: "ATTRITION RATE",
    title: "Grassroots Targets Failing Phase-1",
    description:
      "Proportion of early-stage mineral concessions relinquished due to misclassified alteration footprints, barren structural corridors, or unexamined tenure conflicts.",
  },
  {
    index: "METRIC 03",
    value: "3–6 MOS",
    unit: "CYCLE DELAY",
    title: "Detection Lag on Fatal Flaws",
    description:
      "Average operational delay before unverified historical assay certificates, protected watershed buffers, or access bottlenecks halt a live exploration program.",
  },
];

const COMPARISON_LEDGER = [
  {
    dimension: "Deposit Model & Alteration Verification",
    unscreened:
      "Relies on vendor promotional decks and unverified legacy maps prior to field mobilization.",
    geosentry:
      "Independent ASTER/Sentinel-2 SWIR/VNIR spectral re-processing and tectono-stratigraphic analogue audit.",
  },
  {
    dimension: "Historical Assay & QA/QC Integrity",
    unscreened:
      "Historical trench and grab-sample grades accepted at face value without CRM or twin-hole checks.",
    geosentry:
      "Systematic audit of chain-of-custody, detection limits, and certified reference material (CRM) compliance.",
  },
  {
    dimension: "Cadastral, ESG & Access Risk",
    unscreened:
      "Checked informally after field budgets are committed; high exposure to protected buffer or license overlap.",
    geosentry:
      "Pre-commitment verification of mineral registry boundaries, watershed buffers, and infrastructure corridors.",
  },
  {
    dimension: "Capital Allocation Decision Gate",
    unscreened:
      "Subjective narrative recommendations without standardized risk weighting across competing targets.",
    geosentry:
      "Quantitative 100-point composite score with explicit GO (70–100), CONDITIONAL (45–69), or NO-GO (0–44) gate.",
  },
];

export function GsProblem() {
  return (
    <section
      className="section-padding bg-geo-stone text-geo-ink border-b border-geo-stone-border"
      aria-label="The capital allocation problem"
    >
      <div className="container-custom">
        {/* Top Metadata Rule */}
        <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-geo-slate mb-10">
          <span className="text-geo-ink font-semibold">
            THE CAPITAL ALLOCATION PROBLEM
          </span>
          <span className="h-px flex-1 bg-geo-stone-border" />
          <span className="tabular-nums">PRE-FIELD RISK ISOLATION</span>
        </div>

        {/* 12-Column Asymmetric Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          <div className="lg:col-span-5">
            <h2 className="text-headline text-geo-ink">
              Exploration Capital Is Routinely Impaired{" "}
              <span className="italic font-normal text-geo-gold-dark">
                Before the First Drillhole.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end">
            <p className="text-base sm:text-lg text-geo-charcoal leading-relaxed mb-4">
              In junior mining, private equity deal rooms, and regional concession
              acquisitions, field expenditure is frequently authorized on the
              basis of incomplete vendor data rooms or unverified historical
              workings.
            </p>
            <p className="text-sm text-geo-slate leading-relaxed">
              When a deposit model is structurally invalid or a concession carries
              an undetected cadastral or hydrogeological fatal flaw, every dollar
              spent on ground geophysics and camp mobilization represents permanent
              capital destruction.
            </p>
          </div>
        </div>

        {/* 3-Column Tabular Attrition Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-3 border border-geo-stone-border bg-geo-stone-muted/50 mb-16">
          {ATTRITION_METRICS.map((item, idx) => (
            <div
              key={item.index}
              className={`p-7 sm:p-8 ${
                idx < ATTRITION_METRICS.length - 1
                  ? "border-b md:border-b-0 md:border-r border-geo-stone-border"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-geo-slate mb-4">
                <span>{item.index}</span>
                <span className="text-geo-gold-dark font-semibold">
                  {item.unit}
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-mono font-bold text-geo-ink tabular-nums tracking-tight mb-3">
                {item.value}
              </div>
              <h3 className="text-base font-sans font-bold text-geo-ink mb-2">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-geo-slate leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Comparative Protocol Table */}
        <div className="border border-geo-stone-border bg-white/60">
          <div className="px-6 py-4 bg-geo-stone-muted border-b border-geo-stone-border flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-geo-ink">
              TABLE 1.1 • COMPARATIVE DUE-DILIGENCE PROTOCOL
            </span>
            <span className="text-[11px] font-mono text-geo-slate uppercase tracking-[0.14em]">
              CONVENTIONAL ACQUISITION VS. GEOSENTRY SCREENING
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-geo-stone-border text-[11px] font-mono uppercase tracking-[0.16em] text-geo-slate bg-geo-stone/60">
                  <th className="py-3.5 px-6 w-1/4">Evaluation Dimension</th>
                  <th className="py-3.5 px-6 w-3/8 border-l border-geo-stone-border text-[#A93528]">
                    Unscreened Field Commitment
                  </th>
                  <th className="py-3.5 px-6 w-3/8 border-l border-geo-stone-border text-[#2D6A4F]">
                    GeoSentry 100-Point Protocol
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-geo-stone-border text-xs sm:text-sm">
                {COMPARISON_LEDGER.map((row) => (
                  <tr key={row.dimension} className="align-top">
                    <td className="py-4 px-6 font-semibold text-geo-ink">
                      {row.dimension}
                    </td>
                    <td className="py-4 px-6 border-l border-geo-stone-border text-geo-slate leading-relaxed">
                      {row.unscreened}
                    </td>
                    <td className="py-4 px-6 border-l border-geo-stone-border text-geo-ink font-medium leading-relaxed bg-[#4E7A56]/[0.05]">
                      {row.geosentry}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

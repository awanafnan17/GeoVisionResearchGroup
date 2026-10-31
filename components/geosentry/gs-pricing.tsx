import Link from "next/link";

const FEE_TIERS = [
  {
    code: "TIER 01",
    name: "Standard Target Screening",
    fee: "$2,500",
    feeSub: "USD / SINGLE CONCESSION",
    timeline: "5–7 BUSINESS DAYS",
    includes: [
      "Single concession or prospect evaluation (up to 150 km²)",
      "Full 100-point scoring across 6 technical parameters",
      "ASTER / Sentinel-2 SWIR/VNIR alteration synthesis",
      "Jurisdiction, cadastral standing & ESG buffer audit",
      "Operator quality & historical QA/QC assay verification",
      "Explicit GO / CONDITIONAL GO / NO-GO capital verdict",
      "Signed institutional PDF dossier & staged Phase-1 budget",
    ],
    highlight: false,
  },
  {
    code: "TIER 02",
    name: "Priority Deal-Room Screening",
    fee: "$4,200",
    feeSub: "USD / EXPEDITED MANDATE",
    timeline: "2–3 BUSINESS DAYS (48–72H)",
    includes: [
      "All Standard Screening deliverables & spectral synthesis",
      "Immediate allocation to dedicated senior economic geologist",
      "Guaranteed 48–72 hour turnaround for live deal rooms",
      "Direct 45-minute technical briefing call with lead analyst",
      "Pre-acquisition red-flag & fatal-flaw isolation memo",
    ],
    highlight: true,
  },
  {
    code: "TIER 03",
    name: "Multi-Target Portfolio Matrix",
    fee: "$6,500+",
    feeSub: "USD / 3+ CONCESSIONS",
    timeline: "7–10 BUSINESS DAYS",
    includes: [
      "Simultaneous screening of 3 or more regional concessions",
      "Comparative 100-point ranking & capital allocation matrix",
      "Portfolio-wide metallogenic & structural synthesis",
      "Prioritized drill/field budget allocation across targets",
    ],
    highlight: false,
  },
  {
    code: "TIER 04",
    name: "Institutional IC Retainer",
    fee: "CUSTOM",
    feeSub: "ANNUAL OR TRANSACTION SCOPE",
    timeline: "DEDICATED DESK SLA",
    includes: [
      "Ongoing deal-flow screening for mining funds & family offices",
      "Investment Committee (IC) memorandum formatting",
      "Custom commodity or jurisdictional weighting overlays",
      "Direct integration with Geo Vision field verification teams",
    ],
    highlight: false,
  },
];

export function GsPricing() {
  return (
    <section
      className="section-padding bg-geo-navy border-b border-white/10"
      aria-label="Institutional fee schedule"
    >
      <div className="container-custom">
        {/* Top Metadata Rule */}
        <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-gs-slate mb-10">
          <span className="text-gs-gold font-semibold">
            INSTITUTIONAL FEE SCHEDULE
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="tabular-nums">FIXED-SCOPE TRANSPARENCY</span>
        </div>

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
          <div className="lg:col-span-6">
            <h2 className="text-headline text-geo-white">
              Transparent{" "}
              <span className="italic font-normal text-gs-gold">
                Institutional
              </span>{" "}
              Fee Schedule.
            </h2>
          </div>
          <div className="lg:col-span-6 flex items-end">
            <p className="text-sm sm:text-base text-gs-slate leading-relaxed">
              Fixed-fee desktop screening costs a fraction of a single day of
              field mobilization or diamond drilling. Every engagement is
              confirmed with a formal scope letter within 24 hours of submission.
            </p>
          </div>
        </div>

        {/* 2x2 Swiss Architectural Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/15">
          {FEE_TIERS.map((tier) => (
            <div
              key={tier.code}
              className={`p-7 sm:p-9 border-r border-b border-white/15 flex flex-col justify-between ${
                tier.highlight
                  ? "bg-gs-navy-dark border-t-2 border-t-gs-gold"
                  : "bg-geo-navy-light"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
                  <span className="text-[11px] font-mono font-semibold text-gs-gold uppercase tracking-[0.18em]">
                    {tier.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] border ${
                      tier.highlight
                        ? "bg-gs-gold text-geo-navy border-gs-gold font-bold"
                        : "bg-white/5 text-gs-slate border-white/10"
                    }`}
                  >
                    SLA: {tier.timeline}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-heading text-geo-white">
                      {tier.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gs-slate">
                      {tier.feeSub}
                    </span>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="text-3xl sm:text-4xl font-bold text-gs-gold">
                      {tier.fee}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-geo-white-dim leading-relaxed"
                    >
                      <span className="text-gs-gold font-mono text-xs mt-0.5">
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gs-slate">
                  24H COMMERCIAL CONFIRMATION
                </span>
                <Link
                  href="/geosentry/request"
                  className={
                    tier.highlight
                      ? "gs-btn-primary text-[11px] py-2.5 px-5"
                      : "gs-btn-secondary text-[11px] py-2.5 px-5"
                  }
                >
                  Commission Tier
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

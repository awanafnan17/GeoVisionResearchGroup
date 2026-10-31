const SLA_MILESTONES = [
  {
    code: "T + 00 HRS",
    title: "Commissioning & Reference Assignment",
    detail:
      "Submit target coordinates, deposit hypothesis, and available reports via the encrypted commissioning desk. Automated issuance of unique tracking reference (e.g., GS-2026-0001).",
    owner: "INTAKE DESK",
  },
  {
    code: "T + 24 HRS",
    title: "Data Audit & Commercial Scope Lock",
    detail:
      "Lead economic geologist reviews data room completeness, confirms deposit-specific rubric calibration, and issues a binding fixed-fee commercial quote.",
    owner: "LEAD ANALYST",
  },
  {
    code: "DAYS 02–04",
    title: "Spectral, Structural & Cadastral Execution",
    detail:
      "Parallel execution of ASTER/Sentinel-2 alteration mapping, DEM structural lineament analysis, mineral tenure verification, and historical QA/QC assay audit.",
    owner: "TECHNICAL TEAM",
  },
  {
    code: "DAY 05–07",
    title: "Peer Review & 100-Point Dossier Delivery",
    detail:
      "Two-geologist independent calibration of the 100-point composite score, fatal-flaw register, and delivery of the signed PDF screening dossier via client tracker.",
    owner: "REVIEW BOARD",
  },
];

export function GsProcess() {
  return (
    <section
      className="section-padding bg-geo-navy-light border-b border-white/10"
      aria-label="Process timeline and turnaround SLA"
    >
      <div className="container-custom">
        {/* Top Metadata Rule */}
        <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-gs-slate mb-10">
          <span className="text-gs-gold font-semibold">
            EXECUTION TIMELINE &amp; SLA
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="tabular-nums">STANDARD: 5–7 BUSINESS DAYS</span>
        </div>

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
          <div className="lg:col-span-6">
            <h2 className="text-headline text-geo-white">
              Commissioning to{" "}
              <span className="italic font-normal text-gs-gold">
                Signed Dossier
              </span>{" "}
              in 5–7 Business Days.
            </h2>
          </div>
          <div className="lg:col-span-6 flex items-end">
            <p className="text-sm sm:text-base text-gs-slate leading-relaxed">
              Designed for deal-room velocity and pre-fieldwork capital gates.
              Clients track every milestone in real time using their assigned
              GeoSentry reference number.
            </p>
          </div>
        </div>

        {/* 4-Column Horizontal Swiss Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/15 bg-geo-navy mb-10">
          {SLA_MILESTONES.map((m, idx) => (
            <div
              key={m.code}
              className="p-6 sm:p-7 border-r border-b border-white/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
                  <span className="text-xs font-mono font-bold text-gs-gold tabular-nums tracking-[0.14em]">
                    {m.code}
                  </span>
                  <span className="text-[10px] font-mono text-gs-slate uppercase tracking-[0.14em]">
                    STEP 0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-heading text-geo-white mb-3">
                  {m.title}
                </h3>

                <p className="text-xs text-gs-slate leading-relaxed mb-6">
                  {m.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em]">
                <span className="text-gs-slate">RESPONSIBLE UNIT</span>
                <span className="text-geo-white font-semibold">{m.owner}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Turnaround SLA Comparison Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 border border-white/15 bg-gs-navy-dark">
          <div className="p-6 border-b md:border-b-0 md:border-r border-white/15 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-slate block mb-1">
                STANDARD SLA PROTOCOL
              </span>
              <h4 className="text-base font-sans font-semibold text-geo-white">
                Standard Desktop Screening Mandate
              </h4>
              <p className="text-xs text-gs-slate mt-1">
                Complete 6-parameter 100-point dossier &amp; peer review.
              </p>
            </div>
            <div className="text-right font-mono tabular-nums shrink-0">
              <span className="block text-xl font-bold text-geo-white">
                5–7 DAYS
              </span>
              <span className="text-[10px] text-gs-slate uppercase">
                $2,500 BASE FEE
              </span>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between gap-4 bg-gs-gold/[0.04]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-1">
                PRIORITY / DEAL-ROOM SLA
              </span>
              <h4 className="text-base font-sans font-semibold text-geo-white">
                Expedited Rush Screening Mandate
              </h4>
              <p className="text-xs text-gs-slate mt-1">
                Dedicated senior analyst queue for time-critical auctions.
              </p>
            </div>
            <div className="text-right font-mono tabular-nums shrink-0">
              <span className="block text-xl font-bold text-gs-gold">
                48–72 HRS
              </span>
              <span className="text-[10px] text-gs-gold uppercase">
                $4,200 PRIORITY FEE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

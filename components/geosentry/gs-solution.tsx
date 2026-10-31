const PROTOCOL_STAGES = [
  {
    num: "01",
    code: "STAGE 01",
    title: "Data Room Intake & Cadastral Verification",
    window: "DAY 1",
    inputs:
      "Concession coordinates (UTM/WGS84), license registry IDs, legacy reports, geochemical CSVs, and geological maps.",
    methodology:
      "Validation of spatial coordinate systems, mineral tenure boundaries, historical work completeness, and QA/QC certificate audit.",
    deliverable: "Data Quality & Cadastral Verification Ledger",
  },
  {
    num: "02",
    code: "STAGE 02",
    title: "Deposit Model & Tectono-Stratigraphic Audit",
    window: "DAYS 2–3",
    inputs:
      "Regional metallogenic synthesis, USGS/BGS open-file bulletins, and lithostratigraphic column correlations.",
    methodology:
      "Evaluation of host lithology, magmatic/hydrothermal fertility, structural trap geometry, and analogue comparison against tier-1 deposits.",
    deliverable: "40-Pt Geological Merit & Deposit Model Score",
  },
  {
    num: "03",
    code: "STAGE 03",
    title: "Multi-Spectral Remote Sensing & Structural Synthesis",
    window: "DAYS 3–4",
    inputs:
      "ASTER L1T SWIR/TIR, Sentinel-2 VNIR, ALOS PALSAR / SRTM DEM lineament datasets, and airborne magnetics.",
    methodology:
      "Band-ratio processing for Al-OH, Mg-OH, Fe-oxide/gossan alteration footprints and kinematic fault-intersection mapping.",
    deliverable: "Spectral Alteration & Structural Control Map",
  },
  {
    num: "04",
    code: "STAGE 04",
    title: "Jurisdiction, ESG & Operator Capability Review",
    window: "DAYS 4–5",
    inputs:
      "National mining code, protected watershed/IUCN layers, infrastructure corridors, and operator technical CVs/workplans.",
    methodology:
      "Assessment of security of tenure, permitting timeline, environmental buffer overlaps, and realism of proposed Phase-1 exploration budget.",
    deliverable: "40-Pt Jurisdiction/ESG & 20-Pt Operator Score",
  },
  {
    num: "05",
    code: "STAGE 05",
    title: "100-Point Composite Grading & Capital Verdict",
    window: "DAYS 5–7",
    inputs:
      "Weighted outputs from all 6 technical parameters and 3 institutional pillars.",
    methodology:
      "Independent peer review by two senior economic geologists, fatal-flaw isolation, and calibration of GO / CONDITIONAL / NO-GO gate.",
    deliverable: "Signed Institutional Screening Dossier (PDF)",
  },
];

export function GsSolution() {
  return (
    <section
      className="section-padding bg-geo-navy border-b border-white/10"
      aria-label="The GeoSentry 5-stage screening protocol"
    >
      <div className="container-custom">
        {/* Top Metadata Rule */}
        <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-gs-slate mb-10">
          <span className="text-gs-gold font-semibold">
            OPERATIONAL METHODOLOGY
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="tabular-nums">5-STAGE ANALYTICAL PROTOCOL</span>
        </div>

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
          <div className="lg:col-span-6">
            <h2 className="text-headline text-geo-white">
              Five-Stage{" "}
              <span className="italic font-normal text-gs-gold">
                Institutional
              </span>{" "}
              Screening Protocol.
            </h2>
          </div>
          <div className="lg:col-span-6 flex items-end">
            <p className="text-sm sm:text-base text-gs-slate leading-relaxed">
              Every target submitted to GeoSentry undergoes an identical,
              repeatable five-stage analytical sequence—combining satellite
              spectral processing, structural geology, cadastral audit, and
              peer-reviewed scoring before capital is committed.
            </p>
          </div>
        </div>

        {/* 5-Stage Swiss Ledger */}
        <div className="border border-white/15 bg-geo-navy-light">
          {/* Desktop Column Header */}
          <div className="hidden lg:grid lg:grid-cols-12 border-b border-white/15 bg-gs-navy-dark text-[11px] font-mono uppercase tracking-[0.16em] text-gs-slate">
            <div className="col-span-3 py-3.5 px-6 border-r border-white/10">
              Stage &amp; Window
            </div>
            <div className="col-span-3 py-3.5 px-6 border-r border-white/10">
              Primary Data Inputs
            </div>
            <div className="col-span-4 py-3.5 px-6 border-r border-white/10">
              Analytical Methodology
            </div>
            <div className="col-span-2 py-3.5 px-6">Output Artifact</div>
          </div>

          <div className="divide-y divide-white/10">
            {PROTOCOL_STAGES.map((stage) => (
              <div
                key={stage.num}
                className="grid grid-cols-1 lg:grid-cols-12 hover:bg-white/[0.02] transition-colors"
              >
                {/* Col 1: Stage Title */}
                <div className="lg:col-span-3 p-6 lg:border-r border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-semibold text-gs-gold uppercase tracking-[0.16em]">
                        {stage.code}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono tabular-nums bg-white/5 border border-white/10 text-gs-slate">
                        {stage.window}
                      </span>
                    </div>
                    <h3 className="text-base font-heading text-geo-white leading-snug">
                      {stage.title}
                    </h3>
                  </div>
                </div>

                {/* Col 2: Inputs */}
                <div className="lg:col-span-3 p-6 pt-0 lg:pt-6 lg:border-r border-white/10">
                  <span className="lg:hidden block text-[10px] font-mono uppercase tracking-[0.16em] text-gs-gold mb-1">
                    Primary Data Inputs
                  </span>
                  <p className="text-xs text-gs-slate leading-relaxed">
                    {stage.inputs}
                  </p>
                </div>

                {/* Col 3: Methodology */}
                <div className="lg:col-span-4 p-6 pt-0 lg:pt-6 lg:border-r border-white/10">
                  <span className="lg:hidden block text-[10px] font-mono uppercase tracking-[0.16em] text-gs-gold mb-1">
                    Analytical Methodology
                  </span>
                  <p className="text-xs sm:text-sm text-geo-white-dim leading-relaxed">
                    {stage.methodology}
                  </p>
                </div>

                {/* Col 4: Deliverable */}
                <div className="lg:col-span-2 p-6 pt-0 lg:pt-6 flex flex-col justify-center bg-gs-navy-dark/40">
                  <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-gs-slate block mb-1">
                    ARTIFACT
                  </span>
                  <span className="text-xs font-mono font-medium text-gs-gold leading-snug">
                    {stage.deliverable}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

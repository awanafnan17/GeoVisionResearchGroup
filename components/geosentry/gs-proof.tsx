import Link from "next/link";

export function GsProof() {
  return (
    <section
      className="section-padding bg-geo-navy border-b border-white/10"
      aria-label="Case reference dossier"
    >
      <div className="container-custom">
        {/* Top Metadata Rule */}
        <div className="flex items-baseline gap-4 text-[11px] font-mono uppercase tracking-[0.24em] text-gs-slate mb-10">
          <span className="text-gs-gold font-semibold">
            BENCHMARK CASE DOSSIER
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="tabular-nums">REF: GS-2026-0001 • OMAN</span>
        </div>

        {/* Asymmetric Dossier Frame */}
        <div className="border border-white/15 bg-geo-navy-light">
          {/* Dossier Top Classification Bar */}
          <div className="px-6 py-4 bg-gs-navy-dark border-b border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-gs-gold font-semibold uppercase tracking-[0.16em]">
                CASE REFERENCE • GS-2026-0001
              </span>
              <span className="text-white/20">|</span>
              <span className="text-geo-white">
                BLOCK 14B — SEMAIL OPHIOLITE VMS BELT, SULTANATE OF OMAN
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gs-slate">COORDINATES: 23°35&apos;N 58°24&apos;E</span>
              <span className="gs-badge-proceed">VERDICT: GO (72 / 100)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column (5 cols): Quantitative Scorecard */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:border-r border-b lg:border-b-0 border-white/15 bg-geo-navy/60 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between pb-5 mb-5 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-slate block mb-1">
                      COMPOSITE SCREENING SCORE
                    </span>
                    <span className="text-xs font-mono text-gs-gold uppercase tracking-[0.14em]">
                      THRESHOLD GATE: 70–100 (PROCEED)
                    </span>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="text-5xl font-bold text-gs-gold">72</span>
                    <span className="text-base text-gs-slate"> / 100</span>
                  </div>
                </div>

                {/* 3 Pillar Ledger */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-mono tabular-nums">
                    <span className="text-gs-slate uppercase">
                      01. GEOLOGICAL ASSESSMENT
                    </span>
                    <span className="text-geo-white font-semibold">
                      28 / 40 PTS
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-mono tabular-nums">
                    <span className="text-gs-slate uppercase">
                      02. JURISDICTION &amp; ESG
                    </span>
                    <span className="text-geo-white font-semibold">
                      30 / 40 PTS
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs font-mono tabular-nums">
                    <span className="text-gs-slate uppercase">
                      03. OPERATOR QUALITY
                    </span>
                    <span className="text-geo-white font-semibold">
                      14 / 20 PTS
                    </span>
                  </div>
                </div>

                {/* 6-Parameter Mini Matrix */}
                <div className="p-4 bg-gs-navy-dark border border-white/10 text-[11px] font-mono tabular-nums space-y-1.5">
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-gs-gold mb-2">
                    6-PARAMETER SUB-SCORES
                  </span>
                  <div className="flex justify-between text-gs-slate">
                    <span>Regional Geological Setting</span>
                    <span className="text-geo-white">16 / 20 PTS</span>
                  </div>
                  <div className="flex justify-between text-gs-slate">
                    <span>Deposit Model Validity</span>
                    <span className="text-geo-white">15 / 20 PTS</span>
                  </div>
                  <div className="flex justify-between text-gs-slate">
                    <span>Structural &amp; Lithological Controls</span>
                    <span className="text-geo-white">11 / 15 PTS</span>
                  </div>
                  <div className="flex justify-between text-gs-slate">
                    <span>Geochemical &amp; Geophysical Evidence</span>
                    <span className="text-geo-white">10 / 15 PTS</span>
                  </div>
                  <div className="flex justify-between text-gs-slate">
                    <span>Historical Work &amp; Data Quality</span>
                    <span className="text-geo-white">10 / 15 PTS</span>
                  </div>
                  <div className="flex justify-between text-gs-slate">
                    <span>Fatal Flaw &amp; Access Risk</span>
                    <span className="text-geo-white">10 / 15 PTS</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-3">
                <Link
                  href="/geosentry/sample-report"
                  className="gs-btn-primary text-xs py-2.5 px-5"
                >
                  Read Complete Sample Dossier
                </Link>
                <Link
                  href="/geosentry/track?ref=GS-2026-0001"
                  className="gs-btn-secondary text-xs py-2.5 px-5"
                >
                  Test Live Tracker
                </Link>
              </div>
            </div>

            {/* Right Column (7 cols): Executive Geological Synthesis */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gs-gold block mb-2">
                  EXECUTIVE TECHNICAL SYNTHESIS
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading text-geo-white mb-4">
                  Cyprus-Type Mafic VMS Prospectivity Along the Geotimes–Lasail
                  Volcanic Horizon
                </h2>

                <p className="text-sm text-geo-white-dim leading-relaxed mb-4">
                  An independent desktop screening was commissioned across Block
                  14B in the northern Semail Ophiolite Belt, Sultanate of Oman.
                  Multi-spectral ASTER SWIR/VNIR re-processing isolated a
                  coherent 1.8 km &times; 1.1 km chlorite-epidote and gossanous
                  iron-oxide alteration anomaly localized along syn-volcanic
                  NW-trending normal faults.
                </p>

                <p className="text-sm text-gs-slate leading-relaxed mb-6">
                  While historical trench channel grades required twin-sampling
                  QA/QC verification due to incomplete legacy CRM certificates,
                  the geological setting, intact ophiolite volcanic stratigraphy,
                  and clear Omani cadastral standing supported a{" "}
                  <strong className="text-geo-white font-mono">
                    72 / 100 GO Verdict
                  </strong>{" "}
                  to proceed into a staged $185,000 Phase-1 verification and
                  ground TDEM program prior to scout drilling.
                </p>

                {/* Key Findings Table */}
                <div className="border border-white/10 bg-geo-navy">
                  <div className="px-4 py-2.5 bg-gs-navy-dark border-b border-white/10 text-[10px] font-mono uppercase tracking-[0.16em] text-gs-gold">
                    KEY SCREENING DETERMINATIONS • BLOCK 14B
                  </div>
                  <div className="divide-y divide-white/10 text-xs">
                    <div className="p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <span className="sm:col-span-4 font-mono text-gs-slate uppercase">
                        HOST HORIZON
                      </span>
                      <span className="sm:col-span-8 text-geo-white">
                        Sheeted dike complex to extrusive pillow basalt contact
                        (Geotimes / Lasail units)
                      </span>
                    </div>
                    <div className="p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <span className="sm:col-span-4 font-mono text-gs-slate uppercase">
                        PRIMARY RISK ISOLATED
                      </span>
                      <span className="sm:col-span-8 text-geo-white">
                        Legacy 1990s trench Cu-Au assays lack certified reference
                        material (CRM) documentation
                      </span>
                    </div>
                    <div className="p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <span className="sm:col-span-4 font-mono text-gs-slate uppercase">
                        RECOMMENDED GATE-1
                      </span>
                      <span className="sm:col-span-8 text-geo-white">
                        4-week SWIR field spectrometry, twin channel sampling,
                        and fixed-loop TDEM survey
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-[11px] font-mono text-gs-slate border-t border-white/10 pt-4">
                DISCLOSURE: Demonstration dossier compiled under the GeoSentry
                100-Point Desktop Protocol. Not a statutory NI 43-101 / JORC
                Technical Report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

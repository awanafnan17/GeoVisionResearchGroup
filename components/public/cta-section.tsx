import Link from "next/link";

export function CtaSection() {
  return (
    <section
      className="relative py-20 lg:py-28 bg-[#060B14] text-slate-100 border-t border-white/10 overflow-hidden"
      aria-label="Commissioning desk and advisory inquiry"
    >
      {/* Ambient Depth Glows */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="glass-panel-modern p-8 sm:p-12 lg:p-16 rounded-3xl border border-white/10 relative overflow-hidden backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
          {/* Top Advisory Bar */}
          <div className="pb-6 mb-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-emerald-400">
                Commissioning Desk &bull; Target Screening &amp; Advisory
              </span>
            </div>
            <span className="font-sans text-xs text-slate-400">
              CONFIDENTIAL CONCESSION EVALUATION &bull; DIRECT PARTNER REVIEW
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left 8 Columns: Headline, Copy, Action Buttons */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-white tracking-tight leading-[1.08] mb-6">
                  Commission a Pre-Field{" "}
                  <span className="gradient-text-emerald">
                    Geological Screening
                  </span>{" "}
                  or Technical Advisory Study.
                </h2>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8 font-sans">
                  Before committing capital to drilling, trenching, or tenement
                  acquisition, submit your concession coordinates or project
                  parameters to our multidisciplinary research and advisory desk.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/geosentry/request"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#060B14] font-sans font-semibold text-sm transition-all shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:shadow-[0_0_32px_rgba(16,185,129,0.45)] hover:-translate-y-0.5"
                >
                  <span>Request Target Screening</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg glass-panel-interactive text-white font-sans font-medium text-sm transition-all hover:-translate-y-0.5"
                >
                  <span>Contact Advisory Desk</span>
                </Link>
                <Link
                  href="/geosentry/sample-report"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 hover:text-white font-sans text-sm transition-all"
                >
                  <span>Inspect Sample Report</span>
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Standards & Assurance Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {[
                {
                  badge: "Enterprise Security",
                  title: "Strict Concession Confidentiality",
                  desc: "Coordinates, tenement boundaries, and proprietary logs are restricted exclusively to assigned senior analysts under strict NDA.",
                },
                {
                  badge: "Empirical Standard",
                  title: "100-Point Empirical Weighting",
                  desc: "Structured evaluation across Geological Merit (40 pts), Jurisdiction/ESG (40 pts), and Operator Quality (20 pts).",
                },
                {
                  badge: "Independent Verification",
                  title: "Direct Partner Review",
                  desc: "Every target screening is directly led by senior geoscientists with verifiable deposit expertise and rigorous pre-field scrutiny.",
                },
              ].map((item) => (
                <div
                  key={item.badge}
                  className="p-5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md"
                >
                  <div className="text-xs font-sans text-emerald-400 font-semibold mb-1">
                    {item.badge}
                  </div>
                  <h3 className="text-sm font-sans font-semibold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

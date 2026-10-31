import Link from "next/link";

export default function LoginScene() {
  return (
    <div className="relative w-full h-full bg-[#080E18] flex flex-col justify-between p-10 xl:p-14 overflow-hidden">
      {/* Cartographic Grid */}
      <div className="absolute inset-0 geo-grid-bg opacity-40 pointer-events-none" />

      {/* Top Metadata Bar */}
      <div className="relative z-10 flex items-center justify-between pb-5 border-b border-white/10 text-[10px] font-mono uppercase tracking-[0.22em]">
        <Link
          href="/"
          className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>GEO VISION • RESEARCH GROUP</span>
        </Link>
        <span className="text-slate-400">MEMBER WORKSPACE • V4.2</span>
      </div>

      {/* Center Stratigraphic & Portal Dossier Plate */}
      <div className="relative z-10 my-auto py-8 space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
            ACADEMIC COHORTS &bull; SPECIALIST DESK
          </div>
          <h2 className="text-3xl xl:text-4xl font-heading font-bold text-white tracking-[-0.02em] leading-[1.08] mb-4">
            Dedicated Workspace for{" "}
            <span className="text-emerald-400">
              Students &amp; Senior Geoscientists.
            </span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-lg font-sans">
            Access course syllabi, submit seminar assignments, manage peer-reviewed
            publications, track certified invoices, and participate in active mineral
            exploration research.
          </p>
        </div>

        {/* Technical SVG Elevation & Telemetry Plate */}
        <div className="border border-white/10 bg-[#0B1320] p-5 rounded-xl">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-[0.18em] mb-3 pb-2 border-b border-white/10">
            <span className="text-emerald-400">
              SUBSURFACE INTELLIGENCE &bull; MEMBER WORKSPACE
            </span>
            <span>ENCRYPTED SESSION</span>
          </div>

          <svg
            viewBox="0 0 460 170"
            className="w-full h-auto block"
            aria-hidden="true"
          >
            <line
              x1="0"
              y1="40"
              x2="460"
              y2="40"
              stroke="rgba(246,243,236,0.08)"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              y1="90"
              x2="460"
              y2="90"
              stroke="rgba(246,243,236,0.08)"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              y1="140"
              x2="460"
              y2="140"
              stroke="rgba(246,243,236,0.08)"
              strokeDasharray="3 3"
            />
            <path
              d="M0 115 Q 115 80, 230 105 T 460 75 L 460 170 L 0 170 Z"
              fill="rgba(16,185,129,0.15)"
              stroke="rgba(16,185,129,0.3)"
            />
            <path
              d="M0 68 Q 120 35, 240 58 T 460 32"
              fill="none"
              stroke="#10B981"
              strokeWidth="1.5"
            />
            <line
              x1="190"
              y1="25"
              x2="235"
              y2="165"
              stroke="#34D399"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <rect
              x="200"
              y="72"
              width="106"
              height="26"
              fill="#060B14"
              stroke="#10B981"
              rx="4"
            />
            <text
              x="208"
              y="88"
              fill="#10B981"
              fontSize="9"
              fontFamily="monospace"
            >
              MEMBER VERIFIED
            </text>
          </svg>
        </div>

        {/* Member Workspace Highlights */}
        <div className="grid grid-cols-2 gap-3 text-xs font-sans">
          {[
            "Student Learning & Cohorts",
            "Specialist Research Profiles",
            "Seminar Receipts & Invoices",
            "Publications & Field Reports",
          ].map((role) => (
            <div
              key={role}
              className="p-3 border border-white/10 bg-[#0B1320]/70 rounded-lg flex items-center gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-200">{role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Colophon */}
      <div className="relative z-10 pt-5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
        <span>GEOSCIENCE EDUCATION &amp; PRACTICE</span>
        <span className="text-emerald-400">SECURE SESSION</span>
      </div>
    </div>
  );
}

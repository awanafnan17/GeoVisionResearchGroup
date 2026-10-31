import type { HomepageStats } from "@/lib/public-data";

const STAT_ITEMS: {
  key: keyof HomepageStats;
  label: string;
  suffix: string;
  note: string;
}[] = [
  {
    key: "specializations",
    label: "Earth Science Disciplines",
    suffix: "",
    note: "Structural, economic & environmental earth sciences",
  },
  {
    key: "services",
    label: "Advisory Practice Lines",
    suffix: "",
    note: "Exploration, geophysics, hydrogeology & GIS",
  },
  {
    key: "experts",
    label: "Senior Geoscientists",
    suffix: "",
    note: "PhD researchers & certified field practitioners",
  },
  {
    key: "courses",
    label: "Professional Masterclasses",
    suffix: "",
    note: "Applied GIS, remote sensing & core workshops",
  },
  {
    key: "geosentryRequests",
    label: "Target Assessments",
    suffix: "",
    note: "100-point pre-field concession evaluations",
  },
  {
    key: "countries",
    label: "Project Jurisdictions",
    suffix: "",
    note: "Documented project, expert & screening jurisdictions",
  },
];

interface StatsSectionProps {
  stats: HomepageStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section
      className="relative py-20 lg:py-28 bg-[#060B14]/85 text-slate-100 border-b border-white/10 overflow-hidden"
      aria-label="Practice overview and statistics"
    >
      <div className="container-custom relative z-10">
        {/* Section Header with Modern Sans Eyebrow and Headline */}
        <div className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-sans font-medium mb-4 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Practice Overview</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-[1.08]">
              Quantitative Scope of the{" "}
              <span className="gradient-text-emerald">Research Practice</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-300 max-w-md leading-relaxed font-sans">
            Empirical breadth across mineral exploration, basin hydrogeology,
            geotechnical engineering, and pre-field desktop due diligence.
          </p>
        </div>

        {/* 6-Column Modern Frosted-Glass Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {STAT_ITEMS.map((item) => {
            const value = stats[item.key];
            return (
              <div
                key={item.key}
                className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="text-4xl lg:text-5xl font-sans font-extrabold text-white tabular-nums tracking-tight mb-2 group-hover:text-emerald-400 transition-colors">
                    {value}
                    <span className="text-emerald-400">{item.suffix}</span>
                  </div>
                  <h3 className="text-sm font-sans font-semibold text-slate-200 mb-2">
                    {item.label}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-sans leading-relaxed pt-3 border-t border-white/5">
                  {item.note}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

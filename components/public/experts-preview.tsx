import Link from "next/link";
import type { FeaturedExpert } from "@/lib/public-data";

interface ExpertsPreviewProps {
  experts: FeaturedExpert[];
}

export function ExpertsPreview({ experts }: ExpertsPreviewProps) {
  return (
    <section
      className="relative py-20 lg:py-28 bg-[#0B1324]/90 text-slate-100 border-b border-white/10 overflow-hidden"
      aria-label="Senior geoscience roster"
    >
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-sans font-medium mb-4 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Principal Investigators &amp; Specialists</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-[1.08]">
              Meet Our Senior{" "}
              <span className="gradient-text-emerald">Geoscience Roster</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Structural geologists, remote sensing scientists, hydrogeologists,
              and geotechnical engineers leading field and desktop investigations
              across international basins.
            </p>
            <div>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-emerald-400 hover:text-cyan-300 transition-colors"
              >
                <span>View All Experts</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4-Column Modern Frosted-Glass Faculty Grid */}
        {experts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experts.map((expert) => {
              const initials = expert.fullName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("");

              return (
                <Link
                  key={expert.id}
                  href={`/team/${expert.slug}`}
                  className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between group overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/40"
                >
                  <div>
                    {/* Header Bar */}
                    <div className="flex items-center justify-between text-xs pb-3 mb-4 border-b border-white/10">
                      <span className="font-sans text-xs font-medium text-slate-300 truncate max-w-[150px]">
                        {expert.designation || "Geoscientist"}
                      </span>
                      <span className="font-sans font-medium text-emerald-400 shrink-0">
                        {expert.country || "GLOBAL"}
                      </span>
                    </div>

                    {/* Portrait Photo Frame */}
                    <div className="relative aspect-[4/4.5] rounded-xl overflow-hidden mb-5 border border-white/10 bg-slate-900/60">
                      {expert.profilePhoto ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{
                            backgroundImage: `url(${expert.profilePhoto})`,
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 to-[#0B1324]">
                          <div className="w-16 h-16 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center mb-2">
                            <span className="text-2xl font-sans font-bold text-emerald-400">
                              {initials}
                            </span>
                          </div>
                          <span className="text-[10px] font-sans uppercase tracking-wider text-slate-400">
                            Senior Specialist
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Credentials */}
                    <h3 className="text-lg sm:text-xl font-sans font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5">
                      {expert.fullName}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2 mb-4">
                      {expert.designation}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-sans font-medium text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <span>Curriculum Vitae</span>
                    <span className="transform group-hover:translate-x-1.5 transition-transform">
                      &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel-modern p-12 rounded-2xl text-center text-slate-400 font-sans text-sm">
            Expert profiles are being curated. Check back soon.
          </div>
        )}
      </div>
    </section>
  );
}

import Link from "next/link";
import type { FeaturedService } from "@/lib/public-data";

const SERVICE_ICONS: Record<string, string> = {
  Search:
    "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
  HardHat:
    "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m12 0a2 2 0 100-4m0 4a2 2 0 110-4M6 12H4m16 0h-2",
  Droplets:
    "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582",
  Leaf: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  Waves:
    "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2",
  Satellite:
    "M7.5 3.5a2 2 0 113 0M3.5 7.5a2 2 0 110 3M7.5 20.5a2 2 0 11-3 0M20.5 7.5a2 2 0 110 3M12 12l4-4m-4 4l-4 4m4-4l4 4m-4-4l-4-4",
  Hammer:
    "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  Activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  BarChart3: "M3 3v18h18M7 16V9m4 7V5m4 11V11m4 5V7",
  Fuel: "M3 3h18v18H3V3z",
  GraduationCap:
    "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  Shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
};

const DEFAULT_ICON = "M13 10V3L4 14h7v7l9-11h-7z";

interface ServicesPreviewProps {
  services: FeaturedService[];
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <section
      className="relative py-20 lg:py-28 bg-[#0B1324]/85 text-slate-100 border-b border-white/10 overflow-hidden"
      aria-label="Core geoscience and engineering services"
    >
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-sans font-medium mb-4 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Advisory Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-white leading-[1.08]">
              Our Core Geoscience &amp;{" "}
              <span className="gradient-text-emerald">Engineering Services</span>
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-between gap-4">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Comprehensive geological consulting, multi-spectral alteration
              mapping, subsurface geophysics, and site characterization across
              all earth science disciplines.
            </p>
            <div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-emerald-400 hover:text-cyan-300 pb-1 transition-colors"
              >
                <span>View All Services</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Capability Glass Cards */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const iconPath =
                SERVICE_ICONS[service.icon ?? ""] ?? DEFAULT_ICON;

              return (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="glass-panel-interactive p-7 sm:p-8 rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/40"
                >
                  <div>
                    {/* Header: Capability Tag & Icon */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 text-slate-400 group-hover:text-emerald-400 font-sans text-xs font-medium transition-colors">
                        Advisory Practice
                      </span>
                      <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 flex items-center justify-center transition-all">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors"
                          aria-hidden="true"
                        >
                          <path d={iconPath} />
                        </svg>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-xl sm:text-2xl font-sans font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
                      {service.tagline ??
                        "Rigorous technical investigation, spatial modeling, and field-verified reporting."}
                    </p>
                  </div>

                  {/* Specification Link */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-sans font-medium text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <span>Technical Specification</span>
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
            Services catalog is being updated.
          </div>
        )}
      </div>
    </section>
  );
}
